export const currentChatReducer = (state, action) => {
  switch (action.type) {
    case "START_CURRENT_CHAT":
      return {
        currentChat: true,
      };
    case "STOP_CURRENT_CHAT":
      return {
        currentChat: false,
      };
    default:
      return { ...state };
  }
};
