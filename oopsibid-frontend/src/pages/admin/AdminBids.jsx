import { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import Footer from "../../components/Footer";

import "./AdminBids.css";

function AdminBids() {

    const [bids, setBids] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =========================
    // LOAD BIDS
    // =========================

    const loadBids = async () => {

        setLoading(true);
        setError("");

        try {

            const token =
                localStorage.getItem("token");

            if (!token) {

                setError(
                    "Admin login required."
                );

                return;
            }


            const response = await fetch(
                "http://localhost:8081/api/admin/bids",
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

                console.error(
                    "Server response:",
                    responseText
                );

                setError(
                    `Server returned ${response.status}: ${responseText}`
                );

                return;
            }


            const data =
                responseText
                    ? JSON.parse(responseText)
                    : [];


            console.log(
                "BIDS:",
                data
            );


            setBids(data);


        } catch (error) {

            console.error(
                "Bid loading error:",
                error
            );

            setError(
                "Unable to load bids."
            );

        } finally {

            setLoading(false);

        }
    };


    // =========================
    // LOAD WHEN PAGE OPENS
    // =========================

    useEffect(() => {

        loadBids();

    }, []);


    // =========================
    // BLOCK / UNBLOCK BID
    // =========================

    const updateBidStatus =
        async (id, action) => {

        try {

            const token =
                localStorage.getItem("token");


            let endpoint = "";


            if (action === "block") {

                endpoint =
                    `/api/admin/bids/${id}/block`;

            } else if (action === "unblock") {

                endpoint =
                    `/api/admin/bids/${id}/unblock`;

            }


            const response =
                await fetch(
                    `http://localhost:8081${endpoint}`,
                    {
                        method: "PUT",

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
                    "Unable to update bid."
                );

                return;
            }


            alert(
                "Bid status updated successfully."
            );


            loadBids();


        } catch (error) {

            console.error(error);

            alert(
                "Unable to connect to server."
            );
        }
    };


    // =========================
    // DELETE BID
    // =========================

    const deleteBid =
        async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this bid?"
            );


        if (!confirmDelete) {
            return;
        }


        try {

            const token =
                localStorage.getItem("token");


            const response =
                await fetch(
                    `http://localhost:8081/api/admin/bids/${id}`,
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
                    "Unable to delete bid."
                );

                return;
            }


            alert(
                "Bid deleted successfully."
            );


            loadBids();


        } catch (error) {

            console.error(error);

            alert(
                "Unable to connect to server."
            );
        }
    };


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

        <div className="admin-bids-page">

            {/* =========================
                NAVBAR
            ========================= */}

            <AdminNavbar />


            {/* =========================
                CONTENT
            ========================= */}

            <main className="admin-bids-content">


                {/* HEADER */}

                <div className="admin-bids-header">

                    <div>

                        <span>
                            ADMINISTRATION
                        </span>

                        <h1>
                            Bid Management
                        </h1>

                        <p>
                            Monitor and manage all platform bids.
                        </p>

                    </div>


                    <button
                        onClick={loadBids}
                    >
                        Refresh
                    </button>

                </div>


                {/* =========================
                    LOADING
                ========================= */}

                {loading && (

                    <div className="bids-message">

                        Loading bids...

                    </div>

                )}


                {/* =========================
                    ERROR
                ========================= */}

                {!loading && error && (

                    <div className="bids-error">

                        {error}

                    </div>

                )}


                {/* =========================
                    TABLE
                ========================= */}

                {!loading &&
                 !error && (

                    <div className="bids-table-container">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        Bid ID
                                    </th>

                                    <th>
                                        Auction ID
                                    </th>

                                    <th>
                                        Bidder ID
                                    </th>

                                    <th>
                                        Amount
                                    </th>

                                    <th>
                                        Bid Time
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {bids.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="empty-bids"
                                        >
                                            No bids found.
                                        </td>

                                    </tr>

                                ) : (

                                    bids.map(
                                        (bid) => (

                                        <tr
                                            key={bid.id}
                                        >

                                            <td>
                                                {bid.id || "-"}
                                            </td>


                                            <td>
                                                {bid.auctionId || "-"}
                                            </td>


                                            <td>
                                                {bid.bidderId || "-"}
                                            </td>


                                            <td className="bid-amount">

                                                ₹
                                                {Number(
                                                    bid.amount || 0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}

                                            </td>


                                            <td>

                                                {bid.bidTime
                                                    ? new Date(
                                                        bid.bidTime
                                                      ).toLocaleString()
                                                    : "-"
                                                }

                                            </td>


                                            <td>

                                                <span
                                                    className={
                                                        `bid-status ${getStatusClass(
                                                            bid.status
                                                        )}`
                                                    }
                                                >

                                                    {bid.status ||
                                                        "UNKNOWN"}

                                                </span>

                                            </td>


                                            <td>

                                                <div className="bid-actions">


                                                    {bid.status ===
                                                        "ACTIVE" && (

                                                        <button
                                                            className="block-button"
                                                            onClick={() =>
                                                                updateBidStatus(
                                                                    bid.id,
                                                                    "block"
                                                                )
                                                            }
                                                        >
                                                            Block
                                                        </button>

                                                    )}


                                                    {bid.status ===
                                                        "BLOCKED" && (

                                                        <button
                                                            className="unblock-button"
                                                            onClick={() =>
                                                                updateBidStatus(
                                                                    bid.id,
                                                                    "unblock"
                                                                )
                                                            }
                                                        >
                                                            Unblock
                                                        </button>

                                                    )}


                                                    <button
                                                        className="delete-button"
                                                        onClick={() =>
                                                            deleteBid(
                                                                bid.id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>


                                                </div>

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </main>


            {/* =========================
                FOOTER
            ========================= */}

            <Footer />

        </div>
    );
}

export default AdminBids;