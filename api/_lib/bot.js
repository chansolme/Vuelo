"use strict";

const { getConv, setConv, clearConv, nextOrderId } = require("./state");
const { sendText, sendImage, sendDocument } = require("./wa");
const { appendOrder, updateOrderStatus, getOrderByOrderId } = require("./sheets");
const { isOrderMessage, parseOrder, orderSummaryText, itemsSummary } = require("./parser");

const OWNER = () => process.env.OWNER_PHONE;

/* ── Textos ──────────────────────────────────────────────────── */

function bankDetailsText(orderId, totalFmt) {
  return [
    `🏦 *Datos de transferencia*`,
    ``,
    `Banco: ${process.env.BANK_NAME}`,
    `Tipo de cuenta: ${process.env.BANK_ACCOUNT_TYPE}`,
    `N° cuenta: ${process.env.BANK_ACCOUNT}`,
    `RUT: ${process.env.BANK_RUT}`,
    `Nombre: ${process.env.BANK_HOLDER}`,
    process.env.BANK_EMAIL ? `Correo: ${process.env.BANK_EMAIL}` : null,
    ``,
    `💰 Monto: *${totalFmt}*`,
    `📝 Asunto: *${orderId}*`,
    ``,
    `📎 Envíame el comprobante de transferencia cuando hayas pagado.`,
  ]
    .filter((l) => l !== null)
    .join("\n");
}

const CONFIRM_WORDS = ["si", "sí", "ok", "confirmar", "confirmo", "correcto", "listo", "dale", "yes", "perfecto", "vamos", "adelante"];
function isConfirm(text) {
  const normalized = text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
  return CONFIRM_WORDS.some((w) => normalized.startsWith(w));
}

/* ── Lógica para clientes ────────────────────────────────────── */

async function handleCustomer(from, message) {
  const conv = await getConv(from);
  const msgType = message.type;
  const text = msgType === "text" ? (message.text?.body || "").trim() : "";

  // IDLE: esperando pedido
  if (conv.state === "idle") {
    if (isOrderMessage(text)) {
      const order = parseOrder(text, from);
      await sendText(
        from,
        `¡Hola${order.name !== "Cliente" ? ` *${order.name}*` : ""}! 👋\n\n` +
        orderSummaryText(order) +
        `\n\n¿Está correcto o deseas cambiar algo?\n` +
        `Responde *Confirmar* para continuar o dime qué quieres modificar.`
      );
      await setConv(from, { state: "awaiting_confirmation", order });
      return;
    }

    await sendText(
      from,
      `¡Hola! 👋 Soy el asistente de *Distribuidora Vuelo*.\n\n` +
      `Para hacer tu pedido visita:\n👉 *www.vuelodistribuidora.cl*\n\n` +
      `Arma tu carrito y envíalo desde el sitio web. ☕`
    );
    return;
  }

  // AWAITING_CONFIRMATION: esperando que el cliente confirme el resumen
  if (conv.state === "awaiting_confirmation") {
    if (isConfirm(text)) {
      const orderId = await nextOrderId();
      const order = { ...conv.order, id: orderId };

      await sendText(
        from,
        `✅ *Pedido registrado: ${orderId}*\n\n` + bankDetailsText(orderId, order.totalFmt)
      );

      await setConv(from, { state: "awaiting_payment", order });

      // Guardar en Google Sheets como "Pendiente pago"
      await appendOrder({
        ...order,
        itemsSummary: itemsSummary(order.items),
      }).catch((e) => console.error("[sheets.appendOrder]", e));

      return;
    }

    // Quiere modificar
    await sendText(
      from,
      `Sin problema. Vuelve al sitio, arma un nuevo carrito y envíalo cuando estés listo 😊\n` +
      `👉 www.vuelodistribuidora.cl`
    );
    await clearConv(from);
    return;
  }

  // AWAITING_PAYMENT: esperando comprobante de transferencia
  if (conv.state === "awaiting_payment") {
    const isMedia =
      msgType === "image" ||
      msgType === "document" ||
      msgType === "video";
    const isTextProof = msgType === "text" && text.length >= 4;

    if (!isMedia && !isTextProof) return; // Ignorar stickers, reacciones, etc.

    const { order } = conv;

    await sendText(
      from,
      `📎 Comprobante recibido para el pedido *${order.id}*.\n\n` +
      `Lo estamos revisando. Te confirmaremos el pago en breve. ⏳`
    );

    // Notificar al dueño
    await sendText(
      OWNER(),
      `🔔 *Comprobante de pago recibido*\n\n` +
      `Pedido: *${order.id}*\n` +
      `Cliente: ${order.name}\n` +
      `Teléfono: ${order.phone}\n` +
      `Comuna: ${order.commune}\n` +
      `Monto: ${order.totalFmt}\n\n` +
      `Para confirmar el pago:\n👉 *!confirmar ${order.id}*`
    );

    // Reenviar el comprobante al dueño si es imagen o documento
    if (msgType === "image" && message.image?.id) {
      await sendImage(OWNER(), message.image.id, `Comprobante ${order.id}`).catch(
        (e) => console.error("[wa.sendImage forward]", e)
      );
    } else if (msgType === "document" && message.document?.id) {
      await sendDocument(OWNER(), message.document.id, `Comprobante ${order.id}`).catch(
        (e) => console.error("[wa.sendDocument forward]", e)
      );
    }

    await setConv(from, { ...conv, state: "payment_received" });
    return;
  }

  // PAYMENT_RECEIVED: el dueño aún no confirma
  if (conv.state === "payment_received") {
    await sendText(from, `Tu pago está siendo verificado. Te avisamos en cuanto lo confirmemos. 🙏`);
    return;
  }

  // Estados posteriores a confirmación
  const STATUS_REPLIES = {
    confirmed: `✅ Tu pedido está confirmado y en preparación.`,
    preparing: `🔄 Tu pedido está siendo preparado.`,
    on_the_way: `🚚 Tu pedido está en camino. ¡Pronto lo tendrás!`,
    delivered: `✅ Tu pedido ya fue entregado. ¡Gracias por tu compra! ☕`,
    cancelled: `❌ Tu pedido fue cancelado. Si tienes dudas, escríbenos.`,
  };
  const reply = STATUS_REPLIES[conv.state];
  if (reply) await sendText(from, reply);
}

