import { useEffect, useState } from "react";

import BuyerNavbar from "../../components/BuyerNavbar";
import Footer from "../../components/Footer";

import "./BuyerProfile.css";


function BuyerProfile() {

    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =====================================================
    // LOAD PROFILE
    // =====================================================

    const loadProfile = async () => {

        setLoading(true);
        setError("");

        try {

            const token =
                localStorage.getItem("token");


            if (!token) {

                setError(
                    "Please login to view your profile."
                );

                setLoading(false);

                return;
            }


            const response =
                await fetch(
                    "http://localhost:8081/api/profile",
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


            const responseText =
                await response.text();


            console.log(
                "PROFILE:",
                response.status,
                responseText
            );


            if (!response.ok) {

                setError(
                    `Server returned ${response.status}: ${responseText}`
                );

                return;
            }


            const data =
                responseText
                    ? JSON.parse(responseText)
                    : null;


            setProfile(data);


        } catch (error) {

            console.error(
                "Profile loading error:",
                error
            );

            setError(
                "Unable to connect to server."
            );

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // LOAD WHEN PAGE OPENS
    // =====================================================

    useEffect(() => {

        loadProfile();

    }, []);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="buyer-profile-page">

                <BuyerNavbar />

                <main className="buyer-profile-content">

                    <div className="profile-message">

                        Loading profile...

                    </div>

                </main>

                <Footer />

            </div>
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <div className="buyer-profile-page">

                <BuyerNavbar />

                <main className="buyer-profile-content">

                    <div className="profile-error">

                        <h2>
                            Unable to load profile
                        </h2>

                        <p>
                            {error}
                        </p>

                        <button
                            onClick={loadProfile}
                        >
                            Try Again
                        </button>

                    </div>

                </main>

                <Footer />

            </div>
        );
    }


    // =====================================================
    // PROFILE
    // =====================================================

    return (

        <div className="buyer-profile-page">

            <BuyerNavbar />


            <main className="buyer-profile-content">

                <section className="buyer-profile-header">

                    <div>

                        <span>
                            BUYER CENTER
                        </span>

                        <h1>
                            My Profile
                        </h1>

                        <p>
                            View your OOPSIBID account information.
                        </p>

                    </div>

                    <button
                        className="profile-refresh-button"
                        onClick={loadProfile}
                    >
                        Refresh
                    </button>

                </section>


                <section className="profile-card">

                    {/* =================================================
                        PROFILE HEADER
                    ================================================= */}

                    <div className="profile-card-header">

                        <div className="profile-avatar">

                            {profile?.name
                                ? profile.name
                                    .charAt(0)
                                    .toUpperCase()
                                : "U"}

                        </div>


                        <div>

                            <h2>
                                {profile?.name ||
                                    "User"}
                            </h2>

                            <p>
                                {profile?.email ||
                                    "-"}
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        ACCOUNT TYPE
                    ================================================= */}

                    <div className="profile-role">

                        <span>
                            ACCOUNT TYPE
                        </span>

                        <strong>
                            {profile?.role ||
                                "BUYER"}
                        </strong>

                    </div>


                    {/* =================================================
                        INFORMATION
                    ================================================= */}

                    <div className="profile-information">

                        <div className="profile-info-item">

                            <span>
                                FULL NAME
                            </span>

                            <strong>
                                {profile?.name ||
                                    "-"}
                            </strong>

                        </div>


                        <div className="profile-info-item">

                            <span>
                                EMAIL ADDRESS
                            </span>

                            <strong>
                                {profile?.email ||
                                    "-"}
                            </strong>

                        </div>


                        <div className="profile-info-item">

                            <span>
                                ACCOUNT STATUS
                            </span>

                            <strong className="profile-active">

                                {profile?.status ||
                                    "ACTIVE"}

                            </strong>

                        </div>


                        <div className="profile-info-item">

                            <span>
                                USER ID
                            </span>

                            <strong className="profile-user-id">

                                {profile?.id ||
                                    "-"}

                            </strong>

                        </div>

                    </div>


                    {/* =================================================
                        MEMBER SINCE
                    ================================================= */}

                    <div className="profile-footer">

                        <span>
                            MEMBER SINCE
                        </span>

                        <strong>
                            {profile?.createdAt
                                ? new Date(
                                    profile.createdAt
                                ).toLocaleDateString(
                                    "en-IN"
                                )
                                : "-"}
                        </strong>

                    </div>

                </section>

            </main>


            <Footer />

        </div>
    );
}


export default BuyerProfile;