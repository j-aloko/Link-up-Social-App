import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { userContext } from "./../../ContextApi/UserContext/UserContext";

function MyFriends({ friend }) {
  const history = useHistory();
  const { user } = useContext(userContext);

  const handlePageLoad = () => {
    history.push(`/profile/${friend._id}`);
  };
  return (
    <>
      {friend?._id !== user?._id && (
        <div className="userFriendsImages" onClick={handlePageLoad}>
          <div className="imgsAndNames">
            {friend.profilePic ? (
              <img src={friend.profilePic} alt="" className="friendImg" />
            ) : (
              <img
                src="https://cdn.pixabay.com/photo/2016/04/01/10/11/avatar-1299805_960_720.png"
                alt=""
                className="friendImg"
              />
            )}
            <span style={{ textAlign: "center" }}>{friend.username}</span>
          </div>
        </div>
      )}
    </>
  );
}

export default MyFriends;
