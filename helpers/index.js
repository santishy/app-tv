const databaseValidators = require("./database-validators");
const jwt = require("./jwt");
const str = require("./str");
const upload = require("./upload");
const validateUploadedFile = require("./validate-uploaded-file");

module.exports = {
  ...databaseValidators,
  ...jwt,
  ...str,
  ...upload,
  ...validateUploadedFile,
};
