import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import BuyerNavbar from "../../components/BuyerNavbar";
import Footer from "../../components/Footer";

import "./BuyerWallet.css";

function BuyerWallet() {

    const navigate = useNavigate();

    const [wallet, setWallet] = useState(null);

    const [transactions, setTransactions] = useState([]);

    const [amount, setAmount] = useState("");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // ==========================================
    // LOAD WALLET
    // ==========================================

    const loadWallet = async () => {

        setLoading(true);
        setError("");

        try {

            const token =
                localStorage.getItem("token");

            if (!token) {

                setError(
                    "Please login as a buyer."
                );

                return;
            }


            const response = await fetch(
                "http://localhost:8081/api/wallet",
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


            console.log(
                "WALLET:",
                response.status,
                text
            );


            if (!response.ok) {

                setError(
                    `Server returned ${response.status}: ${text}`
                );

                return;
            }


            const data =
                text
                    ? JSON.parse(text)
                    : null;


            setWallet(data);


        } catch (error) {

            console.error(
                "Wallet loading error:",
                error
            );

            setError(
                "Unable to connect to server."
            );

        } finally {

            setLoading(false);
        }
    };


    // ==========================================
    // LOAD TRANSACTIONS
    // ==========================================

    const loadTransactions = async () => {

        try {

            const token =
                localStorage.getItem("token");


            if (!token) {
                return;
            }


            const response = await fetch(
                "http://localhost:8081/api/wallet/transactions",
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


            console.log(
                "TRANSACTIONS:",
                response.status,
                text
            );


            if (!response.ok) {

                console.error(
                    "Transaction error:",
                    text
                );

                return;
            }


            const data =
                text
                    ? JSON.parse(text)
                    : [];


            setTransactions(data);


        } catch (error) {

            console.error(
                "Transaction loading error:",
                error
            );
        }
    };


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {

        loadWallet();

        loadTransactions();

    }, []);


    // ==========================================
    // ADD MONEY
    // ==========================================
    //
    // IMPORTANT:
    //
    // We DO NOT add money directly here.
    //
    // We first send the buyer to the
    // payment page.
    //
    // Payment page will handle the payment
    // and only after successful payment will
    // the backend wallet be updated.
    //
    // ==========================================

    const handleAddMoney = () => {

        setError("");
        setSuccess("");


        const value =
            Number(amount);


        // --------------------------------------
        // VALIDATE AMOUNT
        // --------------------------------------

        if (!value || value <= 0) {

            setError(
                "Enter a valid amount."
            );

            return;
        }


        // --------------------------------------
        // GO TO PAYMENT PAGE
        // --------------------------------------

        navigate(
            "/buyer/payment",
            {
                state: {
                    amount: value
                }
            }
        );
    };


    // ==========================================
    // FORMAT MONEY
    // ==========================================

    const formatMoney = (value) => {

        return Number(value || 0)
            .toLocaleString(
                "en-IN",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );
    };


    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }


        return new Date(date)
            .toLocaleString("en-IN");
    };


    // ==========================================
    // GET TOTAL BALANCE
    // ==========================================
    //
    // Supports both:
    //
    // totalBalance
    //
    // and your current backend:
    //
    // balance
    //
    // ==========================================

    const getTotalBalance = () => {

        if (!wallet) {
            return 0;
        }


        if (
            wallet.totalBalance !== undefined
        ) {

            return wallet.totalBalance;
        }


        return wallet.balance || 0;
    };


    // ==========================================
    // GET AVAILABLE BALANCE
    // ==========================================

    const getAvailableBalance = () => {

        if (!wallet) {
            return 0;
        }


        if (
            wallet.availableBalance !== undefined
        ) {

            return wallet.availableBalance;
        }


        if (
            wallet.balance !== undefined &&
            wallet.reservedBalance !== undefined
        ) {

            return (
                Number(wallet.balance) -
                Number(wallet.reservedBalance)
            );
        }


        return 0;
    };


    // ==========================================
    // GET LOCKED BALANCE
    // ==========================================

    const getLockedBalance = () => {

        if (!wallet) {
            return 0;
        }


        if (
            wallet.lockedBalance !== undefined
        ) {

            return wallet.lockedBalance;
        }


        return wallet.reservedBalance || 0;
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="buyer-wallet-page">

                <BuyerNavbar />


                <main className="buyer-wallet-content">

                    <div className="wallet-message">

                        Loading your wallet...

                    </div>

                </main>


                <Footer />

            </div>
        );
    }


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div className="buyer-wallet-page">

            <BuyerNavbar />


            <main className="buyer-wallet-content">


                {/* =================================
                    HEADER
                ================================= */}

                <section className="buyer-wallet-header">

                    <div>

                        <span>
                            BUYER CENTER
                        </span>

                        <h1>
                            My Wallet
                        </h1>

                        <p>
                            Manage your funds and locked
                            bidding balance.
                        </p>

                    </div>


                    <button
                        onClick={() =>
                            navigate(
                                "/buyer/auctions"
                            )
                        }
                    >
                        Browse Auctions →
                    </button>

                </section>


                {/* =================================
                    ERROR
                ================================= */}

                {error && (

                    <div className="wallet-error">

                        {error}

                    </div>

                )}


                {/* =================================
                    SUCCESS
                ================================= */}

                {success && (

                    <div className="wallet-success">

                        {success}

                    </div>

                )}


                {wallet && (

                    <>


                        {/* =================================
                            BALANCE CARDS
                        ================================= */}

                        <section
                            className="wallet-balance-grid"
                        >


                            {/* TOTAL */}

                            <div
                                className=
                                    "wallet-balance-card total"
                            >

                                <span>
                                    TOTAL BALANCE
                                </span>

                                <strong>

                                    ₹
                                    {formatMoney(
                                        getTotalBalance()
                                    )}

                                </strong>

                                <small>
                                    Your complete wallet balance
                                </small>

                            </div>


                            {/* AVAILABLE */}

                            <div
                                className=
                                    "wallet-balance-card available"
                            >

                                <span>
                                    AVAILABLE
                                </span>

                                <strong>

                                    ₹
                                    {formatMoney(
                                        getAvailableBalance()
                                    )}

                                </strong>

                                <small>
                                    Available for bidding
                                </small>

                            </div>


                            {/* LOCKED */}

                            <div
                                className=
                                    "wallet-balance-card locked"
                            >

                                <span>
                                    LOCKED
                                </span>

                                <strong>

                                    ₹
                                    {formatMoney(
                                        getLockedBalance()
                                    )}

                                </strong>

                                <small>
                                    Funds reserved for bids
                                </small>

                            </div>


                        </section>


                        {/* =================================
                            ADD FUNDS + WALLET INFORMATION
                        ================================= */}

                        <section
                            className="wallet-main-grid"
                        >


                            {/* =================================
                                DEPOSIT CARD
                            ================================= */}

                            <div
                                className="deposit-card"
                            >

                                <div
                                    className="section-label"
                                >
                                    ADD FUNDS
                                </div>


                                <h2>
                                    Deposit Money
                                </h2>


                                <p>
                                    Add funds to your wallet
                                    before placing bids.
                                </p>


                                <form
                                    onSubmit={(event) => {

                                        event.preventDefault();

                                        handleAddMoney();

                                    }}
                                >


                                    <div
                                        className=
                                            "deposit-input"
                                    >

                                        <span>
                                            ₹
                                        </span>


                                        <input
                                            type="number"
                                            min="1"
                                            step="0.01"
                                            placeholder=
                                                "Enter amount"
                                            value={amount}
                                            onChange={(e) =>
                                                setAmount(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>


                                    <button
                                        type="submit"
                                    >
                                        Add Money
                                    </button>


                                </form>


                                <small
                                    style={{
                                        display: "block",
                                        marginTop: "12px",
                                        color: "#777"
                                    }}
                                >
                                    You will be redirected
                                    to the secure payment page.
                                </small>


                            </div>


                            {/* =================================
                                WALLET RULE
                            ================================= */}

                            <div
                                className=
                                    "wallet-info-card"
                            >

                                <div
                                    className=
                                        "section-label"
                                >
                                    OOPSIBID WALLET
                                </div>


                                <h2>
                                    Your money stays protected.
                                </h2>


                                <p>
                                    When you place a bid,
                                    the bid amount is locked
                                    from your available balance.
                                </p>


                                <div
                                    className="wallet-flow"
                                >

                                    <div>

                                        <strong>
                                            Available
                                        </strong>

                                        <span>
                                            → Bid
                                        </span>

                                    </div>


                                    <div>

                                        <strong>
                                            Locked
                                        </strong>

                                        <span>
                                            → Auction
                                        </span>

                                    </div>


                                    <div>

                                        <strong>
                                            Settlement
                                        </strong>

                                        <span>
                                            → Winner / Refund
                                        </span>

                                    </div>

                                </div>

                            </div>


                        </section>


                        {/* =================================
                            TRANSACTIONS
                        ================================= */}

                        <section
                            className=
                                "transactions-section"
                        >


                            <div
                                className=
                                    "transactions-header"
                            >

                                <div>

                                    <span>
                                        WALLET ACTIVITY
                                    </span>

                                    <h2>
                                        Transactions
                                    </h2>

                                </div>


                                <button
                                    onClick={() =>
                                        loadTransactions()
                                    }
                                >
                                    Refresh
                                </button>

                            </div>


                            {transactions.length === 0 ? (

                                <div
                                    className=
                                        "no-transactions"
                                >

                                    No wallet transactions yet.

                                </div>

                            ) : (

                                <div
                                    className=
                                        "transaction-list"
                                >

                                    {transactions.map(
                                        (transaction) => (

                                            <div
                                                className=
                                                    "transaction-row"
                                                key={
                                                    transaction.id
                                                }
                                            >


                                                {/* LEFT */}

                                                <div>

                                                    <strong>

                                                        {
                                                            transaction.type
                                                        }

                                                    </strong>


                                                    <span>

                                                        {
                                                            transaction.description ||
                                                            "-"
                                                        }

                                                    </span>

                                                </div>


                                                {/* RIGHT */}

                                                <div>

                                                    <strong>

                                                        {transaction.type ===
                                                        "DEPOSIT"
                                                            ? "+ "
                                                            : ""}

                                                        ₹
                                                        {formatMoney(
                                                            transaction.amount
                                                        )}

                                                    </strong>


                                                    <span>

                                                        {formatDate(
                                                            transaction.transactionTime
                                                        )}

                                                    </span>

                                                </div>


                                            </div>

                                        )
                                    )}

                                </div>

                            )}


                        </section>


                    </>

                )}


            </main>


            <Footer />

        </div>
    );
}


export default BuyerWallet;