const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    date: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    likes: { type: Number, default: 0 },
    comments: [
        {
            owner: { type: Schema.Types.ObjectId, ref: "User" },
            comment: { type: String, required: true },
            date: { type: String, required: true },
        },
    ],
    likedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;