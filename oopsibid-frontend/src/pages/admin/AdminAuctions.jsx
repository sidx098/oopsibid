import { useEffect, useState } from "react";

import AdminNavbar from "../../components/AdminNavbar";
import Footer from "../../components/Footer";

import "./AdminAuctions.css";


function AdminAuctions() {

    const [auctions, setAuctions] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =========================
    // LOAD AUCTIONS
    // =========================

    const loadAuctions = async () => {

        setLoading(true);
        setError("");

        try {

            const token =
                localStorage.getItem("token");


            console.log(
                "ADMIN TOKEN:",
                token
            );


            if (!token) {

                setError(
                    "Admin login required. Please login again."
                );

                setLoading(false);

                return;
            }


            const response = await fetch(
                "http://localhost:8081/api/admin/auctions",
                {
                    method: "GET",

                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );


            const responseText =
                await response.text();


            console.log(
                "AUCTION STATUS:",
                response.status
            );

            console.log(
                "AUCTION RESPONSE:",
                responseText
            );


            // =========================
            // UNAUTHORIZED
            // =========================

            if (response.status === 401) {

                setError(
                    "Your login session has expired. Please login again."
                );

                localStorage.removeItem("token");

                return;
            }


            // =========================
            // FORBIDDEN
            // =========================

            if (response.status === 403) {

                setError(
                    "Access denied. Only an administrator can view auctions."
                );

                return;
            }


            // =========================
            // OTHER ERROR
            // =========================

            if (!response.ok) {

                setError(
                    `Server returned ${response.status}: ${responseText}`
                );

                return;
            }


            // =========================
            // SUCCESS
            // =========================

            const data =
                responseText
                    ? JSON.parse(responseText)
                    : [];


            console.log(
                "AUCTIONS:",
                data
            );


            setAuctions(data);

        } catch (error) {

            console.error(
                "Auction loading error:",
                error
            );

            setError(
                "Unable to connect to server."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================
    // LOAD PAGE
    // =========================

    useEffect(() => {

        loadAuctions();

    }, []);


    // =========================
    // UPDATE STATUS
    // =========================

    const updateAuctionStatus =
        async (id, action) => {

        try {

            const token =
                localStorage.getItem("token");


            if (!token) {

                alert(
                    "Admin login required."
                );

                return;
            }


            let endpoint = "";


            if (action === "approve") {

                endpoint =
                    `/api/admin/auctions/${id}/approve`;

            }

            else if (action === "reject") {

                endpoint =
                    `/api/admin/auctions/${id}/reject`;

            }

            else if (action === "stop") {

                endpoint =
                    `/api/admin/auctions/${id}/stop`;

            }


            const response =
                await fetch(
                    `http://localhost:8081${endpoint}`,
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


            if (response.status === 403) {

                alert(
                    "Access denied. Admin permission required."
                );

                return;
            }


            if (!response.ok) {

                alert(
                    result ||
                    "Unable to update auction."
                );

                return;
            }


            alert(
                "Auction updated successfully."
            );


            loadAuctions();

        }

        catch (error) {

            console.error(
                "Update auction error:",
                error
            );

            alert(
                "Unable to connect to server."
            );
        }
    };


    // =========================
    // DELETE
    // =========================

    const deleteAuction =
        async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this auction?"
            );


        if (!confirmDelete) {

            return;
        }


        try {

            const token =
                localStorage.getItem("token");


            if (!token) {

                alert(
                    "Admin login required."
                );

                return;
            }


            const response =
                await fetch(
                    `http://localhost:8081/api/admin/auctions/${id}`,
                    {
                        method: "DELETE",

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


            if (response.status === 403) {

                alert(
                    "Access denied. Admin permission required."
                );

                return;
            }


            if (!response.ok) {

                alert(
                    result ||
                    "Unable to delete auction."
                );

                return;
            }


            alert(
                "Auction deleted successfully."
            );


            loadAuctions();

        }

        catch (error) {

            console.error(
                "Delete auction error:",
                error
            );

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

        <div className="admin-auctions-page">


            <AdminNavbar />


            <main className="admin-auctions-content">


                {/* HEADER */}

                <div className="admin-auctions-header">

                    <div>

                        <span>
                            ADMINISTRATION
                        </span>

                        <h1>
                            Auction Management
                        </h1>

                        <p>
                            Monitor and manage all platform auctions.
                        </p>

                    </div>


                    <button
                        onClick={loadAuctions}
                    >
                        Refresh
                    </button>

                </div>


                {/* LOADING */}

                {loading && (

                    <div className="auctions-message">

                        Loading auctions...

                    </div>

                )}


                {/* ERROR */}

                {!loading && error && (

                    <div className="auctions-error">

                        {error}

                    </div>

                )}


                {/* TABLE */}

                {!loading &&
                 !error && (

                    <div className="auctions-table-container">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        Product ID
                                    </th>

                                    <th>
                                        Seller ID
                                    </th>

                                    <th>
                                        Starting Price
                                    </th>

                                    <th>
                                        Start
                                    </th>

                                    <th>
                                        End
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Winner
                                    </th>

                                    <th>
                                        Winning Bid
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {auctions.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="9"
                                            className="empty-auctions"
                                        >
                                            No auctions found.
                                        </td>

                                    </tr>

                                ) : (

                                    auctions.map(
                                        (auction) => (

                                        <tr
                                            key={
                                                auction.id
                                            }
                                        >

                                            <td>
                                                {auction.productId || "-"}
                                            </td>


                                            <td>
                                                {auction.sellerId || "-"}
                                            </td>


                                            <td>

                                                ₹
                                                {Number(
                                                    auction.startingPrice
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}

                                            </td>


                                            <td>

                                                {auction.startTime
                                                    ? new Date(
                                                        auction.startTime
                                                    ).toLocaleString()
                                                    : "-"
                                                }

                                            </td>


                                            <td>

                                                {auction.endTime
                                                    ? new Date(
                                                        auction.endTime
                                                    ).toLocaleString()
                                                    : "-"
                                                }

                                            </td>


                                            <td>

                                                <span
                                                    className={
                                                        `auction-status ${getStatusClass(
                                                            auction.status
                                                        )}`
                                                    }
                                                >

                                                    {auction.status ||
                                                        "UNKNOWN"}

                                                </span>

                                            </td>


                                            <td>
                                                {auction.winnerId || "-"}
                                            </td>


                                            <td>

                                                {auction.winningBid != null
                                                    ? `₹${Number(
                                                        auction.winningBid
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}`
                                                    : "-"
                                                }

                                            </td>


                                            <td>

                                                <div className="auction-actions">


                                                    {auction.status ===
                                                        "PENDING" && (

                                                        <>

                                                            <button
                                                                className="approve-button"
                                                                onClick={() =>
                                                                    updateAuctionStatus(
                                                                        auction.id,
                                                                        "approve"
                                                                    )
                                                                }
                                                            >
                                                                Approve
                                                            </button>


                                                            <button
                                                                className="reject-button"
                                                                onClick={() =>
                                                                    updateAuctionStatus(
                                                                        auction.id,
                                                                        "reject"
                                                                    )
                                                                }
                                                            >
                                                                Reject
                                                            </button>

                                                        </>

                                                    )}


                                                    {auction.status ===
                                                        "APPROVED" && (

                                                        <button
                                                            className="stop-button"
                                                            onClick={() =>
                                                                updateAuctionStatus(
                                                                    auction.id,
                                                                    "stop"
                                                                )
                                                            }
                                                        >
                                                            Stop
                                                        </button>

                                                    )}


                                                    <button
                                                        className="delete-button"
                                                        onClick={() =>
                                                            deleteAuction(
                                                                auction.id
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


            <Footer />

        </div>
    );
}


export default AdminAuctions;