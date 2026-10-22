import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import SellerNavbar from "../../components/SellerNavbar";
import Footer from "../../components/Footer";

import "./SellerProductDetails.css";


function SellerProductDetails() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [product, setProduct] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =========================
    // LOAD PRODUCT
    // =========================

    const loadProduct = async () => {

        setLoading(true);

        setError("");

        try {

            const token =
                localStorage.getItem("token");


            if (!token) {

                setError(
                    "Seller login required."
                );

                return;
            }


            const response = await fetch(
                `http://localhost:8081/api/products/${id}`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


            const responseText =
                await response.text();


            if (!response.ok) {

                setError(
                    `Server returned ${response.status}: ${responseText}`
                );

                return;
            }


            const data =
                responseText
                    ? JSON.parse(responseText)
                    : null;


            setProduct(data);


        } catch (error) {

            console.error(
                "Product loading error:",
                error
            );

            setError(
                "Unable to load product."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadProduct();

    }, [id]);


    // =========================
    // STATUS CLASS
    // =========================

    const getStatusClass =
        (status) => {

        if (!status) {
            return "";
        }

        return status
            .toLowerCase()
            .replace(/\s+/g, "-");
    };


    return (

        <div className="seller-product-details-page">

            <SellerNavbar />


            <main className="seller-product-details-content">


                {/* BACK */}

                <button
                    className="back-products-button"
                    onClick={() =>
                        navigate("/seller/products")
                    }
                >
                    ← Back to My Products
                </button>


                {/* LOADING */}

                {loading && (

                    <div className="product-details-message">

                        Loading product...

                    </div>

                )}


                {/* ERROR */}

                {!loading && error && (

                    <div className="product-details-error">

                        {error}

                        <button
                            onClick={loadProduct}
                        >
                            Try Again
                        </button>

                    </div>

                )}


                {/* PRODUCT */}

                {!loading &&
                 !error &&
                 product && (

                    <section className="product-details-card">


                        {/* IMAGE */}

                        <div className="product-details-image">

                            {product.images &&
                             product.images.length > 0 ? (

                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                />

                            ) : (

                                <div className="product-details-placeholder">
                                    ◈
                                </div>

                            )}

                        </div>


                        {/* INFORMATION */}

                        <div className="product-details-info">


                            <div className="product-details-top">

                                <span className="product-details-category">

                                    {product.category ||
                                        "Uncategorized"}

                                </span>


                                <span
                                    className={
                                        `product-details-status ${getStatusClass(
                                            product.status
                                        )}`
                                    }
                                >

                                    {product.status ||
                                        "UNKNOWN"}

                                </span>

                            </div>


                            <h1>
                                {product.name}
                            </h1>


                            <p className="product-details-description">

                                {product.description ||
                                    "No description available."}

                            </p>


                            <div className="product-details-meta">


                                <div>

                                    <span>
                                        CONDITION
                                    </span>

                                    <strong>
                                        {product.condition ||
                                            "-"}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        PRODUCT ID
                                    </span>

                                    <strong>
                                        {product.id}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        SELLER ID
                                    </span>

                                    <strong>
                                        {product.sellerId ||
                                            "-"}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        CREATED
                                    </span>

                                    <strong>
                                        {product.createdAt
                                            ? new Date(
                                                product.createdAt
                                              ).toLocaleString()
                                            : "-"
                                        }
                                    </strong>

                                </div>

                            </div>


                            {/* ACTION */}

                            <div className="product-details-actions">

                                {product.status ===
                                    "APPROVED" ? (

                                    <button
                                        className="details-auction-button"
                                        onClick={() =>
                                            navigate(
                                                `/seller/auctions/create?productId=${product.id}`
                                            )
                                        }
                                    >
                                        Create Auction →
                                    </button>

                                ) : (

                                    <div className="auction-disabled-message">

                                        Auction can be created
                                        after your product is
                                        approved by admin.

                                    </div>

                                )}


                                <button
                                    className="details-back-button"
                                    onClick={() =>
                                        navigate(
                                            "/seller/products"
                                        )
                                    }
                                >
                                    Back
                                </button>

                            </div>

                        </div>

                    </section>

                )}

            </main>


            <Footer />

        </div>
    );
}


export default SellerProductDetails;
