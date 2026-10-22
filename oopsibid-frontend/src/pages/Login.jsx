import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./Login.css";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: ""
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
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

        setMessage("");
    };


    // =========================
    // EMAIL VALIDATION
    // =========================

    const validateEmail = (email) => {

        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            return "Email is required.";
        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(trimmedEmail)) {
            return "Please enter a valid email address.";
        }

        return "";
    };


    // =========================
    // PASSWORD VALIDATION
    // =========================

    const validatePassword = (password) => {

        if (!password) {
            return "Password is required.";
        }

        return "";
    };


    // =========================
    // ROLE VALIDATION
    // =========================

    const validateRole = (role) => {

        if (!role) {
            return "Please select an account type.";
        }

        return "";
    };


    // =========================
    // FORM VALIDATION
    // =========================

    const validateForm = () => {

        const newErrors = {};

        const emailError =
            validateEmail(formData.email);

        if (emailError) {
            newErrors.email = emailError;
        }

        const passwordError =
            validatePassword(formData.password);

        if (passwordError) {
            newErrors.password = passwordError;
        }

        const roleError =
            validateRole(formData.role);

        if (roleError) {
            newErrors.role = roleError;
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };


    // =========================
    // NORMALIZE ROLE
    // =========================

    const normalizeRole = (role) => {

        if (!role) {
            return "";
        }

        return role
            .toString()
            .replace("ROLE_", "")
            .trim()
            .toUpperCase();
    };


    // =========================
    // LOGIN
    // =========================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setMessage("");

        const isValid = validateForm();

        if (!isValid) {
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

                        email:
                            formData.email.trim(),

                        password:
                            formData.password

                    })
                }
            );


            const result =
                await response.text();


            // =========================
            // LOGIN FAILED
            // =========================

            if (!response.ok) {

                setErrors({
                    general:
                        result ||
                        "Invalid email or password."
                });

                return;
            }


            // =========================
            // CHECK TOKEN
            // =========================

            const token = result.trim();

            const tokenParts =
                token.split(".");


            if (tokenParts.length !== 3) {

                console.error(
                    "Invalid JWT:",
                    token
                );

                setErrors({
                    general:
                        "Invalid authentication token."
                });

                return;
            }


            // =========================
            // DECODE JWT
            // =========================

            let payload;

            try {

                // JWT uses Base64URL
                const base64Payload =
                    tokenParts[1]
                        .replace(/-/g, "+")
                        .replace(/_/g, "/");

                payload =
                    JSON.parse(
                        atob(base64Payload)
                    );

            } catch (error) {

                console.error(
                    "JWT decode error:",
                    error
                );

                setErrors({
                    general:
                        "Unable to read authentication token."
                });

                return;
            }


            console.log(
                "LOGIN JWT PAYLOAD:",
                payload
            );


            // =========================
            // GET ROLE
            // =========================

            let actualRole =
                payload.role;


            // Support different backend
            // role claim formats

            if (!actualRole &&
                payload.authorities) {

                actualRole =
                    Array.isArray(
                        payload.authorities
                    )
                        ? payload.authorities[0]
                        : payload.authorities;
            }


            actualRole =
                normalizeRole(actualRole);


            console.log(
                "NORMALIZED ROLE:",
                actualRole
            );


            // =========================
            // ROLE NOT FOUND
            // =========================

            if (!actualRole) {

                setErrors({
                    general:
                        "Account role was not found in authentication token."
                });

                console.error(
                    "JWT does not contain role:",
                    payload
                );

                return;
            }


            // =========================
            // CHECK SELECTED ROLE
            // =========================

            const selectedRole =
                normalizeRole(
                    formData.role
                );


            if (
                actualRole !==
                selectedRole
            ) {

                setErrors({
                    general:
                        `Selected account type does not match this account. Account role: ${actualRole}`
                });

                console.error(
                    "Role mismatch:",
                    {
                        selectedRole,
                        actualRole
                    }
                );

                return;
            }


            // =========================
            // SAVE LOGIN DATA
            // =========================

            localStorage.setItem(
                "token",
                token
            );

            localStorage.setItem(
                "role",
                actualRole
            );

            localStorage.setItem(
                "email",
                formData.email.trim()
            );


            // Save JWT payload for debugging
            localStorage.setItem(
                "user",
                JSON.stringify(payload)
            );


            console.log(
                "LOGIN SUCCESS"
            );

            console.log(
                "ROLE:",
                actualRole
            );


            setMessage(
                "Login successful! Redirecting..."
            );


            // =========================
            // REDIRECT
            // =========================

            setTimeout(() => {

                if (
                    actualRole ===
                    "ADMIN"
                ) {

                    navigate(
                        "/admin/dashboard",
                        {
                            replace: true
                        }
                    );

                }

                else if (
                    actualRole ===
                    "SELLER"
                ) {

                    navigate(
                        "/seller/dashboard",
                        {
                            replace: true
                        }
                    );

                }

                else if (
                    actualRole ===
                    "BUYER"
                ) {

                    navigate(
                        "/buyer/dashboard",
                        {
                            replace: true
                        }
                    );

                }

                else {

                    console.error(
                        "Unknown role:",
                        actualRole
                    );

                    navigate(
                        "/",
                        {
                            replace: true
                        }
                    );

                }

            }, 700);


        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            setErrors({
                general:
                    "Unable to connect to server. Please make sure Spring Boot is running."
            });

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="login-page">

            <Navbar />


            <main className="login-content">

                <div className="login-card">

                    <div className="login-header">

                        <h1>
                            Welcome Back
                        </h1>

                        <p>
                            Login to your OOPSIBID account
                        </p>

                    </div>


                    {errors.general && (

                        <div className="error-message">
                            {errors.general}
                        </div>

                    )}


                    {message && (

                        <div className="success-message">
                            {message}
                        </div>

                    )}


                    <form
                        onSubmit={handleSubmit}
                        noValidate
                    >


                        {/* EMAIL */}

                        <div className="form-group">

                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                            />

                            {errors.email && (

                                <div className="field-error">
                                    {errors.email}
                                </div>

                            )}

                        </div>


                        {/* PASSWORD */}

                        <div className="form-group">

                            <label>
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                            />

                            {errors.password && (

                                <div className="field-error">
                                    {errors.password}
                                </div>

                            )}

                        </div>


                        {/* ACCOUNT TYPE */}

                        <div className="form-group">

                            <label>
                                Account Type
                            </label>

                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                            >

                                <option value="">
                                    Select account type
                                </option>

                                <option value="BUYER">
                                    Buyer
                                </option>

                                <option value="SELLER">
                                    Seller
                                </option>

                                <option value="ADMIN">
                                    Admin
                                </option>

                            </select>

                            {errors.role && (

                                <div className="field-error">
                                    {errors.role}
                                </div>

                            )}

                        </div>


                        {/* LOGIN BUTTON */}

                        <button
                            type="submit"
                            disabled={loading}
                        >

                            {loading
                                ? "Signing In..."
                                : "Login"
                            }

                        </button>

                    </form>


                    {/* REGISTER */}

                    <div className="register-link">

                        <span>
                            Don't have an account?
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/register")
                            }
                        >
                            Create Account
                        </button>

                    </div>

                </div>

            </main>


            <Footer />

        </div>

    );
}

export default Login;

