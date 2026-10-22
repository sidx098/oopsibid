import { useNavigate } from "react-router-dom";

function Hero() {

    const navigate = useNavigate();

    return (
        <section className="hero-section">

            <div className="hero-content">

                <div className="hero-badge">
                    ● LIVE AUCTIONS EVERY DAY
                </div>

                <h1>
                    BID ON WHAT
                    <br />
                    <span>YOU LOVE.</span>
                </h1>

                <p>
                    Discover exclusive products, compete in live
                    auctions and make your winning bid.
                </p>

                <div className="hero-buttons">

                    <button
                        className="primary-button"
                        onClick={() => navigate("/auctions")}
                    >
                        Explore Live Auctions
                    </button>

                    <button
                        className="outline-button"
                        onClick={() => navigate("/register")}
                    >
                        Start Selling
                    </button>

                </div>

                <div className="hero-stats">

                    <div>
                        <strong>1K+</strong>
                        <span>Products</span>
                    </div>

                    <div>
                        <strong>500+</strong>
                        <span>Active Users</span>
                    </div>

                    <div>
                        <strong>24H</strong>
                        <span>Auction Duration</span>
                    </div>

                </div>

            </div>

            <div className="hero-card">

                <div className="live-label">
                    ● LIVE NOW
                </div>

                <div className="product-placeholder">
                    OOPSIBID
                    <br />
                    AUCTION
                </div>

                <div className="hero-card-info">

                    <div>
                        <small>Sealed Bidding</small>
                        <h2>ONE BID</h2>
                    </div>

                    <div className="timer">
                        <small>Auction</small>
                        <strong>24H</strong>
                    </div>

                </div>

                <button
                    className="bid-button"
                    onClick={() => navigate("/auctions")}
                >
                    VIEW AUCTIONS →
                </button>

            </div>

        </section>
    );
}

export default Hero;