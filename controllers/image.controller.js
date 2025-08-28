const fs = require('fs');
const path = require('path');

const serveImage = async (req, res) => {
  const { collection, name } = req.params;
  const imagePath = path.join(process.env.UPLOAD_PATH, 'uploads', collection, name);

  if (fs.existsSync(imagePath)) {
    return res.sendFile(imagePath);
  }
  return res.sendFile(path.join(__dirname, '../assets/no-image.jpg'));
};

module.exports = {
  serveImage,
};
