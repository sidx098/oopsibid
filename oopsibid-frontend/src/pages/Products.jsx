import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./Products.css";

function Products() {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ==========================================
    // LOAD PRODUCTS
    // ==========================================

    useEffect(() => {

        const loadProducts = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await fetch(
                    "http://localhost:8081/api/products"
                );

                const text =
                    await response.text();

                console.log(
                    "PRODUCT RESPONSE:",
                    response.status,
                    text
                );

                if (!response.ok) {

                    setError(
                        `Unable to load products: ${response.status}`
                    );

                    return;
                }

                const data =
                    text
                        ? JSON.parse(text)
                        : [];

                console.log(
                    "PRODUCTS:",
                    data
                );

                setProducts(data);

            } catch (err) {

                console.error(
                    "Product loading error:",
                    err
                );

                setError(
                    "Unable to connect to server."
                );

            } finally {

                setLoading(false);
            }
        };

        loadProducts();

    }, []);


    // ==========================================
    // IMAGE URL
    // ==========================================

    const getImageUrl = (product) => {

        if (
            !product.images ||
            product.images.length === 0
        ) {

            return null;
        }

        const image =
            product.images[0];

        if (!image) {
            return null;
        }

        // Full URL
        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {

            return image;
        }

        // Base64 image
        if (
            image.startsWith("data:image")
        ) {

            return image;
        }

        // Backend-relative path
        if (image.startsWith("/")) {

            return `http://localhost:8081${image}`;
        }

        // Any other relative path
        return `http://localhost:8081/${image}`;
    };


    // ==========================================
    // IMAGE ERROR
    // ==========================================

    const handleImageError = (event) => {

        event.currentTarget.style.display =
            "none";

        const parent =
            event.currentTarget.parentElement;

        const fallback =
            parent.querySelector(
                ".product-image-fallback"
            );

        if (fallback) {

            fallback.style.display =
                "flex";
        }
    };


    return (

        <div className="products-page">

            <Navbar />


            {/* ==================================
                HEADER
            ================================== */}

            <section className="products-header">

                <span>
                    OOPSIBID MARKETPLACE
                </span>

                <h1>
                    DISCOVER{" "}
                    <strong>PRODUCTS</strong>
                </h1>

                <p>
                    Explore products available on
                    OOPSIBID and find something worth
                    bidding for.
                </p>

            </section>


            {/* ==================================
                PRODUCTS
            ================================== */}

            <main className="products-container">

                {loading && (

                    <div className="products-message">

                        Loading products...

                    </div>

                )}


                {error && (

                    <div className="products-error">

                        {error}

                    </div>

                )}


                {!loading &&
                 !error &&
                 products.length === 0 && (

                    <div className="products-message">

                        <h2>
                            No products available
                        </h2>

                        <p>
                            New products will appear
                            here soon.
                        </p>

                    </div>

                )}


                {!loading &&
                 !error &&
                 products.length > 0 && (

                    <div className="products-grid">

                        {products.map(
                            product => {

                                const imageUrl =
                                    getImageUrl(product);

                                return (

                                    <article
                                        className="product-card"
                                        key={product.id}
                                    >

                                        {/* =========================
                                            IMAGE
                                        ========================= */}

                                        <div className="product-image">

                                            {imageUrl ? (

                                                <img
                                                    src={imageUrl}
                                                    alt={
                                                        product.name ||
                                                        "Product"
                                                    }
                                                    onError={
                                                        handleImageError
                                                    }
                                                />

                                            ) : null}


                                            <div
                                                className="product-image-fallback"
                                                style={{
                                                    display:
                                                        imageUrl
                                                            ? "none"
                                                            : "flex"
                                                }}
                                            >

                                                PRODUCT

                                            </div>


                                            <span className="product-category">

                                                {product.category ||
                                                    "PRODUCT"}

                                            </span>

                                        </div>


                                        {/* =========================
                                            CONTENT
                                        ========================= */}

                                        <div className="product-content">

                                            <span className="product-label">

                                                OOPSIBID PRODUCT

                                            </span>


                                            <h2>

                                                {product.name ||
                                                    "Unnamed Product"}

                                            </h2>


                                            <p>

                                                {product.description ||
                                                    "Exclusive product available on OOPSIBID."}

                                            </p>


                                            <div className="product-details">

                                                <span>

                                                    Condition

                                                </span>

                                                <strong>

                                                    {product.condition ||
                                                        "Not specified"}

                                                </strong>

                                            </div>


                                            <button
                                                className="product-view-button"
                                                onClick={() => navigate("/login")}
                                            >
                                                VIEW PRODUCT →
                                            </button>

                                        </div>

                                    </article>

                                );
                            }
                        )}

                    </div>

                )}

            </main>


            <Footer />

        </div>
    );
}

export default Products;