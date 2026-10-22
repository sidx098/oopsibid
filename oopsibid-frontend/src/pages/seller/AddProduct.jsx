import { useState } from "react";
import { useNavigate } from "react-router-dom";

import SellerNavbar from "../../components/SellerNavbar";
import Footer from "../../components/Footer";

import "./AddProduct.css";


function AddProduct() {

    const navigate = useNavigate();


    const [formData, setFormData] = useState({

        name: "",
        description: "",
        category: "",
        condition: "",
        images: []

    });


    const [imageInput, setImageInput] =
        useState("");


    const [loading, setLoading] =
        useState(false);


    const [error, setError] =
        useState("");


    const [success, setSuccess] =
        useState("");


    // =========================
    // INPUT CHANGE
    // =========================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setFormData({

            ...formData,

            [name]: value

        });


        setError("");

        setSuccess("");
    };


    // =========================
    // ADD IMAGE URL
    // =========================

    const addImage = () => {

        const image =
            imageInput.trim();


        if (!image) {
            return;
        }


        setFormData({

            ...formData,

            images: [
                ...formData.images,
                image
            ]

        });


        setImageInput("");
    };


    // =========================
    // REMOVE IMAGE
    // =========================

    const removeImage = (index) => {

        setFormData({

            ...formData,

            images:
                formData.images.filter(
                    (_, i) => i !== index
                )

        });
    };


    // =========================
    // SUBMIT
    // =========================

    const handleSubmit = async (event) => {

        event.preventDefault();


        setError("");
        setSuccess("");


        if (!formData.name.trim()) {

            setError(
                "Product name is required."
            );

            return;
        }


        if (!formData.category) {

            setError(
                "Please select a category."
            );

            return;
        }


        if (!formData.condition) {

            setError(
                "Please select product condition."
            );

            return;
        }


        const token =
            localStorage.getItem("token");


        if (!token) {

            setError(
                "Please login as a seller."
            );

            return;
        }


        setLoading(true);


        try {

            const response =
                await fetch(
                    "http://localhost:8081/api/products",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({

                            name:
                                formData.name.trim(),

                            description:
                                formData.description.trim(),

                            category:
                                formData.category,

                            condition:
                                formData.condition,

                            images:
                                formData.images

                        })
                    }
                );


            const responseText =
                await response.text();


            if (!response.ok) {

                setError(
                    responseText ||
                    "Unable to create product."
                );

                return;
            }


            setSuccess(
                "Product listed successfully!"
            );


            setFormData({

                name: "",
                description: "",
                category: "",
                condition: "",
                images: []

            });


            setTimeout(() => {

                navigate(
                    "/seller/products"
                );

            }, 1000);


        } catch (error) {

            console.error(
                "Create product error:",
                error
            );


            setError(
                "Unable to connect to server."
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="add-product-page">

            <SellerNavbar />


            <main className="add-product-content">


                {/* HEADER */}

                <div className="add-product-heading">

                    <span>
                        SELLER CENTER
                    </span>

                    <h1>
                        List a Product
                    </h1>

                    <p>
                        Add your product to the
                        OOPSIBID marketplace.
                    </p>

                </div>


                {/* FORM */}

                <form
                    className="add-product-form"
                    onSubmit={handleSubmit}
                >


                    {/* LEFT */}

                    <div className="add-product-main">


                        <div className="form-section">

                            <div className="section-title">

                                <span>
                                    01
                                </span>

                                <div>

                                    <h2>
                                        Product Details
                                    </h2>

                                    <p>
                                        Tell buyers about
                                        your product.
                                    </p>

                                </div>

                            </div>


                            <div className="field">

                                <label>
                                    Product Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="e.g. Vintage Camera"
                                    value={
                                        formData.name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>


                            <div className="field">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    placeholder="Describe your product..."
                                    rows="6"
                                    value={
                                        formData.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>


                            <div className="field-row">

                                <div className="field">

                                    <label>
                                        Category
                                    </label>

                                    <select
                                        name="category"
                                        value={
                                            formData.category
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    >

                                        <option value="">
                                            Select category
                                        </option>

                                        <option value="Electronics">
                                            Electronics
                                        </option>

                                        <option value="Fashion">
                                            Fashion
                                        </option>

                                        <option value="Collectibles">
                                            Collectibles
                                        </option>

                                        <option value="Vehicles">
                                            Vehicles
                                        </option>

                                        <option value="Art">
                                            Art
                                        </option>

                                        <option value="Furniture">
                                            Furniture
                                        </option>

                                        <option value="Other">
                                            Other
                                        </option>

                                    </select>

                                </div>


                                <div className="field">

                                    <label>
                                        Condition
                                    </label>

                                    <select
                                        name="condition"
                                        value={
                                            formData.condition
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    >

                                        <option value="">
                                            Select condition
                                        </option>

                                        <option value="New">
                                            New
                                        </option>

                                        <option value="Like New">
                                            Like New
                                        </option>

                                        <option value="Good">
                                            Good
                                        </option>

                                        <option value="Used">
                                            Used
                                        </option>

                                        <option value="Refurbished">
                                            Refurbished
                                        </option>

                                    </select>

                                </div>

                            </div>

                        </div>


                        {/* IMAGES */}

                        <div className="form-section">

                            <div className="section-title">

                                <span>
                                    02
                                </span>

                                <div>

                                    <h2>
                                        Product Images
                                    </h2>

                                    <p>
                                        Add image URLs for
                                        your listing.
                                    </p>

                                </div>

                            </div>


                            <div className="image-input-row">

                                <input
                                    type="url"
                                    placeholder="https://example.com/image.jpg"
                                    value={imageInput}
                                    onChange={(e) =>
                                        setImageInput(
                                            e.target.value
                                        )
                                    }
                                />

                                <button
                                    type="button"
                                    onClick={addImage}
                                >
                                    Add
                                </button>

                            </div>


                            {formData.images.length > 0 && (

                                <div className="image-list">

                                    {formData.images.map(
                                        (image, index) => (

                                        <div
                                            className="image-item"
                                            key={index}
                                        >

                                            <img
                                                src={image}
                                                alt="Product"
                                            />

                                            <div>

                                                <span>
                                                    Image {index + 1}
                                                </span>

                                                <small>
                                                    {image}
                                                </small>

                                            </div>


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeImage(
                                                        index
                                                    )
                                                }
                                            >
                                                ×
                                            </button>

                                        </div>

                                    ))}

                                </div>

                            )}

                        </div>

                    </div>


                    {/* RIGHT */}

                    <aside className="add-product-sidebar">

                        <div className="listing-card">

                            <span>
                                LISTING STATUS
                            </span>

                            <strong>
                                Ready to publish
                            </strong>

                            <p>
                                Your product will be
                                listed as active after
                                submission.
                            </p>

                        </div>


                        {error && (

                            <div className="form-error">

                                {error}

                            </div>

                        )}


                        {success && (

                            <div className="form-success">

                                {success}

                            </div>

                        )}


                        <button
                            type="submit"
                            className="publish-button"
                            disabled={loading}
                        >

                            {loading
                                ? "Publishing..."
                                : "Publish Product →"
                            }

                        </button>


                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() =>
                                navigate(
                                    "/seller/products"
                                )
                            }
                        >
                            Cancel
                        </button>


                        <div className="seller-tip">

                            <span>
                                SELLER TIP
                            </span>

                            <p>
                                Clear photos and an
                                honest description help
                                your product attract
                                serious bidders.
                            </p>

                        </div>

                    </aside>

                </form>

            </main>


            <Footer />

        </div>
    );
}


export default AddProduct;

