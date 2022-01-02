const User = require("../Models/User");
const Post = require("../Models/Post");
const { VerifyUser, VerifyToken } = require("../Verification");
const CryptoJS = require("crypto-js");
const router = require("express").Router();

//Update user

router.put("/:id", async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC_KEY
    ).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    const savedUpdate = await updatedUser.save();
    res.status(200).json("Your Account has been successfully updated");
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get user

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, createdAt, updatedAt, isAdmin, ...otherInfo } = user._doc;
    res.status(200).json(otherInfo);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

//getFriends

router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.following.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePic } = friend;
      friendList.push({ _id, username, profilePic });
    });
    res.status(200).json(friendList);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Delete User

router.delete("/:id", VerifyUser, async (req, res) => {
  try {
    const user = User.findById(req.params.id);
    try {
      await Post.deleteMany({ username: req.body.username });
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Your account has been successfully deleted");
    } catch (error) {
      res.status(500).json(error);
    }
  } catch {
    res.status(404).json("user not found");
  }
});

//Follow a User

router.put("/follow/:id", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { following: req.params.id } });
        res.status(200).json("You followed this user");
      } else {
        res.status(404).json("You already follow this account");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(404).json("You are not allowed to follow yourself");
  }
});

//Unfollow a User

router.put("/unfollow/:id", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { following: req.params.id } });
        res.status(200).json("You Unfollowed this user");
      } else {
        res.status(404).json("You already Unfollowed this account");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(404).json("You can't unfollow yourself");
  }
});

module.exports = router;
