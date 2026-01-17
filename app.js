const baseURL = 'https://script.google.com/macros/s/AKfycbzDy9ZYVKggmLIFrvArQqG-MnL3e9lLoRZdTamnn--c1F5VD5tMJu-xRe2leYAcQ64ZMg/exec'; // Replace with your actual script ID


let combinedSalesData = [];
let filteredData = [];

document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  fetchCombinedSalesData(); // Initial load with current year
});

function setupEventListeners() {
  document.getElementById('yearSelect').addEventListener('change', applyFilters);
  document.getElementById('monthSelect').addEventListener('change', applyFilters);
  document.getElementById('datePicker').addEventListener('change', applyFilters);
  document.getElementById('tab-dashboard').addEventListener('click', () => renderTab('dashboard'));
  document.getElementById('tab-daily').addEventListener('click', () => renderTab('daily'));
  document.getElementById('tab-week').addEventListener('click', () => renderTab('week'));
  document.getElementById('tab-month').addEventListener('click', () => renderTab('month'));
  document.getElementById('tab-expenses').addEventListener('click', () => renderTab('expenses'));
  document.getElementById('tab-inventory').addEventListener('click', () => fetchAndRender('getInventory'));
  document.getElementById('homeBtn').addEventListener('click', () => {
    document.getElementById('content').scrollTo({ top: 0, behavior: 'smooth' });
  });
  document.getElementById('refreshBtn').addEventListener('click', () => hardRefresh());
  
  
}

// === Data Fetching ===
function fetchCombinedSalesData(params = {}) {
    const loader = document.getElementById('loader');
    loader.style.display = 'flex'; // Show loader
  
    let query = new URLSearchParams({ action: 'getCombinedSales', ...params }).toString();
    fetch(`${baseURL}?${query}`)
      .then(res => res.json())
      .then(response => {
        if (response.status === 'success' && Array.isArray(response.data)) {
          combinedSalesData = response.data;
          filteredData = [...combinedSalesData];
          console.log(filteredData);
          populateFilterOptions();
          renderTab('dashboard');
        } else {
          console.error("Error fetching combined sales:", response);
        }
      })
      .catch(err => console.error("Fetch error:", err))
      .finally(() => {
        loader.style.display = 'none'; // Hide loader
      });
  }
  

function fetchAndRender(action) {
  fetch(`${baseURL}?action=${action}`)
    .then(res => res.json())
    .then(response => {
      if (response.status === 'success') {
        renderGenericTable(response, action);
        console.log(JSON.stringify(response));
      } else {
        renderError(response.data.message || "No data found.");
      }
    })
    .catch(err => renderError(err));
}

// === Filters ===

function populateFilterOptions() {
  const years = new Set();
  const months = new Set();

  combinedSalesData.forEach(item => {
    const [year, month] = item.Date.split('T')[0].split('-');
    years.add(year);
    months.add(month);
  });

  populateDropdown('yearSelect', [...years]);
  populateDropdown('monthSelect', [...months]);
}

function populateDropdown(id, options) {
  const select = document.getElementById(id);
  select.innerHTML = `<option value="">All</option>`;
  options.sort().forEach(opt => {
    const el = document.createElement('option');
    el.value = opt;
    el.textContent = opt;
    select.appendChild(el);
  });
}

function applyFilters() {
  const year = document.getElementById('yearSelect').value;
  const month = document.getElementById('monthSelect').value;
  const exactDate = document.getElementById('datePicker').value;
  console.log(combinedSalesData);
  filteredData = combinedSalesData.filter(item => {
    const [itemYear, itemMonth, itemDay] = item.Date.split('T')[0].split('-');

    if (exactDate) {
      return item.Date.startsWith(exactDate);
    }
    if (year && itemYear !== year) return false;
    if (month && itemMonth !== month) return false;

    return true;
  });

  renderTab(getActiveTab());
}

// === Tab Rendering ===

