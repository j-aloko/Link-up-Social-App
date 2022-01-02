const SavedPosts = require("../Models/SavedPosts");
const User = require("../Models/User");

const router = require("express").Router();

//Create a saved post

router.post("/", async (req, res) => {
  const newPost = new SavedPosts(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Delete a saved Post

router.delete("/:id", async (req, res) => {
  try {
    await SavedPosts.findByIdAndDelete(req.params.id);
    res.status(200).json("Your post was successfully deleted");
  } catch (error) {
    res.status(500).json(error);
  }
});

//get Users savedPost Post
router.get("/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const savedPosts = await SavedPosts.find({ userId: currentUser._id });
    res.status(200).json(savedPosts);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
