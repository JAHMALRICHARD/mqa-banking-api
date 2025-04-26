const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  streetAddress: String,
  city: String,
  state: String,
  zip: String,
  email: String,
  jobTitle: String
}, {
  timestamps: true // 🚀 Automatically add createdAt and updatedAt
});

// 🚀 Transform _id to id and remove __v (Mongoose version field)
personSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Person', personSchema);
