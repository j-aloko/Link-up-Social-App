export const conversationReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_CONVERSATION_START":
      return {
        conversations: [],
        isFetching: true,
        error: false,
      };
    case "FETCH_CONVERSATION_SUCCESS":
      return {
        conversations: action.payload,
        isFetching: false,
        error: false,
      };
    case "FETCH_CONVERSATION_FAILURE":
      return {
        conversations: [],
        isFetching: false,
        error: true,
      };
    default:
      return { ...state };
  }
};
