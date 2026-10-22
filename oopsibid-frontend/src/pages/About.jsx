import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./About.css";

function About() {

    return (

        <div className="about-page">

            <Navbar />


            {/* ==================================
                HERO
            ================================== */}

            <section className="about-hero">

                <span>
                    ABOUT OOPSIBID
                </span>

                <h1>
                    A NEW WAY TO
                    <br />
                    <strong>COMPETE.</strong>
                </h1>

                <p>
                    OOPSIBID is an online auction platform
                    built around fair, secure and simple
                    one-shot bidding.
                </p>

            </section>


            {/* ==================================
                WHAT IS OOPSIBID
            ================================== */}

            <section className="about-section">

                <div className="about-section-label">
                    01 — OUR PLATFORM
                </div>

                <div className="about-section-content">

                    <h2>
                        Bidding should be
                        <strong> simple.</strong>
                    </h2>

                    <p>
                        OOPSIBID connects sellers and buyers
                        through a modern online auction
                        marketplace.
                    </p>

                    <p>
                        Instead of repeatedly increasing bids,
                        our platform focuses on a sealed,
                        one-shot bidding experience.
                    </p>

                </div>

            </section>


            {/* ==================================
                FEATURES
            ================================== */}

            <section className="about-features">

                <div className="about-feature">

                    <span>
                        01
                    </span>

                    <h3>
                        ONE-SHOT BIDDING
                    </h3>

                    <p>
                        Buyers get one opportunity to submit
                        their bid for an auction.
                    </p>

                </div>


                <div className="about-feature">

                    <span>
                        02
                    </span>

                    <h3>
                        WALLET PROTECTION
                    </h3>

                    <p>
                        Bid amounts are checked against the
                        buyer's available wallet balance.
                    </p>

                </div>


                <div className="about-feature">

                    <span>
                        03
                    </span>

                    <h3>
                        SECURE AUCTIONS
                    </h3>

                    <p>
                        Auctions are controlled through seller
                        and administrator approval.
                    </p>

                </div>


                <div className="about-feature">

                    <span>
                        04
                    </span>

                    <h3>
                        AUTOMATIC SETTLEMENT
                    </h3>

                    <p>
                        Completed auctions can determine the
                        winner and handle locked funds.
                    </p>

                </div>

            </section>


            {/* ==================================
                HOW IT WORKS
            ================================== */}

            <section className="about-how">

                <div className="about-section-label">
                    02 — HOW IT WORKS
                </div>

                <h2>
                    FROM PRODUCT
                    <br />
                    TO <strong>WINNER.</strong>
                </h2>


                <div className="how-grid">

                    <div>

                        <span>01</span>

                        <h3>
                            SELLER LISTS
                        </h3>

                        <p>
                            A seller creates an auction
                            for a product.
                        </p>

                    </div>


                    <div>

                        <span>02</span>

                        <h3>
                            ADMIN APPROVES
                        </h3>

                        <p>
                            The auction becomes available
                            after administrator approval.
                        </p>

                    </div>


                    <div>

                        <span>03</span>

                        <h3>
                            BUYERS BID
                        </h3>

                        <p>
                            Buyers submit their secret
                            one-shot bids.
                        </p>

                    </div>


                    <div>

                        <span>04</span>

                        <h3>
                            WINNER
                        </h3>

                        <p>
                            When the auction ends, the
                            highest valid bid wins.
                        </p>

                    </div>

                </div>

            </section>


            {/* ==================================
                FINAL
            ================================== */}

            <section className="about-final">

                <span>
                    OOPSIBID
                </span>

                <h2>
                    BID ON WHAT
                    <strong> YOU LOVE.</strong>
                </h2>

                <p>
                    Discover products. Place your one bid.
                    Make it count.
                </p>

            </section>


            <Footer />

        </div>
    );
}

export default About;