import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import BuyerNavbar from "../../components/BuyerNavbar";
import Footer from "../../components/Footer";

import "./BuyerBids.css";

function BuyerBids() {

    const navigate = useNavigate();

    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =====================================================
    // LOAD MY BIDS
    // =====================================================

    const loadBids = async () => {

        setLoading(true);
        setError("");

        try {

            const token =
                localStorage.getItem("token");

            if (!token) {

                setError(
                    "Please login as a buyer."
                );

                setLoading(false);

                return;
            }


            const response =
                await fetch(
                    "http://localhost:8081/api/bids/buyer",
                    {
                        method: "GET",

                        headers: {
                            "Authorization":
                                `Bearer ${token}`,

                            "Content-Type":
                                "application/json"
                        }
                    }
                );


            const responseText =
                await response.text();


            console.log(
                "MY BIDS:",
                response.status,
                responseText
            );


            if (!response.ok) {

                setError(
                    `Server returned ${response.status}: ${responseText}`
                );

                return;
            }


            const data =
                responseText
                    ? JSON.parse(responseText)
                    : [];


            setBids(data);


        } catch (error) {

            console.error(
                "My bids loading error:",
                error
            );

            setError(
                "Unable to load your bids."
            );

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // LOAD PAGE
    // =====================================================

    useEffect(() => {

        loadBids();

    }, []);


    // =====================================================
    // STATUS CLASS
    // =====================================================

    const getStatusClass = (status) => {

        if (!status) {
            return "";
        }

        return status
            .toLowerCase()
            .replace(/\s+/g, "-");
    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        try {

            return new Date(date)
                .toLocaleString("en-IN");

        } catch {

            return date;
        }
    };


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="buyer-bids-page">

            <BuyerNavbar />


            <main className="buyer-bids-content">


                {/* =================================================
                    HEADER
                ================================================= */}

                <section className="buyer-bids-header">

                    <div>

                        <span>
                            BUYER CENTER
                        </span>

                        <h1>
                            My Bids
                        </h1>

                        <p>
                            Track all the bids you have placed.
                        </p>

                    </div>


                    <button
                        className="refresh-bids-button"
                        onClick={loadBids}
                    >
                        Refresh
                    </button>

                </section>


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (

                    <div className="buyer-bids-message">

                        <div className="buyer-bids-loader"></div>

                        <p>
                            Loading your bids...
                        </p>

                    </div>

                )}


                {/* =================================================
                    ERROR
                ================================================= */}

                {!loading && error && (

                    <div className="buyer-bids-error">

                        <h3>
                            Unable to load bids
                        </h3>

                        <p>
                            {error}
                        </p>

                        <button
                            onClick={loadBids}
                        >
                            Try Again
                        </button>

                    </div>

                )}


                {/* =================================================
                    EMPTY
                ================================================= */}

                {!loading &&
                 !error &&
                 bids.length === 0 && (

                    <div className="buyer-bids-empty">

                        <div className="empty-bid-icon">
                            ₹
                        </div>

                        <h2>
                            No Bids Yet
                        </h2>

                        <p>
                            You haven't placed any bids yet.
                        </p>

                        <button
                            onClick={() =>
                                navigate(
                                    "/buyer/auctions"
                                )
                            }
                        >
                            Browse Auctions
                        </button>

                    </div>

                )}


                {/* =================================================
                    BIDS
                ================================================= */}

                {!loading &&
                 !error &&
                 bids.length > 0 && (

                    <section className="buyer-bids-section">


                        <div className="buyer-bids-summary">

                            <span>
                                YOUR ACTIVITY
                            </span>

                            <strong>
                                {bids.length}{" "}
                                {bids.length === 1
                                    ? "Bid"
                                    : "Bids"}
                            </strong>

                        </div>


                        <div className="buyer-bids-grid">

                            {bids.map((bid) => (

                                <article
                                    className="buyer-bid-card"
                                    key={bid.id}
                                >


                                    {/* TOP */}

                                    <div className="buyer-bid-card-top">

                                        <span className="bid-label">
                                            BID
                                        </span>

                                        <span
                                            className={
                                                `bid-status ${
                                                    getStatusClass(
                                                        bid.status
                                                    )
                                                }`
                                            }
                                        >
                                            {bid.status ||
                                                "UNKNOWN"}
                                        </span>

                                    </div>


                                    {/* AUCTION */}

                                    <div className="buyer-bid-auction">

                                        <small>
                                            AUCTION ID
                                        </small>

                                        <h2>
                                            {bid.auctionId ||
                                                "-"}
                                        </h2>

                                    </div>


                                    {/* AMOUNT */}

                                    <div className="buyer-bid-amount">

                                        <span>
                                            Your Bid
                                        </span>

                                        <strong>
                                            ₹
                                            {Number(
                                                bid.amount
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </strong>

                                    </div>


                                    {/* DATE */}

                                    <div className="buyer-bid-date">

                                        <small>
                                            BID PLACED
                                        </small>

                                        <p>
                                            {formatDate(
                                                bid.bidTime
                                            )}
                                        </p>

                                    </div>


                                    {/* ACTION */}

                                    <button
                                        className="view-auction-button"
                                        onClick={() =>
                                            navigate(
                                                `/buyer/auctions/${bid.auctionId}`
                                            )
                                        }
                                    >
                                        View Auction →
                                    </button>

                                </article>

                            ))}

                        </div>

                    </section>

                )}

            </main>


            <Footer />

        </div>
    );
}

export default BuyerBids;