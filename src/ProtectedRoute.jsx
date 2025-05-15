import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [valid, setValid] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setValid(false);
                setLoading(false);
                return;
            }
            try {
                const response = await fetch("/api/users/verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token }),
                });

                const data = await response.json();
                setValid(data.status === "valid");
            } catch (err) {
                console.error("Auth check failed:", err);
                setValid(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) return <div>Loading...</div>;

    return valid ? children : <Navigate to="/Login" />;
};

export default ProtectedRoute;
