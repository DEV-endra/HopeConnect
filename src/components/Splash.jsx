import { useEffect, useRef } from "react";
import styles from "../styles/splash.module.css"; // Importing CSS module

const Splash = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    console.log("hello");
    const handleMouseMove = (e) => {
      const cursor = cursorRef.current;
      if (cursor) {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
        cursor.classList.add(styles.Splash);
        setTimeout(() => cursor.classList.remove(styles.Splash), 300);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return <div className={styles.Splash} ref={cursorRef}></div>;
};

export default Splash;