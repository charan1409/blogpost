const multer = require("multer");
const path = require("path");

const BlogPicsStorage = multer.diskStorage({
  destination: "./public/BlogPics",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const uploadBlogPics = multer({
  storage: BlogPicsStorage,
});

module.exports = { uploadBlogPics };
