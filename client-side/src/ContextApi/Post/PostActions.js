export const fetchPostStart = () => ({
  type: "FETCH_POST_START",
});

export const fetchPostSuccess = (posts) => ({
  type: "FETCH_POST_SUCCESS",
  payload: posts,
});

export const fetchPostFailure = () => ({
  type: "FETCH_POST_FAILURE",
});

//Create Post

export const uploadStart = () => ({
  type: "UPLOAD_START",
});

export const uploadSuccess = (posts) => ({
  type: "UPLOAD_SUCCESS",
  payload: posts,
});

export const uploadFailure = () => ({
  type: "UPLOAD_FAILURE",
});
