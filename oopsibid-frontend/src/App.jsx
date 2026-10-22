import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Auctions from "./pages/Auctions";
import Products from "./pages/Products";
import About from "./pages/About";

// ADMIN
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminAuctions from "./pages/admin/AdminAuctions";
import AdminBids from "./pages/admin/AdminBids";
import AdminReports from "./pages/admin/AdminReports";

// SELLER
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerProducts from "./pages/seller/SellerProducts";
import AddProduct from "./pages/seller/AddProduct";
import SellerAuctions from "./pages/seller/SellerAuctions";
import SellerProductDetails from "./pages/seller/SellerProductDetails";
import CreateAuction from "./pages/seller/CreateAuction";
import SellerBids from "./pages/seller/SellerBids";
import SellerProfile from "./pages/seller/SellerProfile";

//buyer
import BuyerDashboard from "./pages/buyer/BuyerDashboard";
import BuyerAuctions from "./pages/buyer/BuyerAuctions";
import BuyerAuctionDetails from "./pages/buyer/BuyerAuctionDetails";
import BuyerBids from "./pages/buyer/BuyerBids";
import BuyerProfile from "./pages/buyer/BuyerProfile";
import BuyerWallet from "./pages/buyer/BuyerWallet";
import BuyerPayment from "./pages/buyer/BuyerPayment";


function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* =========================
                    PUBLIC PAGES
                ========================= */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/auctions"
                    element={<Auctions />}
                />

                <Route
                    path="/products"
                    element={<Products />}
                />

                <Route
                    path="/about"
                    element={<About />}
                />

                {/* =========================
                    ADMIN PAGES
                ========================= */}

                <Route
                    path="/admin/dashboard"
                    element={<AdminDashboard />}
                />

                <Route
                    path="/admin/users"
                    element={<AdminUsers />}
                />

                <Route
                    path="/admin/products"
                    element={<AdminProducts />}
                />

                <Route
                    path="/admin/auctions"
                    element={<AdminAuctions />}
                />

                <Route
                    path="/admin/bids"
                    element={<AdminBids />}
                />

                <Route
                    path="/admin/reports"
                    element={<AdminReports />}
                />


                {/* =========================
                    SELLER PAGES
                ========================= */}

                <Route
                    path="/seller/dashboard"
                    element={<SellerDashboard />}
                />

                <Route
                    path="/seller/products"
                    element={<SellerProducts />}
                />

                <Route
                    path="/seller/products/add"
                    element={<AddProduct />}
                />

                <Route
                    path="/seller/products/:id"
                    element={<SellerProductDetails />}
                />

                <Route
                    path="/seller/auctions"
                    element={<SellerAuctions />}
                />

                <Route
                    path="/seller/auctions/create"
                    element={<CreateAuction />}
                />

                <Route
                    path="/seller/auctions/create/:productId"
                    element={<CreateAuction />}
                />

                <Route
                    path="/seller/bids"
                    element={<SellerBids />}
                />

                <Route
                    path="/seller/profile"
                    element={<SellerProfile />}
                />

                {/* =========================
                    BUYER PAGES
                ========================= */}

                <Route
                    path="/buyer/dashboard"
                    element={<BuyerDashboard />}
                />

                <Route
                    path="/buyer/auctions"
                    element={<BuyerAuctions />}
                />

                <Route
                    path="/buyer/auctions/:id"
                    element={<BuyerAuctionDetails />}
                />

                <Route
                    path="/buyer/bids"
                    element={<BuyerBids />}
                />

                <Route
                    path="/buyer/profile"
                    element={<BuyerProfile />}
                />

                <Route
                    path="/buyer/wallet"
                    element={<BuyerWallet />}
                />

                <Route
                    path="/buyer/payment"
                    element={<BuyerPayment />}
                />

            </Routes>

        </BrowserRouter>

    );
}


export default App;