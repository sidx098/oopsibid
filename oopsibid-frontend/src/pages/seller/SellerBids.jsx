import { useEffect, useState } from "react";

import SellerNavbar from "../../components/SellerNavbar";
import Footer from "../../components/Footer";

import "./SellerBids.css";

function SellerBids() {

    const [bids, setBids] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ==========================================
    // LOAD SELLER BIDS
    // ==========================================

    const loadBids = async () => {

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
                    "http://localhost:8081/api/bids/seller",
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
                "SELLER BIDS:",
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
                "Seller bids error:",
                error
            );

            setError(
                "Unable to load your bids."
            );

        } finally {

            setLoading(false);
        }
    };


    // ==========================================
    // LOAD PAGE
    // ==========================================

    useEffect(() => {

        loadBids();

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
    // RENDER
    // ==========================================

    return (

        <div className="seller-bids-page">

            <SellerNavbar />


            <main className="seller-bids-content">

                {/* HEADER */}

                <section className="seller-bids-header">

                    <div>

                        <span>
                            SELLER CENTER
                        </span>

                        <h1>
                            My Bids
                        </h1>

                        <p>
                            Monitor bids placed on your auctions.
                        </p>

                    </div>


                    <button
                        className="refresh-bids-button"
                        onClick={loadBids}
                    >
                        Refresh
                    </button>

                </section>


                {/* LOADING */}

                {loading && (

                    <div className="seller-bids-message">

                        Loading your bids...

                    </div>

                )}


                {/* ERROR */}

                {!loading && error && (

                    <div className="seller-bids-error">

                        {error}

                        <button
                            onClick={loadBids}
                        >
                            Try Again
                        </button>

                    </div>

                )}


                {/* EMPTY */}

                {!loading &&
                 !error &&
                 bids.length === 0 && (

                    <div className="seller-bids-empty">

                        <div className="empty-bid-icon">
                            ◈
                        </div>

                        <h2>
                            No Bids Yet
                        </h2>

                        <p>
                            No bids have been placed on your
                            auctions yet.
                        </p>

                    </div>

                )}


                {/* BIDS */}

                {!loading &&
                 !error &&
                 bids.length > 0 && (

                    <section className="seller-bids-section">

                        <div className="bids-count">

                            <span>
                                TOTAL BIDS
                            </span>

                            <strong>
                                {bids.length}
                            </strong>

                        </div>


                        <div className="seller-bids-grid">

                            {bids.map(
                                (bid) => (

                                <article
                                    className="seller-bid-card"
                                    key={bid.id}
                                >

                                    <div className="bid-card-header">

                                        <span>
                                            BID
                                        </span>

                                        <span>
                                            {bid.status ||
                                                "ACTIVE"}
                                        </span>

                                    </div>


                                    <div className="bid-information">

                                        <div>

                                            <small>
                                                AUCTION ID
                                            </small>

                                            <strong>
                                                {bid.auctionId ||
                                                    "-"}
                                            </strong>

                                        </div>


                                        <div>

                                            <small>
                                                BIDDER
                                            </small>

                                            <strong>
                                                {bid.bidderId ||
                                                    bid.userId ||
                                                    "-"}
                                            </strong>

                                        </div>


                                        <div>

                                            <small>
                                                BID AMOUNT
                                            </small>

                                            <strong>
                                                ₹
                                                {Number(
                                                    bid.amount ||
                                                    bid.bidAmount ||
                                                    0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </strong>

                                        </div>


                                        <div>

                                            <small>
                                                DATE
                                            </small>

                                            <strong>
                                                {formatDate(
                                                    bid.createdAt ||
                                                    bid.bidTime ||
                                                    bid.timestamp
                                                )}
                                            </strong>

                                        </div>

                                    </div>

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


export default SellerBids;