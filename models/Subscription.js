const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  tier: String,
  monthlyPrice: Number,
  yearlyPrice: Number,
  planDetails: [String]
}, {
  timestamps: true
});

subscriptionSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
