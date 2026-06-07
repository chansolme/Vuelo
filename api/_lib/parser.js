"use strict";

const ORDER_SIGNAL = "quiero hacer un pedido en Distribuidora Vuelo";

function isOrderMessage(text) {
  return typeof text === "string" && text.includes(ORDER_SIGNAL);
}

/**
 * Parsea el mensaje estructurado que genera el carrito del sitio.
 * Ejemplo de línea de ítem:
 *   "1. Brasil | 250 g × 2 bolsas | Espresso | $24.000"
 */
function parseOrder(text, fromPhone) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  // Ítems
  const items = [];
  let inItems = false;
  for (const line of lines) {
    if (line === "Detalle del pedido:") { inItems = true; continue; }
    if (line.startsWith("Total:")) { inItems = false; }
    if (inItems && /^\d+\./.test(line)) {
      const parts = line.replace(/^\d+\.\s*/, "").split("|").map((s) => s.trim());
      if (parts.length >= 4) {
        items.push({
          name: parts[0],
          format: parts[1],
          grind: parts[2],
          price: parts[3],
        });
      }
    }
  }

  const get = (prefix) => {
    const found = lines.find((l) => l.startsWith(prefix));
    return found ? found.slice(prefix.length).trim() : "";
  };

  const totalLine = lines.find((l) => l.startsWith("Total:"));
  const totalFmt = totalLine ? totalLine.replace("Total:", "").trim() : "$0";
  const totalNum = parseInt(totalFmt.replace(/\D/g, ""), 10) || 0;

  return {
    name: get("Nombre:") || "Cliente",
    commune: get("Comuna:") || "",
    phone: get("Teléfono:") || fromPhone,
    notes: get("Notas:") || "",
    items,
    totalFmt,
    totalNum,
    customerPhone: fromPhone,
  };
}

function orderSummaryText(order) {
  const itemLines = order.items
    .map((i) => `  • ${i.name} | ${i.format} | ${i.grind} | ${i.price}`)
    .join("\n");
  return (
    `📦 *Resumen de tu pedido:*\n\n${itemLines}\n\n` +
    `💰 *Total: ${order.totalFmt}*`
  );
}

function itemsSummary(items) {
  return items.map((i) => `${i.name} ${i.format} (${i.grind})`).join(", ");
}

module.exports = { isOrderMessage, parseOrder, orderSummaryText, itemsSummary };
