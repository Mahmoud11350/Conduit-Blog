const { Schema, model, Types } = require("mongoose");

const commentSchema = new Schema({
  comment: {
    type: String,
    required: [true, "please provide comment"],
    trim: true,
  },
  like: {
    type: Boolean,
    default: false,
    required: true,
  },
  post: {
    type: Types.ObjectId,
    ref: "Post",
    required: [true, "please provide post id"],
  },
  user: {
    type: Types.ObjectId,
    ref: "Post",
    required: [true, "please provide user id"],
  },
});
commentSchema.statics.calculateNumOfLikes = async function (postId) {
  const numOfLikes = await this.model("Comment").find({
    like: true,
    post: postId,
  });
  try {
    await this.model("Post").findByIdAndUpdate(postId, {
      numOfLikes: numOfLikes.length,
    });
  } catch (error) {
    console.log(error);
  }
};
commentSchema.post("save", async function () {
  this.constructor.calculateNumOfLikes(this.post);
});
commentSchema.post("remove", async function () {
  this.constructor.calculateNumOfLikes(this.post);
});

const Comment = model("Comment", commentSchema);
module.exports = Comment;
