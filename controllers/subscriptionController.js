const Subscription = require('../models/Subscription');

// GET all subscriptions
exports.getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.json(subscriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single subscription by ID
exports.getSubscriptionById = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) return res.status(404).send('Subscription not found');
    res.json(subscription);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE a new subscription
exports.createSubscription = async (req, res) => {
  const {
    tier,
    monthlyPrice,
    yearlyPrice,
    planDetails
  } = req.body;

  // Validation
  if (!tier || monthlyPrice == null || yearlyPrice == null || !Array.isArray(planDetails) || planDetails.length === 0) {
    return res.status(400).json({ message: "Missing required fields or invalid planDetails format" });
  }

  try {
    const newSubscription = new Subscription({
      tier,
      monthlyPrice,
      yearlyPrice,
      planDetails
    });

    const savedSubscription = await newSubscription.save();
    res.status(201).json(savedSubscription);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE subscription by ID
exports.updateSubscription = async (req, res) => {
  try {
    const updatedSubscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated document
    );

    if (!updatedSubscription) return res.status(404).send('Subscription not found');

    res.json(updatedSubscription);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE subscription by ID
exports.deleteSubscription = async (req, res) => {
  try {
    const deletedSubscription = await Subscription.findByIdAndDelete(req.params.id);
    if (!deletedSubscription) return res.status(404).send('Subscription not found');

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
