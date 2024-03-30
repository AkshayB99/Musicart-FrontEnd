import React, { useEffect, useState } from "react";
import chCss from "./checkOut.module.css";
import logo from "../assets/logo.png";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

const cookies = new Cookies();

function checkOut() {
  const navigate = useNavigate();
  const token = cookies.get("token");
  const [user, setUser] = useState([]);
  const [itemIds, setItemIds] = useState([]);
  const [data, setData] = useState([]);
  const [address, setAddress] = useState("");
  const [paymentOption, setPaymentOption] = useState("");

  const defaultPayment = paymentOption ? paymentOption : "pod";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetch(
          `${import.meta.env.VITE_URL}api/v1/user`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const userData = await userResponse.json();
        if (userData.status === "success") {
          setUser(userData.data.user);
          const ids = userData.data.user.checkout.flatMap((item) =>
            item.newItem.map((newItem) => newItem.itemId)
          );
          setItemIds(ids);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (itemIds.length > 0) {
      const fetchDataAndItem = async () => {
        try {
          const itemResponse = await fetch(
            `${
              import.meta.env.VITE_URL
            }api/v1/data/dataByIds?ids=${itemIds?.join(", ")}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const itemData = await itemResponse.json();
          if (itemData.status === "success") {
            setData(itemData.data.data);
          }
        } catch (error) {
          console.error("Error fetching item data:", error);
        }
      };

      fetchDataAndItem();
    }
  }, [itemIds, token]);

  const handlePaymentOptionChange = (event) => {
    setPaymentOption(event.target.value);
  };

  const handlePlaceOrder = async () => {
    if (address === "" && paymentOption === "") {
      alert("Please enter address and payment option");
      return;
    } else {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_URL}api/v1/user/invoice`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              address: address,
              paymentOption: paymentOption,
            }),
          }
        );
        const data = await res.json();
        if (data.status === "success") {
          navigate("/success");
        }
      } catch (error) {}
    }
  };


  return (
    <>
      <div className={chCss.main}>
        <div className={chCss.header}>
          {/* Left side */}
          <div className={chCss.left}>
            <img src={logo} className={chCss.logoImg} alt="Logo" />
            <h3>Musicart</h3>
            <p className={chCss.headerText}>Home/Check out</p>
          </div>
        </div>
        <div className={chCss.heading}>
          <h3>
            <u>CheckOut</u>
          </h3>
        </div>
        <div className={chCss.content}>
          <div className={chCss.leftCont}>
            <div className={chCss.leftBody}>
              <div className={chCss.One}>
                <p className={chCss.oneLeft}>1. Delivery address</p>
                <div className={chCss.oneRight}>
                  <p>{user?.name}</p>
                  <textarea
                    name="address"
                    className={chCss.oneRightAdd}
                    cols="30"
                    rows="4"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className={chCss.Two}>
                <p className={chCss.twoLeft}>2. Payment method</p>
                <select
                  name="paymentOption"
                  className={chCss.payOpt}
                  value={defaultPayment}
                  onChange={handlePaymentOptionChange}
                >
                  <option value="pod">Pay on delivery</option>
                  <option value="upi">UPI</option>
                  <option value="card">Card</option>
                </select>
              </div>
              <div className={chCss.Three}>
                <p className={chCss.threeLeft}>3. Review items and delivery</p>
                <div className={chCss.threeRight}>
                  {data.map((item) => (
                    <div className={chCss.threeRightItem} key={item.id}>
                      <img
                        src={item?.imageUrl?.mainImg}
                        className={chCss.threeRightItemImg}
                      />
                      <div>
                        <p className={chCss.threeRightItemtxt}>
                          {item?.name?.shortname}
                        </p>
                        <p className={chCss.threeRightItemtxt2}>
                          Color : {item?.color}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={chCss.btmPlaceOrd}>
              <div className={chCss.btmPlaceOrdIn}>
                <button
                  className={chCss.btmPlaceOrdInBtnInBtn}
                  onClick={handlePlaceOrder}
                >
                  Place your Order
                </button>
                <div className={chCss.btmPlaceOrdIn2}>
                  <h3>Order Total : {user?.checkout?.[0]?.totalAmount}</h3>
                  <p>
                    By placing your order, you agree to Musicart privacy notice
                    and conditions of use.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className={chCss.rightCont}>
            <div className={chCss.rightBody}>
              <div className={chCss.rightBodyIn1}>
                <button onClick={handlePlaceOrder}>Place your order</button>
                <p>
                  By placing your order, you agree to Musicart privacy notice
                </p>
                <span></span>
              </div>
              <div className={chCss.rightBodyIn2}>
                <h3>Order Summary</h3>
                <div className={chCss.rightBodyIn2Item}>
                  <p>Items: </p>
                  <span>₹{user?.checkout?.[0]?.totalAmount - 45}.00</span>
                </div>
                <div className={chCss.rightBodyIn2Del}>
                  <p>Delivery:</p>
                  <span>₹45.00</span>
                </div>
                <span className={chCss.rightBodyIn2line}></span>
              </div>
              <div className={chCss.rightBodyIn3}>
                <p>
                  Order Total :{" "}
                  <span>₹{user?.checkout?.[0]?.totalAmount}.00</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default checkOut;
