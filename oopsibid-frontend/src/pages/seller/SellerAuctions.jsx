import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import SellerNavbar from "../../components/SellerNavbar";
import Footer from "../../components/Footer";

import "./SellerAuctions.css";

function SellerAuctions() {

    const navigate = useNavigate();

    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==========================================
    // LOAD MY AUCTIONS
    // ==========================================

    const loadAuctions = async () => {

        setLoading(true);
        setError("");

        try {

            const token =
                localStorage.getItem("token");

            if (!token) {

                setError(
                    "Please login as a seller."
                );

                setLoading(false);
                return;
            }

            const response =
                await fetch(
                    "http://localhost:8081/api/seller/auctions",
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
                "MY AUCTIONS:",
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
                "Auction loading error:",
                error
            );

            setError(
                "Unable to load your auctions."
            );

        } finally {

            setLoading(false);
        }
    };


    // ==========================================
    // LOAD WHEN PAGE OPENS
    // ==========================================

    useEffect(() => {

        loadAuctions();

    }, []);


    // ==========================================
    // STATUS CLASS
    // ==========================================

    const getStatusClass = (status) => {

        if (!status) {
            return "";
        }

        return status
            .toLowerCase()
            .replace(/\s+/g, "-");
    };


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


    return (

        <div className="seller-auctions-page">

            <SellerNavbar />


            <main className="seller-auctions-content">

                {/* =================================
                    HEADER
                ================================= */}

                <div className="seller-auctions-header">

                    <div>

                        <span>
                            SELLER CENTER
                        </span>

                        <h1>
                            My Auctions
                        </h1>

                        <p>
                            Manage and monitor all your auctions.
                        </p>

                    </div>


                    <div className="seller-auction-header-actions">

                        <button
                            className="refresh-button"
                            onClick={loadAuctions}
                        >
                            Refresh
                        </button>

                        <button
                            className="create-auction-button"
                            onClick={() =>
                                navigate(
                                    "/seller/products"
                                )
                            }
                        >
                            + Create Auction
                        </button>

                    </div>

                </div>


                {/* =================================
                    LOADING
                ================================= */}

                {loading && (

                    <div className="seller-auction-message">

                        Loading your auctions...

                    </div>

                )}


                {/* =================================
                    ERROR
                ================================= */}

                {!loading && error && (

                    <div className="seller-auction-error">

                        {error}

                    </div>

                )}


                {/* =================================
                    EMPTY
                ================================= */}

                {!loading &&
                 !error &&
                 auctions.length === 0 && (

                    <div className="empty-auctions">

                        <div className="empty-icon">
                            +
                        </div>

                        <h2>
                            No Auctions Yet
                        </h2>

                        <p>
                            You haven't created any auctions yet.
                        </p>

                        <button
                            onClick={() =>
                                navigate(
                                    "/seller/products"
                                )
                            }
                        >
                            Create Your First Auction
                        </button>

                    </div>

                )}


                {/* =================================
                    AUCTION CARDS
                ================================= */}

                {!loading &&
                 !error &&
                 auctions.length > 0 && (

                    <div className="seller-auctions-grid">

                        {auctions.map(
                            (auction) => (

                            <div
                                className="seller-auction-card"
                                key={auction.id}
                            >

                                <div className="auction-card-top">

                                    <span className="auction-label">
                                        AUCTION
                                    </span>

                                    <span
                                        className={
                                            `seller-auction-status ${
                                                getStatusClass(
                                                    auction.status
                                                )
                                            }`
                                        }
                                    >
                                        {auction.status ||
                                            "UNKNOWN"}
                                    </span>

                                </div>


                                <div className="auction-product">

                                    <small>
                                        PRODUCT ID
                                    </small>

                                    <h2>
                                        {auction.productId ||
                                            "-"}
                                    </h2>

                                </div>


                                <div className="auction-price">

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


                                <div className="auction-times">

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
                                            END
                                        </small>

                                        <p>
                                            {formatDate(
                                                auction.endTime
                                            )}
                                        </p>

                                    </div>

                                </div>


                                <div className="auction-winner">

                                    <div>

                                        <small>
                                            WINNER
                                        </small>

                                        <p>
                                            {auction.winnerId ||
                                                "No winner yet"}
                                        </p>

                                    </div>


                                    <div>

                                        <small>
                                            WINNING BID
                                        </small>

                                        <p>
                                            {auction.winningBid
                                                ? `₹${Number(
                                                    auction.winningBid
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}`
                                                : "-"
                                            }
                                        </p>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </main>


            <Footer />

        </div>
    );
}

export default SellerAuctions;