const apiUrl = 'https://script.google.com/macros/s/AKfycbwdxkQVy4WCXUWb6tWPpkVQymLlzpBuqPxIWc8LoOjLJfTtfSYUApksUAs-d_cxqENwLw/exec'; // Replace this with your actual Apps Script URL

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatCurrency(value) {
  return `₹${Number(value).toFixed(2)}`;
}


/*
// MOCK DATA (replace fetch with this)
const rawData = [
  {
    Date: "2025-03-25",
    Item: "Classic Veg Momos",
    Code: "[New] 1",
    "Qty.": 2,
    Total: 158,
    MonthYear: "March-2025"
  },
  {
    Date: "2025-03-25",
    Item: "Chicken Schezwan Momos",
    Code: "[New] 6",
    "Qty.": 1,
    Total: 109,
    MonthYear: "March-2025"
  },
  {
    Date: "2025-03-26",
    Item: "Water Bottle 1ltr",
    Code: "water bottle 1ltr",
    "Qty.": 3,
    Total: 60,
    MonthYear: "March-2025"
  },
  {
    Date: "2025-03-26",
    Item: "French Fries",
    Code: "[New] 66",
    "Qty.": 2,
    Total: 198,
    MonthYear: "March-2025"
  },
  {
    Date: "2025-03-27",
    Item: "Paneer Mo-Burger",
    Code: "[New] 70",
    "Qty.": 1,
    Total: 99,
    MonthYear: "March-2025"
  },
  {
    Date: "2025-03-27",
    Item: "Paneer Mo-Burger",
    Code: "[New] 70",
    "Qty.": 1,
    Total: 99,
    MonthYear: "March-2025"
  },
  {
    Date: "2025-03-27",
    Item: "Paneer Mo-Burger",
    Code: "[New] 70",
    "Qty.": 1,
    Total: 99,
    MonthYear: "March-2025"
  },
  {
    Date: "2025-03-27",
    Item: "Paneer Mo-Burger",
    Code: "[New] 70",
    "Qty.": 1,
    Total: 99,
    MonthYear: "March-2025"
  },
  {
    Date: "2025-03-27",
    Item: "Paneer Mo-Burger",
    Code: "[New] 70",
    "Qty.": 1,
    Total: 99,
    MonthYear: "March-2025"
  },
  {
    Date: "2025-03-27",
    Item: "Paneer Mo-Burger",
    Code: "[New] 70",
    "Qty.": 1,
    Total: 99,
    MonthYear: "March-2025"
  },
  {
    Date: "2025-03-27",
    Item: "Paneer Mo-Burger",
    Code: "[New] 70",
    "Qty.": 1,
    Total: 99,
    MonthYear: "March-2025"
  },
  {
    Date: "2025-03-27",
    Item: "Paneer Mo-Burger",
    Code: "[New] 70",
    "Qty.": 1,
    Total: 99,
    MonthYear: "March-2025"
  },
  {
    Date: "2025-03-27",
    Item: "Paneer Mo-Burger",
    Code: "[New] 70",
    "Qty.": 1,
    Total: 99,
    MonthYear: "March-2025"
  },
  {
    Date: "2025-04-27",
    Item: "Paneer Mo-Burger",
    Code: "[New] 70",
    "Qty.": 1,
    Total: 99,
    MonthYear: "March-2025"
  },
  {
    Date: "2025-05-27",
    Item: "Paneer Mo-Burger",
    Code: "[New] 70",
    "Qty.": 1,
    Total: 99,
    MonthYear: "March-2025"
  },
  {
    Date: "2025-06-27",
    Item: "Paneer Mo-Burger",
    Code: "[New] 70",
    "Qty.": 1,
    Total: 99,
    MonthYear: "March-2025"
  },
  {
    Date: "2025-05-27",
    Item: "Paneer Mo-Burger",
    Code: "[New] 70",
    "Qty.": 1,
    Total: 99,
    MonthYear: "March-2025"
  },
  {
    Date: "2025-04-02",
    Item: "Paneer Mo-Burger",
    Code: "[New] 70",
    "Qty.": 1,
    Total: 99,
    MonthYear: "March-2025"
  },
  {
    Date: "2025-03-31",
    Item: "Paneer Mo-Burger",
    Code: "[New] 70",
    "Qty.": 1,
    Total: 99,
    MonthYear: "March-2025"
  },
  {
    Date: "2025-03-30",
    Item: "Paneer Mo-Burger",
    Code: "[New] 70",
    "Qty.": 1,
    Total: 99,
    MonthYear: "March-2025"
  },
  {
    Date: "2025-03-28",
    Item: "Paneer Mo-Burger",
    Code: "[New] 70",
    "Qty.": 1,
    Total: 99,
    MonthYear: "March-2025"
  },
  // 👉 Add ~25 more rows by duplicating and adjusting dates/items
];

let filteredData = rawData;

const now = new Date();
let selectedYear = now.getFullYear().toString();
let selectedMonth = String(now.getMonth() + 1).padStart(2, '0'); // '01'-'12'


// Call render manually since no fetch
populateYearOptions(rawData);
applyFilters();


*/


