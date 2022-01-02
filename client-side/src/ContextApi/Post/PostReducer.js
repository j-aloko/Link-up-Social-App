export const postReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_POST_START":
      return {
        posts: [],
        isFetching: true,
        error: false,
      };
    case "FETCH_POST_SUCCESS":
      return {
        posts: action.payload,
        isFetching: false,
        error: false,
      };
    case "FETCH_POST_FAILURE":
      return {
        posts: [],
        isFetching: false,
        error: true,
      };
    case "UPLOAD_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "UPLOAD_SUCCESS":
      return {
        posts: [...state.posts, action.payload],
        isFetching: false,
        error: false,
      };
    case "UPLOAD_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: true,
      };
    default:
      return { ...state };
  }
};
