import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import AdminNavbar from "../../components/AdminNavbar";
import Footer from "../../components/Footer";

import "./AdminDashboard.css";

function AdminDashboard() {

    const navigate = useNavigate();


    useEffect(() => {

        const token =
            localStorage.getItem("token");

        const role =
            localStorage.getItem("role");


        if (!token || role !== "ADMIN") {

            navigate("/login");

        }

    }, [navigate]);


    return (

        <div className="admin-dashboard-page">

            <AdminNavbar />


            <main className="admin-dashboard-content">


                {/* HEADER */}

                <section className="admin-dashboard-header">

                    <div>

                        <span className="admin-welcome">
                            OOPSIBID ADMIN PANEL
                        </span>

                        <h1>
                            Dashboard
                        </h1>

                        <p>
                            Manage your marketplace,
                            auctions and users.
                        </p>

                    </div>

                </section>


                {/* STATISTICS */}

                <section className="admin-stat-grid">


                    <div className="admin-stat-card">

                        <span>
                            Total Users
                        </span>

                        <strong>
                            0
                        </strong>

                        <small>
                            Buyers + Sellers
                        </small>

                    </div>


                    <div className="admin-stat-card">

                        <span>
                            Total Products
                        </span>

                        <strong>
                            0
                        </strong>

                        <small>
                            Marketplace products
                        </small>

                    </div>


                    <div className="admin-stat-card">

                        <span>
                            Active Auctions
                        </span>

                        <strong>
                            0
                        </strong>

                        <small>
                            Currently running
                        </small>

                    </div>


                    <div className="admin-stat-card">

                        <span>
                            Total Bids
                        </span>

                        <strong>
                            0
                        </strong>

                        <small>
                            All-time bids
                        </small>

                    </div>


                </section>


                {/* MANAGEMENT */}

                <section className="admin-management">

                    <div className="section-heading">

                        <h2>
                            Management
                        </h2>

                        <p>
                            Control the OOPSIBID marketplace
                        </p>

                    </div>


                    <div className="admin-management-grid">


                        <button
                            onClick={() =>
                                navigate("/admin/users")
                            }
                        >

                            <strong>
                                Users
                            </strong>

                            <span>
                                Manage buyers and sellers
                            </span>

                        </button>


                        <button
                            onClick={() =>
                                navigate("/admin/products")
                            }
                        >

                            <strong>
                                Products
                            </strong>

                            <span>
                                Review and manage products
                            </span>

                        </button>


                        <button
                            onClick={() =>
                                navigate("/admin/auctions")
                            }
                        >

                            <strong>
                                Auctions
                            </strong>

                            <span>
                                Monitor all auctions
                            </span>

                        </button>


                        <button
                            onClick={() =>
                                navigate("/admin/bids")
                            }
                        >

                            <strong>
                                Bids
                            </strong>

                            <span>
                                Monitor bidding activity
                            </span>

                        </button>


                        <button
                            onClick={() =>
                                navigate("/admin/reports")
                            }
                        >

                            <strong>
                                Reports
                            </strong>

                            <span>
                                View marketplace reports
                            </span>

                        </button>


                        <button
                            onClick={() =>
                                navigate("/admin/profile")
                            }
                        >

                            <strong>
                                Admin Profile
                            </strong>

                            <span>
                                Manage administrator account
                            </span>

                        </button>


                    </div>

                </section>


            </main>


            <Footer />

        </div>

    );

}

export default AdminDashboard;