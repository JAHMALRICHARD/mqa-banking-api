const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
  personId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person', // 🔥 This tells Mongoose this is a reference to the Person model
    required: true
  },
  streetAddress: String,
  city: String,
  state: String,
  zip: String,
  phoneNumber: String,
  cardNumber: String,
  expDate: String,
  cvv: String,
  subscriptionName: String,
  amount: Number
}, {
  timestamps: true
});

billingSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Billing', billingSchema);
