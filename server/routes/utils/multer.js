const multer = require("multer");

const uploadBlogPics = multer({
  storage: multer.memoryStorage(),
});

module.exports = { uploadBlogPics };
