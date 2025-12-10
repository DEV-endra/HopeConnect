import React, { useEffect, useState,useCallback } from "react";
import { useNavigate,Navigate, useLocation } from "react-router-dom";
import AuthChoiceModal from "./components/AuthChoiceModal";
import TopNotification from "./components/TopNotification.jsx";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const [roleCheck, setRoleCheck] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const helperRoutes = ["/HelperDashboard", "/map", "/connect"];
  const helpeeRoutes = ["/HelpeeDashboard", "/audio_connect", "/philosophy", "/connect"];
  const guestRoutes  = ["/HelpeeDashboard"];
  const [show, setShow] = useState(false);
  
  const handleClose = useCallback(() => {
      setShow(false);
  }, []);

  const isPathMatch = (routes, path) =>
    routes.some(route => path.startsWith(route));

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setValid(false);
        setRoleCheck(false);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token })
        });

        const data = await response.json();

        const isValid = data.status === "valid";
        setValid(isValid);

        let allowed = false;

        if (isValid) {
          if (isPathMatch(helperRoutes, location.pathname) && data.role === "helper")
            allowed = true;

          else if (isPathMatch(helpeeRoutes, location.pathname) && data.role === "helpee")
            allowed = true;

          else if (isPathMatch(guestRoutes, location.pathname) && data.role === "guest")
            allowed = true;
        }

        setRoleCheck(allowed);

      } catch (err) {
        console.error("Auth check failed:", err);
        setValid(false);
        setRoleCheck(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname]);  

    useEffect(() => {
    if (!loading && (!valid || !roleCheck)) {
        
        setShow(true);
        if (window.history.length > 2) {
            navigate(-1);
        } else {
            navigate("/", { replace: true });
        }
    }
    }, [loading, valid, roleCheck]);

    if (loading) return null;
    if (!valid || !roleCheck) return null;

    return (
        <>
        <TopNotification
            show={show}
            message="Sign In to continue"
            duration={3000}
            onClose={handleClose}
        />
        {children}
        </>
    );
};

export default ProtectedRoute;