function renderTab(view) {
  document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`tab-${view}`).classList.add('active');

  switch (view) {
    case 'daily':
      renderDailyView();
      break;
    case 'week':
      renderWeeklyView();
      break;
    case 'month':
        renderMonthlyView();
        break;
        case 'expenses':
            renderExpenses();
          break;
          case 'dashboard':
              renderDashboard();
            break;
  }
}

function getActiveTab() {
  const active = document.querySelector('.tab-button.active');
  return active ? active.dataset.tab : 'daily';
}
// === Dashboard Rendering ===
let calendarDate = new Date(); // Default initial month
let weeklyDonutChartInstance;

function renderDashboard() {
  if (filteredData.length === 0) return renderError("No matching sales data.");

  const content = document.getElementById('content');
  const html = `
    <h1>Sales Dashboard</h1>
    <div class="dashboard">
      <div class="card small-card"><h2 id="ordersCount">0</h2><p>Total Orders (7d)</p></div>
      <div class="card small-card"><h2 id="salesAmount">₹0</h2><p>Total Sales (7d)</p></div>
      <div class="card small-card"><h2 id="expensesAmount">₹0</h2><p>Total Expenses (7d)</p></div>
      <div class="card span-2">
        <h3>📅 Sales Calendar -
          <button id="prevMonth" aria-label="Previous Month">◀️</button>
          <span id="calendarMonth"></span>
          <button id="nextMonth" aria-label="Next Month">▶️</button>
        </h3>
        <div class="calendar-grid" id="calendar"></div>
      </div>
      <div class="card"><h3>📊 Sales Insights</h3><ul id="insightsList"></ul></div>
      <div class="card span-3"><h3>📈 Sales vs Target (7 Days)</h3><canvas id="barChart" height="100"></canvas></div>
    </div>
    <div id="modalOverlay" class="modal-overlay hidden">
      <div class="modal">
        <button class="modal-close" aria-label="Close modal">×</button>
        <div class="modal-content" id="modalContent"></div>
      </div>
    </div>
  `;

  content.innerHTML = html;

  document.getElementById('prevMonth').addEventListener('click', () => {
    calendarDate.setMonth(calendarDate.getMonth() - 1);
    renderDashboardData(filteredData, calendarDate);
  });

  document.getElementById('nextMonth').addEventListener('click', () => {
    calendarDate.setMonth(calendarDate.getMonth() + 1);
    renderDashboardData(filteredData, calendarDate);
  });

  document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'modalOverlay' || e.target.classList.contains('modal-close')) {
      document.getElementById('modalOverlay').classList.add('hidden');
    }
  });

  renderDashboardData(filteredData, calendarDate);
}

