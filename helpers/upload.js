const { request } = require("express");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const { v4: uuidv4 } = require("uuid");
const { getExtension } = require("./validate-uploaded-file");

const deleteUploadedFiles = (images = [], folder = "") => {
  return new Promise((resolve, reject) => {
    try {
      images.forEach((image) => {
        const uploadPath = path.join(__dirname, "./uploads/", folder, image);
        if (fs.existsSync(uploadPath)) {
          fs.unlinkSync(uploadPath);
        }
      });
      resolve("OK");
    } catch (err) {
      reject(err.message);
    }
  });
};

const uploadFile = (files, folder = "") => {
  return new Promise((resolve, reject) => {
    const results = [];
    const errors = [];

    const fileList = Array.isArray(files) ? files : [files];
    console.log("dirname", __dirname);
    for (const file of fileList) {
      const fileName = uuidv4();
      //const extension = getExtension(file.name);
      const uploadPath = path.join(
        process.env.UPLOAD_PATH, //aquí iba __dirname
        "uploads",
        folder,
        fileName + "." + "webp" //+ extension
      );
      tempPath = file.tempFilePath;

      if (!fs.existsSync(uploadFile)) {
        fs.mkdirSync(
          path.join(process.env.UPLOAD_PATH, "./uploads/", folder), //PRIMER parámetro era __dirname
          {
            recursive: true,
          }
        );
      }
      // file.mv(uploadPath, (err) => {
      //   errors.push(err);
      // });
      sharp(tempPath)
        .resize({
          width: 1920,
          height: 1080,
          withoutEnlargement: false,
          fit: "contain",
          background: { r: 255, g: 255, b: 255 },
        })
        .toFormat("jpeg")
        .jpeg({ quality: 80 })
        .toFile(uploadPath, (err) => {
          if (err) {
            console.log(err);
            errors.push(err);
          }
        });
      // results.push({ url: fileName + "." + extension });
      results.push({ url: fileName + ".webp" });
    }

    if (errors.length) {
      reject(errors);
    }

    resolve(results);
  });
};

module.exports = {
  uploadFile,
  deleteUploadedFiles,
};
