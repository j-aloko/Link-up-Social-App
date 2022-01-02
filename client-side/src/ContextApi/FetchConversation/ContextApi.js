import { createContext, useReducer } from "react";
import { conversationReducer } from "./Reducer";

const conversationInitialState = {
  conversations: [],
  isFetching: false,
  error: false,
};

export const conversationContext = createContext(conversationInitialState);

export const ConversationContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    conversationReducer,
    conversationInitialState
  );
  return (
    <conversationContext.Provider
      value={{
        conversations: state.conversations,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </conversationContext.Provider>
  );
};
