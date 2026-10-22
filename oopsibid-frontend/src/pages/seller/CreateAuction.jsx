import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import SellerNavbar from "../../components/SellerNavbar";
import Footer from "../../components/Footer";

import "./CreateAuction.css";

function CreateAuction() {

    const navigate = useNavigate();

    const { productId } = useParams();

    const [product, setProduct] = useState(null);

    const [startingPrice, setStartingPrice] = useState("");

    const [loading, setLoading] = useState(true);

    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");

    // =========================
    // LOAD PRODUCT
    // =========================

    useEffect(() => {

        const loadProduct = async () => {

            if (!productId) {

                setError("Product ID is missing.");

                setLoading(false);

                return;
            }

            try {

                const token =
                    localStorage.getItem("token");

                const response = await fetch(
                    `http://localhost:8081/api/products/${productId}`,
                    {
                        method: "GET",
                        headers: {
                            "Authorization":
                                `Bearer ${token}`
                        }
                    }
                );

                const text =
                    await response.text();

                if (!response.ok) {

                    setError(
                        text ||
                        "Unable to load product."
                    );

                    return;
                }

                const data =
                    JSON.parse(text);

                setProduct(data);

            } catch (error) {

                console.error(error);

                setError(
                    "Unable to connect to server."
                );

            } finally {

                setLoading(false);
            }
        };

        loadProduct();

    }, [productId]);


    // =========================
    // CREATE AUCTION
    // =========================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        if (!productId) {

            setError("Product ID is missing.");

            return;
        }

        if (!startingPrice ||
            Number(startingPrice) <= 0) {

            setError(
                "Starting price must be greater than 0."
            );

            return;
        }

        try {

            setSubmitting(true);

            const token =
                localStorage.getItem("token");

            if (!token) {

                setError(
                    "Please login as a seller."
                );

                return;
            }

            const payload = {

                productId: productId,

                sellerId:
                    localStorage.getItem("userId"),

                startingPrice:
                    Number(startingPrice)

            };

            console.log(
                "CREATE AUCTION PAYLOAD:",
                payload
            );

            const response = await fetch(
                "http://localhost:8081/api/auctions",
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

            const text =
                await response.text();

            if (!response.ok) {

                setError(
                    text ||
                    "Unable to create auction."
                );

                return;
            }

            alert(
                "Auction created successfully!"
            );

            navigate("/seller/auctions");

        } catch (error) {

            console.error(
                "Create auction error:",
                error
            );

            setError(
                "Unable to connect to server."
            );

        } finally {

            setSubmitting(false);
        }
    };


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (

            <div className="create-auction-page">

                <SellerNavbar />

                <main className="create-auction-content">

                    <div className="auction-message">
                        Loading product...
                    </div>

                </main>

                <Footer />

            </div>
        );
    }


    // =========================
    // PAGE
    // =========================

    return (

        <div className="create-auction-page">

            <SellerNavbar />

            <main className="create-auction-content">

                <div className="create-auction-card">

                    <div className="auction-header">

                        <span>
                            SELLER AUCTIONS
                        </span>

                        <h1>
                            Create Auction
                        </h1>

                        <p>
                            Start an auction for your product.
                        </p>

                    </div>


                    {error && (

                        <div className="auction-error">

                            {error}

                        </div>

                    )}


                    {product && (

                        <div className="auction-product">

                            <h2>
                                {product.name}
                            </h2>

                            <p>
                                {product.description}
                            </p>

                            <div className="product-info">

                                <span>
                                    Category:
                                    {" "}
                                    {product.category}
                                </span>

                                <span>
                                    Condition:
                                    {" "}
                                    {product.condition}
                                </span>

                            </div>

                        </div>

                    )}


                    <form
                        onSubmit={handleSubmit}
                        className="auction-form"
                    >

                        <label>
                            Starting Price
                        </label>

                        <div className="price-input">

                            <span>₹</span>

                            <input
                                type="number"
                                min="1"
                                step="0.01"
                                placeholder="Enter starting price"
                                value={startingPrice}
                                onChange={(e) =>
                                    setStartingPrice(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="auction-duration">

                            <strong>
                                Auction Duration
                            </strong>

                            <span>
                                24 hours
                            </span>

                        </div>


                        <button
                            type="submit"
                            disabled={submitting}
                        >

                            {submitting
                                ? "Creating Auction..."
                                : "Create Auction"
                            }

                        </button>

                    </form>


                    <button
                        className="back-button"
                        onClick={() =>
                            navigate("/seller/products")
                        }
                    >
                        Back to My Products
                    </button>

                </div>

            </main>

            <Footer />

        </div>
    );
}

export default CreateAuction;