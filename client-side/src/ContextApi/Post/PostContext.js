import { createContext, useReducer } from "react";
import { postReducer } from "./PostReducer";

const postInitialState = {
  posts: [],
  isFetching: false,
  error: false,
};

export const postContext = createContext(postInitialState);

export const PostContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(postReducer, postInitialState);
  return (
    <postContext.Provider
      value={{
        posts: state.posts,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </postContext.Provider>
  );
};
