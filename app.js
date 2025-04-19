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
let ExpenseData = [];
let filteredData = [];
let showingLowStock = false;
let weeklyDonutChartInstance;
let monthlyBarChartInstance;




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

function fetchSaleItemsData() {
  showLoading(true); 
fetch(`${apiUrl}?action=getSaleItems`)
  .then(res => res.json())
  .then(data => {
    rawData = data;
    console.log(data);
    populateYearOptions(data); // 👈 add this
    applyFilters();
    showLoading(false); // 👈 filtered first render
  })
  .catch(err => {
    console.error("Error fetching sale items data:", err);
    showLoading(false); // Hide loading spinner in case of error
  });
  
}
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

function buildWeeklyTable(data,filteredExpenseData) {
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
        days: {},
        expenses: 0
      };
    }

    weeks[weekKey].total += Number(row.Total);
    const item = row.Item;
    const qty = Number(row["Qty."]);
    const date = formatDate(row.Date);

    weeks[weekKey].items[item] = (weeks[weekKey].items[item] || 0) + qty;
    weeks[weekKey].days[date] = (weeks[weekKey].days[date] || 0) + Number(row.Total);
  });

  // 👇 Add expense aggregation
filteredExpenseData.forEach(row => {
  console.log(row);
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
      days: {},
      expenses: 0 // 👈 Add this
    };
  }

  weeks[weekKey].expenses += parseFloat(row.Amount || 0); // 👈 Track expenses
  console.log(weeks);
  console.log(weekKey);
  console.log(weeks[weekKey].expenses);
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
      <td class="text-danger">${formatCurrency(stats.expenses || 0)}</td>
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

  // 🔽 Fetch inventory and find top 5 low stock items
  fetch(apiUrl + '?action=getInventory')
    .then(res => res.json())
    .then(inventoryData => {
      console.log(inventoryData);
      const lowStockItems = inventoryData
        .filter(item => Number(item.CurrentStock) < Number(item.ReorderLevel))
        .sort((a, b) => Number(a.CurrentStock) - Number(b.CurrentStock))
        .slice(0, 5)
        .map(item => `${item.ItemName} : ${item.CurrentStock}`);

      document.getElementById("lowStockItems").textContent = lowStockItems.join(", ") || 'All good!';
    })
    .catch(err => {
      console.error("Error fetching inventory for insights:", err);
      document.getElementById("lowStockItems").textContent = 'Unable to fetch';
    });

}

