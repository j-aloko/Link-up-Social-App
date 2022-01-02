const router = require("express").Router();
const Reply3 = require("../Models/Reply3");

//Write a reply3
router.post("/", async (req, res) => {
  const reply3 = new Reply3(req.body);
  try {
    const savereply3 = await reply3.save();
    res.status(200).json(savereply3);
  } catch (error) {
    res.status(500).json(error);
  }
});

//getReply3

router.get("/:reply2Id", async (req, res) => {
  try {
    const reply3 = await Reply3.find({
      reply2Id: req.params.reply2Id,
    });
    res.status(200).json(reply3);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