let rawData = [];
let filteredData = [];

const now = new Date();
let selectedYear = now.getFullYear().toString();
let selectedMonth = String(now.getMonth() + 1).padStart(2, '0'); // '01'-'12'

/*
function initDashboard() {
fetch(apiUrl)
  .then(res => res.json())
  .then(data => {
    rawData = data;
    populateYearOptions(data); // 👈 add this
    applyFilters(); // 👈 filtered first render
  });
  ;
}*/
fetch(apiUrl)
  .then(res => res.json())
  .then(data => {
    rawData = data;
    populateYearOptions(data); // 👈 add this
    applyFilters(); // 👈 filtered first render
  });
  ;
  
  function buildTable(data) {
    const table = document.querySelector('#salesTable');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    thead.innerHTML = `
      <tr>
        <th>Date</th>
        <th>Total Qty.</th>
        <th>Subtotal</th>
        <th>Top Item</th>
        <th></th>
      </tr>
    `;
    tbody.innerHTML = '';
  
    // Group data by Date
    const grouped = {};
    data.forEach(row => {
      const date = formatDate(row.Date);
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(row);
    });
  
    Object.entries(grouped).forEach(([date, items], index) => {
      const collapseId = `collapse-${index}`;
      const totalQty = items.reduce((sum, i) => sum + Number(i["Qty."]), 0);
      const subtotal = items.reduce((sum, i) => sum + Number(i.Total), 0);
      const topItem = Object.entries(items.reduce((acc, i) => {
        acc[i.Item] = (acc[i.Item] || 0) + Number(i["Qty."]);
        return acc;
      }, {})).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';
  
      // Main row (summary)
      const summaryRow = document.createElement('tr');
      summaryRow.innerHTML = `
        <td>${date}</td>
        <td>${totalQty}</td>
        <td>${formatCurrency(subtotal)}</td>
        <td>${topItem}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary" 
                  data-bs-toggle="collapse" 
                  data-bs-target="#${collapseId}">
            View
          </button>
        </td>
      `;
      tbody.appendChild(summaryRow);
  
      // Expandable detail row
      const detailsRow = document.createElement('tr');
      detailsRow.innerHTML = `
        <td colspan="5" class="p-0 border-0">
          <div class="collapse" id="${collapseId}">
            <div class="p-2">
              <table class="table table-sm mb-0 table-bordered">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Code</th>
                    <th>Qty.</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${items.map(item => `
                    <tr>
                      <td>${item.Item}</td>
                      <td>${item.Code}</td>
                      <td>${item["Qty."]}</td>
                      <td>${formatCurrency(item.Total)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </td>
      `;
      tbody.appendChild(detailsRow);
    });
  
    // Search filter still applies
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
    totalQty += parseInt(row["Qty."]);
    itemCount[row.Item] = (itemCount[row.Item] || 0) + parseInt(row["Qty."]);
  });

  const topItem = Object.entries(itemCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  document.getElementById("totalSales").textContent = formatCurrency(totalSales);
  document.getElementById("totalQty").textContent = totalQty.toLocaleString();
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
      <td>${formatCurrency(stats.total)}</td>
      <td>${topItem}</td>
      <td>${leastItem}</td>
      <td>${bestDay[0]}</td>
      <td>${formatCurrency(bestDay[1])}</td>
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

  document.getElementById("weekTotal").textContent = formatCurrency(recentTotal);
}

function buildMonthlySummary(data) {
  const months = {};

  // Group by MonthYear
  data.forEach(row => {
    const date = new Date(row.Date);
    const key = date.toLocaleString('en-GB', { month: 'long', year: 'numeric' });
  
    if (!months[key]) {
      months[key] = {
        total: 0,
        items: {},
        days: {},
        rawRows: []
      };
    }
  
    months[key].total += Number(row.Total);
    const item = row.Item;
    const qty = Number(row["Qty."]);
    const dateFormatted = formatDate(row.Date);
  
    months[key].items[item] = (months[key].items[item] || 0) + qty;
    months[key].days[dateFormatted] = (months[key].days[dateFormatted] || 0) + Number(row.Total);
    months[key].rawRows.push(row);
  });
  
  const tbody = document.getElementById("monthlyTableBody");
  tbody.innerHTML = '';

  Object.entries(months).forEach(([monthYear, stats], index) => {
    const topItem = Object.entries(stats.items).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';
    const leastItem = Object.entries(stats.items).filter(([_, qty]) => qty > 0).sort((a, b) => a[1] - b[1])[0]?.[0] || '-';
    const bestDay = Object.entries(stats.days).sort((a, b) => b[1] - a[1])[0] || ['-', 0];

    // Weekly breakdown
    const weeklyMap = {};
    stats.rawRows.forEach(row => {
      const dateObj = new Date(row.Date);
      const weekStart = new Date(dateObj);
      weekStart.setDate(dateObj.getDate() - dateObj.getDay());
      const weekKey = formatDate(weekStart);

      if (!weeklyMap[weekKey]) {
        weeklyMap[weekKey] = { days: {} };
      }

      const formatted = formatDate(row.Date);
      weeklyMap[weekKey].days[formatted] = (weeklyMap[weekKey].days[formatted] || 0) + Number(row.Total);
    });

    let weeklyTrendHTML = '';
    Object.entries(weeklyMap).forEach(([weekStart, weekStats]) => {
      const daySales = weekStats.days;
      const best = Object.entries(daySales).sort((a, b) => b[1] - a[1])[0];
      const worst = Object.entries(daySales).sort((a, b) => a[1] - b[1])[0];
      weeklyTrendHTML += `
        <div><strong>Week of ${weekStart}:</strong> 🟢 Best: ${best?.[0]} (₹${best?.[1].toFixed(2)}), 🔴 Worst: ${worst?.[0]} (₹${worst?.[1].toFixed(2)})</div>
      `;
    });

    // Unique ID for collapse
    const collapseId = `collapseMonth${index}`;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${monthYear}</td>
      <td>${formatCurrency(stats.total)}</td>
      <td>${topItem}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="false">
          🔍 View
        </button>
      </td>
    `;
    tbody.appendChild(tr);

    // Collapse row
    const trCollapse = document.createElement('tr');
    trCollapse.innerHTML = `
      <td colspan="4" class="p-0 border-0">
        <div id="${collapseId}" class="collapse">
          <div class="p-3 bg-light">
            <p><strong>Top Item:</strong> ${topItem}</p>
            <p><strong>Least Item:</strong> ${leastItem}</p>
            <p><strong>Best Day:</strong> ${bestDay[0]} (${formatCurrency(bestDay[1])})</p>
            <p><strong>Weekly Trends:</strong></p>
            ${weeklyTrendHTML}
          </div>
        </div>
      </td>
    `;
    tbody.appendChild(trCollapse);
  });
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

    // 👇 Select current year by default
    yearSelect.value = selectedYear;
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
  // buildCharts(filteredData);
  buildMonthlySummary(filteredData); 
  buildInsights(filteredData);
}

function handleCredentialResponse(response) {
  const userData = parseJwt(response.credential);
  const allowedEmails = ["isayyourslovingly@gmail.com", "someoneelse@domain.com"];

  if (allowedEmails.includes(userData.email)) {
    document.body.classList.remove("unauthenticated");
    initDashboard(); // your normal loading logic
  } else {
    alert("Access denied. Not an authorized user.");
  }
}

// Helper to decode JWT token
function parseJwt(token) {
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  const json = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(json);
}


document.getElementById("yearSelect").addEventListener("change", e => {
  selectedYear = e.target.value;
  applyFilters();
});

document.getElementById("monthSelect").addEventListener("change", e => {
  selectedMonth = e.target.value;
  applyFilters();
});

document.getElementById("monthSelect").value = selectedMonth;
