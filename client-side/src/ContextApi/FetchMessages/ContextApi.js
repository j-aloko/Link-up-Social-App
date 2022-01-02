import { createContext, useReducer } from "react";
import { fetchMessagesReducer } from "./Reducer";

const messagesInitialState = {
  messages: [],
  isFetching: false,
  error: false,
};

export const fetchMessagesContext = createContext(messagesInitialState);

export const FetchMessagesContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    fetchMessagesReducer,
    messagesInitialState
  );
  return (
    <fetchMessagesContext.Provider
      value={{
        messages: state.messages,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </fetchMessagesContext.Provider>
  );
};
