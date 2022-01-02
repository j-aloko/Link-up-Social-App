import React, { useEffect, useState, useContext } from "react";
import "./Online.css";
import { userContext } from "../../ContextApi/UserContext/UserContext";
import { useHistory } from "react-router-dom";
import axiosInstance from "./../../axios";

function Online({ onlineUser }) {
  const { user } = useContext(userContext);
  const [online, setOnline] = useState();
  const [followingg, setFollowingg] = useState(false);
  const history = useHistory();

  //Fetching Information of all online users
  useEffect(() => {
    if (onlineUser?.userId !== user?._id) {
      const getOnlineUsersInfo = async () => {
        try {
          const res = await axiosInstance.get("users/" + onlineUser?.userId);
          setOnline(res.data);
        } catch (error) {
          console.log(error);
        }
      };
      getOnlineUsersInfo();
    }
  }, [onlineUser?.userId, user?._id]);

  const handleMessage = () => {
    history.push("/messenger");
  };

  useEffect(() => {
    if (user?.following.includes(online?._id)) {
      setFollowingg(true);
    }
  }, [user, online]);

  return (
    <>
      {online && followingg && (
        <ul className="onlineFriendss">
          <li className="onlineItems" onClick={handleMessage}>
            <div className="imageOnlineIndicator">
              <img
                src={
                  online?.profilePic ||
                  "https://cdn.pixabay.com/photo/2016/04/01/10/11/avatar-1299805_960_720.png"
                }
                alt=""
                className="onlineImg"
              />
              <img
                className="onlineIndicator"
                src="http://www.clker.com/cliparts/e/E/F/G/p/g/alex-green-circle-md.png"
                alt=""
              />
            </div>
            <span className="whoisOnline">{online?.username}</span>
          </li>
        </ul>
      )}
    </>
  );
}

export default Online;
