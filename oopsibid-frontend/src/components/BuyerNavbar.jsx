import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "./BuyerNavbar.css";

function BuyerNavbar() {

    const navigate = useNavigate();
    const location = useLocation();

    const [menuOpen, setMenuOpen] = useState(false);


    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("userId");

        navigate("/login");
    };


    // ==========================================
    // NAVIGATION
    // ==========================================

    const goTo = (path) => {

        navigate(path);

        setMenuOpen(false);
    };


    // ==========================================
    // ACTIVE LINK
    // ==========================================

    const isActive = (path) => {

        return location.pathname === path;
    };


    return (

        <header className="buyer-navbar">

            <div className="buyer-navbar-container">


                {/* =================================
                    LOGO
                ================================= */}

                <div
                    className="buyer-navbar-logo"
                    onClick={() =>
                        goTo("/buyer/dashboard")
                    }
                >

                    <span className="buyer-logo-text">
                        OOPSIBID
                    </span>

                </div>


                {/* =================================
                    DESKTOP NAVIGATION
                ================================= */}

                <nav className="buyer-navbar-links">

                    {/* DASHBOARD */}

                    <button
                        className={
                            isActive("/buyer/dashboard")
                                ? "buyer-nav-link active"
                                : "buyer-nav-link"
                        }
                        onClick={() =>
                            goTo("/buyer/dashboard")
                        }
                    >
                        Dashboard
                    </button>


                    {/* AUCTIONS */}

                    <button
                        className={
                            isActive("/buyer/auctions")
                                ? "buyer-nav-link active"
                                : "buyer-nav-link"
                        }
                        onClick={() =>
                            goTo("/buyer/auctions")
                        }
                    >
                        Auctions
                    </button>


                    {/* MY BIDS */}

                    <button
                        className={
                            isActive("/buyer/bids")
                                ? "buyer-nav-link active"
                                : "buyer-nav-link"
                        }
                        onClick={() =>
                            goTo("/buyer/bids")
                        }
                    >
                        My Bids
                    </button>


                    {/* =================================
                        WALLET
                    ================================= */}

                    <button
                        className={
                            isActive("/buyer/wallet")
                                ? "buyer-nav-link active wallet-link"
                                : "buyer-nav-link wallet-link"
                        }
                        onClick={() =>
                            goTo("/buyer/wallet")
                        }
                    >
                        Wallet
                    </button>


                    {/* PROFILE */}

                    <button
                        className={
                            isActive("/buyer/profile")
                                ? "buyer-nav-link active"
                                : "buyer-nav-link"
                        }
                        onClick={() =>
                            goTo("/buyer/profile")
                        }
                    >
                        Profile
                    </button>

                </nav>


                {/* =================================
                    RIGHT SIDE
                ================================= */}

                <div className="buyer-navbar-actions">

                    <button
                        className="buyer-logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>


                {/* =================================
                    MOBILE MENU BUTTON
                ================================= */}

                <button
                    className="buyer-mobile-menu"
                    onClick={() =>
                        setMenuOpen(!menuOpen)
                    }
                >
                    ☰
                </button>

            </div>


            {/* =====================================
                MOBILE NAVIGATION
            ===================================== */}

            {menuOpen && (

                <div className="buyer-mobile-navigation">

                    {/* DASHBOARD */}

                    <button
                        onClick={() =>
                            goTo("/buyer/dashboard")
                        }
                    >
                        Dashboard
                    </button>


                    {/* AUCTIONS */}

                    <button
                        onClick={() =>
                            goTo("/buyer/auctions")
                        }
                    >
                        Auctions
                    </button>


                    {/* MY BIDS */}

                    <button
                        onClick={() =>
                            goTo("/buyer/bids")
                        }
                    >
                        My Bids
                    </button>


                    {/* =================================
                        WALLET
                    ================================= */}

                    <button
                        onClick={() =>
                            goTo("/buyer/wallet")
                        }
                    >
                        Wallet
                    </button>


                    {/* PROFILE */}

                    <button
                        onClick={() =>
                            goTo("/buyer/profile")
                        }
                    >
                        Profile
                    </button>


                    {/* LOGOUT */}

                    <button
                        className="mobile-logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            )}

        </header>
    );
}

export default BuyerNavbar;