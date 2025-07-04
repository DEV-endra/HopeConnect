import { useEffect, useState } from "react";
import {
    LogOut,
    Settings,
    User,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "../styles/side-bar.module.css";
import ImageKit from "imagekit-javascript";

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
    var avatar = localStorage.getItem("avatar");
    // setAvatar(localStorage.getItem("avatar"))
    const token = localStorage.getItem("token");
    const logout = () => {  // CLEARING THE LOCAL STORAGE
        localStorage.clear();
    }

    const backToServer = async (new_avatar) => {
        try {
            const response = await fetch("https://hopeconnect-backend.onrender.com/users/update", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username: username, avatar: new_avatar }),
            });
            if (response.ok) {
                avatar = new_avatar;
                localStorage.setItem('avatar', new_avatar);
            }
            else {
                console.error("Error:", error);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const res = await fetch("https://hopeconnect-backend.onrender.com/users/auth");
            const { signature, token, expire } = await res.json();

            const imagekit = new ImageKit({
                publicKey: "public_0x9cs15Cv9JgDRo9ADQqPJJlRjw=",
                urlEndpoint: "https://ik.imagekit.io/hopeconnect",
            });

            imagekit.upload(
                {
                    file,
                    fileName: file.name,
                    token,
                    signature,
                    expire,
                },
                (err, result) => {
                    if (err) {
                        console.error("Image upload failed:", err);
                        alert("Upload failed. Try again.");
                    } else {
                        backToServer(result.url);
                        console.log("Image uploaded:", result.url);
                        alert("Avatar changed successfully!");
                    }
                }
            );
        } catch (err) {
            console.error("Error fetching signed upload token:", err);
        }
    };

    return (
        <>
            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.active : ""}`}>
                <div className={styles.logo}>Hope Connect</div>
                <div className={styles.userInfo}>
                    <div className={styles.avatarContainer}>
                        <img src={avatar} alt={username} className={styles.Avatar} />
                        <label className={styles.changeButton}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-pen-icon lucide-user-pen"><path d="M11.5 15H7a4 4 0 0 0-4 4v2" /><path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" /><circle cx="10" cy="7" r="4" /></svg>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e)}
                            />
                        </label>
                    </div>
                    <div className={styles.userDetails}>{name}</div>
                    <div className={styles.userName}>{username}</div>
                    <div className={styles.role}>{role}</div>
                </div>
                <nav className={styles.menu}>
                    <NavLink to="/buildingpage" className={({ isActive }) => isActive ? styles.active : ""} onClick={onCloseSidebar}>
                        <User /> My Posts
                    </NavLink>
                </nav>
                <div className={styles.bottomMenu}>
                    <NavLink to="/buildingpage" onClick={onCloseSidebar}>
                        <Settings /> Settings
                    </NavLink>
                    <NavLink to="/" className={styles.logout} onClick={() => { onCloseSidebar; logout() }}>
                        <LogOut className={styles.logoutIcon} /> <div className={styles.logoutText}>Logout</div>
                    </NavLink>
                </div>
            </aside >
        </>
    );
}
