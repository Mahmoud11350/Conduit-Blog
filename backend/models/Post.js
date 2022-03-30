const { Schema, Types, model } = require("mongoose");

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "please provide post title"],
      minlength: 10,
      trim: true,
    },
    content: {
      type: String,
      required: [true, "please provide post content"],
      minlength: 10,
      trim: true,
    },
    tags: {
      type: [String],
      trim: true,
    },
    user: {
      ref: "User",
      type: Types.ObjectId,
      required: true,
    },

    numOfLikes: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

postSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "post",
  localField: "_id",
  justOne: false,
});

const Post = model("Post", postSchema);

module.exports = Post;
