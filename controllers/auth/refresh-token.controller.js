const { generateToken } = require('../../helpers/index');

const refreshToken = async (req, res) => {
  const user = req.user;
  const token = await generateToken(user._id);
  return res.json({
    user,
    token,
  });
};

module.exports = {
  refreshToken,
};