function renderDashboardData(data, date = calendarDate) {
  calendarDate = new Date(date);

  const allDailySales = data.flatMap(entry => entry.DailySaleData || []);
  const allExpenses = data.flatMap(entry => entry.ExpensesData || []);
  const allItems = data.flatMap(entry => entry.itemisedSale || []);

  const today = new Date();
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();
  const currentMonthName = date.toLocaleString('default', { month: 'long' });
  document.getElementById("calendarMonth").textContent = `${currentMonthName} ${currentYear}`;

  const last7Days = new Set();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    last7Days.add(d.toISOString().split('T')[0]);
  }

  const last7Sales = allDailySales.filter(s => last7Days.has(s.Date));
  const totalOrders = last7Sales.length;
  const totalSales = last7Sales.reduce((sum, s) => sum + s["Total + Tip"], 0);
  const totalExpenses = allExpenses.filter(e => last7Days.has(e.Date)).reduce((sum, e) => sum + e.Amount, 0);

  document.getElementById("ordersCount").textContent = totalOrders;
  document.getElementById("salesAmount").textContent = `₹${totalSales}`;
  document.getElementById("expensesAmount").textContent = `₹${totalExpenses}`;

  const cal = document.getElementById("calendar");
  cal.innerHTML = '';
  const dailyTotalMap = {};
  allDailySales.forEach(d => {
    dailyTotalMap[d.Date] = (dailyTotalMap[d.Date] || 0) + d["Total + Tip"];
  });

  const startDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const weeklySalesMap = {};

  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(currentYear, currentMonth, d);
    const weekNumber = getWeekOfMonth(dateObj);
    const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
    const sale = dailyTotalMap[dateStr] || 0;

    if (!weeklySalesMap[weekNumber]) weeklySalesMap[weekNumber] = [];
    weeklySalesMap[weekNumber].push({ date: dateStr, day: d, sale });
  }

  const starDays = new Set();
  Object.values(weeklySalesMap).forEach(week => {
    if (week.length > 0) {
      const top = week.reduce((a, b) => (a.sale > b.sale ? a : b));
      starDays.add(top.date);
    }
  });

  for (let i = 0; i < startDay; i++) {
    cal.innerHTML += '<div></div>';
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
    const sale = dailyTotalMap[dateStr] || 0;
    const isTopDay = starDays.has(dateStr);

    const cell = document.createElement("div");
    cell.classList.add("calendar-cell");
    if (sale === 0) cell.classList.add("missing");
    if (sale < 500 && sale > 0) cell.classList.add("low-sale");
    if (sale > 3000) cell.classList.add("high-sale");
    if (isTopDay) cell.classList.add("star-day");

    cell.innerHTML = `<strong>${d}</strong><br><small>₹${sale}</small>`;
    cell.addEventListener('click', () => openModalForDate(dateStr, allDailySales, allItems, allExpenses));
    cal.appendChild(cell);
  }

  function getWeekOfMonth(date) {
    const adjustedDate = date.getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return Math.ceil(adjustedDate / 7);
  }

  const chartLabels = Array.from(last7Days).sort();
  const targetValue = 2000;
  const actual = chartLabels.map(date =>
    last7Sales.filter(s => s.Date === date).reduce((sum, s) => sum + s["Total + Tip"], 0)
  );
  const shortfall = actual.map(val => val >= targetValue ? 0 : targetValue - val);
  const cappedActual = actual.map(val => Math.min(val, targetValue));

  if (weeklyDonutChartInstance instanceof Chart) weeklyDonutChartInstance.destroy();
  const ctx = document.getElementById('barChart').getContext('2d');

  weeklyDonutChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: chartLabels,
      datasets: [
        { label: 'Actual Sales', data: cappedActual, backgroundColor: '#ffd100' },
        { label: 'Shortfall to Target', data: shortfall, backgroundColor: '#4d4d4d' }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: { stacked: true },
        y: {
          stacked: true,
          beginAtZero: true,
          suggestedMax: targetValue * 1.2
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.dataset.label}: ₹${ctx.raw}`
          }
        }
      }
    }
  });

  const insightsList = document.getElementById('insightsList');
  insightsList.innerHTML = '';
  const topSold = allItems.length ? [...allItems].sort((a, b) => b["Qty."] - a["Qty."])[0] : null;
  const leastSold = allItems.length ? [...allItems].sort((a, b) => a["Qty."] - b["Qty."])[0] : null;
  const mostProfit = allItems.length ? [...allItems].sort((a, b) => b["Total"] - a["Total"])[0] : null;

  const orderCounts = {};
  allDailySales.forEach(o => {
    orderCounts[o.Date] = (orderCounts[o.Date] || 0) + 1;
  });

  const datesSorted = Object.entries(orderCounts).sort((a, b) => b[1] - a[1]);
  const [busiestDate, busiestCount] = datesSorted[0] || [];
  const [quietestDate, quietestCount] = datesSorted[datesSorted.length - 1] || [];

  const insights = [
    topSold && `🏆 <b>Top Sold:</b> ${topSold.Item} (${topSold["Qty."]} sold)`,
    leastSold && `💤 <b>Least Sold:</b> ${leastSold.Item} (${leastSold["Qty."]} sold)`,
    mostProfit && `💰 <b>Most Profit:</b> ${mostProfit.Item} (₹${mostProfit.Total})`,
    busiestDate && `📅 <b>Busiest Day:</b> ${busiestDate} (${busiestCount} orders)`,
    quietestDate && `🕊️ <b>Quietest Day:</b> ${quietestDate} (${quietestCount} orders)`
  ].filter(Boolean);

  insights.forEach(txt => {
    const li = document.createElement('li');
    li.innerHTML = txt;
    insightsList.appendChild(li);
  });
}

function openModalForDate(dateStr, sales, items, expenses) {
  const modalOverlay = document.getElementById('modalOverlay');
  const modalContent = document.getElementById('modalContent');

  const formattedDate = new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const dailySales = sales.filter(s => s.Date === dateStr);
  const dailyExpenses = expenses.filter(e => e.Date === dateStr);
  const itemCount = items.filter(i => i.Date === dateStr).reduce((sum, i) => sum + i["Qty."], 0);

  const totalSales = dailySales.reduce((sum, s) => sum + s["Total + Tip"], 0);
  const totalExpenses = dailyExpenses.reduce((sum, e) => sum + e.Amount, 0);

  modalContent.innerHTML = `
    <h2>${formattedDate}</h2>
    <p><b>Total Sales:</b> ₹${totalSales}</p>
    <p><b>Total Items Sold:</b> ${itemCount}</p>
    <p><b>Total Expenses:</b> ₹${totalExpenses}</p>
  `;

  modalOverlay.classList.remove('hidden');
}


// === Expenses Rendering ===
function renderExpenses() {
    if (filteredData.length === 0) {
        return renderError("No matching sales data.");
    }

    const content = document.getElementById('content');
    let groupedExpenses = {};

    // Group expenses by Month-Year and then by Category
    filteredData.forEach(day => {
        day.ExpensesData.forEach(expense => {
            const date = new Date(expense.Date);
            const monthYear = date.toLocaleString('default', { month: 'long' }) + '-' + date.getFullYear(); // e.g., "April-2025"
            const category = expense.Category;

            // Group by Month-Year
            if (!groupedExpenses[monthYear]) {
                groupedExpenses[monthYear] = {};
            }

            // Group by Category within each Month-Year
            if (!groupedExpenses[monthYear][category]) {
                groupedExpenses[monthYear][category] = [];
            }

            groupedExpenses[monthYear][category].push(expense);
        });
    });

    // Build HTML for grouped expenses
    let html = '';
    for (let monthYear in groupedExpenses) {
        const monthCategories = groupedExpenses[monthYear];

        // Calculate total for the month
        const totalForMonth = Object.values(monthCategories).flat().reduce((total, expense) => total + expense.Amount, 0);

        // Start the group (Month-Year) section
        html += `
            <div class="expense-group">
                <div class="group-header">
                    <span class="month-year">${monthYear}</span>
                    <span class="total">Total: ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalForMonth)}</span>
                    <button class="expander" onclick="toggleCategoryGroup('${monthYear}')">+</button>
                </div>
                <div id="category-details-${monthYear}" class="category-details" style="display: none;">
        `;

        // Loop through categories and create category sections
        for (let category in monthCategories) {
            const categoryExpenses = monthCategories[category];

            // Calculate total for the category
            const totalForCategory = categoryExpenses.reduce((total, expense) => total + expense.Amount, 0);

            // Add category section
            html += `
                <div class="category-group">
                    <div class="category-header">
                        <span class="category-name">${category}</span>
                        <span class="category-total">Total: ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalForCategory)}</span>
                        <button class="expander" onclick="toggleExpenseDetails('${monthYear}', '${category}')">+</button>
                    </div>
                    <div id="expense-details-${monthYear}-${category}" class="expense-details" style="display: none;">
                        <table>
                            <thead>
                                <tr><th>Date</th><th>Description</th><th>Amount</th></tr>
                            </thead>
                            <tbody>
            `;

            // Add each individual expense under the category
            categoryExpenses.forEach(expense => {
                const formattedDate = new Date(expense.Date).toLocaleDateString('en-IN');
                html += `
                    <tr>
                        <td>${formattedDate}</td>
                        <td>${expense.Description}</td>
                        <td>${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(expense.Amount)}</td>
                    </tr>
                `;
            });

            // Close category section
            html += `
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }

        // Close the group (Month-Year) section
        html += `
                </div>
            </div>
        `;
    }

    // Render the grouped expenses HTML
    content.innerHTML = html;
}

