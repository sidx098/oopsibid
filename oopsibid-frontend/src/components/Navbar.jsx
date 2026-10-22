import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {

    const location = useLocation();

    const isRegisterPage = location.pathname === "/register";
    const isLoginPage = location.pathname === "/login";

    return (
        <nav className="navbar">

            {/* LOGO */}

            <div className="navbar-logo">

                <Link to="/">
                    OOPSIBID
                </Link>

            </div>


            {/* CENTER LINKS */}

            <div className="navbar-links">

                <Link to="/">
                    Home
                </Link>

                <Link to="/auctions">
                    Auctions
                </Link>

                <Link to="/products">
                    Products
                </Link>

                <Link to="/about">
                    About
                </Link>

            </div>


            {/* RIGHT SIDE */}

            <div className="navbar-actions">

                {/* Hide Login on Login page */}

                {!isLoginPage && (
                    <Link
                        to="/login"
                        className="login-link"
                    >
                        Login
                    </Link>
                )}


                {/* Hide Register on Register page */}

                {!isRegisterPage && (
                    <Link
                        to="/register"
                        className="register-button"
                    >
                        Register
                    </Link>
                )}

            </div>

        </nav>
    );
}

export default Navbar;