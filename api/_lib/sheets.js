"use strict";

const { google } = require("googleapis");

const SHEET_NAME = "Pedidos";
// Columnas: A=ID B=Fecha C=Nombre D=Teléfono E=Comuna F=Items G=Total H=Estado I=NumCliente J=Notas
const HEADERS = ["ID", "Fecha", "Nombre", "Teléfono", "Comuna", "Items", "Total", "Estado", "NumCliente", "Notas"];

function getAuth() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function nowCL() {
  return new Date().toLocaleString("es-CL", {
    timeZone: "America/Santiago",
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

async function ensureHeaders(sheets, spreadsheetId) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_NAME}!A1:J1`,
  });
  if (!res.data.values || res.data.values[0]?.[0] !== "ID") {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${SHEET_NAME}!A1:J1`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [HEADERS] },
    });
  }
}

async function appendOrder(order) {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const id = process.env.GOOGLE_SHEET_ID;

  await ensureHeaders(sheets, id);

  await sheets.spreadsheets.values.append({
    spreadsheetId: id,
    range: `${SHEET_NAME}!A:J`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[
        order.id,
        nowCL(),
        order.name,
        order.phone,
        order.commune,
        order.itemsSummary,
        order.totalFmt,
        "Pendiente pago",
        order.customerPhone,
        order.notes,
      ]],
    },
  });
}

async function updateOrderStatus(orderId, status) {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const id = process.env.GOOGLE_SHEET_ID;

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: id,
    range: `${SHEET_NAME}!A:A`,
  });

  const rows = res.data.values || [];
  const rowIndex = rows.findIndex((r) => r[0] === orderId);
  if (rowIndex === -1) return false;

  await sheets.spreadsheets.values.update({
    spreadsheetId: id,
    range: `${SHEET_NAME}!H${rowIndex + 1}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [[status]] },
  });
  return true;
}

async function getOrderByOrderId(orderId) {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const id = process.env.GOOGLE_SHEET_ID;

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: id,
    range: `${SHEET_NAME}!A:J`,
  });

  const rows = res.data.values || [];
  const row = rows.find((r) => r[0] === orderId);
  if (!row) return null;

  return {
    id: row[0], date: row[1], name: row[2], phone: row[3],
    commune: row[4], items: row[5], totalFmt: row[6],
    status: row[7], customerPhone: row[8], notes: row[9],
  };
}

module.exports = { appendOrder, updateOrderStatus, getOrderByOrderId };
