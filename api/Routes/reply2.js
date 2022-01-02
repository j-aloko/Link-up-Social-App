const router = require("express").Router();
const Reply2 = require("../Models/Reply2");
const Reply = require("../Models/Reply");

//Write a reply2
router.post("/", async (req, res) => {
  const reply2 = new Reply2(req.body);
  try {
    const savereply2 = await reply2.save();
    res.status(200).json(savereply2);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Update reply2 array in reply1Schema

router.put("/reply2/:replyId", async (req, res) => {
  const reply = await Reply.findById(req.params.replyId);
  try {
    await reply.updateOne({ $push: { reply2Id: req.body.reply2Id } });
    res.status(200).json("You replied Successfully");
  } catch (error) {
    res.status(500).json(error);
  }
});

//getReply2

router.get("/:replyId", async (req, res) => {
  try {
    const reply2 = await Reply2.find({
      replyId: req.params.replyId,
    });
    res.status(200).json(reply2);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
