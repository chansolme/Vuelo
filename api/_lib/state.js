"use strict";

const { Redis } = require("@upstash/redis");

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const CONV_TTL = 48 * 60 * 60; // 48 horas

async function getConv(phone) {
  const data = await redis.get(`conv:${phone}`);
  return data || { state: "idle" };
}

async function setConv(phone, conv) {
  await redis.set(`conv:${phone}`, conv, { ex: CONV_TTL });
}

async function clearConv(phone) {
  await redis.del(`conv:${phone}`);
}

// Genera un ID de pedido único: VD-YYYYMMDD-NNN
async function nextOrderId() {
  const now = new Date().toLocaleString("es-CL", { timeZone: "America/Santiago" });
  const [datePart] = now.split(",");
  const [day, month, year] = datePart.trim().split("-").map((s) => s.padStart(2, "0"));
  const dateKey = `${year}${month}${day}`;
  const counter = await redis.incr(`order-counter:${dateKey}`);
  await redis.expire(`order-counter:${dateKey}`, 86400 * 3);
  return `VD-${dateKey}-${String(counter).padStart(3, "0")}`;
}

// Evita procesar el mismo mensaje dos veces (WhatsApp puede reenviar webhooks)
async function markProcessed(msgId) {
  const key = `msg:${msgId}`;
  const exists = await redis.exists(key);
  if (exists) return false;
  await redis.set(key, 1, { ex: 60 * 60 }); // 1 hora
  return true;
}

module.exports = { getConv, setConv, clearConv, nextOrderId, markProcessed };
