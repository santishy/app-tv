const sharp = require('sharp');

const validateDimensionsImage =
  (fieldName, { width, height }) =>
  async (req, res, next) => {
    const errors = [];
    if (!req.files?.[fieldName]) return next();
    const files = getFileArray(req, fieldName);
    const invalidImages = await Promise.all(
      files.map(async (file) => {
        const { width: imgWidth, height: imgHeight } = await sharp(file.tempFilePath).metadata(); //al quitar en model Server.js el useTempFiles:true y ponerlo en false hay que cambiarlo por file.tempFilePath por file.data
        let message = null;
        if (imgWidth < width || imgHeight < height) {
          message = `La imagen ${file.name} es demasiado pequeña, debe tener un mínimo de ${width}X${height}`;
        }
        if (imgWidth < imgHeight || imgHeight === imgWidth) {
          message = `La imagen ${file.name} debe ser horizontal (mas ancha que alta). Actual ${imgWidth}X${imgHeight}`;
        }
        if (message) {
          errors.push({ msg: message });
          return true;
        }
        return false;
      }),
    );
    if (invalidImages.includes(true)) {
      return res.status(422).json({ errors });
    }
    return next();
  };
const getFileArray = (req, name) => {
  return Array.isArray(req.files[name]) ? req.files[name] : [req.files[name]];
};

const getExtension = (fileName = '') => {
  const parts = fileName.split('.');
  const extension = parts[parts.length - 1];
  return extension;
};

module.exports = { getExtension, validateDimensionsImage, getFileArray };
