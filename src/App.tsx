import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "./app/store";
import { useGetCategoriesQuery } from "./api/productsApi";
import { setDrawerOpen } from "./features/catalog/catalogSlice";
import Header from "./components/user/Header";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import Checkout from "./pages/Checkout";
import WishlistPage from "./pages/WishlistPage";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminCategories from "./pages/AdminCategories";
import AdminUsers from "./pages/AdminUsers";
import AdminSettings from "./pages/AdminSettings";
import AdminTest from "./pages/AdminTest";
import Footer from "./components/user/Footer";
import Cart from "./components/user/Cart";
import LocationSync from "./routing/urlSync";

// Компонент для условного отображения хедера и футера
const ConditionalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const isAdminRoute = location.pathname.startsWith('/admin');
    const drawerOpen = useSelector((s: RootState) => s.catalog.drawerOpen);

    // ПРЕДЗАГРУЖАЕМ категории сразу при старте приложения
    useGetCategoriesQuery(undefined, {
        staleTime: 10 * 60 * 1000, // 10 минут
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        cacheTime: Infinity,
    });

    return (
        <>
            {!isAdminRoute && <Header />}
            {/* ВАЖНО: компонент синхронизации должен быть ОДИН, выше Routes, внутри Router */}
            {!isAdminRoute && <LocationSync />}
            {children}
            {!isAdminRoute && <Footer />}
            {!isAdminRoute && <Cart isOpen={drawerOpen} onClose={() => dispatch(setDrawerOpen(false))} />}
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
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/admin/products" element={<AdminProducts />} />
                    <Route path="/admin/products/new" element={<AdminProducts />} />
                    <Route path="/admin/products/:id/edit" element={<AdminProducts />} />
                    <Route path="/admin/orders" element={<AdminOrders />} />
                    <Route path="/admin/orders/:id" element={<AdminOrders />} />
                    <Route path="/admin/orders/:id/edit" element={<AdminOrders />} />
                    <Route path="/admin/categories" element={<AdminCategories />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/admin/settings" element={<AdminSettings />} />
                    <Route path="/admin/test" element={<AdminTest />} />
                    <Route path="/admin/analytics" element={<Admin />} />
                </Routes>
            </ConditionalLayout>
        </BrowserRouter>
    );
}
