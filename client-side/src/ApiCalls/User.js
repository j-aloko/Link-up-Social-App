import {
  loginStart,
  loginFailure,
  loginSuccess,
} from "./../ContextApi/UserContext/UserActions";
import axiosInstance from "./../axios";

//Register User
export const register = async (values) => {
  await axiosInstance.post("auth/register", values);
};

//login User
export const login = async (values, dispatch) => {
  dispatch(loginStart());
  try {
    const res = await axiosInstance.post("auth/login", values);
    dispatch(loginSuccess(res.data));
  } catch (error) {
    dispatch(loginFailure(error));
  }
};
