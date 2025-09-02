import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import Footer from "./components/layout/Footer";
import CartDrawer from "./components/cart/CartDrawer";
import LocationSync from "./routing/urlSync"; // ← этот файл

export default function App(){
    return (
        <BrowserRouter>
            <Header />
            {/* ВАЖНО: компонент синхронизации должен быть ОДИН, выше Routes, внутри Router */}
            <LocationSync />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/*" element={<Admin />} />
            </Routes>
            <Footer />
            <CartDrawer />
        </BrowserRouter>
    );
}
