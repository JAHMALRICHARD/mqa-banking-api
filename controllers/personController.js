const Person = require('../models/Person');

// GET all persons
exports.getAllPersons = async (req, res) => {
  try {
    const persons = await Person.find();
    res.json(persons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single person by ID
exports.getPersonById = async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    if (!person) return res.status(404).send('Person not found');
    res.json(person);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE a new person
exports.createPerson = async (req, res) => {
  const {
    firstName,
    lastName,
    streetAddress,
    city,
    state,
    zip,
    email,
    jobTitle
  } = req.body;

  // Validation
  if (!firstName || !lastName || !streetAddress || !city || !state || !zip || !email || !jobTitle) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newPerson = new Person({
      firstName,
      lastName,
      streetAddress,
      city,
      state,
      zip,
      email,
      jobTitle
    });

    const savedPerson = await newPerson.save();
    res.status(201).json(savedPerson);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE person by ID
exports.updatePerson = async (req, res) => {
  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated document
    );

    if (!updatedPerson) return res.status(404).send('Person not found');

    res.json(updatedPerson);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE person by ID
exports.deletePerson = async (req, res) => {
  try {
    const deletedPerson = await Person.findByIdAndDelete(req.params.id);
    if (!deletedPerson) return res.status(404).send('Person not found');

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
