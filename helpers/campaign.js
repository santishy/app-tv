const { Campaign } = require('../models');

const ensureNoActiveCampaign = async (campaignId) => {
  const query = { status: true };
  if (campaignId) {
    query._id = { $ne: campaignId };
  }
  const activeCampaign = await Campaign.findOne(query);
  if (activeCampaign) {
    throw new Error(
      'There is already an active campaign. Please deactivate it before creating or updating another campaign.',
    );
  }
};

module.exports = {
  ensureNoActiveCampaign,
};
