import React, { useEffect, useState } from "react";
import footerCss from "./footer.module.css";
import Cookies from "universal-cookie";
import { useNavigate, useLocation } from "react-router-dom";

const cookies = new Cookies();

function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState();
  const [user, setUser] = useState([]);

  useEffect(() => {
    setToken(cookies.get("token"));
  }, [location]);

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          const responce = await fetch(
            `${import.meta.env.VITE_URL}api/v1/user`,
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
            setUser(data.data.user);
          }
        } catch (error) {}
      }
    };
    fetchData();
  }, [token]);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_URL}api/v1/user/logout`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        cookies.remove("token");
        window.location.reload();
      }
    } catch (error) {}
  };

  const handleCart = () => {
    if (user?.cart?.length === 0) {
      alert("cart is empty");
    } else {
      navigate("/viewCart");
    }
  };

  const handleInvoice = () => {
    if (user?.invoice?.length === 0) {
      alert("First buy somthing!!");
    } else {
      navigate("/invoice");
    }
  }

  return (
    <>
      <div
        className={footerCss.main1}
        style={{ backgroundColor: !token ? "#2E0052" : "#fff" }}
      >
        <div className={footerCss.line}></div>
        {token ? (
          <div className={footerCss.links}>
            <span
              className="material-symbols-outlined"
              onClick={() => navigate("/")}
            >
              home
            </span>
            <span className="material-symbols-outlined" onClick={handleCart}>
              add_shopping_cart
            </span>
            <span
              className="material-symbols-outlined"
              onClick={handleInvoice}
            >
              edit_document
            </span>
            <span className="material-symbols-outlined" onClick={handleLogout}>
              person_alert
            </span>
          </div>
        ) : (
          <div className={footerCss.textInner}>
            Musicart | All rights reserved
          </div>
        )}
        <div className={footerCss.text}>Musicart | All rights reserved</div>
      </div>
      <div className={footerCss.main2}>
        <div className={footerCss.text}>Musicart | All rights reserved</div>
      </div>
    </>
  );
}

export default Footer;
