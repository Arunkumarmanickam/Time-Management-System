// ★ Update this URL when the client deploys their own Apps Script ★
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/library/d/11PzgdPze9EiGCpwkSm33A9k7N0yzELGNnVCzunkB9-F_FYSUfZiNiDpn/11';

exports.handler = async function (event) {
  try {
    const payload = JSON.parse(event.body);
    const res = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: event.body,
    });
    const text = await res.text();
    const result = { ...JSON.parse(text), tabName: payload.targetTabName };
    return { statusCode: 200, body: JSON.stringify(result), headers: { 'Content-Type': 'application/json' } };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
