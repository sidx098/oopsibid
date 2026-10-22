import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./Register.css";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
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

        // Remove error for the field being edited

        setErrors({
            ...errors,
            [name]: ""
        });

        setMessage("");
    };


    // =========================
    // NAME VALIDATION
    // =========================

    const validateName = (name) => {

        const trimmedName = name.trim();

        if (!trimmedName) {
            return "Name is required.";
        }

        if (trimmedName.length < 2) {
            return "Name must contain at least 2 characters.";
        }

        if (trimmedName.length > 50) {
            return "Name cannot exceed 50 characters.";
        }

        if (!/^[A-Za-z ]+$/.test(trimmedName)) {
            return "Name can contain only letters and spaces.";
        }

        return "";
    };


    // =========================
    // EMAIL VALIDATION
    // =========================

    const validateEmail = (email) => {

        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            return "Email is required.";
        }

        if (trimmedEmail.length > 100) {
            return "Email cannot exceed 100 characters.";
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

        if (password.length < 8) {
            return "Password must contain at least 8 characters.";
        }

        if (password.length > 64) {
            return "Password cannot exceed 64 characters.";
        }

        if (!/[A-Z]/.test(password)) {
            return "Password must contain at least one uppercase letter.";
        }

        if (!/[a-z]/.test(password)) {
            return "Password must contain at least one lowercase letter.";
        }

        if (!/[0-9]/.test(password)) {
            return "Password must contain at least one number.";
        }

        if (!/[@$!%*?&#]/.test(password)) {
            return "Password must contain at least one special character.";
        }

        if (/\s/.test(password)) {
            return "Password cannot contain spaces.";
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

        if (role !== "BUYER" && role !== "SELLER") {
            return "Invalid account type selected.";
        }

        return "";
    };


    // =========================
    // COMPLETE FORM VALIDATION
    // =========================

    const validateForm = () => {

        const newErrors = {};


        const nameError =
            validateName(formData.name);

        if (nameError) {
            newErrors.name = nameError;
        }


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
    // SUBMIT FORM
    // =========================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setMessage("");


        // Validate all fields

        const isValid = validateForm();

        if (!isValid) {

            return;

        }


        setLoading(true);


        try {

            const response = await fetch(
                "http://localhost:8081/api/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: formData.name.trim(),
                        email: formData.email.trim(),
                        password: formData.password,
                        role: formData.role
                    })
                }
            );


            const result =
                await response.text();


            if (response.ok) {

                setMessage(
                    "Registration successful! Redirecting to login..."
                );


                setFormData({
                    name: "",
                    email: "",
                    password: "",
                    role: ""
                });


                setErrors({});


                setTimeout(() => {

                    navigate("/login");

                }, 1500);

            } else {

                setErrors({
                    general:
                        result ||
                        "Registration failed. Please try again."
                });

            }

        } catch (error) {

            console.error(
                "Registration error:",
                error
            );

            setErrors({
                general:
                    "Unable to connect to server. " +
                    "Please make sure Spring Boot is running."
            });

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="register-page">


            {/* =========================
                NAVBAR
            ========================= */}

            <Navbar />


            {/* =========================
                REGISTER CONTENT
            ========================= */}

            <main className="register-content">

                <div className="register-card">


                    {/* HEADER */}

                    <div className="register-header">

                        <h1>
                            Create Account
                        </h1>

                        <p>
                            Join OOPSIBID today
                        </p>

                    </div>


                    {/* GENERAL ERROR */}

                    {errors.general && (

                        <div className="error-message">

                            {errors.general}

                        </div>

                    )}


                    {/* SUCCESS MESSAGE */}

                    {message && (

                        <div className="success-message">

                            {message}

                        </div>

                    )}


                    {/* FORM */}

                    <form
                        onSubmit={handleSubmit}
                        noValidate
                    >


                        {/* =========================
                            NAME
                        ========================= */}

                        <div className="form-group">

                            <label>
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                maxLength="50"
                                autoComplete="name"
                            />

                            {errors.name && (

                                <div className="field-error">

                                    {errors.name}

                                </div>

                            )}

                        </div>


                        {/* =========================
                            EMAIL
                        ========================= */}

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
                                maxLength="100"
                                autoComplete="email"
                            />

                            {errors.email && (

                                <div className="field-error">

                                    {errors.email}

                                </div>

                            )}

                        </div>


                        {/* =========================
                            PASSWORD
                        ========================= */}

                        <div className="form-group">

                            <label>
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                placeholder="Create a strong password"
                                value={formData.password}
                                onChange={handleChange}
                                maxLength="64"
                                autoComplete="new-password"
                            />

                            {errors.password && (

                                <div className="field-error">

                                    {errors.password}

                                </div>

                            )}


                            <div className="password-hint">

                                <strong>
                                    Password must contain:
                                </strong>

                                <br />

                                • At least 8 characters

                                <br />

                                • One uppercase letter

                                <br />

                                • One lowercase letter

                                <br />

                                • One number

                                <br />

                                • One special character

                                <br />

                                • No spaces

                            </div>

                        </div>


                        {/* =========================
                            ACCOUNT TYPE
                        ========================= */}

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

                            </select>


                            {errors.role && (

                                <div className="field-error">

                                    {errors.role}

                                </div>

                            )}

                        </div>


                        {/* =========================
                            SUBMIT BUTTON
                        ========================= */}

                        <button
                            type="submit"
                            disabled={loading}
                        >

                            {loading
                                ? "Creating Account..."
                                : "Create Account"
                            }

                        </button>


                    </form>


                    {/* =========================
                        LOGIN
                    ========================= */}

                    <div className="login-link">

                        <span>
                            Already have an account?
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/login")
                            }
                        >

                            Login

                        </button>

                    </div>


                </div>

            </main>


            {/* =========================
                FOOTER
            ========================= */}

            <Footer />


        </div>

    );

}

export default Register;