// Function to toggle the display of categories under each month
function toggleCategoryGroup(monthYear) {
    const categoryDiv = document.getElementById(`category-details-${monthYear}`);
    const expanderButton = document.querySelector(`button[onclick="toggleCategoryGroup('${monthYear}')"]`);

    // Toggle the display
    if (categoryDiv.style.display === 'none') {
        categoryDiv.style.display = 'block';
        expanderButton.textContent = '-'; // Change button to collapse
    } else {
        categoryDiv.style.display = 'none';
        expanderButton.textContent = '+'; // Change button to expand
    }
}

// Function to toggle the display of expenses under each category
function toggleExpenseDetails(monthYear, category) {
    const detailsDiv = document.getElementById(`expense-details-${monthYear}-${category}`);
    const expanderButton = document.querySelector(`button[onclick="toggleExpenseDetails('${monthYear}', '${category}')"]`);

    // Toggle the display
    if (detailsDiv.style.display === 'none') {
        detailsDiv.style.display = 'block';
        expanderButton.textContent = '-'; // Change button to collapse
    } else {
        detailsDiv.style.display = 'none';
        expanderButton.textContent = '+'; // Change button to expand
    }
}

// === Monthly Rendering ===

function renderMonthlyView() {
    if (filteredData.length === 0) {
        return renderError("No matching sales data.");
    }

    const processedData = processData(filteredData);
    createTable(processedData);
}

