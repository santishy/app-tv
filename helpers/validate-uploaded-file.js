const sharp = require('sharp');

const validateDimensionsImage =
  (width, height) =>
  async (value, { req, path }) => {
    console.log({ value });

    const files = getFileArray(req, path);
    const invalidImages = await Promise.all(
      files.map(async (file) => {
        const dimensions = await sharp(file.tempFilePath).metadata(); //al quitar en model Server.js el useTempFiles:true y ponerlo en false hay que cambiarlo por file.tempFilePath por file.data
        console.log('width: ' + dimensions.width + ' height: ' + dimensions.height);
        return dimensions.width < width || dimensions.height < height;
      }),
    );
    if (invalidImages.includes(true)) {
      throw new Error(`The images must have a width and height: ${width} X ${height}`);
    }
    return true;
  };
const getFileArray = (req, name) => {
  return Array.isArray(req.files[name]) ? req.files[name] : [req.files[name]];
};
const validateFiles =
  (allowedExtensions, name) =>
  (value, { req }) => {
    if (!req.files || !req.files[name]) {
      throw new Error('There are no file to upload');
    }
    const files = getFileArray(req, name);

    const invalidFiles = files.filter(
      (file) => !allowedExtensions.includes(getExtension(file.name)),
    );

    if (invalidFiles.length) {
      const invalidFilesNames = invalidFiles.map((file) => getExtension(file.name)).join(', ');
      throw new Error(`Extensions not allowed: ${invalidFilesNames}`);
    }

    return true;
  };

const getExtension = (fileName = '') => {
  const parts = fileName.split('.');
  const extension = parts[parts.length - 1];
  return extension;
};

module.exports = { validateFiles, getExtension, validateDimensionsImage };
