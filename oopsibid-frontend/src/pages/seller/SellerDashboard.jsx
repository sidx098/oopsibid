import { useNavigate } from "react-router-dom";

import SellerNavbar from "../../components/SellerNavbar";
import Footer from "../../components/Footer";

import "./SellerDashboard.css";


function SellerDashboard() {

    const navigate = useNavigate();


    return (

        <div className="seller-dashboard-page">

            <SellerNavbar />


            <main className="seller-dashboard-content">


                {/* =========================
                    HERO
                ========================= */}

                <section className="seller-hero">

                    <div className="seller-hero-content">

                        <span className="seller-eyebrow">
                            SELLER CENTER
                        </span>

                        <h1>
                            Build your next
                            <span> winning auction.</span>
                        </h1>

                        <p>
                            Manage your products, create auctions,
                            monitor bids and grow your presence on
                            OOPSIBID.
                        </p>


                        <div className="seller-hero-actions">

                            <button
                                className="primary-seller-button"
                                onClick={() =>
                                    navigate("/seller/products/add")
                                }
                            >
                                + Add Product
                            </button>


                            <button
                                className="secondary-seller-button"
                                onClick={() =>
                                    navigate("/seller/auctions/create")
                                }
                            >
                                Create Auction
                            </button>

                        </div>

                    </div>


                    <div className="seller-hero-decoration">

                        <div className="seller-glow"></div>

                        <div className="seller-circle">

                            <span>
                                SELL
                            </span>

                            <strong>
                                SMART
                            </strong>

                        </div>

                    </div>

                </section>


                {/* =========================
                    STATISTICS
                ========================= */}

                <section className="seller-stats">


                    <div className="seller-stat-card">

                        <div className="seller-stat-icon">
                            ◈
                        </div>

                        <div>

                            <span>
                                Products
                            </span>

                            <strong>
                                0
                            </strong>

                        </div>

                    </div>


                    <div className="seller-stat-card">

                        <div className="seller-stat-icon">
                            ◉
                        </div>

                        <div>

                            <span>
                                Active Auctions
                            </span>

                            <strong>
                                0
                            </strong>

                        </div>

                    </div>


                    <div className="seller-stat-card">

                        <div className="seller-stat-icon">
                            ◌
                        </div>

                        <div>

                            <span>
                                Pending Auctions
                            </span>

                            <strong>
                                0
                            </strong>

                        </div>

                    </div>


                    <div className="seller-stat-card">

                        <div className="seller-stat-icon">
                            ↗
                        </div>

                        <div>

                            <span>
                                Total Bids
                            </span>

                            <strong>
                                0
                            </strong>

                        </div>

                    </div>

                </section>


                {/* =========================
                    QUICK ACTIONS
                ========================= */}

                <section className="seller-section">

                    <div className="seller-section-heading">

                        <div>

                            <span>
                                QUICK ACTIONS
                            </span>

                            <h2>
                                What would you like to do?
                            </h2>

                        </div>

                    </div>


                    <div className="seller-action-grid">


                        <div
                            className="seller-action-card"
                            onClick={() =>
                                navigate("/seller/products/add")
                            }
                        >

                            <div className="action-number">
                                01
                            </div>

                            <h3>
                                Add Product
                            </h3>

                            <p>
                                List a new product and make it
                                available for auction.
                            </p>

                            <span>
                                Get started →
                            </span>

                        </div>


                        <div
                            className="seller-action-card"
                            onClick={() =>
                                navigate("/seller/auctions/create")
                            }
                        >

                            <div className="action-number">
                                02
                            </div>

                            <h3>
                                Create Auction
                            </h3>

                            <p>
                                Turn your product into an exciting
                                bidding opportunity.
                            </p>

                            <span>
                                Create now →
                            </span>

                        </div>


                        <div
                            className="seller-action-card"
                            onClick={() =>
                                navigate("/seller/auctions")
                            }
                        >

                            <div className="action-number">
                                03
                            </div>

                            <h3>
                                Manage Auctions
                            </h3>

                            <p>
                                Track your active and pending
                                auctions from one place.
                            </p>

                            <span>
                                View auctions →
                            </span>

                        </div>


                        <div
                            className="seller-action-card"
                            onClick={() =>
                                navigate("/seller/bids")
                            }
                        >

                            <div className="action-number">
                                04
                            </div>

                            <h3>
                                Monitor Bids
                            </h3>

                            <p>
                                See buyer activity and monitor
                                bidding on your auctions.
                            </p>

                            <span>
                                View bids →
                            </span>

                        </div>

                    </div>

                </section>


                {/* =========================
                    SELLER TIPS
                ========================= */}

                <section className="seller-tip">

                    <div>

                        <span>
                            SELLER TIP
                        </span>

                        <h2>
                            Great listings attract
                            better bids.
                        </h2>

                        <p>
                            Add clear images, detailed descriptions
                            and accurate product information to give
                            buyers confidence.
                        </p>

                    </div>

                    <div className="tip-arrow">
                        ↗
                    </div>

                </section>


            </main>


            <Footer />

        </div>
    );
}


export default SellerDashboard;
