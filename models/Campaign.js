const { model, Schema } = require('mongoose');
const campaignSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value >= this.startDate;
        },
        message: 'End date must be after start date',
      },
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true, id: false },
  },
);

campaignSchema.methods.toJSON = function () {
  const { __v, _id, id, ...rest } = this.toObject({ virtuals: true });
  rest.uuid = _id;
  return rest;
};

module.exports = model('Campaign', campaignSchema);
