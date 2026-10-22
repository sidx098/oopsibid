import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import SellerNavbar from "../../components/SellerNavbar";
import Footer from "../../components/Footer";

import "./SellerProfile.css";


function SellerProfile() {

    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);

    const [name, setName] = useState("");

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // ==========================================
    // LOAD PROFILE
    // ==========================================

    const loadProfile = async () => {

        setLoading(true);
        setError("");

        try {

            const token =
                localStorage.getItem("token");


            if (!token) {

                navigate("/login");

                return;
            }


            const response =
                await fetch(
                    "http://localhost:8081/api/users/profile",
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


            const text =
                await response.text();


            console.log(
                "PROFILE:",
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


            setProfile(data);

            setName(
                data?.name || ""
            );


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


    // ==========================================
    // LOAD ON PAGE OPEN
    // ==========================================

    useEffect(() => {

        loadProfile();

    }, []);


    // ==========================================
    // UPDATE PROFILE
    // ==========================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        if (!name.trim()) {

            setError(
                "Name cannot be empty."
            );

            return;
        }


        try {

            setSaving(true);

            const token =
                localStorage.getItem("token");


            const response =
                await fetch(
                    "http://localhost:8081/api/users/profile",
                    {
                        method: "PUT",

                        headers: {
                            "Authorization":
                                `Bearer ${token}`,

                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            name: name.trim()
                        })
                    }
                );


            const text =
                await response.text();


            if (!response.ok) {

                setError(
                    text ||
                    "Unable to update profile."
                );

                return;
            }


            const data =
                JSON.parse(text);


            setProfile(data);

            setName(
                data.name || ""
            );


            setSuccess(
                "Profile updated successfully."
            );


        } catch (error) {

            console.error(
                "Profile update error:",
                error
            );

            setError(
                "Unable to connect to server."
            );

        } finally {

            setSaving(false);
        }
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="seller-profile-page">

                <SellerNavbar />

                <main className="seller-profile-content">

                    <div className="profile-loading">

                        Loading profile...

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

        <div className="seller-profile-page">

            <SellerNavbar />


            <main className="seller-profile-content">


                {/* =================================
                    HEADER
                ================================= */}

                <section className="seller-profile-header">

                    <div>

                        <span>
                            SELLER CENTER
                        </span>

                        <h1>
                            My Profile
                        </h1>

                        <p>
                            Manage your OOPSIBID account information.
                        </p>

                    </div>

                </section>


                {/* =================================
                    ERROR
                ================================= */}

                {error && (

                    <div className="profile-error">

                        {error}

                    </div>

                )}


                {/* =================================
                    SUCCESS
                ================================= */}

                {success && (

                    <div className="profile-success">

                        {success}

                    </div>

                )}


                {profile && (

                    <section className="profile-layout">


                        {/* =================================
                            PROFILE CARD
                        ================================= */}

                        <div className="profile-card">


                            <div className="profile-avatar">

                                {profile.name
                                    ? profile.name
                                        .charAt(0)
                                        .toUpperCase()
                                    : "S"
                                }

                            </div>


                            <h2>
                                {profile.name}
                            </h2>


                            <p>
                                {profile.email}
                            </p>


                            <span className="profile-role">

                                {profile.role || "SELLER"}

                            </span>


                            <div className="profile-divider"></div>


                            <div className="profile-account-info">

                                <div>

                                    <small>
                                        ACCOUNT STATUS
                                    </small>

                                    <strong>
                                        {profile.status || "ACTIVE"}
                                    </strong>

                                </div>


                                <div>

                                    <small>
                                        MEMBER SINCE
                                    </small>

                                    <strong>
                                        {profile.createdAt
                                            ? new Date(
                                                profile.createdAt
                                            ).toLocaleDateString(
                                                "en-IN"
                                            )
                                            : "-"
                                        }
                                    </strong>

                                </div>

                            </div>

                        </div>


                        {/* =================================
                            EDIT PROFILE
                        ================================= */}

                        <div className="profile-edit-card">

                            <div className="profile-card-heading">

                                <span>
                                    ACCOUNT
                                </span>

                                <h2>
                                    Profile Information
                                </h2>

                                <p>
                                    Update your personal information.
                                </p>

                            </div>


                            <form
                                onSubmit={handleSubmit}
                                className="profile-form"
                            >


                                {/* NAME */}

                                <div className="profile-field">

                                    <label>
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) =>
                                            setName(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter your name"
                                    />

                                </div>


                                {/* EMAIL */}

                                <div className="profile-field">

                                    <label>
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        value={profile.email || ""}
                                        disabled
                                    />

                                    <small>
                                        Email cannot be changed.
                                    </small>

                                </div>


                                {/* ROLE */}

                                <div className="profile-field">

                                    <label>
                                        Account Role
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            profile.role || "SELLER"
                                        }
                                        disabled
                                    />

                                </div>


                                {/* BUTTON */}

                                <button
                                    type="submit"
                                    className="save-profile-button"
                                    disabled={saving}
                                >

                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"
                                    }

                                </button>

                            </form>

                        </div>

                    </section>
                )}


            </main>


            <Footer />

        </div>
    );
}


export default SellerProfile;