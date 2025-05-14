import Logo from "../assets/Logo.png";
import { useState, useEffect, useRef } from 'react';
import styles from '../styles/HelpeeDashboard.module.css';
import profilePic from "../assets/Logo.png";
import Popup from 'reactjs-popup';
import Sidebar from "./Sidebar.jsx";
import { Navigate, useNavigate } from "react-router-dom";
const welcomeText = "In the midst of winter, I found there was, within me, an invincible summer. And that makes me happy. For it says that no matter how hard the world pushes against me, within me, there's something stronger, something better, pushing right back.";

export default function HelpeeDashboard() {
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(50);
  const [expandedPost, setExpandedPost] = useState(null);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [text, setText] = useState('');
  const [posts, setPosts] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timeout;
    if (isDeleting) {
      timeout = setTimeout(() => {
        setCurrentText(currentText.slice(0, -1));
        if (currentText === '') {
          setIsDeleting(false);
        }
      }, typingSpeed);
    } else {
      timeout = setTimeout(() => {
        if (currentText === welcomeText) {
          setTimeout(() => setIsDeleting(true), 2000);
        } else {
          setCurrentText(welcomeText.slice(0, currentText.length + 1));
        }
      }, typingSpeed);
    }
    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, typingSpeed]);


  //// IMPORTING POSTS
  useEffect(() => {
    async function fun() {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("/api/users/posts", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });
        const res = await response.json();
        // console.log(res);
        setPosts(res);
      } catch (error) {
        console.error("Error:", error);
      }
    }
    fun();
  }, []);

  const togglePostExpansion = (username) => {
    setExpandedPost(expandedPost === username ? null : username);
    // console.log(username);
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const posted = async () => {

    setPopupOpen(false)   // CLOSING THE POST POPUP
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    //   console.log(role);
    // console.log(username);
    const content = text.substring(0, 150);
    try {
      const response = await fetch("/api/users/posted", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title: "HopeConnect", role: role, username: username, likes: 0, comments: 0, fullcontent: text, content: content }),
      });
    } catch (error) {
      console.error("Error:", error);
    }
    // console.log(text);

  };

  function formatTimestamp(createdAt) {
    const date = new Date(createdAt);
    const now = new Date();

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d`;
    } else if (diffInWeeks < 4) {
      return `${diffInWeeks}w`;
    } else {
      // For older posts, show the date
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      });
    }
  }

  return (

    <div className={styles.dashboard}>

      <nav className={styles.navbar}>
        <div className={styles.navLeft}>
          <img src={Logo} alt="HopeConnect" className={styles.logo} />
        </div>
        <div className={styles.navRight}>
          <button className={styles.notificationButton}>
            <span className={styles.notificationBadge}>2</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 1 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
          <button className={styles.profileButton} onClick={() => (setIsSidebarOpen(!isSidebarOpen))}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Profile
          </button>
          <Sidebar isopen={isSidebarOpen} onCloseSidebar={() => setIsSidebarOpen(false)} />
        </div>
      </nav >

      <div className={styles.mainLayout}>
        <main className={styles.mainContent}>

          {/* typing text */}
          <div className={styles.heroSection}>
            <div className={styles.typingContainer}>
              <p className={styles.typingText}>
                {currentText}
                <span className={styles.cursor}>|</span>
              </p>
            </div>
          </div>

          {/* POST OPTION */}
          <div className={styles.startPost}>
            <img
              src={profilePic}
              alt="User Avatar"
              className={styles.avatar}
            />
            <button className={styles.postInput} onClick={() => setPopupOpen(true)}>
              Start a Post...
            </button>
          </div>

          {/* POST POPUP */}

          <Popup open={isPopupOpen} onClose={() => setPopupOpen(false)} modal>
            <div className={styles.overlay}>
              <div className={styles.popupContent}>
                <button className={styles.closeButton} onClick={() => setPopupOpen(false)}>
                  <span style={{ color: 'black' }}>✖</span>
                </button>
                <textarea className={styles.textInput} placeholder="What's on your mind?" value={text} onChange={handleTextChange} />
                <label className={styles.attachButton}>
                  📎 Attach
                  <input type="file" accept="image/*,video/*" />
                </label>
                <button className={styles.sendButton} onClick={() => posted()}>
                  🚀 Post
                </button>
              </div>
            </div>
          </Popup>

          {/* POST SECTION */}
          <div className={styles.postsContainer}>
            {Array.isArray(posts) && posts.map(post => (

              <div key={post.username} className={styles.post}>

                {/* POST HEADER */}
                <div className={styles.postHeader}>
                  <div className={styles.postusername}>
                    <img src="/avatar.png" alt={post.username} className={styles.postAvatar} />
                    <div>
                      <h3>{post.username}</h3>
                      {/* <span>{post.role}</span> */}
                    </div>
                  </div>
                  <span className={styles.timestamp}>{formatTimestamp(post.createdAt)}</span>
                </div>


                {/* POST CONTENT */}
                <div className={styles.postContent}>
                  {expandedPost === post.username ? (
                    <div className={styles.expandedContent}>
                      {post.fullcontent.split('\n').map((line, index) => (
                        <p key={index}>{line}</p>
                      ))}
                    </div>
                  ) : (
                    <p>{post.content}</p>
                  )}
                  <button
                    className={styles.readMoreButton}
                    onClick={() => togglePostExpansion(post.username)}
                  >
                    {expandedPost === post.username ? 'Show less' : 'Read more'}
                  </button>
                </div>

                {/* POST ACTIONS */}
                <div className={styles.postActions}>
                  <button className={styles.actionButton}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    <span>{post.likes}</span>
                  </button>

                  <button className={styles.actionButton}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span>{post.comments}</span>
                  </button>
                </div>

              </div>

            ))}
          </div>


        </main>

        <aside className={styles.sidebar}>

          <div className={styles.sidebarCard}>
            <h3>Talk to AI</h3>
            <p>Get immediate support from our AI companion</p>
            <button className={styles.sidebarButton} onClick={() => navigate('/philosophy')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Start Chat
            </button>
          </div>

          <div className={styles.sidebarCard}>
            <h3>Get Heard</h3>
            <p>Connect with our AI for voice support and guidance</p>
            <button className={styles.sidebarButton} onClick={() => navigate('/audio_connect')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Start AI Call
            </button>
          </div>

          <div className={styles.sidebarCard}>
            <h3>Connect to Helper</h3>
            <p>Find and connect with mental health professionals</p>
            <button className={styles.sidebarButton} onClick={() => navigate('/connect')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Find Helpers
            </button>
          </div>


          <div className={styles.sidebarCard}>
            <h3>Recommendations</h3>
            <ul className={styles.recommendationsList}>
              <li>Daily Meditation Guide</li>
              <li>Stress Management Tips</li>
              <li>Sleep Better Tonight</li>
              <li>Anxiety Relief Techniques</li>
            </ul>
          </div>

        </aside>
      </div>
    </div >
  );
}