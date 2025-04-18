const apiUrl = 'https://script.google.com/macros/s/AKfycbwdxkQVy4WCXUWb6tWPpkVQymLlzpBuqPxIWc8LoOjLJfTtfSYUApksUAs-d_cxqENwLw/exec'; // Replace this with your actual Apps Script URL

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

let rawData = [];

fetch(apiUrl)
  .then(res => res.json())
  .then(data => {
    rawData = data;
    buildTable(data);
    buildSummary(data);
    buildWeeklyTable(data);
    buildCharts(data);
    buildInsights(data);
  });

function buildTable(data) {
  const headers = Object.keys(data[0]);
  const thead = document.querySelector('#salesTable thead tr');
  const tbody = document.querySelector('#salesTable tbody');
  thead.innerHTML = ''; tbody.innerHTML = '';

  headers.forEach(h => {
    const th = document.createElement('th');
    th.textContent = h;
    thead.appendChild(th);
  });

  data.forEach(row => {
    const tr = document.createElement('tr');
    headers.forEach(h => {
      const td = document.createElement('td');
      td.textContent = h === 'Date' ? formatDate(row[h]) : row[h];
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  document.querySelector('#searchInput').addEventListener('input', e => {
    const term = e.target.value.toLowerCase();
    tbody.querySelectorAll('tr').forEach(tr => {
      tr.style.display = tr.textContent.toLowerCase().includes(term) ? '' : 'none';
    });
  });
}

function buildSummary(data) {
  let totalSales = 0;
  let totalQty = 0;
  const itemCount = {};

  data.forEach(row => {
    totalSales += Number(row.Total);
    totalQty += Number(row["Qty."]);
    itemCount[row.Item] = (itemCount[row.Item] || 0) + Number(row["Qty."]);
  });

  const topItem = Object.entries(itemCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  document.getElementById("totalSales").textContent = totalSales.toLocaleString();
  document.getElementById("totalQty").textContent = totalQty;
  document.getElementById("topItem").textContent = topItem;
}

function buildWeeklyTable(data) {
  const weeks = {};

  data.forEach(row => {
    const dateObj = new Date(row.Date);
    const day = dateObj.getDay();
    const weekStart = new Date(dateObj);
    weekStart.setDate(dateObj.getDate() - day);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const weekKey = `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
    if (!weeks[weekKey]) {
      weeks[weekKey] = {
        total: 0,
        items: {},
        days: {}
      };
    }

    weeks[weekKey].total += Number(row.Total);
    const item = row.Item;
    const qty = Number(row["Qty."]);
    const date = formatDate(row.Date);

    weeks[weekKey].items[item] = (weeks[weekKey].items[item] || 0) + qty;
    weeks[weekKey].days[date] = (weeks[weekKey].days[date] || 0) + Number(row.Total);
  });

  const tbody = document.getElementById("weeklyTableBody");
  tbody.innerHTML = '';

  Object.entries(weeks).forEach(([weekRange, stats]) => {
    const tr = document.createElement("tr");

    const topItem = Object.entries(stats.items).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';
    const leastItem = Object.entries(stats.items).filter(([_, qty]) => qty > 0).sort((a, b) => a[1] - b[1])[0]?.[0] || '-';
    const bestDay = Object.entries(stats.days).sort((a, b) => b[1] - a[1])[0] || ['-', 0];

    tr.innerHTML = `
      <
