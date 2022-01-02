import { createContext, useEffect, useReducer } from "react";
import { userReducer } from "./UserReducer";

const userInitialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isFetching: false,
  isSuccess: false,
  error: false,
};

export const userContext = createContext(userInitialState);

export const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, userInitialState);
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);
  return (
    <userContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        isSuccess: state.isSuccess,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </userContext.Provider>
  );
};
