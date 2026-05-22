const { request, response } = require('express');
const { Campaign } = require('../models');
const { ensureNoActiveCampaign } = require('../helpers/campaign');

const createCampaign = async (req = request, res = response) => {
  const { name, startDate, endDate } = req.body;
  try {
    await ensureNoActiveCampaign();
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
  const campaign = new Campaign({ name: name.toUpperCase(), startDate, endDate });
  await campaign.save();
  return res.status(201).json({ data: campaign });
};

const getCampaign = async (req, res) => {
  const { id } = req.params;
  const campaign = await Campaign.findById(id);
  return res.json({ data: campaign });
};

const updateCampaign = async (req, res) => {
  const { id } = req.params;
  const { status, uuid, ...rest } = req.body;
  try {
    await ensureNoActiveCampaign(id);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
  if (rest.name) {
    rest.name = rest.name.toUpperCase();
  }
  const campaign = await Campaign.findById(id);
  campaign.set(rest);
  await campaign.save();
  return res.json({
    data: campaign,
  });
};

const getCampaigns = async (req, res) => {
  const { page = 1, limit = 25 } = req.query;
  const query = { status: true, ...req.filters };
  const [total, Campaigns] = await Promise.all([
    Campaign.countDocuments(query),
    Campaign.find(query)
      .skip((page - 1) * limit)
      .limit(limit),
  ]);
  return res.json({
    data: Campaigns,
    meta: {
      total,
      per_page: limit,
      page,
    },
  });
};

const deleteCampaign = async (req = request, res = response) => {
  const { id } = req.params;
  await Campaign.findByIdAndUpdate(id, { status: false }, { new: true });
  return res.status(204).json();
};

module.exports = {
  createCampaign,
  getCampaign,
  updateCampaign,
  getCampaigns,
  deleteCampaign,
};
