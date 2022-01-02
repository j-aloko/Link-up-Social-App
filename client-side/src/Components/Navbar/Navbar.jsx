import React, { useContext, useEffect, useState } from "react";
import "./Navbar.css";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Link } from "react-router-dom";
import { logout } from "../../ContextApi/UserContext/UserActions";
import { userContext } from "./../../ContextApi/UserContext/UserContext";
import SearchResults from "../SearchResults/SearchResults";
import NoResults from "./../NoResults/NoResults";
import axiosInstance from "./../../axios";

function Navbar({ close, setClose, socket }) {
  const { dispatch, user } = useContext(userContext);
  const [users, setUsers] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResult, setNoResult] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState(0);
  const [proceed, setProceed] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
  };

  //Fetch all users
  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const res = await axiosInstance.get("users");
        setUsers(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllUsers();
  }, []);

  //Handling Search
  const handleSearch = () => {
    setClose(false);
    setNoResult(false);
    const result = users.filter(
      (user) =>
        user.username.toLowerCase().indexOf(searchItem.toLowerCase()) !== -1
    );
    setSearchResults && setSearchResults(result);
    if (result.length <= 0) {
      setNoResult(true);
    }
    setSearchItem("");
  };

  //Receive Notifications from our socket server
  useEffect(() => {
    socket?.on("receiveNotification", (data) => {
      setNotifications((prev) => [...prev, data]);
      if (
        data?.receiverId === user?._id &&
        data.senderName !== user?.username
      ) {
        setProceed(true);
        setCount((prevCount) => prevCount + 1);
      }
      if (data?.receiverId !== user?._id) {
        setProceed(false);
      }
    });
  }, [socket, user?._id, user?.username]);

  const displayNotifications = ({
    receiverId,
    senderName,
    senderId,
    postId,
    profilePic,
    postPhoto,
    postVideo,
    type,
  }) => {
    let action;
    if (receiverId === user?._id && senderName !== user?.username) {
      if (type === 1) {
        action = "Liked";
      } else if (type === 2) {
        action = "commented on";
      } else if (type === 3) {
        action = "mentioned you in a post";
      } else {
        action = "Followed you";
      }
      return (
        <div>
          <div className="notificationMessageAndImages">
            <Link to={`/profile/${senderId}`} className="links">
              <div
                className="username"
                onClick={() => setOpenNotification(!openNotification)}
              >
                {profilePic && (
                  <img
                    src={
                      profilePic ||
                      "https://cdn.pixabay.com/photo/2016/04/01/10/11/avatar-1299805_960_720.png"
                    }
                    alt=""
                    className="notificationProfilePic"
                  />
                )}
                <span style={{ cursor: "pointer" }}>
                  <b>{senderName}</b>
                </span>
                <span className="NotificationDescription">
                  {`  ${action} ${type === 3 || type === 4 ? "" : "your post"}`}
                </span>
              </div>
            </Link>
            {postPhoto &&
            postPhoto.split(/[#?]/)[0].split(".").pop().trim() !== "mp4" ? (
              <img src={postPhoto} alt="" className="notificationImage" />
            ) : (
              <img src={postVideo} alt="" className="notificationImage" />
            )}
          </div>
        </div>
      );
    }
  };

  //handle Open Notification

  const handleOpenNotification = () => {
    setOpenNotification(!openNotification);
    setCount(0);
  };

  //Hnadle Clear notification
  const handleClear = (e) => {
    e.preventDefault();
    setNotifications([]);
  };

  return (
    <div className="navbarContainer">
      <div className="navbarWrapper">
        <div className="navbarLogo">
          <Link to="/" className="links">
            <h2>LINK UP</h2>
          </Link>
        </div>
        <div className="navbarSearchBar">
          <div className="navbarSearchField">
            <input
              onChange={(e) => setSearchItem(e.target.value)}
              className="navbarSearchInput"
              type="text"
              placeholder="Search for friend, post or video"
              autoFocus={true}
              value={searchItem}
            />
            {searchResults && (
              <div className="searchResultsContainerr">
                {searchResults.map((result) => (
                  <SearchResults
                    key={result?._id}
                    result={result}
                    close={close}
                    setClose={setClose}
                  />
                ))}
              </div>
            )}
            {noResult && (
              <NoResults
                close={close}
                setClose={setClose}
                setNoResult={setNoResult}
              />
            )}
          </div>
          <div className="navbarSearchIcon" onClick={handleSearch}>
            <SearchOutlinedIcon />
          </div>
          <ul className="homepageAndTimeline">
            <Link to={`/profile/${user?._id}`} className="links">
              <li className="homepageAndTimelineListItems">Timeline</li>
            </Link>
          </ul>
        </div>
        <div>
          <ul className="navbarIconsWrapper">
            <li className="navbarIcon" onClick={handleOpenNotification}>
              <Badge badgeContent={count} color="warning">
                <NotificationsIcon color="action" style={{ fontSize: 30 }} />
              </Badge>
            </li>
          </ul>
          {openNotification && (
            <div className="notificationContainer">
              <div className="notificationWrapper">
                {notifications?.map((n) => displayNotifications(n))}
              </div>
              {notifications.length > 0 && proceed ? (
                <div className="buttonWrapper">
                  <button className="clearNotification" onClick={handleClear}>
                    Clear
                  </button>
                </div>
              ) : (
                <span className="noNotification">
                  You have no new notifications
                </span>
              )}
            </div>
          )}
        </div>
        <div className="imgAndLogout">
          <Link to={`/settings/${user?._id}`}>
            <>
              {user?.profilePic ? (
                <img src={user?.profilePic} alt="" className="navbarAvatar" />
              ) : (
                <img
                  src="https://cdn.pixabay.com/photo/2016/04/01/10/11/avatar-1299805_960_720.png"
                  alt=""
                  className="navbarAvatar"
                />
              )}
            </>
          </Link>
          <button className="logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
