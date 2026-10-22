import { useNavigate } from "react-router-dom";

import "./SellerNavbar.css";

function SellerNavbar() {

    const navigate = useNavigate();

    const handleLogout = () => {

        localStorage.removeItem("token");

        navigate("/login");
    };

    return (

        <nav className="seller-navbar">

            <div
                className="seller-navbar-logo"
                onClick={() => navigate("/seller/dashboard")}
            >
                OOPSIBID
            </div>


            <div className="seller-navbar-links">

                <button
                    onClick={() =>
                        navigate("/seller/dashboard")
                    }
                >
                    Dashboard
                </button>


                <button
                    onClick={() =>
                        navigate("/seller/products")
                    }
                >
                    My Products
                </button>


                <button
                    onClick={() =>
                        navigate("/seller/products/add")
                    }
                >
                    Add Product
                </button>


                <button
                    onClick={() =>
                        navigate("/seller/auctions")
                    }
                >
                    My Auctions
                </button>


                <button
                    onClick={() =>
                        navigate("/seller/bids")
                    }
                >
                    Bids
                </button>


                <button
                    onClick={() =>
                        navigate("/seller/profile")
                    }
                >
                    Profile
                </button>


                <button
                    className="seller-logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

        </nav>
    );
}

export default SellerNavbar;
