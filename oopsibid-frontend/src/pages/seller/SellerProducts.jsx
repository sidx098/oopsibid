import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import SellerNavbar from "../../components/SellerNavbar";
import Footer from "../../components/Footer";

import "./SellerProducts.css";


function SellerProducts() {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =========================
    // LOAD PRODUCTS
    // =========================

    const loadProducts = async () => {

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
                "http://localhost:8081/api/products",
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
                    : [];


            setProducts(data);


        } catch (error) {

            console.error(
                "Product loading error:",
                error
            );

            setError(
                "Unable to load products."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadProducts();

    }, []);


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

        <div className="seller-products-page">

            <SellerNavbar />


            <main className="seller-products-content">


                {/* =========================
                    HEADER
                ========================= */}

                <section className="seller-products-header">

                    <div>

                        <span>
                            SELLER CENTER
                        </span>

                        <h1>
                            My Products
                        </h1>

                        <p>
                            Manage the products you've listed
                            on OOPSIBID.
                        </p>

                    </div>


                    <div className="seller-products-header-actions">

                        <button
                            className="refresh-products-button"
                            onClick={loadProducts}
                        >
                            Refresh
                        </button>


                        <button
                            className="add-product-button"
                            onClick={() =>
                                navigate(
                                    "/seller/products/add"
                                )
                            }
                        >
                            + Add Product
                        </button>

                    </div>

                </section>


                {/* =========================
                    LOADING
                ========================= */}

                {loading && (

                    <div className="seller-products-message">

                        <div className="seller-loader"></div>

                        <span>
                            Loading your products...
                        </span>

                    </div>

                )}


                {/* =========================
                    ERROR
                ========================= */}

                {!loading && error && (

                    <div className="seller-products-error">

                        {error}

                        <button
                            onClick={loadProducts}
                        >
                            Try Again
                        </button>

                    </div>

                )}


                {/* =========================
                    EMPTY
                ========================= */}

                {!loading &&
                 !error &&
                 products.length === 0 && (

                    <div className="seller-products-empty">

                        <div className="empty-product-icon">
                            ◈
                        </div>

                        <h2>
                            No products yet
                        </h2>

                        <p>
                            Start selling by adding your
                            first product to OOPSIBID.
                        </p>

                        <button
                            onClick={() =>
                                navigate(
                                    "/seller/products/add"
                                )
                            }
                        >
                            Add Your First Product
                        </button>

                    </div>

                )}


                {/* =========================
                    PRODUCTS
                ========================= */}

                {!loading &&
                 !error &&
                 products.length > 0 && (

                    <section className="seller-products-section">

                        <div className="products-count">

                            <span>
                                YOUR INVENTORY
                            </span>

                            <strong>
                                {products.length}{" "}
                                {products.length === 1
                                    ? "Product"
                                    : "Products"}
                            </strong>

                        </div>


                        <div className="seller-product-grid">

                            {products.map(
                                (product) => (

                                <article
                                    className="seller-product-card"
                                    key={product.id}
                                >


                                    {/* IMAGE */}

                                    <div className="seller-product-image">

                                        {product.images &&
                                         product.images.length > 0 ? (

                                            <img
                                                src={
                                                    product.images[0]
                                                }
                                                alt={
                                                    product.name
                                                }
                                            />

                                        ) : (

                                            <div className="product-image-placeholder">

                                                ◈

                                            </div>

                                        )}


                                        <span
                                            className={
                                                `product-status ${getStatusClass(
                                                    product.status
                                                )}`
                                            }
                                        >
                                            {product.status ||
                                                "UNKNOWN"}
                                        </span>

                                    </div>


                                    {/* CONTENT */}

                                    <div className="seller-product-info">

                                        <span className="product-category">

                                            {product.category ||
                                                "Uncategorized"}

                                        </span>


                                        <h2>
                                            {product.name}
                                        </h2>


                                        <p>

                                            {product.description ||
                                                "No description available."}

                                        </p>


                                        <div className="product-meta">

                                            <span>

                                                Condition

                                                <strong>
                                                    {product.condition ||
                                                        "-"}
                                                </strong>

                                            </span>


                                            <span>

                                                Product ID

                                                <strong>
                                                    {product.id}
                                                </strong>

                                            </span>

                                        </div>


                                        <div className="product-card-actions">

                                            <button
                                                className="view-product-button"
                                                onClick={() =>
                                                    navigate(
                                                        `/seller/products/${product.id}`
                                                    )
                                                }
                                            >
                                                View
                                            </button>


                                            <button
                                                className="auction-product-button"
                                                onClick={() =>
                                                    navigate(
                                                        `/seller/auctions/create/${product.id}`
                                                    )
                                                }
                                            >
                                                Create Auction →
                                            </button>

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


export default SellerProducts;
