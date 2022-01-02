import React, { useContext, useEffect, useState } from "react";
import Left from "./../../Components/LeftSideBar/Left";
import "./SavedPost.css";
import Saved from "./../../Components/Saved/Saved";
import { userContext } from "./../../ContextApi/UserContext/UserContext";
import ContentLoader from "react-content-loader";
import axiosInstance from "./../../axios";

function SavedPost() {
  const [savedPosts, setSavedPosts] = useState([]);
  const { user } = useContext(userContext);

  //Fetch all saved Post
  useEffect(() => {
    const getSavedPosts = async () => {
      try {
        const res = await axiosInstance.get("savedPosts/" + user?._id);
        setSavedPosts(
          res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
      } catch (error) {
        console.log(error);
      }
    };
    getSavedPosts();
  }, [user?._id]);

  const MyPostImageLoader = () => (
    <ContentLoader
      width={500}
      speed={1}
      backgroundColor={"#e6d3e2"}
      foregroundColor={"#fac0ee"}
      viewBox="0 0 380 250"
    >
      <rect x="0" y="0" rx="0" ry="0" width="500" height="300" />
    </ContentLoader>
  );

  const MyOtherInfoLoader = () => (
    <ContentLoader
      height={140}
      speed={1}
      backgroundColor={"#e6d3e2"}
      foregroundColor={"#fac0ee"}
      viewBox="0 0 380 70"
    >
      <rect x="30" y="17" rx="0" ry="0" width="100%" height="15" />
      <rect x="30" y="40" rx="0" ry="0" width="120" height="10" />
      <rect x="30" y="57" rx="0" ry="0" width="200" height="10" />
    </ContentLoader>
  );

  return (
    <div className="savedPostContainer">
      <div className="savedPostsWrapper">
        <Left />
        {savedPosts?.length > 0 ? (
          <div className="savedPostsMain">
            {savedPosts?.map((saved) => (
              <Saved key={saved._id} saved={saved} />
            ))}
          </div>
        ) : (
          <div className="savedPostsMainSkeleton">
            <div className="savedPostsSkeletonWrapper">
              <div className="actualSavedPostsSkeleton">
                <MyPostImageLoader />
              </div>
              <div className="otherPostInfo">
                <MyOtherInfoLoader />
              </div>
            </div>
            <div className="savedPostsSkeletonWrapper">
              <div className="actualSavedPostsSkeleton">
                <MyPostImageLoader />
              </div>
              <div className="otherPostInfo">
                <MyOtherInfoLoader />
              </div>
            </div>
            <div className="savedPostsSkeletonWrapper">
              <div className="actualSavedPostsSkeleton">
                <MyPostImageLoader />
              </div>
              <div className="otherPostInfo">
                <MyOtherInfoLoader />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SavedPost;
