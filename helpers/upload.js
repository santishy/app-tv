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
        const uploadPath = path.join(__dirname, "../uploads/", folder, image);
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

    for (const file of fileList) {
      const fileName = uuidv4();
      //const extension = getExtension(file.name);
      const uploadPath = path.join(
        __dirname,
        "../uploads/",
        folder,
        fileName + "." + "jpeg" //+ extension
      );
      tempPath = file.tempFilePath;

      if (!fs.existsSync(uploadFile)) {
        fs.mkdirSync(path.join(__dirname, "../uploads/", folder), {
          recursive: true,
        });
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
      results.push({ url: fileName + ".jpeg" });
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
