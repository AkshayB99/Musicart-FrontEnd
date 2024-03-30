import React from "react";
import suCss from "./success.module.css";
import logo from "./../assets/logo.png";
import successImg from "./../assets/success.png";
import { useNavigate } from "react-router-dom";


function success() {
  const navigate = useNavigate();
  return (
    <>
      <div className={suCss.main}>
        <div className={suCss.container}>
          <div className={suCss.first}>
            <img src={logo} className={suCss.logo} />
            <h3 className={suCss.logoText}>Musicart</h3>
          </div>
          <div className={suCss.second}>
            <div className={suCss.sucBox}>
              <img src={successImg} alt="" className={suCss.succLogo} />
              <h2 className={suCss.mainH2}>Order is placed successfully!</h2>
              <p className={suCss.mainP}>
                You will be receiving a confirmation email with order details
              </p>
              <button className={suCss.mainBtn} onClick={() => navigate("/")}>
                Go back to Home page
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default success;
