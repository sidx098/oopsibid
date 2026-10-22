import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BuyerNavbar from "../../components/BuyerNavbar";
import Footer from "../../components/Footer";

import "./BuyerAuctionDetails.css";


function BuyerAuctionDetails() {

    const navigate = useNavigate();

    const { id } = useParams();

    const [auction, setAuction] = useState(null);

    const [bidAmount, setBidAmount] = useState("");

    const [loading, setLoading] = useState(true);

    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // ==========================================
    // LOAD AUCTION
    // ==========================================

    const loadAuction = async () => {

        setLoading(true);
        setError("");

        try {

            const token =
                localStorage.getItem("token");

            const response =
                await fetch(
                    `http://localhost:8081/api/auctions/${id}`,
                    {
                        method: "GET",

                        headers: token
                            ? {
                                "Authorization":
                                    `Bearer ${token}`
                            }
                            : {}
                    }
                );

            const responseText =
                await response.text();

            console.log(
                "AUCTION DETAILS:",
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
                JSON.parse(responseText);

            setAuction(data);

            // Suggested first bid
            if (data.startingPrice) {

                setBidAmount(
                    String(
                        Number(data.startingPrice) + 1
                    )
                );
            }

        } catch (error) {

            console.error(
                "Auction details error:",
                error
            );

            setError(
                "Unable to connect to server."
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        if (!id) {

            setError(
                "Auction ID is missing."
            );

            setLoading(false);

            return;
        }

        loadAuction();

    }, [id]);


    // ==========================================
    // PLACE BID
    // ==========================================

    const handlePlaceBid = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        const token =
            localStorage.getItem("token");


        if (!token) {

            setError(
                "Please login as a buyer."
            );

            return;
        }


        if (!bidAmount ||
            Number(bidAmount) <= 0) {

            setError(
                "Please enter a valid bid amount."
            );

            return;
        }


        if (
            Number(bidAmount) <=
            Number(auction.startingPrice)
        ) {

            setError(
                "Your bid must be greater than the starting price."
            );

            return;
        }


        try {

            setSubmitting(true);


            const payload = {

                auctionId: auction.id,

                amount: Number(bidAmount)

            };


            console.log(
                "PLACE BID PAYLOAD:",
                payload
            );


            const response =
                await fetch(
                    "http://localhost:8081/api/bids",
                    {
                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`
                        },

                        body:
                            JSON.stringify(payload)
                    }
                );


            const responseText =
                await response.text();


            console.log(
                "PLACE BID RESPONSE:",
                response.status,
                responseText
            );


            if (!response.ok) {

                setError(
                    `Server returned ${response.status}: ${responseText}`
                );

                return;
            }


            setSuccess(
                "Your bid has been placed successfully!"
            );


            setBidAmount("");


        } catch (error) {

            console.error(
                "Place bid error:",
                error
            );

            setError(
                "Unable to connect to server."
            );

        } finally {

            setSubmitting(false);
        }
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="buyer-auction-details-page">

                <BuyerNavbar />

                <main className="buyer-details-content">

                    <div className="buyer-details-message">
                        Loading auction...
                    </div>

                </main>

                <Footer />

            </div>
        );
    }


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div className="buyer-auction-details-page">

            <BuyerNavbar />


            <main className="buyer-details-content">


                {/* =================================
                    BACK
                ================================= */}

                <button
                    className="buyer-back-button"
                    onClick={() =>
                        navigate("/buyer/auctions")
                    }
                >
                    ← Back to Auctions
                </button>


                {/* =================================
                    ERROR
                ================================= */}

                {error && (

                    <div className="buyer-details-error">
                        {error}
                    </div>

                )}


                {auction && (

                    <div className="buyer-details-layout">


                        {/* =================================
                            AUCTION INFORMATION
                        ================================= */}

                        <section className="buyer-auction-info-card">

                            <div className="buyer-detail-top">

                                <span>
                                    AUCTION
                                </span>

                                <strong>
                                    {auction.status}
                                </strong>

                            </div>


                            <div className="buyer-detail-product">

                                <small>
                                    PRODUCT ID
                                </small>

                                <h1>
                                    {auction.productId}
                                </h1>

                            </div>


                            <div className="buyer-detail-price">

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


                            <div className="buyer-detail-times">

                                <div>

                                    <small>
                                        START TIME
                                    </small>

                                    <p>
                                        {new Date(
                                            auction.startTime
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </p>

                                </div>


                                <div>

                                    <small>
                                        END TIME
                                    </small>

                                    <p>
                                        {new Date(
                                            auction.endTime
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </p>

                                </div>

                            </div>


                            <div className="buyer-detail-info">

                                <div>

                                    <span>
                                        Current Winner
                                    </span>

                                    <strong>
                                        {auction.winnerId ||
                                            "No winner yet"}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Winning Bid
                                    </span>

                                    <strong>
                                        {auction.winningBid
                                            ? `₹${Number(
                                                auction.winningBid
                                            ).toLocaleString(
                                                "en-IN"
                                            )}`
                                            : "No bids yet"}
                                    </strong>

                                </div>

                            </div>

                        </section>


                        {/* =================================
                            BID FORM
                        ================================= */}

                        <section className="buyer-place-bid-card">

                            <span className="bid-eyebrow">
                                PLACE YOUR BID
                            </span>

                            <h2>
                                Make Your Move
                            </h2>

                            <p>
                                Enter an amount greater than
                                the current starting price.
                            </p>


                            {success && (

                                <div className="buyer-bid-success">

                                    {success}

                                </div>

                            )}


                            <form
                                onSubmit={handlePlaceBid}
                            >

                                <label>
                                    Your Bid Amount
                                </label>


                                <div className="buyer-bid-input">

                                    <span>
                                        ₹
                                    </span>

                                    <input
                                        type="number"
                                        min={
                                            Number(
                                                auction.startingPrice
                                            ) + 1
                                        }
                                        step="0.01"
                                        value={bidAmount}
                                        onChange={(event) =>
                                            setBidAmount(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter your bid"
                                    />

                                </div>


                                <div className="buyer-minimum-bid">

                                    <span>
                                        Minimum bid
                                    </span>

                                    <strong>
                                        ₹
                                        {(
                                            Number(
                                                auction.startingPrice
                                            ) + 1
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>

                                </div>


                                <button
                                    type="submit"
                                    className="place-bid-button"
                                    disabled={submitting}
                                >

                                    {submitting
                                        ? "Placing Bid..."
                                        : "Place Bid →"
                                    }

                                </button>

                            </form>


                            <div className="bid-warning">

                                <span>
                                    ◆
                                </span>

                                <p>
                                    Make sure your bid is correct
                                    before submitting. Bids are
                                    recorded against your account.
                                </p>

                            </div>

                        </section>

                    </div>

                )}

            </main>


            <Footer />

        </div>
    );
}


export default BuyerAuctionDetails;