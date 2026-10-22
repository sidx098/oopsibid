import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminNavbar from "../../components/AdminNavbar";
import Footer from "../../components/Footer";

import "./AdminUsers.css";

function AdminUsers() {

    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================
    // LOAD USERS
    // =========================

    useEffect(() => {

        const token =
            localStorage.getItem("token");

        const role =
            localStorage.getItem("role");


        if (!token) {

            navigate("/login");

            return;
        }


        fetchUsers(token);

    }, [navigate]);


    // =========================
    // FETCH USERS
    // =========================

    const fetchUsers = async (token) => {

        try {

            setError("");

            const response = await fetch(
                "http://localhost:8081/api/admin/users",
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


            console.log(
                "GET USERS STATUS:",
                response.status
            );


            const responseText =
                await response.text();


            console.log(
                "GET USERS RESPONSE:",
                responseText
            );


            if (!response.ok) {

                throw new Error(
                    `Server returned ${response.status}: ${responseText}`
                );
            }


            const data =
                JSON.parse(responseText);


            console.log(
                "USERS:",
                data
            );


            setUsers(data);


        } catch (error) {

            console.error(
                "FETCH USERS ERROR:",
                error
            );


            setError(
                error.message
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================
    // BLOCK / UNBLOCK USER
    // =========================

    const handleUserStatus = async (
        userId,
        action
    ) => {

        const token =
            localStorage.getItem("token");


        if (!token) {

            alert(
                "Admin session expired. Please login again."
            );

            navigate("/login");

            return;
        }


        try {

            const response = await fetch(

                `http://localhost:8081/api/admin/users/${userId}/${action}`,

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


            console.log(
                "STATUS UPDATE:",
                response.status
            );


            console.log(
                "SERVER RESPONSE:",
                result
            );


            if (!response.ok) {

                alert(
                    result ||
                    "Unable to update user."
                );

                return;
            }


            // Reload users
            await fetchUsers(token);


        } catch (error) {

            console.error(
                "STATUS UPDATE ERROR:",
                error
            );


            alert(
                "Unable to connect to server."
            );
        }
    };


    // =========================
    // PAGE
    // =========================

    return (

        <div className="admin-users-page">

            <AdminNavbar />


            <main className="admin-users-content">

                <div className="admin-users-header">

                    <div>

                        <span>
                            ADMIN PANEL
                        </span>

                        <h1>
                            User Management
                        </h1>

                        <p>
                            Manage buyers, sellers
                            and administrator accounts.
                        </p>

                    </div>


                    <button
                        onClick={() =>
                            navigate(
                                "/admin/dashboard"
                            )
                        }
                    >
                        ← Dashboard
                    </button>

                </div>


                {/* =========================
                    LOADING
                ========================= */}

                {loading && (

                    <div className="users-message">
                        Loading users...
                    </div>

                )}


                {/* =========================
                    ERROR
                ========================= */}

                {error && (

                    <div className="users-error">
                        {error}
                    </div>

                )}


                {/* =========================
                    USERS TABLE
                ========================= */}

                {!loading &&
                 !error && (

                    <div className="users-table-container">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        Name
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Role
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Created
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {users.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="6"
                                            className="empty-users"
                                        >
                                            No users found.
                                        </td>

                                    </tr>

                                ) : (

                                    users.map((user) => (

                                        <tr
                                            key={user.id}
                                        >

                                            <td>
                                                {user.name}
                                            </td>


                                            <td>
                                                {user.email}
                                            </td>


                                            <td>

                                                <span
                                                    className={
                                                        `role-badge ${user.role?.toLowerCase()}`
                                                    }
                                                >
                                                    {user.role}
                                                </span>

                                            </td>


                                            <td>

                                                <span
                                                    className={
                                                        `status-badge ${user.status?.toLowerCase()}`
                                                    }
                                                >
                                                    {user.status}
                                                </span>

                                            </td>


                                            <td>

                                                {user.createdAt
                                                    ? new Date(
                                                        user.createdAt
                                                    ).toLocaleDateString()
                                                    : "-"
                                                }

                                            </td>


                                            <td>

                                                {user.role?.toUpperCase() ===
                                                "ADMIN" ? (

                                                    <span className="admin-protected">
                                                        Protected
                                                    </span>

                                                ) : user.status?.toUpperCase() ===
                                                  "BLOCKED" ? (

                                                    <button
                                                        className="unblock-button"
                                                        onClick={() =>
                                                            handleUserStatus(
                                                                user.id,
                                                                "unblock"
                                                            )
                                                        }
                                                    >
                                                        Unblock
                                                    </button>

                                                ) : (

                                                    <button
                                                        className="block-button"
                                                        onClick={() =>
                                                            handleUserStatus(
                                                                user.id,
                                                                "block"
                                                            )
                                                        }
                                                    >
                                                        Block
                                                    </button>

                                                )}

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

export default AdminUsers;