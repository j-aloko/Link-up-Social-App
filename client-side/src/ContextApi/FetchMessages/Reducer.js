export const fetchMessagesReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_MESSAGES_START":
      return {
        messages: [],
        isFetching: true,
        error: false,
      };
    case "FETCH_MESSAGES_SUCCESS":
      return {
        messages: action.payload,
        isFetching: false,
        error: false,
      };
    case "FETCH_MESSAGES_FAILURE":
      return {
        messages: [],
        isFetching: false,
        error: true,
      };
    case "SEND_MESSAGE_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "SEND_MESSAGE_SUCCESS":
      return {
        messages: [...state.messages, action.payload],
        isFetching: false,
        error: false,
      };
    case "SEND_MESSAGE_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: true,
      };
    default:
      return { ...state };
  }
};
