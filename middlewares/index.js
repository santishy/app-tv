const auth = require("./auth");
const authorization = require("./authorization");
const validateRequests = require("./validate-requests");

module.exports = {
  ...auth,
  ...authorization,
  ...validateRequests,
};
