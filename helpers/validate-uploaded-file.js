const validateFiles =
  (allowedExtensions, name) =>
  (value, { req }) => {
    if (!req.files || !req.files[name]) {
      throw new Error("There are no file to upload");
    }
    const files = Array.isArray(req.files[name])
      ? req.files[name]
      : [req.files[name]];

    const invalidFiles = files.filter(
      ({ name }) => !allowedExtensions.includes(getExtension(name))
    );

    if (invalidFiles.length) {
      const invalidFilesNames = invalidFiles
        .map((file) => getExtension(file.name))
        .join(", ");
      throw new Error(`Extensions not allowed: ${invalidFilesNames}`);
    }

    return true;
  };

const getExtension = (fileName = "") => {
  const parts = fileName.split(".");
  const extension = parts[parts.length - 1];
  return extension;
};

module.exports = { validateFiles, getExtension };
