function doGet() {
  return ContentService
    .createTextOutput('TMS Backend is running. Use POST to submit data.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const raw = e.postData.contents;
    const data = JSON.parse(raw);
    const tabName = data.targetTabName || 'GeneralLog';
    const sheet = getOrCreateSheet(ss, tabName);

    const headers = getHeaders(data.prefix);
    ensureHeaders(sheet, headers);
    const row = buildRow(data, headers);
    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success', receivedTab: tabName, raw: raw }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet(ss, name) {
  const existing = ss.getSheetByName(name);
  if (existing) return existing;
  const s = ss.insertSheet(name);
  return s;
}

function getHeaders(prefix) {
  const common = ['Timestamp', 'Emp ID', 'Emp Name', 'Module Name', 'Doc ID', 'Elapsed Time', 'Notes/Challenges'];
  if (prefix === 'class') {
    return ['Timestamp', 'Emp ID', 'Emp Name', 'Module Name', 'Doc ID', 'No of Pages', 'Type', 'Elapsed Time', 'Notes/Challenges'];
  }
  if (prefix === 'field' || prefix === 'trans') {
    return ['Timestamp', 'Emp ID', 'Emp Name', 'Module Name', 'Doc ID', 'Fields Count', 'Layout Type', 'Kicked Back', 'Elapsed Time', 'Notes/Challenges'];
  }
  if (prefix === 'super') {
    return ['Timestamp', 'Emp ID', 'Emp Name', 'Module Name', 'Doc ID', 'Type', 'Elapsed Time', 'Notes/Challenges'];
  }
  return common;
}

function ensureHeaders(sheet, expected) {
  const existing = sheet.getLastRow();
  if (existing > 0) {
    const firstRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    if (firstRow.join('|') === expected.join('|')) return;
  }
  sheet.clear();
  sheet.appendRow(expected);
  sheet.getRange(1, 1, 1, expected.length).setFontWeight('bold');
}

function buildRow(data, headers) {
  const row = [];
  const ts = new Date();
  for (let i = 0; i < headers.length; i++) {
    const h = headers[i];
    if (h === 'Timestamp') { row.push(ts); continue; }
    if (h === 'Emp ID') { row.push(data.empId || ''); continue; }
    if (h === 'Emp Name') { row.push(data.empName || ''); continue; }
    if (h === 'Module Name') { row.push(data.moduleName || ''); continue; }
    if (h === 'Doc ID') { row.push(data.docId || ''); continue; }
    if (h === 'Elapsed Time') { row.push(data.elapsedTime || ''); continue; }
    if (h === 'Notes/Challenges') { row.push(data.notes || ''); continue; }
    if (h === 'No of Pages') { row.push(data.metricCount || ''); continue; }
    if (h === 'Fields Count') { row.push(data.metricCount || ''); continue; }
    if (h === 'Layout Type') { row.push(data.type || ''); continue; }
    if (h === 'Kicked Back') { row.push(data.kickedBack || ''); continue; }
    if (h === 'Type') { row.push(data.type || ''); continue; }
    row.push('');
  }
  return row;
}