function buildMonthlySummary(data, filteredExpenseData) {
  const months = {};
  const monthlyExpenses = {};

  // Group sales data by MonthYear
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

  // Group expenses by MonthYear
  filteredExpenseData.forEach(row => {
    const date = new Date(row.Date);
    const key = date.toLocaleString('en-GB', { month: 'long', year: 'numeric' });
    monthlyExpenses[key] = (monthlyExpenses[key] || 0) + parseFloat(row.Amount || 0);
  });

  const tbody = document.getElementById("monthlyTableBody");
  tbody.innerHTML = '';

  // 🧠 Convert months object to sorted array (descending by date)
  const sortedEntries = Object.entries(months).sort(([a], [b]) => {
    const dateA = new Date("1 " + a); // Convert "April 2025" → Date
    const dateB = new Date("1 " + b);
    return dateB - dateA; // Descending
  });

  sortedEntries.forEach(([monthYear, stats], index) => {
    const topItem = Object.entries(stats.items).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';
    const leastItem = Object.entries(stats.items).filter(([_, qty]) => qty > 0).sort((a, b) => a[1] - b[1])[0]?.[0] || '-';
    const bestDay = Object.entries(stats.days).sort((a, b) => b[1] - a[1])[0] || ['-', 0];

    const salesTotal = stats.total;
    const expenseTotal = monthlyExpenses[monthYear] || 0;
    const profit = salesTotal - expenseTotal;

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
      const weekTotal = Object.values(daySales).reduce((sum, val) => sum + val, 0);
const weekEnd = new Date(weekStart);
weekEnd.setDate(weekEnd.getDate() + 6);

// Map day indexes to short names (M, T, W...)
const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// Build day-wise values for the week
let dailyTotals = [];
let bestDayVal = -Infinity, worstDayVal = Infinity;
let bestDayIdx = -1, worstDayIdx = -1;

for (let i = 0; i < 7; i++) {
  const date = new Date(weekStart);
  date.setDate(date.getDate() + i);
  const formatted = formatDate(date);
  const val = daySales[formatted] || 0;

  dailyTotals.push(val);

  if (val > bestDayVal) {
    bestDayVal = val;
    bestDayIdx = i;
  }
  if (val < worstDayVal) {
    worstDayVal = val;
    worstDayIdx = i;
  }
}

// Build HTML row
let headerRow = '<tr>';
let valueRow = '<tr>';

for (let i = 0; i < 7; i++) {
  headerRow += `<th class="text-center">${dayLabels[i]}</th>`;

  const value = formatCurrency(dailyTotals[i]);
  let className = 'bg-light';
  if (i === bestDayIdx) className = 'bg-success text-white fw-bold';
  else if (i === worstDayIdx) className = 'bg-danger text-white';

  valueRow += `<td class="text-center ${className}">${value}</td>`;
}

headerRow += '</tr>';
valueRow += '</tr>';


weeklyTrendHTML += `
  <div class="card shadow-sm mb-4 rounded-4">
    <div class="card-header bg-gradient-primary text-white d-flex justify-content-between align-items-center rounded-top-4">
      <span>🗓️ <strong>${formatDate(weekStart)} – ${formatDate(weekEnd)}</strong></span>
      <span class="badge bg-dark">Total: ${formatCurrency(weekTotal)}</span>
    </div>
    <div class="card-body py-3 px-4">
      <div class="d-flex justify-content-between mb-2 text-center text-muted fw-semibold" style="font-size: 0.85rem;">
        ${dayLabels.map(label => `<div style="width: 14.28%;">${label}</div>`).join('')}
      </div>
      <div class="d-flex justify-content-between text-center">
        ${dailyTotals.map((val, i) => {
          const value = formatCurrency(val);
          let bgClass = 'bg-light text-dark';
          if (i === bestDayIdx) bgClass = 'bg-success text-white fw-bold shadow';
          else if (i === worstDayIdx) bgClass = 'bg-danger text-white shadow-sm';

          return `
            <div style="width: 14.28%;">
              <div class="rounded-pill px-2 py-1 ${bgClass}" style="display:inline-block; min-width:60px; font-size:0.85rem;">
                ${value}
              </div>
            </div>`;
        }).join('')}
      </div>
    </div>
  </div>
`;



    });

    const collapseId = `collapseMonth${index}`;

    // 🧱 Main row
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${monthYear}</td>
      <td>${formatCurrency(salesTotal)}</td>
      <td>${topItem}</td>
      <td class="text-danger">${formatCurrency(expenseTotal)}</td>
      <td>
  <span class="badge ${profit > 0 ? 'bg-success' : profit < 0 ? 'bg-danger' : 'bg-secondary'}">
    ${formatCurrency(profit)}
  </span>
</td>

      <td>
        <button class="btn btn-sm btn-outline-primary" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="false">
          🔍 View
        </button>
      </td>
    `;
    tbody.appendChild(tr);

    // 🔽 Collapsible detail row
    const trCollapse = document.createElement('tr');
    trCollapse.innerHTML = `
      <td colspan="6" class="p-0 border-0">
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
  filteredExpenseData = ExpenseData.filter(row => {
    const dateObj = new Date(row.Date);
    const y = dateObj.getFullYear().toString();
    const m = ("0" + (dateObj.getMonth() + 1)).slice(-2); // '01'-'12'

    return (!selectedYear || y === selectedYear) &&
           (!selectedMonth || m === selectedMonth);
  });
  // rebuild all views
  buildTable(filteredData);
  buildSummary(filteredData);
  buildWeeklyTable(filteredData,filteredExpenseData);
  // buildCharts(filteredData);
  buildMonthlySummary(filteredData,filteredExpenseData); 
  fetchInventoryData();
  // fetchExpensesData(filteredData);
  buildInsights(filteredData);
  buildWeeklyDonutChart(filteredData); 
  buildMonthlyBarChart(filteredData);
  populateExpensesTable(filteredExpenseData);
  calculateExpensesSummary(filteredExpenseData);

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

function buildInventoryTable(data) {
  const tbody = document.getElementById("inventoryTableBody");
  tbody.innerHTML = '';

  // Filter if toggle is active
  const filtered = showingLowStock
    ? data.filter(row => Number(row.CurrentStock) < Number(row.ReorderLevel))
    : data;

  // Sort by lowest stock
  filtered
    .sort((a, b) => a.CurrentStock - b.CurrentStock)
    .forEach(row => {
      const tr = document.createElement("tr");

      for (let key in row) {
        const td = document.createElement("td");
        td.textContent = row[key];

        // Highlight low stock
        if (key === "CurrentStock" && Number(row.CurrentStock) < Number(row.ReorderLevel)) {
          td.classList.add("text-danger", "fw-bold");
        }

        tr.appendChild(td);
      }

      tbody.appendChild(tr);
    });
}



function showLoading(isLoading) {
  const spinner = document.getElementById("loadingSpinner");
  const body = document.body;

  if (isLoading) {
    spinner.style.display = "flex"; // Show the spinner
    body.classList.add("blur"); // Apply blur effect to the body
  } else {
    spinner.style.display = "none"; // Hide the spinner
    body.classList.remove("blur"); // Remove the blur effect from body
  }
}

// 📦 Fetch inventory data
function fetchInventoryData() {
  showLoading(true); // Show loading spinner and blur page

  fetch(apiUrl + '?action=getInventory')
    .then(response => response.json())
    .then(data => {
      // inventoryData = data;
      buildInventoryTable(data);
      showLoading(false); // Hide loading spinner and unblur the page
    })
    .catch(err => {
      console.error("Error fetching inventory data:", err);
      showLoading(false); // Hide loading spinner in case of error
    });
}

// 📦 Fetch expenses data
function fetchExpensesData() {
  showLoading(true); // Show loading spinner and blur page

  fetch(apiUrl + '?action=getExpenses')
    .then(response => response.json())
    .then(data => {
      ExpenseData = data;
      applyFilters();   
      showLoading(false); // Hide loading spinner and unblur the page
    })
    .catch(err => {
      console.error("Error fetching Expenses data:", err);
      showLoading(false); // Hide loading spinner in case of error
    });
}

function populateExpensesTable(data) {
  const tableBody = document.getElementById('expensesTableBody');
  tableBody.innerHTML = '';

  data.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${formatDate(row.Date)}</td>
      <td>${row.Description}</td>
      <td class="text-danger">₹${parseFloat(row.Amount || 0).toFixed(2)}</td>
      <td>${row.Category}</td>
    `;
    tableBody.appendChild(tr);
  });
}

function calculateExpensesSummary(data) {
  const total = data.reduce((sum, row) => sum + parseFloat(row.Amount || 0), 0);
  document.getElementById('totalExpenses').textContent = `₹${total.toFixed(2)}`;
  
  // ✅ Update new card
  const card = document.getElementById('totalExpensesCard');
  if (card) card.textContent = `₹${total.toFixed(2)}`;
}



function buildWeeklyDonutChart(data) {
  const weeks = {};

  data.forEach(row => {
    const dateObj = new Date(row.Date);
    const day = dateObj.getDay();
    const weekStart = new Date(dateObj);
    weekStart.setDate(dateObj.getDate() - day);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const weekKey = `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
    weeks[weekKey] = (weeks[weekKey] || 0) + Number(row.Total);
  });

  const labels = Object.keys(weeks);
  const values = Object.values(weeks);

  // ✅ Clean up existing chart safely
  if (weeklyDonutChartInstance instanceof Chart) {
    weeklyDonutChartInstance.destroy();
  }

  const ctx = document.getElementById('weeklyDonutChart').getContext('2d');
  weeklyDonutChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        label: 'Weekly Sales',
        data: values,
        backgroundColor: [
          '#FFD700', // Gold
          '#FFF8DC', // Cornsilk (creamy)
          '#FFA500', // Orange
          '#F5DEB3', // Wheat
          '#D4AF37', // Rich gold
          '#B8860B', // Dark goldenrod
          '#000000', // Black
          '#FFFFFF'  // White
        ],
        borderColor: '#fff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          backgroundColor: '#fff8dc',
          titleColor: '#000',
          bodyColor: '#333',
          borderColor: '#FFD700',
          borderWidth: 1,
          callbacks: {
            label: (tooltipItem) => {
              const value = tooltipItem.raw;
              return `₹${Number(value).toFixed(2)}`;
            }
          }
        },
        legend: {
          position: 'bottom',
          labels: {
            color: '#333',
            font: {
              weight: '600'
            }
          }
        }
      },
      cutout: '65%' // Inner radius for elegance
    }
  });
  
}



