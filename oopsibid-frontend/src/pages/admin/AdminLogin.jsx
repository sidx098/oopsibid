import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./AdminLogin.css";

function AdminLogin() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(false);


    // =========================
    // HANDLE INPUT
    // =========================

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });

        setErrors({
            ...errors,
            [name]: "",
            general: ""
        });

    };


    // =========================
    // VALIDATION
    // =========================

    const validateForm = () => {

        const newErrors = {};

        if (!formData.email.trim()) {

            newErrors.email =
                "Admin email is required.";

        }

        else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                .test(formData.email.trim())
        ) {

            newErrors.email =
                "Enter a valid email address.";

        }


        if (!formData.password) {

            newErrors.password =
                "Password is required.";

        }


        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;

    };


    // =========================
    // LOGIN
    // =========================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setErrors({});


        if (!validateForm()) {

            return;

        }


        setLoading(true);


        try {

            const response = await fetch(
                "http://localhost:8081/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: formData.email.trim(),
                        password: formData.password
                    })
                }
            );


            const result =
                await response.text();


            if (!response.ok) {

                setErrors({
                    general:
                        result ||
                        "Invalid admin credentials."
                });

                return;

            }


            // Decode JWT payload

            const tokenParts =
                result.split(".");

            if (tokenParts.length !== 3) {

                setErrors({
                    general:
                        "Invalid authentication token."
                });

                return;

            }


            const payload =
                JSON.parse(
                    atob(tokenParts[1])
                );


            // Check ADMIN role

            if (payload.role !== "ADMIN") {

                setErrors({
                    general:
                        "Access denied. Admin account required."
                });

                return;

            }


            // Save JWT

            localStorage.setItem(
                "token",
                result
            );


            localStorage.setItem(
                "role",
                "ADMIN"
            );


            // Go to dashboard

            navigate("/admin/dashboard");

        }

        catch (error) {

            console.error(
                "Admin login error:",
                error
            );

            setErrors({
                general:
                    "Unable to connect to server. " +
                    "Please make sure Spring Boot is running."
            });

        }

        finally {

            setLoading(false);

        }

    };


    return (

        <div className="admin-login-page">


            <div className="admin-login-card">


                <div className="admin-login-header">

                    <div className="admin-badge">
                        ADMIN
                    </div>

                    <h1>
                        OOPSIBID
                    </h1>

                    <p>
                        Administrator Login
                    </p>

                </div>


                {errors.general && (

                    <div className="admin-error">

                        {errors.general}

                    </div>

                )}


                <form
                    onSubmit={handleSubmit}
                    noValidate
                >


                    <div className="admin-form-group">

                        <label>
                            Admin Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter admin email"
                            value={formData.email}
                            onChange={handleChange}
                        />

                        {errors.email && (

                            <div className="admin-field-error">

                                {errors.email}

                            </div>

                        )}

                    </div>


                    <div className="admin-form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter admin password"
                            value={formData.password}
                            onChange={handleChange}
                        />

                        {errors.password && (

                            <div className="admin-field-error">

                                {errors.password}

                            </div>

                        )}

                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Authenticating..."
                            : "Admin Login"
                        }

                    </button>


                </form>


                <button
                    className="back-button"
                    onClick={() => navigate("/")}
                >

                    ← Back to Website

                </button>


            </div>


        </div>

    );

}

export default AdminLogin;