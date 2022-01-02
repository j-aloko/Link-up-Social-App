const router = require("express").Router();
const Comments = require("../Models/Comments");
const Post = require("../Models/Post");

//Write a comment
router.post("/", async (req, res) => {
  const comments = new Comments(req.body);
  try {
    const saveComments = await comments.save();
    res.status(200).json(saveComments);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Update comments array in postSchema

router.put("/comment/:postId", async (req, res) => {
  const post = await Post.findById(req.params.postId);
  try {
    await post.updateOne({ $push: { comments: req.body.commentId } });
    res.status(200).json("Comment Posted Successfully");
  } catch (error) {
    res.status(500).json(error);
  }
});

//getComment

router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comments.find({
      postId: req.params.postId,
    });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
