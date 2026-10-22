import { useNavigate } from "react-router-dom";

import "./AdminNavbar.css";

function AdminNavbar() {

    const navigate = useNavigate();


    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");

        navigate("/");

    };


    return (

        <nav className="admin-navbar">


            {/* =========================
                LOGO / BRAND
            ========================= */}

            <div
                className="admin-brand"
                onClick={() =>
                    navigate("/admin/dashboard")
                }
            >

                <span className="admin-brand-main">
                    OOPSIBID
                </span>

                <span className="admin-brand-label">
                    ADMIN
                </span>

            </div>


            {/* =========================
                ADMIN MENU
            ========================= */}

            <div className="admin-nav-links">


                <button
                    onClick={() =>
                        navigate("/admin/dashboard")
                    }
                >
                    Dashboard
                </button>


                <button
                    onClick={() =>
                        navigate("/admin/users")
                    }
                >
                    Users
                </button>


                <button
                    onClick={() =>
                        navigate("/admin/products")
                    }
                >
                    Products
                </button>


                <button
                    onClick={() =>
                        navigate("/admin/auctions")
                    }
                >
                    Auctions
                </button>


                <button
                    onClick={() =>
                        navigate("/admin/bids")
                    }
                >
                    Bids
                </button>


                <button
                    onClick={() =>
                        navigate("/admin/reports")
                    }
                >
                    Reports
                </button>


            </div>


            {/* =========================
                RIGHT SIDE
            ========================= */}

            <div className="admin-nav-actions">


                <button
                    className="admin-profile-button"
                    onClick={() =>
                        navigate("/admin/profile")
                    }
                >
                    Admin
                </button>


                <button
                    className="admin-logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>


            </div>


        </nav>

    );

}

export default AdminNavbar;