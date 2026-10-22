import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AuctionCard({
    auctionId,
    productName,
    price,
    endTime,
    category,
    image
}) {

    const navigate = useNavigate();

    const [timeLeft, setTimeLeft] = useState(
        calculateTimeLeft()
    );

    function calculateTimeLeft() {

        if (!endTime) {
            return "00:00:00";
        }

        const difference =
            new Date(endTime).getTime() -
            new Date().getTime();

        if (difference <= 0) {
            return "ENDED";
        }

        const totalSeconds =
            Math.floor(difference / 1000);

        const hours =
            Math.floor(totalSeconds / 3600);

        const minutes =
            Math.floor(
                (totalSeconds % 3600) / 60
            );

        const seconds =
            totalSeconds % 60;

        return (
            String(hours).padStart(2, "0") +
            ":" +
            String(minutes).padStart(2, "0") +
            ":" +
            String(seconds).padStart(2, "0")
        );
    }


    // ==========================================
    // LIVE COUNTDOWN
    // ==========================================

    useEffect(() => {

        const timer =
            setInterval(() => {

                setTimeLeft(
                    calculateTimeLeft()
                );

            }, 1000);

        return () => {
            clearInterval(timer);
        };

    }, [endTime]);


    // ==========================================
    // OPEN AUCTION
    // ==========================================

    const handleBid = () => {

        if (!auctionId) {
            navigate("/auctions");
            return;
        }

        navigate(`/auctions/${auctionId}`);
    };


    return (

        <div className="auction-card">

            <div className="auction-image">

                {timeLeft !== "ENDED" && (
                    <span className="live-tag">
                        LIVE
                    </span>
                )}

                {timeLeft === "ENDED" && (
                    <span className="live-tag">
                        ENDED
                    </span>
                )}

                <span className="category-tag">
                    {category || "AUCTION"}
                </span>


                {image ? (

                    <img
                        src={image}
                        alt={productName}
                        className="auction-product-image"
                    />

                ) : (

                    <div className="image-placeholder">
                        PRODUCT
                    </div>

                )}

            </div>


            <div className="auction-content">

                <h3>
                    {productName || "Auction Product"}
                </h3>


                <div className="auction-price">

                    <div>

                        <small>
                            Starting Price
                        </small>

                        <strong>
                            ₹{Number(price || 0).toLocaleString("en-IN")}
                        </strong>

                    </div>


                    <div className="auction-time">

                        <small>
                            Ends In
                        </small>

                        <strong>
                            {timeLeft}
                        </strong>

                    </div>

                </div>


                <button
                    className="card-bid-button"
                    onClick={handleBid}
                    disabled={timeLeft === "ENDED"}
                >

                    {timeLeft === "ENDED"
                        ? "AUCTION ENDED"
                        : "VIEW AUCTION →"
                    }

                </button>

            </div>

        </div>
    );
}

export default AuctionCard;