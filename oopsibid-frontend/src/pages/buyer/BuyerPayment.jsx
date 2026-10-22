import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import BuyerNavbar from "../../components/BuyerNavbar";
import Footer from "../../components/Footer";

import "./BuyerPayment.css";

function BuyerPayment() {

    const navigate = useNavigate();
    const location = useLocation();

    const amountFromWallet =
        location.state?.amount || "";

    const [amount, setAmount] =
        useState(amountFromWallet);

    const [paymentMethod, setPaymentMethod] =
        useState("UPI");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // ==========================================
    // HANDLE PAYMENT
    // ==========================================

    const handlePayment = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        const paymentAmount =
            Number(amount);

        if (!paymentAmount ||
            paymentAmount <= 0) {

            setError(
                "Please enter a valid amount."
            );

            return;
        }


        const token =
            localStorage.getItem("token");

        if (!token) {

            setError(
                "Please login before making payment."
            );

            return;
        }


        try {

            setLoading(true);


            /*
             * =====================================
             * SIMULATED PAYMENT
             * =====================================
             *
             * In the final version this section
             * can be replaced with Razorpay/Stripe
             * or another real payment gateway.
             *
             */

            await new Promise(resolve =>
                setTimeout(resolve, 1500)
            );


            // =====================================
            // ADD MONEY TO WALLET
            // =====================================

            const response = await fetch(
                `http://localhost:8081/api/wallet/add-money?amount=${paymentAmount}`,
                {
                    method: "POST",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


            const responseText =
                await response.text();


            console.log(
                "PAYMENT RESPONSE:",
                response.status,
                responseText
            );


            if (!response.ok) {

                throw new Error(
                    responseText ||
                    `Server returned ${response.status}`
                );
            }


            // =====================================
            // PAYMENT SUCCESS
            // =====================================

            setSuccess(
                "Payment successful! Money has been added to your wallet."
            );


            // Wait before going back
            setTimeout(() => {

                navigate("/buyer/wallet");

            }, 1800);


        } catch (error) {

            console.error(
                "Payment error:",
                error
            );

            setError(
                error.message ||
                "Payment failed."
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="buyer-payment-page">

            <BuyerNavbar />


            <main className="buyer-payment-container">

                {/* =================================
                    HEADER
                ================================= */}

                <div className="payment-header">

                    <p className="payment-label">
                        OOPSIBID WALLET
                    </p>

                    <h1>
                        Complete Payment
                    </h1>

                    <p>
                        Add funds securely to your
                        OOPSIBID wallet.
                    </p>

                </div>


                {/* =================================
                    PAYMENT CARD
                ================================= */}

                <div className="payment-card">


                    {/* AMOUNT */}

                    <div className="payment-section">

                        <label>
                            Amount
                        </label>

                        <div className="amount-input-wrapper">

                            <span>
                                ₹
                            </span>

                            <input
                                type="number"
                                min="1"
                                value={amount}
                                onChange={(e) =>
                                    setAmount(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter amount"
                            />

                        </div>

                    </div>


                    {/* PAYMENT METHODS */}

                    <div className="payment-section">

                        <label>
                            Payment Method
                        </label>


                        <div className="payment-methods">


                            <button
                                type="button"
                                className={
                                    paymentMethod === "UPI"
                                        ? "payment-method selected"
                                        : "payment-method"
                                }
                                onClick={() =>
                                    setPaymentMethod(
                                        "UPI"
                                    )
                                }
                            >

                                <span className="method-icon">
                                    UPI
                                </span>

                                <span>
                                    UPI
                                </span>

                                <span className="radio">
                                    {paymentMethod === "UPI"
                                        ? "●"
                                        : "○"}
                                </span>

                            </button>


                            <button
                                type="button"
                                className={
                                    paymentMethod === "CARD"
                                        ? "payment-method selected"
                                        : "payment-method"
                                }
                                onClick={() =>
                                    setPaymentMethod(
                                        "CARD"
                                    )
                                }
                            >

                                <span className="method-icon">
                                    CARD
                                </span>

                                <span>
                                    Credit / Debit Card
                                </span>

                                <span className="radio">
                                    {paymentMethod === "CARD"
                                        ? "●"
                                        : "○"}
                                </span>

                            </button>


                            <button
                                type="button"
                                className={
                                    paymentMethod === "NETBANKING"
                                        ? "payment-method selected"
                                        : "payment-method"
                                }
                                onClick={() =>
                                    setPaymentMethod(
                                        "NETBANKING"
                                    )
                                }
                            >

                                <span className="method-icon">
                                    BANK
                                </span>

                                <span>
                                    Net Banking
                                </span>

                                <span className="radio">
                                    {paymentMethod === "NETBANKING"
                                        ? "●"
                                        : "○"}
                                </span>

                            </button>

                        </div>

                    </div>


                    {/* SUMMARY */}

                    <div className="payment-summary">

                        <div>

                            <span>
                                Payment method
                            </span>

                            <strong>
                                {paymentMethod === "UPI"
                                    ? "UPI"
                                    : paymentMethod === "CARD"
                                        ? "Credit / Debit Card"
                                        : "Net Banking"}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Amount
                            </span>

                            <strong>
                                ₹{Number(amount || 0).toLocaleString("en-IN")}
                            </strong>

                        </div>


                        <div className="total-row">

                            <span>
                                Total
                            </span>

                            <strong>
                                ₹{Number(amount || 0).toLocaleString("en-IN")}
                            </strong>

                        </div>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="payment-error">
                            {error}
                        </div>

                    )}


                    {/* SUCCESS */}

                    {success && (

                        <div className="payment-success">
                            {success}
                        </div>

                    )}


                    {/* PAY BUTTON */}

                    <button
                        className="pay-button"
                        onClick={handlePayment}
                        disabled={loading}
                    >

                        {loading
                            ? "Processing Payment..."
                            : `Pay ₹${Number(amount || 0).toLocaleString("en-IN")}`
                        }

                    </button>


                    {/* BACK */}

                    <button
                        className="back-wallet-button"
                        onClick={() =>
                            navigate("/buyer/wallet")
                        }
                        disabled={loading}
                    >
                        ← Back to Wallet
                    </button>


                    <div className="secure-payment">

                        🔒 Secure OOPSIBID Payment

                    </div>

                </div>

            </main>


            <Footer />

        </div>
    );
}

export default BuyerPayment;