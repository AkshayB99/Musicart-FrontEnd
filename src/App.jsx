import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Headers from "./pages/header/header";
import Footer from "./pages/footer/footer";
import Home from "./pages/main/home";
import Login from "./pages/userAuth/login";
import Signup from "./pages/userAuth/signup";
import ViewItem from "./components/viewItem";
import Cart from "./components/viewCart";
import CheckOut from "./components/checkOut";
import Success from "./components/success";
import Invoice from "./pages/Invoice/invoice"
import ViewInvoice from "./pages/Invoice/viewInvoice"


function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";
  const isSuccess = location.pathname === "/success";
  

  return (
    <>
      {!isLoginPage && !isSignupPage && !isSuccess && <Headers />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/item" element={<ViewItem />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<CheckOut />} />
        <Route path="/success" element={<Success />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/viewInvoice/:id" element={<ViewInvoice />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
