import React, { useContext, useState, useRef, useEffect } from "react";
import "./Write.css";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import LabelIcon from "@mui/icons-material/Label";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { userContext } from "./../../ContextApi/UserContext/UserContext";
import { postContext } from "./../../ContextApi/Post/PostContext";
import CircularProgressWithLabel from "@mui/material/CircularProgress";
import {
  uploadSuccess,
  uploadStart,
  uploadFailure,
} from "./../../ContextApi/Post/PostActions";
import { Link } from "react-router-dom";
import CameraOutlinedIcon from "@mui/icons-material/CameraOutlined";
import axiosInstance from "./../../axios";

function Write() {
  const { user } = useContext(userContext);

  const { dispatch } = useContext(postContext);

  const description = useRef();
  const [file, setFile] = useState(null);
  const [snapshot, setSnapShot] = useState(null);
  const [videoSnap, setVideoSnap] = useState("");
  const [img, setImg] = useState("");
  const [loading, setLoading] = useState(false);

  //Handle server file upload upon choosing image
  useEffect(() => {
    if (file) {
      const uploadImage = async () => {
        const data = new FormData();
        data.append("file", file);
        try {
          const res = await axiosInstance.post("upload", data, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          setImg(res.data.filePath);
        } catch (error) {
          console.log(error);
        }
      };
      uploadImage();
    }
  }, [file]);

  //Handle Snapshot
  useEffect(() => {
    if (snapshot) {
      const uploadSnapshot = async () => {
        const data = new FormData();
        data.append("snapshot", snapshot);
        try {
          const res = await axiosInstance.post("upload", data, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          setVideoSnap(res.data.filePathSnap);
        } catch (error) {
          console.log(error);
        }
      };
      uploadSnapshot();
    }
  }, [snapshot]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const newPost = {
      userId: user._id,
      description: description.current.value,
      img,
      videoSnap,
    };
    try {
      dispatch(uploadStart());
      const res = await axiosInstance.post("posts", newPost);
      dispatch(uploadSuccess(res.data));
      window.location.reload();
    } catch (error) {
      dispatch(uploadFailure(error));
    }
  };

  return (
    <>
      <div className="whatsOnYourMind">
        <div className="imgAndTextField">
          <Link to={`/profile/${user?._id}`}>
            <img
              src={
                user.profilePic ||
                "https://cdn.pixabay.com/photo/2016/04/01/10/11/avatar-1299805_960_720.png"
              }
              alt=""
              className="feedImage"
            />
          </Link>
          <textarea
            type="text"
            className="postSomething"
            ref={description}
            placeholder={"Whats on your mind " + user?.username + "?"}
          ></textarea>
        </div>
        <div className="feedWidgetsAndShareButton">
          <ul className="feedWidgets">
            <li className="widgetItems">
              <label htmlFor="file" style={{ cursor: "pointer" }}>
                <AddPhotoAlternateIcon style={{ color: "orange" }} />
              </label>
              <input
                type="file"
                id="file"
                name="file"
                style={{ display: "none" }}
                onChange={(e) => setFile(e.target.files[0])}
              />
              <span>Photo or video</span>
            </li>
            <li className="widgetItems">
              <label htmlFor="snapshot" style={{ cursor: "pointer" }}>
                <CameraOutlinedIcon style={{ color: "#fc3d03" }} />
              </label>
              <input
                type="file"
                id="snapshot"
                name="snapshot"
                style={{ display: "none" }}
                onChange={(e) => setSnapShot(e.target.files[0])}
              />
              <span>
                Video<b style={{ color: "red" }}>?</b> Thumbnail
              </span>
            </li>
            <li className="widgetItems">
              <LabelIcon style={{ color: "blue" }} />
              <span>Tag</span>
            </li>
            <li className="widgetItems">
              <LocationOnIcon style={{ color: "green" }} />
              <span>Location</span>
            </li>
          </ul>
          <button
            className="shareButton"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgressWithLabel /> : "Share"}
          </button>
        </div>
        <>
          {!img ? null : (
            <>
              {img?.split(/[#?]/)[0].split(".").pop().trim() !== "mp4" ? (
                <img src={img} alt="" className="showUploadImage" />
              ) : (
                <video
                  src={img}
                  poster={videoSnap}
                  className="showUploadImage"
                  controls
                ></video>
              )}
            </>
          )}
        </>
      </div>
    </>
  );
}

export default Write;
