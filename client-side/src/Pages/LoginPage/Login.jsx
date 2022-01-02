import React, { useContext, useState } from "react";
import "./Login.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { login } from "./../../ApiCalls/User";
import { userContext } from "./../../ContextApi/UserContext/UserContext";
import CircularProgress from "@mui/material/CircularProgress";

const validationSchema = Yup.object({
  email: Yup.string().email().required("Please Enter your Email"),
  password: Yup.string().required("Please Enter your password"),
});

function Login() {
  const { isFetching, dispatch, isSuccess, error } = useContext(userContext);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const history = useHistory();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      login(values, dispatch);
      if (isSuccess) {
        setSuccessMessage("😉 Login Successful");
        setTimeout(() => {
          history.push("/");
        }, 2000);
      } else if (error) {
        setErrorMessage("😠 Wrong username or password!!");
      }
    },
    validationSchema,
  });

  console.log(errorMessage);

  const handleSignUp = (e) => {
    e.preventDefault();
    setLoading(true);
    history.push("/register");
  };

  return (
    <div className="loginContainer">
      <div className="loginWrapper">
        <div className="logoAndDescription">
          <div className="loginTitleImoji">
            <h1 className="loginLogo">LINK UP</h1>
            <img className="loginImoji" src="assets/imoji.png" alt="" />
          </div>
          <span className="loginDescription">
            Connect with friends and the world around you
          </span>
        </div>
        <div className="loginArea">
          <form className="loginForm" onSubmit={formik.handleSubmit}>
            <div className="loginItems">
              <input
                type="email"
                placeholder="Email"
                id="email"
                name="email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="error">{formik.errors.email}</div>
              ) : null}
            </div>
            <div className="loginItems">
              <input
                type="password"
                placeholder="Password"
                id="password"
                name="password"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="error">{formik.errors.password}</div>
              ) : null}
            </div>
            <button className="loginButton" type="submit" disabled={isFetching}>
              {isFetching ? <CircularProgress color="success" /> : "Login"}
            </button>
          </form>
          {error && (
            <div className="errorMessage">
              <span className="actualErrorMessage">{errorMessage}</span>
            </div>
          )}
          {isSuccess && (
            <div className="successMessage">
              <span className="actualSuccessMessage">{successMessage}</span>
            </div>
          )}
          <div className="forgotPasswordAndCreate">
            <span className="forgot">Forgot Password?</span>
            <button
              className="createNewAccount"
              onClick={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress color="success" />
              ) : (
                "Create a new account"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
