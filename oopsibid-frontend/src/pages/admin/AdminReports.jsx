import { useEffect, useState } from "react";

import AdminNavbar from "../../components/AdminNavbar";
import Footer from "../../components/Footer";

import "./AdminReports.css";


function AdminReports() {

    const [report, setReport] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =========================
    // LOAD REPORT
    // =========================

    const loadReport = async () => {

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


            const response =
                await fetch(
                    "http://localhost:8081/api/admin/reports",
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
                    : {};


            console.log(
                "REPORT:",
                data
            );


            setReport(data);


        } catch (error) {

            console.error(
                "Report loading error:",
                error
            );

            setError(
                "Unable to load reports."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadReport();

    }, []);


    return (

        <div className="admin-reports-page">

            <AdminNavbar />


            <main className="admin-reports-content">


                {/* HEADER */}

                <div className="admin-reports-header">

                    <div>

                        <span>
                            ADMINISTRATION
                        </span>

                        <h1>
                            Platform Reports
                        </h1>

                        <p>
                            Overview of OOPSIBID platform activity.
                        </p>

                    </div>


                    <button
                        onClick={loadReport}
                    >
                        Refresh
                    </button>

                </div>


                {/* LOADING */}

                {loading && (

                    <div className="reports-message">
                        Loading reports...
                    </div>

                )}


                {/* ERROR */}

                {!loading && error && (

                    <div className="reports-error">
                        {error}
                    </div>

                )}


                {/* REPORT */}

                {!loading &&
                 !error &&
                 report && (

                    <>


                        {/* USERS */}

                        <section className="report-section">

                            <h2>
                                Users
                            </h2>


                            <div className="report-grid">

                                <div className="report-card">

                                    <span>
                                        TOTAL USERS
                                    </span>

                                    <strong>
                                        {report.totalUsers ?? 0}
                                    </strong>

                                </div>


                                <div className="report-card">

                                    <span>
                                        BUYERS
                                    </span>

                                    <strong>
                                        {report.totalBuyers ?? 0}
                                    </strong>

                                </div>


                                <div className="report-card">

                                    <span>
                                        SELLERS
                                    </span>

                                    <strong>
                                        {report.totalSellers ?? 0}
                                    </strong>

                                </div>


                                <div className="report-card danger-card">

                                    <span>
                                        BLOCKED USERS
                                    </span>

                                    <strong>
                                        {report.blockedUsers ?? 0}
                                    </strong>

                                </div>

                            </div>

                        </section>


                        {/* PRODUCTS */}

                        <section className="report-section">

                            <h2>
                                Products
                            </h2>


                            <div className="report-grid">

                                <div className="report-card">

                                    <span>
                                        TOTAL PRODUCTS
                                    </span>

                                    <strong>
                                        {report.totalProducts ?? 0}
                                    </strong>

                                </div>


                                <div className="report-card">

                                    <span>
                                        ACTIVE PRODUCTS
                                    </span>

                                    <strong>
                                        {report.activeProducts ?? 0}
                                    </strong>

                                </div>

                            </div>

                        </section>


                        {/* AUCTIONS */}

                        <section className="report-section">

                            <h2>
                                Auctions
                            </h2>


                            <div className="report-grid">

                                <div className="report-card">

                                    <span>
                                        TOTAL AUCTIONS
                                    </span>

                                    <strong>
                                        {report.totalAuctions ?? 0}
                                    </strong>

                                </div>


                                <div className="report-card">

                                    <span>
                                        ACTIVE
                                    </span>

                                    <strong>
                                        {report.activeAuctions ?? 0}
                                    </strong>

                                </div>


                                <div className="report-card">

                                    <span>
                                        PENDING
                                    </span>

                                    <strong>
                                        {report.pendingAuctions ?? 0}
                                    </strong>

                                </div>


                                <div className="report-card">

                                    <span>
                                        COMPLETED
                                    </span>

                                    <strong>
                                        {report.completedAuctions ?? 0}
                                    </strong>

                                </div>

                            </div>

                        </section>


                        {/* BIDS */}

                        <section className="report-section">

                            <h2>
                                Bids
                            </h2>


                            <div className="report-grid">

                                <div className="report-card">

                                    <span>
                                        TOTAL BIDS
                                    </span>

                                    <strong>
                                        {report.totalBids ?? 0}
                                    </strong>

                                </div>


                                <div className="report-card">

                                    <span>
                                        ACTIVE BIDS
                                    </span>

                                    <strong>
                                        {report.activeBids ?? 0}
                                    </strong>

                                </div>


                                <div className="report-card danger-card">

                                    <span>
                                        BLOCKED BIDS
                                    </span>

                                    <strong>
                                        {report.blockedBids ?? 0}
                                    </strong>

                                </div>

                            </div>

                        </section>

                    </>

                )}

            </main>


            <Footer />

        </div>
    );
}


export default AdminReports;