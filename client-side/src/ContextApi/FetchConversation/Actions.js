export const fetchConversationStart = () => ({
  type: "FETCH_CONVERSATION_START",
});

export const fetchConversationSuccess = (conversations) => ({
  type: "FETCH_CONVERSATION_SUCCESS",
  payload: conversations,
});

export const fetchConversationFailure = () => ({
  type: "FETCH_CONVERSATION_FAILURE",
});
