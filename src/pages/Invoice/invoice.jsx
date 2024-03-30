import React, { useEffect, useState } from "react";
import inCss from "./invoice.module.css";
import logo from "./../../assets/logo.png";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

const cookies = new Cookies();

function invoice() {
  const token = cookies.get("token");
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const responce = await fetch(
          `${import.meta.env.VITE_URL}api/v1/user/invoice`,
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
          setData(data.data.invoice);
        }
      } catch (error) {}
    };
    fetchdata();
  }, []);

  const handleViewInvoice = (id) => {
    navigate(`/viewInvoice/${id}`);
  };

  return (
    <>
      <div className={inCss.main}>
        <dir className={inCss.header}>
          <div className={inCss.headerLeft}>
            <img src={logo} alt="" className={inCss.headerLogo} />
            <h2 className={inCss.headerTxt}>Musicart</h2>
            <p className={inCss.headerTxt2}>Home/Invoice</p>
          </div>
          <div className={inCss.headerRight}>
            <div className={inCss.cart}>
              <span className="material-symbols-outlined">shopping_cart</span>
              <p>View Cart</p>
            </div>
          </div>
        </dir>
        <dir className={inCss.backBtn}>
          <button onClick={() => navigate("/")}>Back to Home</button>
          <button onClick={() => navigate("/")}>
            <span class="material-symbols-outlined">arrow_back</span>
          </button>
        </dir>
        <dir className={inCss.body}>
          <div className={inCss.upper}>
            <h2>My Invoices</h2>
          </div>
          <div className={inCss.lower}>
            {data.map((item, index) => (
              <>
                <div key={index} className={inCss.itemDiv}>
                  <span className="material-symbols-outlined">summarize</span>
                  <div className={inCss.itemDiv2}>
                    <p>{item.address.name}</p>
                    <p>{item.address.address}</p>
                  </div>
                  <button onClick={() => handleViewInvoice(item.id)}>
                    View Invoice
                  </button>
                </div>
              </>
            ))}
          </div>
        </dir>
      </div>
    </>
  );
}

export default invoice;
