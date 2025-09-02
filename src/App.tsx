import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/layout/Header";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminCategories from "./pages/AdminCategories";
import AdminUsers from "./pages/AdminUsers";
import AdminSettings from "./pages/AdminSettings";
import AdminTest from "./pages/AdminTest";
import Footer from "./components/layout/Footer";
import CartDrawer from "./components/cart/CartDrawer";
import LocationSync from "./routing/urlSync";

// Компонент для условного отображения хедера и футера
const ConditionalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
        <>
            {!isAdminRoute && <Header />}
            {/* ВАЖНО: компонент синхронизации должен быть ОДИН, выше Routes, внутри Router */}
            {!isAdminRoute && <LocationSync />}
            {children}
            {!isAdminRoute && <Footer />}
            {!isAdminRoute && <CartDrawer />}
        </>
    );
};

export default function App(){
    return (
        <BrowserRouter>
            <ConditionalLayout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/admin/products" element={<AdminProducts />} />
                    <Route path="/admin/orders" element={<AdminOrders />} />
                    <Route path="/admin/categories" element={<AdminCategories />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/admin/settings" element={<AdminSettings />} />
                    <Route path="/admin/test" element={<AdminTest />} />
                </Routes>
            </ConditionalLayout>
        </BrowserRouter>
    );
}
