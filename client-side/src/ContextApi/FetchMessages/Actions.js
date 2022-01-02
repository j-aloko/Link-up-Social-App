export const fetchMessagesStart = () => ({
  type: "FETCH_MESSAGES_START",
});

export const fetchMessagesSuccess = (messages) => ({
  type: "FETCH_MESSAGES_SUCCESS",
  payload: messages,
});

export const fetchMessagesFailure = () => ({
  type: "FETCH_MESSAGES_FAILURE",
});

export const sendMessageStart = () => ({
  type: "SEND_MESSAGE_START",
});

export const sendMessageSuccess = (message) => ({
  type: "SEND_MESSAGE_SUCCESS",
  payload: message,
});

export const sendMessageFailure = () => ({
  type: "SEND_MESSAGE_FAILURE",
});