function processData(data) {
    const monthMap = {};

    data.forEach(entry => {
        const monthYear = new Date(entry.Date).toLocaleString('default', { month: 'long', year: 'numeric' });

        if (!monthMap[monthYear]) {
            monthMap[monthYear] = {
                monthYear,
                totalSales: 0,
                totalExpenses: 0,
                sales: [],
                itemsMap: {},
                expensesMap: {},
            };
        }

        const monthEntry = monthMap[monthYear];
        const dailySales = entry.DailySaleData || [];
        const itemised = entry.itemisedSale || [];
        const expenses = entry.ExpensesData || [];

        monthEntry.totalSales += dailySales.reduce((sum, sale) => sum + (sale["Total + Tip"] || 0), 0);
        monthEntry.sales.push(...dailySales);

        itemised.forEach(i => {
            const itemName = i.Item || 'Unknown Item';
            if (!monthEntry.itemsMap[itemName]) {
                monthEntry.itemsMap[itemName] = { Item: itemName, "Qty.": 0, Total: 0 };
            }
            monthEntry.itemsMap[itemName]["Qty."] += i["Qty."] || 0;
            monthEntry.itemsMap[itemName].Total += i.Total || 0;
        });

        expenses.forEach(e => {
            const desc = (e.Description || 'Unknown').trim().toLowerCase();
            const cat = (e.Category || 'Uncategorized').trim().toLowerCase();
            const key = `${desc}|${cat}`;

            if (!monthEntry.expensesMap[key]) {
                monthEntry.expensesMap[key] = {
                    Description: e.Description?.trim() || 'Unknown',
                    Category: e.Category?.trim() || 'Uncategorized',
                    Amount: 0,
                };
            }

            monthEntry.expensesMap[key].Amount += e.Amount || 0;
        });

        monthEntry.totalExpenses += expenses.reduce((sum, exp) => sum + (exp.Amount || 0), 0);
    });

    return Object.values(monthMap).map(entry => ({
        ...entry,
        items: Object.values(entry.itemsMap),
        expenses: Object.values(entry.expensesMap),
    }));
}

