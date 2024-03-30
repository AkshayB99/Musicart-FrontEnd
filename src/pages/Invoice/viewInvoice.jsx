import React, { useEffect, useState } from "react";
import viCss from "./viewInvoice.module.css";
import logo from "../../assets/logo.png";
import Cookies from "universal-cookie";
import { useParams } from "react-router-dom";

const cookies = new Cookies();

function viewInvoice() {
  const token = cookies.get("token");
  const [data, setData] = useState([]);
  const { id } = useParams();
  const [itemId, setItemId] = useState([]);
  const [items, setItems] = useState([]);
  const [itemData, setItemData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_URL}api/v1/user/invoice/${id}`,
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
            setData(data.data.invoice);
          }
        } catch (error) {}
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let ids = [];
    data?.newInvoice?.[0]?.newItem?.map((item) => {
      ids.push(item.itemId);
    });
    setItemId(ids);
  }, [data]);

  useEffect(() => {
    if (itemId.length > 0) {
      const fetchDataAndItem = async () => {
        try {
          const itemResponse = await fetch(
            `${
              import.meta.env.VITE_URL
            }api/v1/data/dataByIds?ids=${itemId?.join(",")}`,
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
            setItemData(itemData.data.data);
          }
        } catch (error) {
          console.error("Error fetching item data:", error);
        }
      };

      fetchDataAndItem();
    }
  }, [itemId, token]);

  console.log();

  return (
    <>
      <div className={viCss.main}>
        <dir className={viCss.header}>
          <div className={viCss.headerLeft}>
            <img src={logo} alt="" className={viCss.headerLogo} />
            <h2 className={viCss.headerTxt}>Musicart</h2>
            <p className={viCss.headerTxt2}>Home/View Invoice</p>
          </div>
        </dir>
        <dir className={viCss.backBtn}>
          <button>Back to Home</button>
        </dir>
        <dir className={viCss.body}>
          <div className={viCss.upper}>
            <h2>My Invoices</h2>
          </div>
          <div className={viCss.lower}>
            <div className={viCss.lowerLeft}>
              <div className={viCss.lowerLeft1}>
                <div className={viCss.lowerLeft1In}>
                  <h3>1. Delivery address</h3>
                  <div className={viCss.lowerLeft1Add}>
                    <p>{data?.address?.name}</p>
                    <p>{data?.address?.address}</p>
                  </div>
                </div>
                <div className={viCss.lowerLeft1span}></div>
              </div>
              <div className={viCss.lowerLeft2}>
                <div className={viCss.lowerLeft2In}>
                  <h3>2. Payment methos</h3>
                  <p>
                    {data.paymentOption === "pod" && "Pay on delivery"}
                    {data.paymentOption === "upi" && "UPI"}
                    {data.paymentOption === "card" && "Card"}
                  </p>
                </div>
                <div className={viCss.lowerLeft1span}></div>
              </div>
              <div className={viCss.lowerLeft3}>
                <h3>3. Review items and delivery</h3>
                <div className={viCss.lowerLeft3Item}>
                  {itemData?.map((item) => (
                    <div className={viCss.lowerLeft3ItemIn}>
                      <img src={item?.imageUrl?.mainImg} alt="" />
                      <div className={viCss.lowerLeft3ItemIn2}>
                        <p>{item?.name?.shortname}</p>
                        <p>{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={viCss.lowerRight}>
              <div className={viCss.lowerRightBox}>
                <h3>Order Summary</h3>
                <div className={viCss.itemRate}>
                  <p>Item:</p>
                  <p>₹{(data?.newInvoice?.[0]?.totalAmount) - 45}.00</p>
                </div>
                <div className={viCss.itemRate}>
                  <p>Delivery:</p>
                  <p>₹45.00</p>
                </div>
                <div className={viCss.midLine}></div>
                <div className={viCss.totalPrice}>
                  <h3>Total Price</h3>
                  <h3>₹{(data?.newInvoice?.[0]?.totalAmount)}.00</h3>
                </div>
              </div>
            </div>
          </div>
        </dir>
      </div>
    </>
  );
}

export default viewInvoice;
