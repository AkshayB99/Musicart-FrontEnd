import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import vCss from "./viewItem.module.css";
import logo from "../assets/logo.png";

const cookies = new Cookies();

function ViewItem() {
  const token = cookies.get("token");
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const viewId = searchParams.get("view");
  const [data, setData] = useState([]);
  const [user, setUser] = useState([]);
  const [mainImage, setMainImage] = useState(""); 
  const [reloading, setReloading] = useState(false);

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
          setUser(userData.data);
        }
      } catch (error) {}
    };

    const fetchDataAndItem = async () => {
      try {
        const itemResponse = await fetch(
          `${import.meta.env.VITE_URL}api/v1/data/dataByIds?ids=${viewId}`,
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
          setData(itemData.data.data[0]);
          // Set main image initially
          setMainImage(itemData.data.data[0]?.imageUrl?.mainImg);
        }
      } catch (error) {}
    };

    fetchData();
    fetchDataAndItem();
  }, [reloading]);

  // Function to handle click on small image
  const handleSmallImageClick = (imageUrl) => {
    setMainImage(imageUrl);
  };

  const generateStars = (rating) => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push("⭐");
    }
    return stars;
  };

  function brand() {
    return data?.name?.shortname.split(" ")[0];
  }

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
        setReloading(!reloading)
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleBuyNow = async (e) => {
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
        navigate("/cart");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <h2 className={vCss.main}>
        <div className={vCss.header}>
          <div className={vCss.left}>
            <img src={logo} className={vCss.logoImg} />
            <h3>Musicart</h3>
            <p className={vCss.headerText}>Home/{data?.name?.shortname}</p>
          </div>
          <div className={vCss.right}>
            <div className={vCss.cart}>
              <div className={vCss.cartIn}>
                <span className="material-symbols-outlined">shopping_cart</span>
                <p className={vCss.cartText}>
                  View Cart
                  <span className={vCss.cartNo}>
                    {user?.user?.cart?.length}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className={vCss.backBtnArea}>
          <button className={vCss.backBtn} onClick={() => navigate("/")}>
            Back to product
          </button>
        </div>
        <div className={vCss.pFullNameArea}>
          <p className={vCss.pFullName}>
            {data?.name?.fullname} ({data?.color})
          </p>
        </div>
        <div className={vCss.content}>
          <div className={vCss.conLeft}>
            <div className={vCss.smallImgs}>
              {Object.values(data?.imageUrl || {}).map((imgUrl, index) => (
                <img
                  key={index}
                  src={imgUrl}
                  alt=""
                  onClick={() => handleSmallImageClick(imgUrl)}
                />
              ))}
            </div>
            <div className={vCss.showImgs}>
              <img src={mainImage} alt="" />
            </div>
          </div>
          <div className={vCss.conRight}>
            <div className={vCss.itemName}>
              <p>{data?.name?.shortname}</p>
            </div>
            <div className={vCss.itemRatting}>
              {generateStars(data?.ratings?.rating).map((star, index) => (
                <span className={vCss.rattingStars} key={index}>
                  {star}
                </span>
              ))}
              <p className={vCss.rattingNo}>
                ({data?.ratings?.ratingNo} Customer reviews)
              </p>
            </div>
            <div className={vCss.pirceDiv}>
              <p className={vCss.pirce}>Price - ₹ {data?.price}</p>
            </div>
            <div className={vCss.aboutItemDiv}>
              <p className={vCss.aboutItemHead}>About this item</p>
              <p className={vCss.aboutItem}>{data?.description}</p>
            </div>
            <p className={vCss.avaP}>Available - {data?.availability}</p>
            <p className={vCss.brand}>Brand - {brand()}</p>
            <div className={vCss.buttons}>
              <button className={vCss.addToCart} onClick={(e) => handleCartClick(e)}>Add to cart</button>
              <button className={vCss.buyNow} onClick={(e) => handleBuyNow(e)}>Buy Now</button>
            </div>
          </div>
        </div>
      </h2>
    </div>
  );
}

export default ViewItem;