function createTable(processed) {
    const content = document.getElementById('content');
  
    content.innerHTML = `
      <table id="sales-table">
        <thead>
          <tr>
            <th>Month-Year</th>
            <th>Total Sales</th>
            <th>Total Expenses</th>
            <th>Profit/Loss</th>  <!-- New column -->
            <th>Actions</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>`;

    const tbody = content.querySelector('#sales-table tbody');
  
    processed.forEach((monthData, index) => {
        const profitOrLoss = monthData.totalSales - monthData.totalExpenses;
        const profitLossText = profitOrLoss >= 0 ? `${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(profitOrLoss)} Profit` : `${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(profitOrLoss)} Loss`;
        const profitLossClass = profitOrLoss >= 0 ? 'profit' : 'loss';  // Add the class based on profit/loss

        const mainRow = document.createElement('tr');
        mainRow.innerHTML = `
          <td>${monthData.monthYear}</td>
          <td>${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(monthData.totalSales)}</td>
          <td>${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(monthData.totalExpenses)}</td>
          <td><span class="${profitLossClass}">${profitLossText}</span></td>  <!-- Profit/Loss Column -->
          <td>
            <button class="expand-icon" aria-label="Expand details for ${monthData.monthYear}" data-index="${index}">➕</button>
          </td>
        `;

        const detailRow = document.createElement('tr');
        detailRow.classList.add('expandable-row');
        detailRow.classList.add('collapsed');  // Initially collapsed
        detailRow.innerHTML = `
          <td colspan="5">
            <div class="details-section">
              <div class="details-toggle" data-section="orders-${index}" tabindex="0">📦 Orders</div>
              <div class="details-content" id="orders-${index}" style="display: none;">
                <table>
                  <tr><th>Order No.</th><th>Total</th></tr>
                  ${monthData.sales.map(o => `<tr><td>${o["Order No."]}</td><td>${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format((o.Total || 0))}</td></tr>`).join('')}
                </table>
              </div>

              <div class="details-toggle" data-section="items-${index}" tabindex="0">🍽️ Itemised Sales</div>
              <div class="details-content" id="items-${index}" style="display: none;">
                <table>
                  <tr><th>Item</th><th>Qty</th><th>Total</th></tr>
                  ${monthData.items.map(i => `<tr><td>${i.Item}</td><td>${i["Qty."]}</td><td>${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format((i.Total || 0))}</td></tr>`).join('')}
                </table>
              </div>

              <div class="details-toggle" data-section="expenses-${index}" tabindex="0">💸 Expenses</div>
              <div class="details-content" id="expenses-${index}" style="display: none;">
                <table>
                    <tr><th>Description</th><th>Category</th><th>Amount</th></tr>
                    ${monthData.expenses.map(e => `
                    <tr>
                        <td>${e.Description}</td>
                        <td>${e.Category || '-'}</td>
                        <td>${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format((e.Amount || 0))}</td>
                    </tr>
                    `).join('')}
                </table>
              </div>  
            </div>
          </td>
        `;

        tbody.appendChild(mainRow);
        tbody.appendChild(detailRow);
    });

    // Expand/Collapse logic for rows
    document.querySelectorAll('.expand-icon').forEach(icon => {
        icon.addEventListener('click', () => {
            const index = icon.getAttribute('data-index');
            const row = icon.closest('tr').nextElementSibling;

            const isExpanded = row.classList.contains('expanded');

            if (isExpanded) {
                row.classList.remove('expanded');
                icon.innerHTML = '➕';
            } else {
                // Collapse all others
                document.querySelectorAll('.expandable-row').forEach(r => r.classList.remove('expanded'));
                document.querySelectorAll('.expand-icon').forEach(i => i.innerHTML = '➕');

                row.classList.add('expanded');
                icon.innerHTML = '➖';
            }
        });
    });

    // Toggle individual content sections (Orders, Itemized Sales, Expenses)
    document.querySelectorAll('.details-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const section = document.getElementById(toggle.dataset.section);
            section.style.display = section.style.display === 'block' ? 'none' : 'block';
        });

        // Optional: allow keyboard accessibility
        toggle.addEventListener('keypress', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle.click();
            }
        });
    });
}



