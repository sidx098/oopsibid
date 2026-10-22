import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminNavbar from "../../components/AdminNavbar";
import Footer from "../../components/Footer";

import "./AdminProducts.css";

function AdminProducts() {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================
    // LOAD PRODUCTS
    // =========================

    useEffect(() => {

        const token =
            localStorage.getItem("token");


        if (!token) {

            navigate("/login");

            return;
        }


        fetchProducts(token);

    }, [navigate]);


    // =========================
    // FETCH PRODUCTS
    // =========================

    const fetchProducts = async (token) => {

        try {

            setLoading(true);
            setError("");


            const response = await fetch(
                "http://localhost:8081/api/admin/products",
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


            console.log(
                "PRODUCT STATUS:",
                response.status
            );


            const responseText =
                await response.text();


            console.log(
                "PRODUCT RESPONSE:",
                responseText
            );


            if (!response.ok) {

                throw new Error(
                    `Server returned ${response.status}: ${responseText}`
                );
            }


            const data =
                JSON.parse(responseText);


            setProducts(data);


        } catch (error) {

            console.error(
                "PRODUCT ERROR:",
                error
            );


            setError(
                error.message
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================
    // APPROVE / REJECT
    // =========================

    const updateProductStatus = async (
        productId,
        action
    ) => {

        const token =
            localStorage.getItem("token");


        if (!token) {

            alert(
                "Admin session expired."
            );

            navigate("/login");

            return;
        }


        try {

            const response = await fetch(

                `http://localhost:8081/api/admin/products/${productId}/${action}`,

                {
                    method: "PUT",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"
                    }
                }
            );


            const result =
                await response.text();


            console.log(
                "UPDATE STATUS:",
                response.status
            );


            console.log(
                "UPDATE RESPONSE:",
                result
            );


            if (!response.ok) {

                alert(
                    result ||
                    "Unable to update product."
                );

                return;
            }


            await fetchProducts(token);


        } catch (error) {

            console.error(
                "UPDATE PRODUCT ERROR:",
                error
            );


            alert(
                "Unable to connect to server."
            );
        }
    };


    // =========================
    // DELETE PRODUCT
    // =========================

    const deleteProduct = async (
        productId
    ) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this product?"
            );


        if (!confirmDelete) {
            return;
        }


        const token =
            localStorage.getItem("token");


        try {

            const response = await fetch(

                `http://localhost:8081/api/admin/products/${productId}`,

                {
                    method: "DELETE",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


            const result =
                await response.text();


            if (!response.ok) {

                alert(
                    result ||
                    "Unable to delete product."
                );

                return;
            }


            alert(result);


            await fetchProducts(token);


        } catch (error) {

            console.error(
                "DELETE ERROR:",
                error
            );


            alert(
                "Unable to connect to server."
            );
        }
    };


    // =========================
    // FORMAT DATE
    // =========================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }


        return new Date(
            date
        ).toLocaleDateString();
    };


    // =========================
    // PAGE
    // =========================

    return (

        <div className="admin-products-page">

            <AdminNavbar />


            <main className="admin-products-content">


                {/* =========================
                    HEADER
                ========================= */}

                <div className="admin-products-header">

                    <div>

                        <span>
                            ADMIN PANEL
                        </span>

                        <h1>
                            Product Management
                        </h1>

                        <p>
                            Review and manage
                            marketplace products.
                        </p>

                    </div>


                    <button
                        onClick={() =>
                            navigate(
                                "/admin/dashboard"
                            )
                        }
                    >
                        ← Dashboard
                    </button>

                </div>


                {/* =========================
                    LOADING
                ========================= */}

                {loading && (

                    <div className="products-message">
                        Loading products...
                    </div>

                )}


                {/* =========================
                    ERROR
                ========================= */}

                {error && (

                    <div className="products-error">
                        {error}
                    </div>

                )}


                {/* =========================
                    TABLE
                ========================= */}

                {!loading &&
                 !error && (

                    <div className="products-table-container">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        Product
                                    </th>

                                    <th>
                                        Category
                                    </th>

                                    <th>
                                        Condition
                                    </th>

                                    <th>
                                        Seller ID
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Created
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {products.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="empty-products"
                                        >
                                            No products found.
                                        </td>

                                    </tr>

                                ) : (

                                    products.map(
                                        (product) => (

                                            <tr
                                                key={
                                                    product.id
                                                }
                                            >

                                                <td>

                                                    <div className="product-name">

                                                        {product.name}

                                                    </div>

                                                    <div className="product-description">

                                                        {product.description
                                                            ? product.description.substring(
                                                                0,
                                                                60
                                                            )
                                                            : "-"
                                                        }

                                                    </div>

                                                </td>


                                                <td>
                                                    {product.category}
                                                </td>


                                                <td>
                                                    {product.condition}
                                                </td>


                                                <td>
                                                    {product.sellerId}
                                                </td>


                                                <td>

                                                    <span
                                                        className={
                                                            `product-status ${product.status?.toLowerCase()}`
                                                        }
                                                    >
                                                        {product.status}
                                                    </span>

                                                </td>


                                                <td>
                                                    {formatDate(
                                                        product.createdAt
                                                    )}
                                                </td>


                                                <td>

                                                    <div className="product-actions">


                                                        {/* APPROVE */}

                                                        {product.status?.toUpperCase() !==
                                                        "APPROVED" && (

                                                            <button
                                                                className="approve-button"
                                                                onClick={() =>
                                                                    updateProductStatus(
                                                                        product.id,
                                                                        "approve"
                                                                    )
                                                                }
                                                            >
                                                                Approve
                                                            </button>

                                                        )}


                                                        {/* REJECT */}

                                                        {product.status?.toUpperCase() !==
                                                        "REJECTED" && (

                                                            <button
                                                                className="reject-button"
                                                                onClick={() =>
                                                                    updateProductStatus(
                                                                        product.id,
                                                                        "reject"
                                                                    )
                                                                }
                                                            >
                                                                Reject
                                                            </button>

                                                        )}


                                                        {/* DELETE */}

                                                        <button
                                                            className="delete-button"
                                                            onClick={() =>
                                                                deleteProduct(
                                                                    product.id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>


                                                    </div>

                                                </td>

                                            </tr>

                                        )
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </main>


            <Footer />

        </div>
    );
}

export default AdminProducts;