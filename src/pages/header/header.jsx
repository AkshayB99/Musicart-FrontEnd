import React, { useEffect, useState } from "react";
import headerCss from "./header.module.css";
import Cookies from "universal-cookie";
import { useNavigate, useLocation } from "react-router-dom";

const cookies = new Cookies();

function header() {
  const navigate = useNavigate();
  const [token, setToken] = useState();
  const location = useLocation();

  const isViewPage = location.pathname.includes("item");

  useEffect(() => {
    setToken(cookies.get("token"));
  }, []);

  const handleLogout = async () => {
    try {
      const responce = await fetch(
        `${import.meta.env.VITE_URL}api/v1/user/logout`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await responce.json();
      if (data.status === "success") {
        cookies.remove("token");
        navigate("/");
      }
    } catch (error) {}
  };

  return (
    <>
      <div className={headerCss.main}>
        <div className={headerCss.phone}>
          <span className="material-symbols-outlined">phone_in_talk</span>
          9100004444
        </div>
        <div className={headerCss.centerCont}>
          <p>Get 50% off on selected items | Shop Now</p>
        </div>
        <div className={headerCss.authCont}>
          {!token ? (
            <>
              <button onClick={() => navigate("/login")}>Login</button>
              <p>|</p>
              <button onClick={() => navigate("/signup")}>Signup</button>
            </>
          ) : null}
          {isViewPage ? <button onClick={handleLogout}>Logout</button> : null}
        </div>
      </div>
    </>
  );
}

export default header;
