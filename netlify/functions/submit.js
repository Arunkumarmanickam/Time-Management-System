// ★ Update this URL when the client deploys their own Apps Script ★
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbygn9UXEP_epWq2VnXVgdKIrSx42CEsyupccyFtMljGnS7EVjEBv2w3cd-4PwGt_roQ/exec';

exports.handler = async function (event) {
  try {
    const res = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: event.body,
    });
    const text = await res.text();
    return { statusCode: 200, body: text, headers: { 'Content-Type': 'application/json' } };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
