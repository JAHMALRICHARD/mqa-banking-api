const Billing = require('../models/Billing');
const Person = require('../models/Person'); // ensure this is at the top

// GET all billing details
exports.getAllBillingDetails = async (req, res) => {
  try {
   const billings = await Billing.find().populate('personId', 'firstName lastName email');
    res.json(billings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET billing details by ID
exports.getBillingDetailsById = async (req, res) => {
  try {
    const details = await Billing.findById(req.params.id);
    if (!details) return res.status(404).send('Billing details not found');
    res.json(details);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE new billing details
exports.createBillingDetails = async (req, res) => {
  const {
    personId,
    streetAddress,
    city,
    state,
    zip,
    phoneNumber,
    cardNumber,
    expDate,
    cvv,
    subscriptionName,
    amount
  } = req.body;

  // Simple validation
  if (!personId || !streetAddress || !city || !state || !zip || !phoneNumber || !cardNumber || !expDate || !cvv || !subscriptionName || amount == null) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newBilling = new Billing({
      personId,
      streetAddress,
      city,
      state,
      zip,
      phoneNumber,
      cardNumber,
      expDate,
      cvv,
      subscriptionName,
      amount
    });

    const savedBilling = await newBilling.save();
    res.status(201).json(savedBilling);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// CREATE new billing details using person id
exports.createBillingForPerson = async (req, res) => {
  const { personId } = req.params;
  const {
    streetAddress,
    city,
    state,
    zip,
    phoneNumber,
    cardNumber,
    expDate,
    cvv,
    subscriptionName,
    amount
  } = req.body;

  if (!streetAddress || !city || !state || !zip || !phoneNumber || !cardNumber || !expDate || !cvv || !subscriptionName || amount == null) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const person = await Person.findById(personId).select('firstName lastName email');
    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }

    const newBilling = new Billing({
      personId: person._id,
      streetAddress,
      city,
      state,
      zip,
      phoneNumber,
      cardNumber,
      expDate,
      cvv,
      subscriptionName,
      amount
    });

    const savedBilling = await newBilling.save();
    const billingObject = savedBilling.toObject();

    // Transform person sub-document
    const personObj = {
      id: person._id,
      firstName: person.firstName,
      lastName: person.lastName,
      email: person.email
    };

    // Final formatted response
    const response = {
      ...billingObject,
      id: billingObject._id,
      personId: personObj
    };

    delete response._id;
    delete response.__v;

    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// UPDATE billing details
exports.updateBillingDetails = async (req, res) => {
  try {
    const updatedBilling = await Billing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // return the updated document
    );

    if (!updatedBilling) return res.status(404).send('Billing details not found');

    res.json(updatedBilling);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE billing details
exports.deleteBillingDetails = async (req, res) => {
  try {
    const deletedBilling = await Billing.findByIdAndDelete(req.params.id);
    if (!deletedBilling) return res.status(404).send('Billing details not found');
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
