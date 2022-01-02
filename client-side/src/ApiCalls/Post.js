import {
  fetchPostFailure,
  fetchPostStart,
  fetchPostSuccess,
} from "./../ContextApi/Post/PostActions";
import axiosInstance from "./../axios";

export const getTimelinePosts = async (dispatch, path) => {
  dispatch(fetchPostStart());
  try {
    const res = await axiosInstance.get("posts/timeline/" + path);
    dispatch(
      fetchPostSuccess(
        res.data.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        })
      )
    );
  } catch (error) {
    dispatch(fetchPostFailure(error));
  }
};
