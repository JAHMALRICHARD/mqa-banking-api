const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiDocs = require('./data');
require('dotenv').config(); // Load env variables

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Handle dynamic username/password replacement in MONGO_URI
const mongoUri = process.env.MONGO_URI
  .replace('${MONGO_USER}', process.env.MONGO_USER)
  .replace('${MONGO_PASS}', process.env.MONGO_PASS);

// MongoDB Connection
mongoose.connect(mongoUri)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection failed:', err));

// API Routes
app.use('/api/persons', require('./routes/personRoutes'));
app.use('/api/billing', require('./routes/billingRoutes'));
app.use('/api/subscriptions', require('./routes/subscriptionRoutes'));

// Root Endpoint - Docs UI
app.get('/', (req, res) => {
  let html = `
    <!DOCTYPE html>
    <html lang="en" data-theme="light">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Financial API Documentation</title>
      <style>
        :root {
          --bg-light: #f9f9f9;
          --bg-dark: #121212;
          --text-light: #333;
          --text-dark: #f0f0f0;
          --table-bg-light: #fff;
          --table-bg-dark: #1e1e1e;
          --border-color: #ccc;
          --hover-light: #f5f5f5;
          --hover-dark: #2a2a2a;
          --accent: #007bff;
          --base-url-bg: #e6f4ff;
          --base-url-bg-dark: #1a1a2e;
        }
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          background: var(--bg-light);
          color: var(--text-light);
          transition: all 0.3s ease;
        }
        h1 { color: inherit; }
        .base-url {
          background: var(--base-url-bg);
          padding: 12px 20px;
          border-left: 5px solid var(--accent);
          margin-bottom: 30px;
          border-radius: 6px;
          font-size: 16px;
          word-break: break-word;
        }
        .accordion {
          margin-bottom: 20px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          overflow: hidden;
          background: var(--table-bg-light);
          transition: all 0.3s ease;
        }
        .accordion-header {
          padding: 15px;
          background: var(--accent);
          color: white;
          cursor: pointer;
          font-size: 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .accordion-body {
          display: none;
          padding: 15px;
          background: var(--table-bg-light);
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        th, td {
          border: 1px solid var(--border-color);
          padding: 10px;
          text-align: left;
        }
        th {
          background-color: #e0e0e0;
        }
        tr:hover {
          background-color: var(--hover-light);
        }
        .dark body {
          background: var(--bg-dark);
          color: var(--text-dark);
        }
        .dark .accordion {
          background: var(--table-bg-dark);
        }
        .dark .accordion-body {
          background: var(--table-bg-dark);
        }
        .dark tr:hover {
          background-color: var(--hover-dark);
        }
        .dark .base-url {
          background: var(--base-url-bg-dark);
          color: var(--text-dark);
        }
        .toggle-btn {
          position: fixed;
          top: 20px;
          right: 20px;
          background: var(--accent);
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
        }
        .arrow {
          transition: transform 0.3s ease;
        }
        .arrow.open {
          transform: rotate(90deg);
        }
        .search-bar {
          margin-bottom: 20px;
        }
        .search-bar input {
          width: 100%;
          padding: 12px;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          font-size: 16px;
        }
        /* 🔥 Dark Mode for Search Bar */
        .dark .search-bar input {
          background: var(--table-bg-dark);
          color: var(--text-dark);
          border: 1px solid #444;
        }
        .dark .search-bar input::placeholder {
          color: #aaa;
        }
      </style>
    </head>
    <body>
      <button class="toggle-btn" onclick="toggleTheme()">Toggle Dark Mode</button>
      <h1>📚 Financial API Endpoints</h1>

      <div class="base-url">
        Base URL: <strong>https://mqa-banking-api.onrender.com</strong>
      </div>

      <div class="search-bar">
        <input type="text" id="searchInput" placeholder="Search endpoints...">
      </div>
  `;

  for (const [category, endpoints] of Object.entries(apiDocs)) {
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    html += `
      <div class="accordion">
        <div class="accordion-header" onclick="toggleAccordion(this)">
          ${categoryName} API Endpoints
          <span class="arrow">&#9654;</span>
        </div>
        <div class="accordion-body">
          <table class="endpoint-table">
            <tr><th>Method</th><th>URL</th><th>Description</th></tr>
    `;
    endpoints.forEach(endpoint => {
      html += `<tr>
        <td>${endpoint.method}</td>
        <td>${endpoint.url}</td>
        <td>${endpoint.description}</td>
      </tr>`;
    });
    html += `
          </table>
        </div>
      </div>
    `;
  }

  html += `
      <script>
        function toggleTheme() {
          const html = document.documentElement;
          if (html.getAttribute('data-theme') === 'dark') {
            html.setAttribute('data-theme', 'light');
            document.body.classList.remove('dark');
          } else {
            html.setAttribute('data-theme', 'dark');
            document.body.classList.add('dark');
          }
        }

        function toggleAccordion(header) {
          const body = header.nextElementSibling;
          const arrow = header.querySelector('.arrow');
          if (body.style.display === 'block') {
            body.style.display = 'none';
            arrow.classList.remove('open');
          } else {
            body.style.display = 'block';
            arrow.classList.add('open');
          }
        }

        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', function() {
          const filter = searchInput.value.toLowerCase();
          const tables = document.querySelectorAll('.endpoint-table');

          tables.forEach(table => {
            const rows = table.querySelectorAll('tr');
            rows.forEach((row, index) => {
              if (index === 0) return; // Skip header row
              const text = row.textContent.toLowerCase();
              row.style.display = text.includes(filter) ? '' : 'none';
            });
          });
        });
      </script>
    </body>
    </html>
  `;

  res.send(html);
});

// Start Server
app.listen(port, () => {
  console.log(`Financial API running on http://localhost:${port}`);
});
