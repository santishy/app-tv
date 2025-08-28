const { model, Schema } = require('mongoose');

const StoreSettingSchema = Schema(
  {
    _id: { type: String, default: 'singleton', immutable: true },
    openingHours: {
      type: String,
      trim: true,
      default: '',
    },
    notice: {
      type: String,
      trim: true,
      default: '',
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: '',
    },
    slideDelaySec: {
      type: Number,
      default: 4,
      min: 1,
      max: 60,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = model('StoreSetting', StoreSettingSchema);
