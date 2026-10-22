import { useNavigate } from "react-router-dom";

import BuyerNavbar from "../../components/BuyerNavbar";
import Footer from "../../components/Footer";

import "./BuyerDashboard.css";


function BuyerDashboard() {

    const navigate = useNavigate();


    return (

        <div className="buyer-dashboard-page">

            <BuyerNavbar />


            <main className="buyer-dashboard-content">


                {/* =================================
                    HERO
                ================================= */}

                <section className="buyer-dashboard-hero">

                    <div className="buyer-hero-content">

                        <span className="buyer-eyebrow">
                            BUYER CENTER
                        </span>

                        <h1>
                            Find Something
                            <span> Worth Bidding For.</span>
                        </h1>

                        <p>
                            Discover unique products,
                            compete with other bidders,
                            and win auctions on OOPSIBID.
                        </p>


                        <div className="buyer-hero-actions">

                            <button
                                className="buyer-primary-button"
                                onClick={() =>
                                    navigate(
                                        "/buyer/auctions"
                                    )
                                }
                            >
                                Browse Auctions →
                            </button>


                            <button
                                className="buyer-secondary-button"
                                onClick={() =>
                                    navigate(
                                        "/buyer/bids"
                                    )
                                }
                            >
                                View My Bids
                            </button>

                        </div>

                    </div>


                    <div className="buyer-hero-visual">

                        <div className="buyer-visual-card">

                            <div className="buyer-visual-dot"></div>

                            <span>
                                LIVE AUCTIONS
                            </span>

                            <strong>
                                BID.
                            </strong>

                            <strong>
                                COMPETE.
                            </strong>

                            <strong className="green-text">
                                WIN.
                            </strong>

                        </div>

                    </div>

                </section>


                {/* =================================
                    QUICK ACTIONS
                ================================= */}

                <section className="buyer-quick-section">

                    <div className="buyer-section-heading">

                        <span>
                            QUICK ACCESS
                        </span>

                        <h2>
                            Your Auction Hub
                        </h2>

                    </div>


                    <div className="buyer-quick-grid">


                        {/* AUCTIONS */}

                        <div
                            className="buyer-quick-card"
                            onClick={() =>
                                navigate(
                                    "/buyer/auctions"
                                )
                            }
                        >

                            <div className="buyer-card-icon">
                                ↗
                            </div>

                            <span>
                                EXPLORE
                            </span>

                            <h3>
                                Live Auctions
                            </h3>

                            <p>
                                Browse products currently
                                available for bidding.
                            </p>

                            <strong>
                                Explore →
                            </strong>

                        </div>


                        {/* BIDS */}

                        <div
                            className="buyer-quick-card"
                            onClick={() =>
                                navigate(
                                    "/buyer/bids"
                                )
                            }
                        >

                            <div className="buyer-card-icon">
                                ◈
                            </div>

                            <span>
                                TRACK
                            </span>

                            <h3>
                                My Bids
                            </h3>

                            <p>
                                Monitor your active bids
                                and auction results.
                            </p>

                            <strong>
                                View Bids →
                            </strong>

                        </div>


                        {/* PROFILE */}

                        <div
                            className="buyer-quick-card"
                            onClick={() =>
                                navigate(
                                    "/buyer/profile"
                                )
                            }
                        >

                            <div className="buyer-card-icon">
                                ○
                            </div>

                            <span>
                                ACCOUNT
                            </span>

                            <h3>
                                My Profile
                            </h3>

                            <p>
                                View and manage your
                                buyer account.
                            </p>

                            <strong>
                                Open Profile →
                            </strong>

                        </div>

                    </div>

                </section>


                {/* =================================
                    HOW IT WORKS
                ================================= */}

                <section className="buyer-how-section">

                    <div className="buyer-section-heading">

                        <span>
                            HOW IT WORKS
                        </span>

                        <h2>
                            Bid in Three Steps
                        </h2>

                    </div>


                    <div className="buyer-steps">


                        <div className="buyer-step">

                            <div className="step-number">
                                01
                            </div>

                            <h3>
                                Discover
                            </h3>

                            <p>
                                Find an auction that
                                interests you.
                            </p>

                        </div>


                        <div className="buyer-step">

                            <div className="step-number">
                                02
                            </div>

                            <h3>
                                Bid
                            </h3>

                            <p>
                                Place your competitive
                                bid before the auction ends.
                            </p>

                        </div>


                        <div className="buyer-step">

                            <div className="step-number">
                                03
                            </div>

                            <h3>
                                Win
                            </h3>

                            <p>
                                Become the highest bidder
                                and win the auction.
                            </p>

                        </div>

                    </div>

                </section>

            </main>


            <Footer />

        </div>
    );
}


export default BuyerDashboard;