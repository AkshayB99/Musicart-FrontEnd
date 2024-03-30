import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import logo from "../assets/logo.png";
import cartCss from "./viewCart.module.css";

const cookies = new Cookies();

function ViewCart() {
  const token = cookies.get("token");
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [user, setUser] = useState([]);
  const [itemIds, setItemIds] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [deleteItem, setDeleteItem] = useState(false);

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
          const ids = userData.data.user.cart.map((item) => item.itemId);
          setItemIds(ids);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [token, deleteItem]);

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

  useEffect(() => {
    const calculateTotalPrice = () => {
      let total = 0;
      data.forEach((item) => {
        total += item.price * (item.quantity || 1);
      });
      setTotalPrice(total);
    };

    calculateTotalPrice();
  }, [data]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_URL}api/v1/user/cart`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            itemId: id,
          }),
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        setDeleteItem(!deleteItem);
        window.location.reload();
      }
    } catch (error) {}
  };

  const handlePlaceOrder = async () => {
    if (user?.cart?.length === 0) {
      alert("Cart is empty");
    } else {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_URL}api/v1/user/checkout`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              TotalAmt: totalPrice + 45,
            }),
          }
        );
        const data = await response.json();
        if (data.status === "success") {
          navigate("/checkout");
        }
      } catch (error) {}
    }
  };

  return (
    <>
      <div className={cartCss.main}>
        {/* Header section */}
        <div className={cartCss.header}>
          {/* Left side */}
          <div className={cartCss.left}>
            <img src={logo} className={cartCss.logoImg} alt="Logo" />
            <h3>Musicart</h3>
            <p className={cartCss.headerText}>Home/View Cart</p>
          </div>
          {/* Right side */}
          <div className={cartCss.right}>
            <div className={cartCss.cart}>
              <div className={cartCss.cartIn}>
                <span className="material-symbols-outlined">shopping_cart</span>
                <p className={cartCss.cartText}>
                  View Cart
                  <span className={cartCss.cartNo}>{user?.cart?.length}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Back button */}
        <div className={cartCss.backBtnArea}>
          <button className={cartCss.backBtn} onClick={() => navigate("/")}>
            Back to product
          </button>
          <button className={cartCss.backBtn2} onClick={() => navigate("/")}>
            <span class="material-symbols-outlined">arrow_back</span>
          </button>
        </div>
        <div className={cartCss.Contents}>
          <div className={cartCss.btleft}>
            <div className={cartCss.items}>
              {data.map((item, index) => (
                <>
                  <div className={cartCss.item} key={item._id}>
                    <img
                      src={item?.imageUrl?.mainImg}
                      className={cartCss.itemImg}
                      alt={item.name.shortname}
                    />
                    <div className={cartCss.second}>
                      <h3 className={cartCss.shortName}>
                        {item?.name?.shortname}
                      </h3>
                      <p className={cartCss.color}>Color : {item?.color}</p>
                      <p className={cartCss.stock}>{item?.availability}</p>
                    </div>
                    <div className={cartCss.prices}>
                      <h3 className={cartCss.priceText}>Price</h3>
                      <p className={cartCss.price}>₹ {item?.price}</p>
                    </div>
                    <div className={cartCss.quantity}>
                      <h3>Quantity</h3>
                      <select
                        name={`quantity-${index}`}
                        id={`quantity-${index}`}
                        defaultValue={1}
                        onChange={(e) => {
                          const selectedQuantity = parseInt(e.target.value);
                          const updatedData = [...data];
                          updatedData[index].quantity = selectedQuantity;
                          setData(updatedData);
                        }}
                      >
                        {Array.from({ length: 8 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={cartCss.total}>
                      <h3>Total</h3>
                      <p className={cartCss.totalPrice}>
                        ₹ {(item.price * (item.quantity || 1)).toLocaleString()}
                      </p>
                    </div>
                    <div className={cartCss.delBtn}>
                      <span
                        className="material-symbols-outlined"
                        onClick={() => handleDelete(item.id)}
                      >
                        delete
                      </span>
                    </div>
                  </div>
                  <div className={cartCss.botLine}></div>
                </>
              ))}
            </div>
            <div className={cartCss.bottomTotal}>
              <p className={cartCss.btmItem}>{user?.cart?.length} Item</p>
              <p className={cartCss.btmTotal}>
                ₹ {totalPrice.toLocaleString()}
              </p>
            </div>
          </div>
          <div className={cartCss.btRight}>
            <h3 className={cartCss.TotHead}>Price Details</h3>
            <p className={cartCss.totMrp}>
              Total MRP <span>₹{totalPrice.toLocaleString()}</span>
            </p>
            <p className={cartCss.totDis}>
              Discount on MRP <span>₹0</span>
            </p>
            <p className={cartCss.totCon}>
              Convenience Fee <span>₹45</span>
            </p>

            <h2 className={cartCss.totTotalAmt}>
              Total Amount <span>₹{(totalPrice + 45).toLocaleString()}</span>
            </h2>
            <button className={cartCss.placeOrd} onClick={handlePlaceOrder}>
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewCart;
