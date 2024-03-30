import React, { useState } from "react";
import lCss from "./login.module.css";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies();

function login() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [errorData, setErrorData] = useState({});

  const handleLogin = async () => {
    try {
      const responce = await fetch(
        `${import.meta.env.VITE_URL}api/v1/user/login`,
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
        setErrorData(data);
      }
    } catch (error) {}
  };

  console.log(errorData.message);

  return (
    <>
      <div className={lCss.main}>
        <div className={lCss.logo}>
          <img src={logo} alt="" />
          <h1>Musicart</h1>
        </div>
        <div className={lCss.login}>
          <h1>Sign in</h1>
          <div>
            <label htmlFor="username">Enter your email or mobile number</label>
            <input
              type="text"
              id="username"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="password">Enter your password</label>
            <input
              type="password"
              id="password"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </div>
          <p className={lCss.error}>{errorData.message}</p>
          <button className={lCss.btn} onClick={handleLogin}>
            Continue
          </button>
          <p>
            By continuing, you agree to Musicart privacy notice and conditions
            of use.
          </p>
        </div>
        <div className={lCss.line}>
          <span></span>
          <p>New To Musicart?</p>
          <span></span>
        </div>
        <button className={lCss.create} onClick={() => navigate("/signup")}>
          Create your Musicart account
        </button>
      </div>
    </>
  );
}

export default login;
