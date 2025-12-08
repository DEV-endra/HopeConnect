// src/components/AuthChoiceModal.jsx
import styles from "../styles/AuthChoiceModal.module.css";
import { useNavigate } from "react-router-dom";

export default function AuthChoiceModal() {

  const navigate = useNavigate();
  const continueAsGuest = async () => {
    try {
      const res = await fetch("/api/GuestSignIn", {
        method: "POST"
      });

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", data.username);
      localStorage.setItem("name", data.name);
      localStorage.setItem("Id", data.Id);
      localStorage.setItem("avatar", data.avatar);
      // console.log(data.token);
      navigate("/HelpeeDashboard");
    } catch (err) {
      console.error("Guest login failed", err);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        <h2 className={styles.title}>Welcome to HopeConnect</h2>

        <p className={styles.subtitle}>
          “ The wound is the place where the Light enters you.”
                            ― Rumi
        </p>

        <div className={styles.actions}>
          <button
            className={styles.guestBtn}
            onClick={continueAsGuest}
          >
            Continue as Guest
            <span></span>
          </button>

          <button
            className={styles.loginBtn}
            onClick={() => window.location.href = "/login"}
          >
            Login
            <span> I already have an account</span>
          </button>

          <button
            className={styles.signupBtn}
            onClick={() => window.location.href = "/RoleSelection"}
          >
            Sign Up 
            <span> Connect with helpers</span>
          </button>
        </div>

      </div>
    </div>
  );
}