// === Weekly View ===

function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = (day === 0 ? 6 : day - 1); // Adjust for Monday as the start of the week
    d.setDate(d.getDate() - diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  
  function getEndOfWeek(date) {
    const start = getStartOfWeek(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return end;
  }
  
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  function processWeeklyData(data) {
    const weekData = [];
  
    data.forEach(entry => {
      const entryDate = new Date(entry.Date.split('T')[0]);
      const startOfWeek = getStartOfWeek(entryDate);
      const endOfWeek = getEndOfWeek(entryDate);
      const weekRange = `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
  
      let week = weekData.find(w => w.weekRange === weekRange);
      if (!week) {
        week = {
          weekRange,
          totalOrders: 0,
          totalItemsSold: 0,
          totalSales: 0,
          itemsSold: {}
        };
        week.entries = [];
        weekData.push(week);

      }
  
      // Check if DailySaleData and itemisedSale exist
      if (Array.isArray(entry.DailySaleData)) {
        week.totalOrders += entry.DailySaleData.length;
        week.totalSales += entry.DailySaleData.reduce((acc, order) => acc + (order.Total || 0), 0);
      }
  
      if (Array.isArray(entry.itemisedSale)) {
        entry.itemisedSale.forEach(item => {
          const qty = item["Qty."] || 0;
          week.totalItemsSold += qty;
          if (!week.itemsSold[item.Item]) {
            week.itemsSold[item.Item] = 0;
          }
          week.itemsSold[item.Item] += qty;
        });
      }

      week.entries.push(entry);

    });
  
    // Add insights
    weekData.forEach(week => {
      const mostSold = Object.entries(week.itemsSold).reduce((a, b) => b[1] > a[1] ? b : a, ['', 0]);
      const leastSold = Object.entries(week.itemsSold).reduce((a, b) => b[1] < a[1] ? b : a, ['', Infinity]);
  
      week.mostSoldItem = { name: mostSold[0], qty: mostSold[1] };
      week.leastSoldItem = { name: leastSold[0], qty: leastSold[1] };
      week.averageSalesPerDay = (week.totalSales / 7).toFixed(2);
    });
  
    return weekData;
  }
  
  
  function renderWeeklyView() {
    const content = document.getElementById('content');
    content.innerHTML = '';
  
    const weekSalesData = processWeeklyData(filteredData);
  
    weekSalesData.forEach((week, index) => {
      const detailsId = `week-details-${index}`;
      const row = document.createElement('div');
      row.className = 'daily-row';
  
      row.innerHTML = `
        <div class="summary-row">
          <span><strong>Week:</strong> ${week.weekRange}</span>
          <span><strong>Orders:</strong> ${week.totalOrders}</span>
          <span><strong>Items Sold:</strong> ${week.totalItemsSold}</span>
          <span><strong>Sales:</strong> ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(week.totalSales)}</span>
          <button class="expand-btn">➕</button>
        </div>
  
        <div class="details-section" id="${detailsId}">
          <div class="weekly-insights">
            <h4>Weekly Insights</h4>
            <ul>
              <li>Most Sold Item: ${week.mostSoldItem.name} (${week.mostSoldItem.qty} sold)</li>
              <li>Least Sold Item: ${week.leastSoldItem.name} (${week.leastSoldItem.qty} sold)</li>
              <li>Average Sales per Day: ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(week.averageSalesPerDay)}</li>
            </ul>
          </div>
  
          <div class="details-content">
            <h4>Orders</h4>
            <table>
              <thead>
                <tr><th>Order No.</th><th>Total</th></tr>
              </thead>
              <tbody>
                ${
                  week.entries.flatMap(entry =>
                    entry.DailySaleData?.map(order =>
                      `<tr><td>${order["Order No."]}</td><td>${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(order.Total)}</td></tr>`
                    ) || []
                  ).join('')
                }
              </tbody>
            </table>
          </div>
  
          <div class="details-content">
            <h4>Items Sold</h4>
            <table>
              <thead>
                <tr><th>Item</th><th>Quantity</th></tr>
              </thead>
              <tbody>
                ${
                  week.entries.flatMap(entry =>
                    entry.itemisedSale?.map(item =>
                      `<tr><td>${item.Item}</td><td>${item["Qty."]}</td></tr>`
                    ) || []
                  ).join('')
                }
              </tbody>
            </table>
          </div>
        </div>
      `;
  
      const expandBtn = row.querySelector('.expand-btn');
      const detailsSection = row.querySelector('.details-section');
      expandBtn.addEventListener('click', () => {
        const isExpanded = detailsSection.style.display === 'block';
        detailsSection.style.display = isExpanded ? 'none' : 'block';
        expandBtn.textContent = isExpanded ? '➕' : '➖';
      });
  
      content.appendChild(row);
    });
  }
  

  function toggleWeekDetails(id, el) {
    const details = document.getElementById(id);
    const expander = el.querySelector('.expander');
    if (details.style.display === 'none' || details.style.display === '') {
      details.style.display = 'block';
      expander.textContent = '➖';
    } else {
      details.style.display = 'none';
      expander.textContent = '➕';
    }
  }
    
  

// === Daily View ===
function renderDailyView() {
    const content = document.getElementById('content');
    content.innerHTML = '';
  
    if (filteredData.length === 0) {
      return renderError("No matching sales data.");
    }
  
    const currencyFormatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    });
  
    filteredData.forEach(entry => {
      const row = document.createElement('div');
      row.classList.add('daily-row');
  
      const totalSales = entry.DailySaleData.reduce((acc, order) => acc + order.Total, 0);
      const totalItems = entry.itemisedSale.reduce((acc, item) => acc + item["Qty."], 0);
  
      row.innerHTML = `
        <div class="summary-row">
          <span class="date">Date: ${new Intl.DateTimeFormat('en-GB').format(new Date(entry.Date))}</span>
          <span>Total Orders: ${entry.DailySaleData.length}</span>
          <span>Total Items Sold: ${totalItems}</span>
          <span>Total Sales: ${currencyFormatter.format(totalSales)}</span>
          <button class="expand-btn">➕</button>
        </div>
        <div class="details-section">
          <div class="order-details">
            <h4>Orders</h4>
            <table>
              <thead>
                <tr>
                  <th>Order No</th>
                  <th>Payment Type</th>
                  <th>Order Type</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${entry.DailySaleData.map(order => `
                  <tr>
                    <td>${order["Order No."]}</td>
                    <td>${order["Payment Type"]}</td>
                    <td>${order["Order Type"]}</td>
                    <td>${currencyFormatter.format(order.Total)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <div class="item-details">
            <h4>Items Sold</h4>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${entry.itemisedSale.map(item => `
                  <tr>
                    <td>${item.Item}</td>
                    <td>${item["Qty."]}</td>
                    <td>${currencyFormatter.format(item.Total)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
  
      const expandBtn = row.querySelector('.expand-btn');
      const detailsSection = row.querySelector('.details-section');
  
      expandBtn.addEventListener('click', () => {
        const isExpanded = detailsSection.style.display === 'block';
        detailsSection.style.display = isExpanded ? 'none' : 'block';
        expandBtn.textContent = isExpanded ? '➕' : '➖';
      });
  
      content.appendChild(row);
    });
  }
  
  
// === Error Rendering ===

function renderError(message) {
  const content = document.getElementById('content');
  content.innerHTML = `<p class="error">${message}</p>`;
}

function toggleDetails(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
  }
  
// === Refresh ===

  function hardRefresh() {
    location.reload(true); // Force a hard reload (deprecated but still works in many browsers)

}
