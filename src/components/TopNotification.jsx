import { useEffect, useState } from "react";
import styles from "../styles/TopNotification.module.css";

export default function TopNotification({
  show,
  message,
  duration = 4000,
  onClose
}) {

  useEffect(() => {
    if (!show) return;

    console.log("Timer started");

    const t = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(t);

  }, [show, duration, onClose]);

  if (!show) return null;

  return (
    <div className={styles.notification}>
      <span className={styles.text}>{message}</span>

      <button className={styles.close} onClick={onClose}>✖</button>

      <div className={styles.progressWrap}>
        <div
          className={styles.progress}
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
    </div>
  );
}