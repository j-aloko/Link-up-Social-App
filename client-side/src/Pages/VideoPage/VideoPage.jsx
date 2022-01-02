import React, { useState, useEffect } from "react";
import "./VideoPage.css";
import Left from "./../../Components/LeftSideBar/Left";
import Posts from "./../../Components/Posts/Posts";
import axiosInstance from "./../../axios";

function VideoPage({ socket }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getVideos = async () => {
      try {
        const res = await axiosInstance.get("posts");
        setPosts(
          res.data.filter(
            (p) => p.img?.split(/[#?]/)[0].split(".").pop().trim() === "mp4"
          )
        );
      } catch (error) {
        console.log(error);
      }
    };
    getVideos();
  }, []);

  return (
    <div className="videoContainer">
      <div className="videosWrapper">
        <Left />
        <div className="videoMain">
          {posts?.map((post) => (
            <Posts socket={socket} key={post._id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default VideoPage;
