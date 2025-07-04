import React from "react";
import styles from "../styles/building-page.module.css";
import Logo from "../assets/Logo.png";
const BuildingPage = () => {
    return (
        <main className={styles.mainWrapper}>
            <div className={styles.backgroundCircle} />
            <section className={`${styles.card} ${styles.fadeIn}`}>
                <img
                    src={Logo} alt="HopeConnect"
                    className={styles.logo}
                />
                <h1 className={styles.headline}>
                    We’re still building<br />HopeConnect
                </h1>
                <hr className={styles.divider} />
                <p className={styles.message}>
                    Our core features are ready. We’re putting the final pieces in place — check back soon!
                </p>
                <a href="/dashboard" className={styles.backBtn}>
                    ← Back to Dashboard
                </a>
                <footer className={styles.footer}>
                    Made with 💙 at HopeConnect
                </footer>
            </section>
        </main>
    );
};

export default BuildingPage;
