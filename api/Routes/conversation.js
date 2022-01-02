const router = require("express").Router();
const Conversation = require("../Models/Conversation");

//Create Conversation
router.post("/", async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });
  try {
    const conversation = await newConversation.save();
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get Conversation

router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
