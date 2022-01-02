const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./Routes/auth");
const userRoute = require("./Routes/user");
const postRoute = require("./Routes/post");
const conversationRoute = require("./Routes/conversation");
const messageRoute = require("./Routes/message");
const commentsRoute = require("./Routes/comments");
const replyRoute = require("./Routes/reply");
const reply2Route = require("./Routes/reply2");
const reply3Route = require("./Routes/reply3");
const savedPostRoute = require("./Routes/savedPosts");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const fileUpload = require("express-fileupload");
const path = require("path");

dotenv.config();
app.use(cors({ origin: "*" }));

app.listen(process.env.PORT, () => {
  console.log("Server Running");
});

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongo Server Connected");
  })
  .catch((error) => {
    console.log(error);
  });

app.use("/images", express.static(path.join(__dirname, "/public/images/")));
app.use(morgan("common"));
app.use(helmet());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversation", conversationRoute);
app.use("/api/message", messageRoute);
app.use("/api/comments", commentsRoute);
app.use("/api/reply", replyRoute);
app.use("/api/reply2", reply2Route);
app.use("/api/reply3", reply3Route);
app.use("/api/savedPosts", savedPostRoute);
app.use(fileUpload());

//File Upload
app.post("/api/upload", async function (req, res) {
  let uploadPath;
  let uploadPathSnap;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json("No files were uploaded.");
  }

  const file = req.files.file;
  const snapshot = req.files.snapshot;

  uploadPath = __dirname + "/public/images/" + file?.name;
  uploadPathSnap = __dirname + "/public/images/" + snapshot?.name;

  file?.mv(uploadPath, function (err) {
    if (err) return res.status(500).json(err);

    res.status(200).json({
      fileName: file?.name,
      filePath: `http://localhost:8000/images/${file?.name}`,
    });
  });

  snapshot?.mv(uploadPathSnap, function (err) {
    if (err) return res.status(500).json(err);

    res.status(200).json({
      fileName: snapshot?.name,
      filePathSnap: `http://localhost:8000/images/${snapshot?.name}`,
    });
  });
});
