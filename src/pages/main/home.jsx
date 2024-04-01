import React, { useEffect, useState, useRef } from "react";
import hCss from "./home.module.css";
import Cookies from "universal-cookie";
import logo from "./../../assets/logo.png";
import bannerImg from "./../../assets/BannerImg.png";
import Item from "../../components/itemsComp";
import { useNavigate } from "react-router-dom";
import ViewItem from "../../components/itemViewComp"

const cookies = new Cookies();

function Home() {
  const token = cookies.get("token");
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [grid, setGrid] = useState(true);
  const [list, setList] = useState(false);
  const [headphoneType, setHeadphoneType] = useState("");
  const [company, setCompany] = useState("");
  const [color, setColor] = useState("");
  const [price, setPrice] = useState("");
  const [featured, setFeatured] = useState("");
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [userName, setUserName] = useState("");
  const [userDetails, setUserDetails] = useState(false);
  const optionsRef = useRef(null);
  const [reloading, setReloading] = useState(false);

  const handleMainReload = () => {
    setReloading(!reloading);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responce = await fetch(`${import.meta.env.VITE_URL}api/v1/data`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await responce.json();
        if (data.status === "success") {
          // setuser(data.data.data);
        }
      } catch (error) {}
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responce = await fetch(`${import.meta.env.VITE_URL}api/v1/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await responce.json();
        if (data.status === "success") {
          setUser(data.data.user);
        }
      } catch (error) {}
    };
    fetchData();
  }, [reloading, token]);

  const handleSearchValue = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responce = await fetch(
          `${
            import.meta.env.VITE_URL
          }api/v1/data?search=${search}&headphoneType=${headphoneType}&company=${company}&color=${color}&price=${price}&featured=${featured}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await responce.json();
        if (data.status === "success") {
          setData(data.data.data);
        }
      } catch (error) {}
    };
    fetchData();
  }, [search, headphoneType, company, color, price, featured]);

  useEffect(() => {
    const words = user?.name?.split(" ");
    if (words?.length === 1) {
      const name = words[0].substring(0, 2).toUpperCase();
      setUserName((prevUser) => ({ ...prevUser, name }));
    } else if (words?.length === 2) {
      const name = words
        .slice(0, 2)
        .map((word) => word.charAt(0).toUpperCase())
        .join("");
      setUserName((prevUser) => ({ ...prevUser, name }));
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setUserDetails(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
        window.location.reload();
      }
    } catch (error) {}
  };

  const handelInvoice = () => {
    if (token) {
      navigate("/invoice");
    } else {
      navigate("/login");
    }
  };

  const handleClickCart = () => {
    if(user?.cart?.length === 0){
      alert("cart is empty")
    }
    else{
      navigate("/viewCart");
    }
  }

  return (
    <>
      <div className={hCss.main}>
        <div className={hCss.header}>
          <div className={hCss.left}>
            <img src={logo} className={hCss.logoImg} />
            <h3>Musicart</h3>
            <p>Home</p>
            {token ? <p onClick={handelInvoice}>Invoice</p> : null}
          </div>
          <div className={hCss.right}>
            {token ? (
              <>
                <div className={hCss.cart}>
                  <div
                    className={hCss.cartIn}
                    onClick={handleClickCart}
                  >
                    <span className="material-symbols-outlined">
                      shopping_cart
                    </span>
                    <p>
                      View Cart{" "}
                      <span className={hCss.cartNo}>{user?.cart?.length}</span>
                    </p>
                  </div>
                </div>
                <div className={hCss.user} onClick={() => setUserDetails(true)}>
                  {userName.name}
                </div>
                {userDetails ? (
                  <div className={hCss.uDetails} ref={optionsRef}>
                    <p>{user?.name}</p>
                    <span></span>
                    <p onClick={handleLogout}>Logout</p>
                  </div>
                ) : (
                  ""
                )}
              </>
            ) : null}
          </div>
        </div>
        <div className={hCss.body}>
          <div className={hCss.banner}>
            <img src={bannerImg} alt="" />
            <div className={hCss.bannerBox}>
              <p>Grab upto 50% off on Selected headphones</p>
            </div>
          </div>
          <div className={hCss.content}>
            <div className={hCss.searchBoxDiv}>
              <div className={hCss.searchBox}>
                <span className="material-symbols-outlined">search</span>
                <input
                  type="search"
                  placeholder="Search by Product Name"
                  onChange={handleSearchValue}
                />
              </div>
            </div>
            <div className={hCss.filterBox}>
              <span
                className="material-symbols-outlined"
                onClick={() => {
                  setGrid(!grid);
                  setList(!list);
                }}
                style={{
                  fontWeight: grid ? "900" : "100",
                  fontSize: "28px",
                  cursor: "pointer",
                }}
              >
                grid_view
              </span>
              <span
                className="material-symbols-outlined"
                onClick={() => {
                  setGrid(!grid);
                  setList(!list);
                }}
                style={{
                  fontWeight: list ? "900" : "100",
                  fontSize: "29px",
                  cursor: "pointer",
                }}
              >
                view_list
              </span>
              <div className={hCss.hBox}>
                <select
                  className={hCss.hType}
                  value={headphoneType}
                  onChange={(e) => setHeadphoneType(e.target.value)}
                >
                  <option value="">Headphone type</option>
                  <option value="In the Ear">In the Ear</option>
                  <option value="True Wireless">True Wireless</option>
                  <option value="On the Ear">On the Ear</option>
                </select>
                <span className="material-symbols-outlined">expand_more</span>
              </div>
              <div className={hCss.hBox}>
                <select
                  className={hCss.hType}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                >
                  <option value="">Company</option>
                  <option value="JBL">JBL</option>
                  <option value="Sony">Sony</option>
                  <option value="Realme">Realme</option>
                  <option value="boAt">boAt</option>
                  <option value="OnePlus">One Plus</option>
                  <option value="Mivi">Mivi</option>
                  <option value="Acer">Acer</option>
                  <option value="Fire-Boltt">Fire-Boltt</option>
                  <option value="Apple">Apple</option>
                  <option value="Noise">Noise</option>
                  <option value="Boult">Boult</option>
                  <option value="CMF">CMF</option>
                  <option value="Razer">Razer</option>
                </select>
                <span className="material-symbols-outlined">expand_more</span>
              </div>
              <div className={hCss.hBox}>
                <select
                  className={hCss.hType}
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                >
                  <option value="">Color</option>
                  <option value="Blue">Blue</option>
                  <option value="Black">Black</option>
                  <option value="White">RWhite</option>
                  <option value="Orange">Orange</option>
                  <option value="Grey">Grey</option>
                  <option value="Yellow">Yellow</option>
                  <option value="Green">Green</option>
                  <option value="Pink">Pink</option>
                </select>
                <span className="material-symbols-outlined">expand_more</span>
              </div>
              <div className={hCss.hBox}>
                <select
                  className={hCss.hType}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                >
                  <option value="">Price</option>
                  <option value="1">₹0 - ₹1000</option>
                  <option value="2">₹1000 - ₹10000</option>
                  <option value="3">₹10000 - ₹20000</option>
                </select>
                <span className="material-symbols-outlined">expand_more</span>
              </div>
              <div className={hCss.hSortBox}>
                <select
                  className={hCss.hSort}
                  value={featured}
                  onChange={(e) => setFeatured(e.target.value)}
                >
                  <option value="">Sort by : Featured</option>
                  <option value="Price: Lowest">Price: Lowest</option>
                  <option value="Price: highest">Price: highest</option>
                  <option value="Name: (A-Z)">Name: (A-Z)</option>
                  <option value="Name: (Z-A)">Name: (Z-A)</option>
                </select>
                <span className="material-symbols-outlined">expand_more</span>
              </div>
            </div>
          </div>
          {grid ? (
            <div className={hCss.subContent}>
              {data?.map((item) => (
                <Item
                  data={item}
                  key={item._id}
                  handleMainReload={handleMainReload}
                />
              ))}
            </div>
          ) : (
            <div className={hCss.subContent2}>
              {data?.map((item) => (
                <ViewItem
                  data={item}
                  key={item._id}
                  handleMainReload={handleMainReload}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
