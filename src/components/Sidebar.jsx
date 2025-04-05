import { useEffect, useState } from "react";
import {
    LogOut,
    Settings,
    User,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "../styles/side-bar.module.css";

export default function SideBar({ isopen, onCloseSidebar, userData, onUpdateUserData }) {
    // console.log(isopen);
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(isopen);

    // Ensure state follows the `isopen` prop
    useEffect(() => {
        // console.log("Prop isopen changed to:", isopen);
        setIsSidebarOpen(isopen);
    }, [isopen]);

    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");
    const name = localStorage.getItem("name");

    return (
        <>
            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.active : ""}`}>
                <div className={styles.logo}>Hope Connect</div>
                <div className={styles.userInfo}>
                    <div className={styles.userDetails}>{name}</div>
                    <div className={styles.userName}>{username}</div>
                    <div className={styles.role}>{role}</div>
                </div>
                <nav className={styles.menu}>
                    <NavLink to="/" className={({ isActive }) => isActive ? styles.active : ""} onClick={onCloseSidebar}>
                        <User /> My Posts
                    </NavLink>
                </nav>
                <div className={styles.bottomMenu}>
                    <NavLink to="/" onClick={onCloseSidebar}>
                        <Settings /> Settings
                    </NavLink>
                    <NavLink to="/" className={styles.logout} onClick={onCloseSidebar}>
                        <LogOut className={styles.logoutIcon} /> <div className={styles.logoutText}>Logout</div>
                    </NavLink>
                </div>
            </aside>
        </>
    );
}
