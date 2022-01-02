import { createContext, useReducer } from "react";
import { currentChatReducer } from "./CurrentChatReducer";

const initialState = {
  currentChat: false,
};

export const chatContext = createContext(initialState);

export const ChatContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(currentChatReducer, initialState);
  return (
    <chatContext.Provider value={{ currentChat: state.currentChat, dispatch }}>
      {children}
    </chatContext.Provider>
  );
};
