import React from "react";
import itemCss from "./itemComp.module.css";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const cookie = new Cookies();

function ItemsComp({ data, handleMainReload }) {
  const token = cookie.get("token");
  const navigate = useNavigate();

  const handleClick = () => {
    if (token) {
      navigate(`/item?view=${data.id}`);
    } else {
      navigate("/login");
    }
  };

  const handleCartClick = async (e) => {
    e.stopPropagation();
    try {
      const responce = await fetch(
        `${import.meta.env.VITE_URL}api/v1/user/cart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ itemId: data?.id }),
        }
      );
      const responseData = await responce.json();
      if (responseData.status === "success") {
        handleMainReload();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <div className={itemCss.main} key={data._id} onClick={handleClick}>
        <div className={itemCss.imgComp}>
          <img src={data?.imageUrl?.mainImg} alt="" />
          <p onClick={(e) => handleCartClick(e)}>
            <span
              className="material-symbols-outlined"
              style={{ fontWeight: "600" }}
            >
              add_shopping_cart
            </span>
          </p>
        </div>
        <div className={itemCss.Cont}>
          <p>{data?.name?.shortname}</p>
          <p>Price - ₹{data?.price}</p>
          <p>
            {data?.color} <span>|</span> {data?.type}
          </p>
        </div>
      </div>
    </>
  );
}

export default ItemsComp;
