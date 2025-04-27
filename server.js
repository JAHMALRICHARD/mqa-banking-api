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

// MongoDB Connection
const mongoUri = process.env.MONGO_URI
  .replace('${MONGO_USER}', process.env.MONGO_USER)
  .replace('${MONGO_PASS}', process.env.MONGO_PASS);

mongoose.connect(mongoUri)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection failed:', err));

// API Routes
app.use('/api/persons', require('./routes/personRoutes'));
app.use('/api/billing', require('./routes/billingRoutes'));
app.use('/api/subscriptions', require('./routes/subscriptionRoutes'));

// Root Endpoint - API Documentation
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
          --text-light: #333;
          --table-bg-light: #fff;
          --border-color: #ccc;
          --hover-light: #f5f5f5;
          --accent: #007bff;
          --base-url-bg: #e6f4ff;
        }
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          background: var(--bg-light);
          color: var(--text-light);
        }
        h1 {
          margin-bottom: 20px;
        }
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
        .arrow {
          transition: transform 0.3s ease;
        }
        .arrow.open {
          transform: rotate(90deg);
        }
      </style>
    </head>
    <body>
      <h1>📚 Financial API Endpoints</h1>

      <div class="base-url">
        Base URL: <strong>https://mqa-banking-api.onrender.com</strong>
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
          <table>
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
