const { getExtension, getFileArray } = require("./validate-image-dimensions");

const validateFiles = (allowedExtensions, name) => (req, res, next) => {
  if (!req.files || !req.files[name]) {
    return next();
    //throw new Error("There are no file to upload");
  }
  const files = getFileArray(req, name);

  const invalidFiles = files.filter(
    (file) => !allowedExtensions.includes(getExtension(file.name))
  );

  if (invalidFiles.length) {
    const invalidFilesNames = invalidFiles
      .map((file) => getExtension(file.name))
      .join(", ");
    return res.status(422).json({
      errors: [
        {
          msg: `La extensión: "${invalidFilesNames}" debe ser una extensión permitida: ${allowedExtensions}`,
        },
      ],
    });
    // throw new Error(`Extensions not allowed: ${invalidFilesNames}`);
  }

  return next();
};

module.exports = {
  validateFiles,
};
