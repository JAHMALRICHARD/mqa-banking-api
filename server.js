const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
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
mongoose.connect(mongoUri, {
  // These options are now deprecated — you can safely remove them if using Mongoose 7+
  // useNewUrlParser: true,
  // useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection failed:', err));

// Routes
app.use('/api/persons', require('./routes/personRoutes'));
app.use('/api/billing', require('./routes/billingRoutes'));
app.use('/api/subscriptions', require('./routes/subscriptionRoutes'));

// ➡️ Add this:
app.get('/', (req, res) => {
  res.send('✅ Financial API is up and running!');
});

// Start server
app.listen(port, () => {
  console.log(`Financial API running on http://localhost:${port}`);
});
