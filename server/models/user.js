const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  blogs: [{ type: Schema.Types.ObjectId, ref: "Blog" }],
  likedBlogs: [{ type: Schema.Types.ObjectId, ref: "Blog" }],
  profilePicture: { type: String },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
