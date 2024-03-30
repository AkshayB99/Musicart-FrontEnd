import React, { useState } from "react";
import sCss from "./signup.module.css";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies();

function signup() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    mobileNo: "",
    email: "",
    password: "",
  });

  const [errorData, setErrorData] = useState({});

  const handleSignUp = async () => {
    try {
      const responce = await fetch(
        `${import.meta.env.VITE_URL}api/v1/user/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );
      const data = await responce.json();
      if (data.status === "success") {
        cookies.set("token", data.token);
        navigate("/");
      } else {
        setErrorData(data.error.errors);
      }
    } catch (error) {}
  };

  return (
    <>
      <div className={sCss.main}>
        <div className={sCss.logo}>
          <img src={logo} alt="" />
          <h1>Musicart</h1>
        </div>
        <dir className={sCss.signUp}>
          <h1>Create Account</h1>
          <div>
            <label>Your name</label>
            <input
              type="text"
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
            <span className={sCss.errors}>{errorData?.name?.message}</span>
          </div>
          <div>
            <label>Mobile number</label>
            <input
              type="text"
              onChange={(e) => setUser({ ...user, mobileNo: e.target.value })}
            />
            <span className={sCss.errors}>{errorData?.mobileNo?.message}</span>
          </div>
          <div>
            <label>Email Id</label>
            <input
              type="email"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
            <span className={sCss.errors}>{errorData?.email?.message}</span>
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
            <span className={sCss.errors}>
              {errorData?.password?.properties?.type === "required"
                ? errorData.password.message
                : errorData?.password?.properties?.type === "minlength"
                ? "Password should be at least 8 characters long."
                : ""}
            </span>
          </div>
          <p>
            By enrolling your mobile phone number, you consent to receive
            automated security notifications via text message from Musicart.
            Message and data rates may apply.
          </p>
          <button className={sCss.btn} onClick={handleSignUp}>
            Continue
          </button>
          <p>
            By continuing, you agree to Musicart privacy notice and conditions
            of use.
          </p>
        </dir>
        <dir className={sCss.last}>
          <p>
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Sign in</span>
          </p>
        </dir>
      </div>
    </>
  );
}

export default signup;
