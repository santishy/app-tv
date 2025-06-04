const { request, response } = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../../models/User");
const { generateToken } = require("../../helpers/jwt");

const login = async (req = request, res = response, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user.status) {
    return res.status(400).json({
      errors: [{ message: `The user ${username} is deactivated` }],
    });
  }

  const validPassword = bcryptjs.compareSync(password, user.password);
  if (!validPassword) {
    return res.status(401).json({
      errors: [{ message: "Credentials are incorrect. Password/Username" }],
    });
  }

  const token = await generateToken(user.id);

  return res.json({
    user,
    token,
  });
};

module.exports = login;