/* ── Lógica para el dueño ────────────────────────────────────── */

const ADMIN_COMMANDS = {
  "!confirmar":  { sheetStatus: "Confirmado",  state: "confirmed",  emoji: "✅", label: "Pago confirmado" },
  "!preparando": { sheetStatus: "Preparando",  state: "preparing",  emoji: "🔄", label: "En preparación" },
  "!camino":     { sheetStatus: "En camino",   state: "on_the_way", emoji: "🚚", label: "En camino" },
  "!entregado":  { sheetStatus: "Entregado",   state: "delivered",  emoji: "✅", label: "Entregado" },
  "!cancelar":   { sheetStatus: "Cancelado",   state: "cancelled",  emoji: "❌", label: "Cancelado" },
};

const CUSTOMER_STATUS_MSG = {
  confirmed:  (id) => `✅ *Pago confirmado* para el pedido *${id}*.\nEstamos preparando tu pedido. 🔄`,
  preparing:  (id) => `🔄 Tu pedido *${id}* está siendo preparado.`,
  on_the_way: (id) => `🚚 Tu pedido *${id}* está en camino. ¡Pronto lo tendrás!`,
  delivered:  (id) => `✅ ¡Tu pedido *${id}* fue entregado!\n\nGracias por comprar en *Distribuidora Vuelo* ☕\nRecuerda que participas en el sorteo del mes. ¡Nos vemos pronto!`,
  cancelled:  (id) => `❌ Tu pedido *${id}* fue cancelado. Si tienes dudas, contáctanos directamente.`,
};

async function handleOwner(from, message) {
  const text = message.type === "text" ? (message.text?.body || "").trim() : "";
  if (!text.startsWith("!")) return;

  const [cmd, orderId] = text.split(/\s+/);

  // Ayuda
  if (cmd === "!ayuda" || cmd === "!help") {
    await sendText(
      from,
      `📋 *Comandos disponibles:*\n\n` +
      `!confirmar VD-XXX — confirmar pago\n` +
      `!preparando VD-XXX — marcar en preparación\n` +
      `!camino VD-XXX — marcar en camino\n` +
      `!entregado VD-XXX — marcar entregado\n` +
      `!cancelar VD-XXX — cancelar pedido\n` +
      `!ayuda — ver esta lista`
    );
    return;
  }

  const action = ADMIN_COMMANDS[cmd];
  if (!action) {
    await sendText(from, `❓ Comando no reconocido. Escribe *!ayuda* para ver los disponibles.`);
    return;
  }

  if (!orderId) {
    await sendText(from, `⚠️ Falta el ID del pedido. Ejemplo: *${cmd} VD-20260606-001*`);
    return;
  }

  // Buscar pedido en Google Sheets para obtener el teléfono del cliente
  let order;
  try {
    order = await getOrderByOrderId(orderId);
  } catch (e) {
    console.error("[sheets.getOrderByOrderId]", e);
  }

  if (!order) {
    await sendText(from, `❌ Pedido *${orderId}* no encontrado en la planilla.`);
    return;
  }

  const customerPhone = order.customerPhone;

  // Actualizar planilla + notificar cliente + actualizar estado en Redis
  await Promise.allSettled([
    updateOrderStatus(orderId, action.sheetStatus),
    sendText(customerPhone, CUSTOMER_STATUS_MSG[action.state](orderId)),
    setConv(customerPhone, { state: action.state, order: { id: orderId } }),
    sendText(from, `${action.emoji} Pedido *${orderId}* actualizado: *${action.label}*.\nCliente: ${order.name} (${order.commune})`),
  ]);
}

module.exports = { handleCustomer, handleOwner };
