import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { UserContextProvider } from "./ContextApi/UserContext/UserContext";
import { PostContextProvider } from "./ContextApi/Post/PostContext";
import { FetchMessagesContextProvider } from "./ContextApi/FetchMessages/ContextApi";
import { ConversationContextProvider } from "./ContextApi/FetchConversation/ContextApi";

ReactDOM.render(
  <React.StrictMode>
    <UserContextProvider>
      <PostContextProvider>
        <FetchMessagesContextProvider>
          <ConversationContextProvider>
            <App />
          </ConversationContextProvider>
        </FetchMessagesContextProvider>
      </PostContextProvider>
    </UserContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
