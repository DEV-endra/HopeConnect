import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importing navigation hook
import styles from "../styles/RoleSelection.module.css"; // Importing CSS module

export default function RoleSelection() {
  const [role, setRole] = useState(null);
  const navigate = useNavigate(); // Initialize navigation

  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);

    if (selectedRole === "helper") {
      navigate("/map");              // Redirect to map page when selecting "I Want to Help"
    }
  };

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <h1 className={styles.title}>🌍 HopeConnect</h1>
        <p className={styles.subtitle}>
          AI-Powered Hope, Human-Driven Change
        </p>

        <div className={styles.buttonContainer}>
          <button
            className={`${styles.button} ${
              role === "seeker" ? styles.selectedSeeker : ""
            }`}
            onClick={() => handleRoleSelection("seeker")}
          >
            💙 I Need Help
          </button>

          <button
            className={`${styles.button} ${
              role === "helper" ? styles.selectedHelper : ""
            }`}
            onClick={() => handleRoleSelection("helper")}
          >
            🤝 I Want to Help
          </button>
        </div>

        {role && role === "seeker" && (
          <p className={styles.message}>
            We’re here for you. You are not alone. ❤️
          </p>
        )}
      </div>
    </div>
  );
}