function buildMonthlyBarChart(data) {
  const monthly = {};

  data.forEach(row => {
    const date = new Date(row.Date);
    const monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' }); // "Mar 2025"
    monthly[monthKey] = (monthly[monthKey] || 0) + Number(row.Total);
  });

  const labels = Object.keys(monthly);
  const values = Object.values(monthly);

  // Cleanup existing chart if exists
  if (monthlyBarChartInstance instanceof Chart) {
    monthlyBarChartInstance.destroy();
  }

  const ctx = document.getElementById("monthlyBarChart").getContext("2d");

  monthlyBarChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Monthly Sales',
        data: values,
        backgroundColor: '#FFD700',     // Gold
        borderColor: '#B8860B',         // Dark golden border
        borderWidth: 1,
        borderRadius: 6,
        hoverBackgroundColor: '#FFC300' // Goldenrod hover
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#333', // Dark gray for visibility
            callback: function (value) {
              return `₹${value.toFixed(2)}`;
            }
          },
          grid: {
            color: 'rgba(0,0,0,0.05)' // Subtle grid
          }
        },
        x: {
          ticks: {
            color: '#333'
          },
          grid: {
            color: 'rgba(0,0,0,0.03)'
          }
        }
      },
      plugins: {
        tooltip: {
          backgroundColor: '#fff8dc', // Light creamy gold
          titleColor: '#000',
          bodyColor: '#333',
          borderColor: '#FFD700',
          borderWidth: 1,
          callbacks: {
            label: (context) => `₹${context.raw.toFixed(2)}`
          }
        },
        legend: {
          display: false
        }
      }
    }
  });
  
}


