import React, { useState, useEffect } from "react";
import "./Left.css";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import EventIcon from "@mui/icons-material/Event";
import SchoolIcon from "@mui/icons-material/School";
import { Link } from "react-router-dom";
import Badge from "@mui/material/Badge";
import AcUnitOutlinedIcon from "@mui/icons-material/AcUnitOutlined";

function Left({ socket }) {
  const [count, setCount] = useState(0);

  //Receive SMS from socket
  useEffect(() => {
    socket?.on("receiveSMS", (data) => {
      setCount((prevCount) => prevCount + data.num);
    });
  }, [socket]);

  const handleMessenger = () => {
    setCount(0);
  };

  return (
    <div className="leftContainer" style={{ position: "sticky", top: "60px" }}>
      <div className="leftWrapper">
        <ul className="leftbarItems">
          <Link to="/" className="links">
            <li className="leftbarItem">
              <RssFeedIcon />
              <span>Feed</span>
            </li>
          </Link>
          <Link to="/messenger" className="links">
            <li className="leftbarItem" onClick={handleMessenger}>
              <ChatOutlinedIcon color="action" style={{ color: "black" }} />
              <span>Chats</span>
              {count > 0 && (
                <Badge badgeContent={count} color="success"></Badge>
              )}
            </li>
          </Link>
          <Link to="/videos" className="links">
            <li className="leftbarItem">
              <VideoLibraryIcon />
              <span>Videos</span>
            </li>
          </Link>
          <Link to="/savedPosts" className="links">
            <li className="leftbarItem">
              <BookmarkIcon />
              <span>Saved Posts</span>
            </li>
          </Link>
        </ul>
        <ul className="leftbarNonFunctional">
          <li className="leftbarItemNF">
            <div className="nonFunctional">
              <ContactSupportOutlinedIcon />
              <span>Questons</span>
            </div>
            <AcUnitOutlinedIcon style={{ color: "red", fontSize: 15 }} />
          </li>
          <li className="leftbarItemNF">
            <div className="nonFunctional">
              <WorkOutlineOutlinedIcon />
              <span>Jobs</span>
            </div>
            <AcUnitOutlinedIcon style={{ color: "red", fontSize: 15 }} />
          </li>
          <li className="leftbarItemNF">
            <div className="nonFunctional">
              <EventIcon />
              <span>Events</span>
            </div>
            <AcUnitOutlinedIcon style={{ color: "red", fontSize: 15 }} />
          </li>
          <li className="leftbarItemNF">
            <div className="nonFunctional">
              <SchoolIcon />
              <span>Courses</span>
            </div>
            <AcUnitOutlinedIcon style={{ color: "red", fontSize: 15 }} />
          </li>
        </ul>
        <div className="NFButton">
          <button className="showMore">Show More</button>
          <AcUnitOutlinedIcon style={{ color: "red", fontSize: 15 }} />
        </div>
        <hr className="leftHorizontalLine" />
      </div>
    </div>
  );
}

export default Left;
