import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./Auctions.css";

function Auctions() {

    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ==========================================
    // LOAD APPROVED AUCTIONS
    // ==========================================

    useEffect(() => {

        const loadAuctions = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await fetch(
                    "http://localhost:8081/api/auctions"
                );

                const text =
                    await response.text();

                console.log(
                    "AUCTIONS:",
                    response.status,
                    text
                );

                if (!response.ok) {

                    setError(
                        `Unable to load auctions: ${response.status}`
                    );

                    return;
                }

                const data =
                    text
                        ? JSON.parse(text)
                        : [];

                // Only approved auctions
                const approvedAuctions =
                    data.filter(
                        auction =>
                            auction.status &&
                            auction.status.toUpperCase() ===
                            "APPROVED"
                    );

                setAuctions(
                    approvedAuctions
                );

            } catch (err) {

                console.error(
                    "Auction loading error:",
                    err
                );

                setError(
                    "Unable to connect to server."
                );

            } finally {

                setLoading(false);
            }
        };

        loadAuctions();

    }, []);


    // ==========================================
    // FORMAT PRICE
    // ==========================================

    const formatPrice = (price) => {

        return Number(price || 0)
            .toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
    };


    // ==========================================
    // COUNTDOWN
    // ==========================================

    const getTimeLeft = (endTime) => {

        if (!endTime) {
            return "No end time";
        }

        const difference =
            new Date(endTime).getTime() -
            new Date().getTime();

        if (difference <= 0) {
            return "Auction ended";
        }

        const hours =
            Math.floor(
                difference / (1000 * 60 * 60)
            );

        const minutes =
            Math.floor(
                (difference %
                    (1000 * 60 * 60)) /
                    (1000 * 60)
            );

        const seconds =
            Math.floor(
                (difference %
                    (1000 * 60)) /
                    1000
            );

        return `${String(hours).padStart(2, "0")}:${String(
            minutes
        ).padStart(2, "0")}:${String(
            seconds
        ).padStart(2, "0")}`;
    };


    return (

        <div className="auctions-page">

            <Navbar />


            {/* ==================================
                HEADER
            ================================== */}

            <section className="auctions-header">

                <div className="auctions-header-content">

                    <span className="section-label">
                        OOPSIBID MARKETPLACE
                    </span>

                    <h1>
                        LIVE <strong>AUCTIONS</strong>
                    </h1>

                    <p>
                        Discover exclusive products and
                        compete in one-shot sealed bidding.
                    </p>

                </div>

            </section>


            {/* ==================================
                AUCTIONS
            ================================== */}

            <main className="auctions-container">

                {loading && (

                    <div className="auction-message">
                        Loading auctions...
                    </div>

                )}


                {error && (

                    <div className="auction-error">
                        {error}
                    </div>

                )}


                {!loading &&
                 !error &&
                 auctions.length === 0 && (

                    <div className="auction-message">

                        <div className="empty-icon">
                            ⏳
                        </div>

                        <h2>
                            No live auctions
                        </h2>

                        <p>
                            Check back soon for new
                            approved auctions.
                        </p>

                    </div>

                )}


                {!loading &&
                 !error &&
                 auctions.length > 0 && (

                    <div className="auctions-grid">

                        {auctions.map(
                            auction => (

                            <AuctionItem
                                key={auction.id}
                                auction={auction}
                                formatPrice={formatPrice}
                                getTimeLeft={getTimeLeft}
                            />

                        ))}

                    </div>

                )}

            </main>


            <Footer />

        </div>
    );
}


// ==========================================
// AUCTION ITEM
// ==========================================

function AuctionItem({
    auction,
    formatPrice,
    getTimeLeft
}) {

    const [timeLeft, setTimeLeft] =
        useState(
            getTimeLeft(auction.endTime)
        );


    // ==========================================
    // LIVE COUNTDOWN
    // ==========================================

    useEffect(() => {

        const timer =
            setInterval(() => {

                setTimeLeft(
                    getTimeLeft(
                        auction.endTime
                    )
                );

            }, 1000);

        return () => clearInterval(timer);

    }, [auction.endTime]);


    return (

        <article className="auction-item">

            <div className="auction-item-image">

                <span className="auction-live-tag">
                    ● LIVE
                </span>

                <span className="auction-category">
                    AUCTION
                </span>

                <div className="auction-placeholder">
                    OOPSIBID
                </div>

            </div>


            <div className="auction-item-content">

                <div className="auction-product-info">

                    <span>
                        STARTING PRICE
                    </span>

                    <h2>
                        ₹{formatPrice(
                            auction.startingPrice
                        )}
                    </h2>

                </div>


                <div className="auction-time-box">

                    <span>
                        ENDS IN
                    </span>

                    <strong>
                        {timeLeft}
                    </strong>

                </div>


                <button
                    className="auction-view-button"
                    onClick={() =>
                        window.location.href =
                            `/auctions/${auction.id}`
                    }
                >
                    VIEW AUCTION →
                </button>

            </div>

        </article>
    );
}

export default Auctions;