function animateValue(element, start, end, duration) {
  let startTime = null;
  const step = (currentTime) => {
    if (!startTime) startTime = currentTime;
    const progress = currentTime - startTime;
    const percent = Math.min(progress / duration, 1);
    const value = Math.floor(percent * (end - start) + start);
    element.textContent = element.dataset.prefix + value.toLocaleString();
    if (percent < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}



document.getElementById("yearSelect").addEventListener("change", e => {
  selectedYear = e.target.value;
  applyFilters();
});

document.getElementById("monthSelect").addEventListener("change", e => {
  selectedMonth = e.target.value;
  applyFilters();
});

// 🔄 Connect refresh button
document.getElementById("refreshInventoryBtn").addEventListener("click", () => {
  fetch(`${apiUrl}?action=updateInventory`)
    .then(() => fetchInventoryData())
    .catch(err => alert("Failed to refresh inventory"));
});

document.getElementById("monthSelect").value = selectedMonth;

document.getElementById("lowStockSwitch").addEventListener("change", (e) => {
  showingLowStock = e.target.checked;
  fetchInventoryData();
});

document.addEventListener('DOMContentLoaded', function() {
  fetchSaleItemsData();
  fetchExpensesData();
});

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.card-value').forEach((el) => {
    const end = parseInt(el.dataset.value || "0", 10);
    const prefix = el.dataset.prefix || "";
    el.dataset.prefix = prefix;
    animateValue(el, 0, end, 1500);
  });
});