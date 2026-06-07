"use strict";

const { markProcessed } = require("./_lib/state");
const { handleCustomer, handleOwner } = require("./_lib/bot");

const OWNER = () => process.env.OWNER_PHONE;

module.exports = async function handler(req, res) {
  // ── Verificación del webhook (GET desde Meta) ──
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
    if (mode === "subscribe" && token === process.env.WA_VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.status(403).end();
  }

  // ── Mensajes entrantes (POST desde Meta) ──
  if (req.method === "POST") {
    // Responder 200 inmediatamente para que Meta no reintente
    res.status(200).end();

    try {
      await processWebhook(req.body);
    } catch (err) {
      console.error("[webhook] Error procesando mensaje:", err);
    }
    return;
  }

  res.status(405).end();
};

async function processWebhook(body) {
  const changes = body?.entry?.[0]?.changes?.[0];
  const value = changes?.value;
  const messages = value?.messages;
  if (!messages?.length) return;

  for (const message of messages) {
    // Deduplicar: ignorar mensajes ya procesados
    const isNew = await markProcessed(message.id);
    if (!isNew) continue;

    // Solo procesar mensajes de texto, imagen y documento
    const allowed = ["text", "image", "document", "video"];
    if (!allowed.includes(message.type)) continue;

    const from = message.from;

    if (from === OWNER()) {
      await handleOwner(from, message);
    } else {
      await handleCustomer(from, message);
    }
  }
}
