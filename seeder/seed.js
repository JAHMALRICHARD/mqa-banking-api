const mongoose = require('mongoose');
require('dotenv').config();

const Person = require('../models/Person');
const Billing = require('../models/Billing');
const Subscription = require('../models/Subscription');

// Load data from JSON files
const persons = require('../data/persons.json');
const billings = require('../data/billing.json');
const subscriptions = require('../data/subscriptions.json');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected for Seeding'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Person.deleteMany();
    await Billing.deleteMany();
    await Subscription.deleteMany();
    console.log('🧹 Existing collections cleared');

    // Insert persons first
    const insertedPersons = await Person.insertMany(persons);
    console.log('👤 Persons seeded');

    // Map billing's personId (number) to actual inserted person's _id
    const billingDataWithObjectIds = billings.map(billing => {
      const matchingPerson = insertedPersons[billing.personId - 1]; // -1 because arrays are 0-indexed
      return {
        ...billing,
        personId: matchingPerson._id
      };
    });

    // Insert billing with corrected personId
    await Billing.insertMany(billingDataWithObjectIds);
    console.log('💳 Billing records seeded');

    // Insert subscriptions
    await Subscription.insertMany(subscriptions);
    console.log('📜 Subscriptions seeded');

    console.log('🌱 Database seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding data:', err);
    process.exit(1);
  }
};


seedDatabase();
