const { request, response } = require('express');
const { StoreSetting } = require('../models');

const pick = (obj, keys) =>
  Object.fromEntries(keys.filter((key) => key in obj).map((k) => [k, obj[k]]));

const upsertStoreSetting = async (req = request, res = response) => {
  const payload = pick(req.body, ['openingHours', 'notice', 'slideDelaySec', 'phoneNumber']);
  const id = req.params.id || 'singleton';
  try {
    console.log('payload', payload);
    const data = await StoreSetting.findByIdAndUpdate(
      { _id: id },
      {
        $set: payload,
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      },
    );
    return res.json({ data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error updating store settings' });
  }
};

const getStoreSettings = async (req, res) => {
  try {
    const id = req.params.id || 'singleton';
    const storeSettings = await StoreSetting.findById(id);
    return res.json(storeSettings);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error fetching store settings' });
  }
};
module.exports = {
  upsertStoreSetting,
  getStoreSettings,
};
