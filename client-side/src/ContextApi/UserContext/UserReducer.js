export const userReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        isFetching: true,
        isSuccess: false,
        error: false,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        isFetching: false,
        isSuccess: true,
        error: false,
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        isFetching: false,
        isSuccess: false,
        error: true,
      };
    case "LOGOUT":
      return {
        user: null,
        isFetching: false,
        isSuccess: true,
        error: false,
      };
    default:
      return { ...state };
  }
};
