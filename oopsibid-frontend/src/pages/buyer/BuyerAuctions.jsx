import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import BuyerNavbar from "../../components/BuyerNavbar";
import Footer from "../../components/Footer";

import "./BuyerAuctions.css";


function BuyerAuctions() {

    const navigate = useNavigate();

    const [auctions, setAuctions] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ==========================================
    // LOAD ACTIVE AUCTIONS
    // ==========================================

    const loadAuctions = async () => {

        setLoading(true);
        setError("");

        try {

            const token =
                localStorage.getItem("token");

            const headers = {};

            if (token) {
                headers.Authorization =
                    `Bearer ${token}`;
            }

            const response =
                await fetch(
                    "http://localhost:8081/api/auctions/active",
                    {
                        method: "GET",
                        headers: headers
                    }
                );

            const responseText =
                await response.text();

            console.log(
                "BUYER AUCTIONS:",
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

            setAuctions(data);

        } catch (error) {

            console.error(
                "Buyer auctions error:",
                error
            );

            setError(
                "Unable to connect to server."
            );

        } finally {

            setLoading(false);
        }
    };


    // ==========================================
    // LOAD PAGE
    // ==========================================

    useEffect(() => {

        loadAuctions();

    }, []);


    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date)
            .toLocaleString("en-IN");
    };


    // ==========================================
    // AUCTION STATUS
    // ==========================================

    const getStatusClass = (status) => {

        if (!status) {
            return "";
        }

        return status
            .toLowerCase()
            .replace(/\s+/g, "-");
    };


    return (

        <div className="buyer-auctions-page">

            <BuyerNavbar />


            <main className="buyer-auctions-content">


                {/* =================================
                    HEADER
                ================================= */}

                <section className="buyer-auctions-header">

                    <div>

                        <span className="buyer-auctions-eyebrow">
                            BUYER CENTER
                        </span>

                        <h1>
                            Live Auctions
                        </h1>

                        <p>
                            Discover products and place
                            your bids before the auction ends.
                        </p>

                    </div>


                    <button
                        className="buyer-refresh-button"
                        onClick={loadAuctions}
                    >
                        ↻ Refresh
                    </button>

                </section>


                {/* =================================
                    LOADING
                ================================= */}

                {loading && (

                    <div className="buyer-auctions-message">

                        <div className="buyer-loader"></div>

                        <p>
                            Loading live auctions...
                        </p>

                    </div>

                )}


                {/* =================================
                    ERROR
                ================================= */}

                {!loading && error && (

                    <div className="buyer-auctions-error">

                        <strong>
                            Unable to load auctions
                        </strong>

                        <p>
                            {error}
                        </p>

                        <button
                            onClick={loadAuctions}
                        >
                            Try Again
                        </button>

                    </div>

                )}


                {/* =================================
                    EMPTY
                ================================= */}

                {!loading &&
                 !error &&
                 auctions.length === 0 && (

                    <div className="buyer-auctions-empty">

                        <div className="buyer-empty-icon">
                            ◈
                        </div>

                        <h2>
                            No Live Auctions
                        </h2>

                        <p>
                            There are currently no active
                            auctions available for bidding.
                        </p>

                        <button
                            onClick={loadAuctions}
                        >
                            Refresh Auctions
                        </button>

                    </div>

                )}


                {/* =================================
                    AUCTION GRID
                ================================= */}

                {!loading &&
                 !error &&
                 auctions.length > 0 && (

                    <section>

                        <div className="buyer-auction-count">

                            <span>
                                LIVE NOW
                            </span>

                            <strong>
                                {auctions.length}{" "}
                                {auctions.length === 1
                                    ? "Auction"
                                    : "Auctions"}
                            </strong>

                        </div>


                        <div className="buyer-auction-grid">

                            {auctions.map(
                                (auction) => (

                                <article
                                    className="buyer-auction-card"
                                    key={auction.id}
                                >

                                    {/* TOP */}

                                    <div className="buyer-auction-card-top">

                                        <span>
                                            AUCTION
                                        </span>

                                        <span
                                            className={
                                                `buyer-auction-status ${
                                                    getStatusClass(
                                                        auction.status
                                                    )
                                                }`
                                            }
                                        >
                                            {auction.status}
                                        </span>

                                    </div>


                                    {/* PRODUCT */}

                                    <div className="buyer-auction-product">

                                        <small>
                                            PRODUCT ID
                                        </small>

                                        <h2>
                                            {auction.productId ||
                                                "-"}
                                        </h2>

                                    </div>


                                    {/* PRICE */}

                                    <div className="buyer-auction-price">

                                        <span>
                                            Starting Price
                                        </span>

                                        <strong>
                                            ₹
                                            {Number(
                                                auction.startingPrice
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </strong>

                                    </div>


                                    {/* TIME */}

                                    <div className="buyer-auction-times">

                                        <div>

                                            <small>
                                                START
                                            </small>

                                            <p>
                                                {formatDate(
                                                    auction.startTime
                                                )}
                                            </p>

                                        </div>


                                        <div>

                                            <small>
                                                ENDS
                                            </small>

                                            <p>
                                                {formatDate(
                                                    auction.endTime
                                                )}
                                            </p>

                                        </div>

                                    </div>


                                    {/* BUTTON */}

                                    <button
                                        className="buyer-view-auction-button"
                                        onClick={() =>
                                            navigate(
                                                `/buyer/auctions/${auction.id}`
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


export default BuyerAuctions;