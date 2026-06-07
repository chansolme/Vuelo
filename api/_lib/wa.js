"use strict";

const API_BASE = () =>
  `https://graph.facebook.com/v19.0/${process.env.WA_PHONE_NUMBER_ID}`;

async function _post(endpoint, body) {
  const res = await fetch(`${API_BASE()}${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WA_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messaging_product: "whatsapp", ...body }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error("[wa]", endpoint, err);
  }
  return res;
}

function sendText(to, text) {
  return _post("/messages", {
    to,
    type: "text",
    text: { body: text, preview_url: false },
  });
}

function sendImage(to, mediaId, caption) {
  return _post("/messages", {
    to,
    type: "image",
    image: { id: mediaId, caption: caption || "" },
  });
}

function sendDocument(to, mediaId, caption) {
  return _post("/messages", {
    to,
    type: "document",
    document: { id: mediaId, caption: caption || "", filename: "comprobante.pdf" },
  });
}

module.exports = { sendText, sendImage, sendDocument };
