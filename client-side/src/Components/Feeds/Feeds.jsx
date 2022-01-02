import React, { useContext, useEffect } from "react";
import "./Feeds.css";
import Write from "./../Write/Write";
import { getTimelinePosts } from "./../../ApiCalls/Post";
import { postContext } from "./../../ContextApi/Post/PostContext";
import { userContext } from "./../../ContextApi/UserContext/UserContext";
import Posts from "../Posts/Posts";
import ContentLoader from "react-content-loader";

//Posts skeleton Loader
export const MyProfileLoader = () => (
  <ContentLoader
    height={140}
    speed={1}
    backgroundColor={"#e6d3e2"}
    foregroundColor={"#fac0ee"}
    viewBox="0 0 380 70"
  >
    <rect x="0" y="10" rx="50" ry="30" width="40" height="40" />
    <rect x="50" y="17" rx="4" ry="4" width="300" height="10" />
    <rect x="50" y="40" rx="3" ry="3" width="250" height="10" />
  </ContentLoader>
);

export const MyPostLoader = () => (
  <ContentLoader
    width="100%"
    speed={1}
    backgroundColor={"#e6d3e2"}
    foregroundColor={"#fac0ee"}
    viewBox="0 0 380 250"
  >
    <rect x="0" y="0" rx="0" ry="0" width="100%" height="450" />
  </ContentLoader>
);

function Feeds({ socket }) {
  const { dispatch, posts } = useContext(postContext);
  const { user } = useContext(userContext);

  useEffect(() => {
    getTimelinePosts(dispatch, user._id);
  }, [dispatch, user._id]);

  return (
    <div className="feedsContainer">
      <div className="feedsWrapper">
        <Write />
        {posts?.length > 0 ? (
          <>
            {posts.map((post) => (
              <Posts key={post?._id} post={post} socket={socket} />
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
      </div>
    </div>
  );
}

export default Feeds;
