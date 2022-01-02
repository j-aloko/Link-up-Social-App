const router = require("express").Router();
const Reply = require("../Models/Reply");
const Comments = require("../Models/Comments");

//Write a reply1
router.post("/", async (req, res) => {
  const reply = new Reply(req.body);
  try {
    const savereply = await reply.save();
    res.status(200).json(savereply);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Update reply array in commentSchema

router.put("/reply/:commentId", async (req, res) => {
  const comment = await Comments.findById(req.params.commentId);
  try {
    await comment.updateOne({ $push: { reply: req.body.replyId } });
    res.status(200).json("You replied Successfully");
  } catch (error) {
    res.status(500).json(error);
  }
});

//getReply1

router.get("/:commentId", async (req, res) => {
  try {
    const reply = await Reply.find({
      commentId: req.params.commentId,
    });
    res.status(200).json(reply);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
