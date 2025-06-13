const sharp = require("sharp");

const validateDimensionsImage =
  (fieldName, { width, height }) =>
  async (req, res, next) => {
    const errors = [];
    if (!req.files?.[fieldName]) return next();
    const files = getFileArray(req, fieldName);
    const invalidImages = await Promise.all(
      files.map(async (file) => {
        const dimensions = await sharp(file.tempFilePath).metadata(); //al quitar en model Server.js el useTempFiles:true y ponerlo en false hay que cambiarlo por file.tempFilePath por file.data
        if (dimensions.width >= width || dimensions.height >= height) {
          return false;
        }
        errors.push({
          msg: `La imagen: "${file.name}" debe tener como minímo un ancho y alto de: ${width} X ${height}`,
        });
        return true;
      })
    );
    console.log(invalidImages);
    if (invalidImages.includes(true)) {
      return res.status(422).json({ errors });
      //   throw new Error(
      //     `The images must have a width and height: ${width} X ${height}`
      //   );
    }
    return next();
  };
const getFileArray = (req, name) => {
  return Array.isArray(req.files[name]) ? req.files[name] : [req.files[name]];
};

const getExtension = (fileName = "") => {
  const parts = fileName.split(".");
  const extension = parts[parts.length - 1];
  return extension;
};

module.exports = { getExtension, validateDimensionsImage, getFileArray };
