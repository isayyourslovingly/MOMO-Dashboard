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
let filteredData = [];

let selectedYear = '';
let selectedMonth = '';


fetch(apiUrl)
  .then(res => res.json())
  .then(data => {
    rawData = data;
    buildTable(data);
    buildSummary(data);
    buildWeeklyTable(data);
    buildCharts(data);
    buildInsights(data);
  })
  .then(data => {
    rawData = data;
    populateYearOptions(data); // 👈 add this
    applyFilters(); // 👈 filtered first render
  });
  ;

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
      <td>${weekRange}</td>
      <td>₹${stats.total.toLocaleString()}</td>
      <td>${topItem}</td>
      <td>${leastItem}</td>
      <td>${bestDay[0]}</td>
      <td>₹${bestDay[1].toLocaleString()}</td>
    `;

    tbody.appendChild(tr);
  });
}

function buildCharts(data) {
  const monthly = {};

  data.forEach(row => {
    const monthYear = row.MonthYear;
    monthly[monthYear] = (monthly[monthYear] || 0) + Number(row.Total);
  });

  const ctx = document.getElementById('monthlyChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: Object.keys(monthly),
      datasets: [{
        label: 'Monthly Sales',
        data: Object.values(monthly),
        fill: false,
        borderColor: '#4e73df',
        tension: 0.3
      }]
    }
  });
}

function buildInsights(data) {
  const totalsByDate = {};
  const itemCount = {};

  data.forEach(row => {
    const date = formatDate(row.Date);
    totalsByDate[date] = (totalsByDate[date] || 0) + Number(row.Total);
    itemCount[row.Item] = (itemCount[row.Item] || 0) + Number(row["Qty."]);
  });

  const bestDay = Object.entries(totalsByDate).sort((a, b) => b[1] - a[1])[0];
  const topItem = Object.entries(itemCount).sort((a, b) => b[1] - a[1])[0];

  document.getElementById("bestDay").textContent = bestDay?.[0] || '-';
  document.getElementById("insightTopItem").textContent = topItem?.[0] || '-';

  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const recentTotal = data
    .filter(row => {
      const date = new Date(row.Date);
      return date >= start && date <= end;
    })
    .reduce((sum, [, , , , total]) => sum + Number(total), 0);

  document.getElementById("weekTotal").textContent = recentTotal.toLocaleString();
}

function populateYearOptions(data) {
  const yearSet = new Set();

  data.forEach(row => {
    let dateStr = row.Date;

    // Try to parse reliably even if it's in "DD-MM-YYYY"
    let dateParts = dateStr.split(/[-/]/);
    let year;

    if (dateParts[2]?.length === 4) {
      // assume DD-MM-YYYY or DD/MM/YYYY
      year = dateParts[2];
    } else {
      // fallback if it's ISO or Date object
      year = new Date(dateStr).getFullYear();
    }

    if (!isNaN(year)) {
      yearSet.add(year);
    }
  });

  const yearSelect = document.getElementById("yearSelect");
  yearSelect.innerHTML = `<option value="">All</option>`;

  [...yearSet].sort((a, b) => b - a).forEach(year => {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  });
}

function applyFilters() {
  filteredData = rawData.filter(row => {
    const dateObj = new Date(row.Date);
    const y = dateObj.getFullYear().toString();
    const m = ("0" + (dateObj.getMonth() + 1)).slice(-2); // '01'-'12'

    return (!selectedYear || y === selectedYear) &&
           (!selectedMonth || m === selectedMonth);
  });

  // rebuild all views
  buildTable(filteredData);
  buildSummary(filteredData);
  buildWeeklyTable(filteredData);
  buildCharts(filteredData);
  buildInsights(filteredData);
}

document.getElementById("yearSelect").addEventListener("change", e => {
  selectedYear = e.target.value;
  applyFilters();
});

document.getElementById("monthSelect").addEventListener("change", e => {
  selectedMonth = e.target.value;
  applyFilters();
});
