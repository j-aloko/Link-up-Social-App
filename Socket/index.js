import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const io = new Server({
  cors: { origin: "http://localhost:3000" },
});

//Defining our add, get, and remove user function
let users = [];

const AddUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const RemoveUser = (socketId) => {
  users.filter((user) => user.socketId !== socketId);
};

//if connection is in effect lets receive all Users from the client side and emit back their ids and socketids
io.on("connection", (socket) => {
  console.log("a user connected");

  //Adding User from client side
  socket.on("addUser", (loggedInUserId) => {
    AddUser(loggedInUserId, socket.id);
    io.emit("users", users);
  });

  //Receieve and broadcast Message
  socket.on("message", ({ senderId, friendsSocketId, text }) => {
    io.to(friendsSocketId).emit("receiveMessage", {
      senderId,
      text,
    });
  });

  //Receive SMS
  socket.on("SMS", ({ friendsSocketId, num, senderId }) => {
    io.to(friendsSocketId).emit("receiveSMS", {
      num,
      senderId,
    });
  });

  //Receive comments and emit back to the client side

  socket.on("comments", ({ text, postId, userId }) => {
    io.emit("receiveComments", {
      text,
      postId,
      userId,
    });
  });

  //receive Notification
  socket.on(
    "Notification",
    ({
      senderName,
      senderId,
      receiverId,
      postId,
      postPhoto,
      postVideo,
      profilePic,
      type,
    }) => {
      io.emit("receiveNotification", {
        senderName,
        senderId,
        receiverId,
        postId,
        postPhoto,
        postVideo,
        profilePic,
        type,
      });
    }
  );

  //upon disconnection lets remove all users from the connection
  socket.on("disconnect", () => {
    console.log("a user has disconnected");
    RemoveUser(socket.id);
  });
});

io.listen(process.env.PORT);
