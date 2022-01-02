import React, { useState, useEffect, useContext } from "react";
import "./Body.css";
import Write from "./../Write/Write";
import { useLocation } from "react-router-dom";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import Posts from "./../Posts/Posts";
import MyFriends from "../MyFriends/MyFriends";
import { conversationContext } from "./../../ContextApi/FetchConversation/ContextApi";
import { MyPostLoader } from "../Feeds/Feeds";
import { MyProfileLoader } from "./../Feeds/Feeds";
import {
  fetchConversationStart,
  fetchConversationFailure,
  fetchConversationSuccess,
} from "./../../ContextApi/FetchConversation/Actions";
import axiosInstance from "./../../axios";

function Body({ socket }) {
  const [friends, setFriends] = useState([]);
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);

  const [following, setFollowing] = useState(false);
  const [conversation, setConversation] = useState([]);
  const location = useLocation();
  const path = location.pathname.split("/")[2];

  //fetching all conversations of this user
  const { conversations, dispatch } = useContext(conversationContext);

  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  //Get Single User
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axiosInstance.get("users/" + path);
        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [path]);

  //Get timeline posts

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axiosInstance.get("posts/userPosts/" + path);
        setPosts(
          res.data.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          })
        );
      } catch (error) {
        console.log(error);
      }
    };
    fetchPost();
  }, [path]);

  //fetching Online Friends/followers
  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const res = await axiosInstance.get(`users/friends/${path}`);
        setFriends(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFollowers();
  }, [path]);

  const followings = user?.followers;

  useEffect(() => {
    setFollowing(followings && followings.includes(loggedInUser?._id));
  }, [loggedInUser?._id, followings]);

  //Fetching Conversations with context Api
  useEffect(() => {
    const FetchConversations = async () => {
      try {
        dispatch(fetchConversationStart());
        const res = await axiosInstance.get("conversation/" + loggedInUser._id);
        dispatch(fetchConversationSuccess(res.data));
      } catch (error) {
        dispatch(fetchConversationFailure());
      }
    };
    FetchConversations();
  }, [dispatch, loggedInUser._id]);

  //A little Snippet of code which checks if an array exists in a set of arrays
  /*useEffect(() => {
    const array = [1, 3];
    const prizes = [
      [1, 4],
      [1, 3],
    ];
    const includes = prizes.some((a) => array.every((v, i) => v === a[i]));
    console.log(includes);
  }, []);*/

  useEffect(() => {
    conversations?.map((c) => setConversation((prev) => [...prev, c.members]));
  }, [conversations]);

  //handleFollow
  const handleFollow = async (type) => {
    setFollowing(true);
    if (!following) {
      try {
        await axiosInstance.put(`users/follow/${user._id}`, {
          userId: loggedInUser?._id,
        });
        //create a conversation between both users if there is no conversation between between them
        //This prevnts duplicate conversations
        const array = [path, loggedInUser._id];
        if (!conversation?.some((a) => array.every((v, i) => v === a[i]))) {
          await axiosInstance.post("conversation", {
            senderId: loggedInUser?._id,
            receiverId: path,
          });
        }
        //Notify the followed user
        socket?.emit("Notification", {
          senderName: loggedInUser?.username,
          senderId: loggedInUser?._id,
          receiverId: path,
          profilePic: loggedInUser?.profilePic,
          type,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };
  //handleUnfollow
  const handleUnFollow = async (e) => {
    e.preventDefault();
    setFollowing(false);
    if (following) {
      try {
        await axiosInstance.put(`users/unfollow/${user?._id}`, {
          userId: loggedInUser?._id,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <div className="bodyContainer">
        <div className="bodyWrapper">
          <div className="profileCover">
            <div className="coverImageWrapper">
              {user.coverPhoto ? (
                <img src={user?.coverPhoto} alt="" className="coverImage" />
              ) : (
                <img
                  src="https://cdn.pixabay.com/photo/2016/04/01/10/11/avatar-1299805_960_720.png"
                  alt=""
                  className="coverImage"
                />
              )}
            </div>
            <div className="profileAvatar">
              {user.profilePic ? (
                <img src={user?.profilePic} alt="" className="avatarImage" />
              ) : (
                <img
                  src="https://cdn.pixabay.com/photo/2016/04/01/10/11/avatar-1299805_960_720.png"
                  alt=""
                  className="avatarImage"
                />
              )}
              <h3>{user?.username}</h3>
              <span
                style={{ maxWidth: "600px", fontWeight: 500, fontSize: "18px" }}
              >
                {user?.description}
              </span>
            </div>
          </div>
        </div>
        <div className="feedAndInfoWrapper">
          <div className="leftWrapper">
            {loggedInUser?._id === path ? <Write /> : null}
            <>
              {posts?.length > 0 ? (
                <>
                  {posts.map((post) => (
                    <Posts post={post} key={post?._id} socket={socket} />
                  ))}
                </>
              ) : (
                <div className="feedsSkeletonContainer">
                  <div className="feedsSkeletonItems">
                    <MyProfileLoader />
                    <MyPostLoader />
                  </div>
                  <div className="feedsSkeletonItems">
                    <MyProfileLoader />
                    <MyPostLoader />
                  </div>
                  <div className="feedsSkeletonItems">
                    <MyProfileLoader />
                    <MyPostLoader />
                  </div>
                </div>
              )}
            </>
          </div>
          <div className="rightWrapper">
            <>
              {loggedInUser?._id !== path && following && (
                <button className="followButton" onClick={handleUnFollow}>
                  Following{" "}
                  <CheckCircleOutlineRoundedIcon style={{ color: "green" }} />
                </button>
              )}

              {loggedInUser?._id !== path && !following && (
                <span className="followButton" onClick={() => handleFollow(4)}>
                  Follow <AddCircleOutlineRoundedIcon />
                </span>
              )}
            </>
            <h5 className="userInformationTitle">User information</h5>
            <ul className="userInformation">
              <li className="infolistItem">
                <span>City:</span>
                <span style={{ opacity: "0.6", marginLeft: "15px" }}>
                  {user?.city}
                </span>
              </li>
              <li className="infolistItem">
                <span>From:</span>
                <span style={{ opacity: "0.6", marginLeft: "15px" }}>
                  {user?.from}
                </span>
              </li>
              <li className="infolistItem">
                <span>Relationship:</span>
                <span style={{ opacity: "0.6", marginLeft: "15px" }}>
                  {user?.relationship}
                </span>
              </li>
            </ul>
            <div className="userFriends">
              <h5 style={{ marginTop: "30px" }}>
                {friends?.length > 0 && loggedInUser?._id !== user?._id
                  ? "Friends of " + user?.username
                  : friends?.length > 0 && loggedInUser?._id === user?._id
                  ? "Your Friends"
                  : null}
              </h5>
              <div className="userFriendsImages">
                {friends.map((friend) => (
                  <MyFriends friend={friend} key={friend?._id} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Body;
