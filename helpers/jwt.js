const jwt = require('jsonwebtoken');

const generateToken = (uuid) => {
  return new Promise((resolve, reject) => {
    const payload = { uuid };
    jwt.sign(
      payload,
      process.env.SECRET_OR_PRIVATE_KEY,
      {
        expiresIn: '4h',
      },
      (error, token) => {
        if (error) {
          console.log(error);
          reject('error creating token');
        } else {
          resolve(token);
        }
      },
    );
  });
};

module.exports = {
  generateToken,
};
