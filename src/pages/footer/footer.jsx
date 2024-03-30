import React, { useEffect, useState } from "react";
import footerCss from "./footer.module.css";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

const cookies = new Cookies();

function Footer() {
  const navigate = useNavigate();
  const [token, setToken] = useState();

  useEffect(() => {
    setToken(cookies.get("token"));
  }, [token]);

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
              class="material-symbols-outlined"
              onClick={() => navigate("/")}
            >
              home
            </span>
            <span
              class="material-symbols-outlined"
              onClick={() => navigate("/cart")}
            >
              add_shopping_cart
            </span>
            <span class="material-symbols-outlined" onClick={() => navigate("/invoice")}>edit_document</span>
            <span class="material-symbols-outlined">person_add</span>
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
