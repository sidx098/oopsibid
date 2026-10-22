import { useEffect, useState } from "react";

import "./Home.css";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AuctionCard from "../components/AuctionCard";
import FeatureSection from "../components/FeatureSection";
import Footer from "../components/Footer";


function Home() {

    const [auctions, setAuctions] = useState([]);

    const [loadingAuctions, setLoadingAuctions] =
        useState(true);

    const [auctionError, setAuctionError] =
        useState("");


    // ==========================================
    // LOAD LIVE AUCTIONS
    // ==========================================

    const loadAuctions = async () => {

        try {

            setLoadingAuctions(true);

            setAuctionError("");

            const response = await fetch(
                "http://localhost:8081/api/auctions"
            );

            const text =
                await response.text();

            console.log(
                "HOME AUCTIONS:",
                response.status,
                text
            );


            if (!response.ok) {

                setAuctionError(
                    "Unable to load auctions."
                );

                return;
            }


            const data =
                text
                    ? JSON.parse(text)
                    : [];


            // ==================================
            // ONLY LIVE AUCTIONS
            // ==================================

            const now =
                new Date();


            const liveAuctions =
                data.filter((auction) => {

                    if (
                        auction.status?.toUpperCase()
                        !== "APPROVED"
                    ) {
                        return false;
                    }


                    if (!auction.startTime ||
                        !auction.endTime) {

                        return false;
                    }


                    const start =
                        new Date(
                            auction.startTime
                        );

                    const end =
                        new Date(
                            auction.endTime
                        );


                    return (
                        now >= start &&
                        now < end
                    );

                });


            setAuctions(liveAuctions);


        } catch (error) {

            console.error(
                "Auction loading error:",
                error
            );

            setAuctionError(
                "Unable to connect to server."
            );

        } finally {

            setLoadingAuctions(false);

        }

    };


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {

        loadAuctions();

    }, []);


    return (

        <div className="home">

            <Navbar />

            <Hero />


            {/* =================================
                LIVE AUCTIONS
            ================================= */}

            <section className="auctions-section">

                <div className="section-top">

                    <div>

                        <span>
                            LIVE RIGHT NOW
                        </span>

                        <h2>
                            LIVE <strong>AUCTIONS</strong>
                        </h2>

                    </div>


                    <a href="/auctions">
                        VIEW ALL →
                    </a>

                </div>


                {/* =================================
                    LOADING
                ================================= */}

                {loadingAuctions && (

                    <div className="auction-message">

                        Loading live auctions...

                    </div>

                )}


                {/* =================================
                    ERROR
                ================================= */}

                {!loadingAuctions &&
                 auctionError && (

                    <div className="auction-message error">

                        {auctionError}

                    </div>

                )}


                {/* =================================
                    NO LIVE AUCTIONS
                ================================= */}

                {!loadingAuctions &&
                 !auctionError &&
                 auctions.length === 0 && (

                    <div className="auction-message">

                        <h3>
                            No live auctions right now.
                        </h3>

                        <p>
                            Check back soon for new
                            OOPSIBID auctions.
                        </p>

                    </div>

                )}


                {/* =================================
                    AUCTION GRID
                ================================= */}

                {!loadingAuctions &&
                 auctions.length > 0 && (

                    <div className="auction-grid">

                        {auctions
                            .slice(0, 3)
                            .map((auction) => (

                                <AuctionCard
                                    key={auction.id}
                                    auctionId={auction.id}
                                    productName={
                                        auction.productName ||
                                        "Featured Product"
                                    }
                                    price={
                                        auction.startingPrice
                                    }
                                    endTime={
                                        auction.endTime
                                    }
                                    category="LIVE AUCTION"
                                    image={
                                        auction.productImage
                                    }
                                />

                            ))}

                    </div>

                )}

            </section>


            {/* =================================
                FEATURES
            ================================= */}

            <FeatureSection />


            {/* =================================
                FOOTER
            ================================= */}

            <Footer />

        </div>
    );
}

export default Home;