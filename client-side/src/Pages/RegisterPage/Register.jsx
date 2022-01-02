import React, { useState } from "react";
import "./Register.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { register } from "./../../ApiCalls/User";
import CircularProgress from "@mui/material/CircularProgress";

const validationSchema = Yup.object({
  username: Yup.string().required("Please Enter a username"),
  email: Yup.string().email().required("Please Enter your Email"),
  password: Yup.string().required("Please Enter your password"),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

function Register() {
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async (values) => {
      setLoading(true);
      register(values);
      history.push("/login");
    },
    validationSchema,
  });

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLogin(true);
    history.push("/login");
  };

  return (
    <div className="registerContainer">
      <div className="registerWrapper">
        <div className="registerlogoAndDescription">
          <div className="registerloginTitleImoji">
            <h1 className="registerLogo">LINK UP</h1>
            <img className="registerImoji" src="assets/imoji.png" alt="" />
          </div>
          <span className="registerDescription">
            Connect with friends and the world around you
          </span>
        </div>
        <div className="registerArea">
          <form className="registerForm" onSubmit={formik.handleSubmit}>
            <div className="registerItems">
              <input
                type="text"
                placeholder="Username"
                id="username"
                name="username"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.username}
              />
              {formik.touched.username && formik.errors.username ? (
                <div className="error">{formik.errors.username}</div>
              ) : null}
            </div>
            <div className="registerItems">
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
            <div className="registerItems">
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
            <div className="registerItems">
              <input
                type="password"
                placeholder="Confirm Password"
                id="confirmPassword"
                name="confirmPassword"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.Confirmpassword}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="error">{formik.errors.password}</div>
              ) : null}
            </div>
            <button className="signupButton" type="submit">
              {loading ? <CircularProgress color="success" /> : "Sign Up"}
            </button>
          </form>
          <div className="alreadyHaveAnAccount">
            <span className="aleady">Already have an account?</span>
            <button
              className="logintoAccount"
              onClick={handleLogin}
              disabled={isLogin}
            >
              {isLogin ? <CircularProgress color="success" /> : "Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
