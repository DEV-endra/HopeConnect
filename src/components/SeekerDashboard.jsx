import Logo from "../assets/Logo.png";
import { useState, useEffect, useRef } from 'react';
import styles from '../styles/SeekerDashboard.module.css';

const welcomeText = "afgasica fiefua fhdsifh dfsi fs  ndso knvdss dkvnsddvonv snasdnosd vn sacjsdodvj vnsaiodsj nssdv skjdsf vksfovsnanv sfjsjfv  skfnsdjjfovnnvnnnaonc sanfojvonv ksfns ksnck kasnknv kfnsv ksdfakn rafndsv kasfnkvn vksdndsnv vvksnvak";

const posts = [
  {
    id: 1,
    author: "Dr. Sarah Wilson",
    role: "Mental Health Professional",
    content: "Remember, it's okay to not be okay. Taking care of your mental health is just as important as taking care of your physical health. What are some self-care practices you've found helpful?",
    fullContent: "Remember, it's okay to not be okay. Taking care of your mental health is just as important as taking care of your physical health. What are some self-care practices you've found helpful? Here are some tips to get started:\n\n1. Practice mindfulness daily\n2. Stay connected with loved ones\n3. Get regular exercise\n4. Maintain a healthy sleep schedule\n5. Seek professional help when needed\n\nRemember, you're not alone in this journey.",
    likes: 234,
    comments: 45,
    timestamp: "2 hours ago"
  },
  {
    id: 2,
    author: "Alex Thompson",
    role: "Community Member",
    content: "Sharing my journey with anxiety. Meditation has been a game-changer for me. Anyone else practicing mindfulness?",
    fullContent: "Sharing my journey with anxiety. Meditation has been a game-changer for me. Anyone else practicing mindfulness? I started with just 5 minutes a day and gradually increased to 20 minutes. The benefits have been incredible:\n\n- Reduced stress levels\n- Better sleep quality\n- Improved focus\n- More emotional stability\n\nI'd love to hear about your experiences with meditation!",
    likes: 189,
    comments: 32,
    timestamp: "4 hours ago"
  },
  {
    id: 3,
    author: "Dr. Michael Chen",
    role: "Therapist",
    content: "Today's tip: Practice the 5-4-3-2-1 grounding technique when feeling overwhelmed. Name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.",
    fullContent: "Today's tip: Practice the 5-4-3-2-1 grounding technique when feeling overwhelmed. Name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.\n\nThis technique helps you:\n1. Stay present in the moment\n2. Reduce anxiety and panic\n3. Regain control of your thoughts\n4. Connect with your surroundings\n\nTry it whenever you feel overwhelmed or anxious. It's a simple but effective tool for managing stress.",
    likes: 567,
    comments: 89,
    timestamp: "6 hours ago"
  }
];

export default function SeekerDashboard() {
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(50);
  const [expandedPost, setExpandedPost] = useState(null);

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

  const togglePostExpansion = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

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
          <button className={styles.profileButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Profile
          </button>
        </div>
      </nav>

      <div className={styles.mainLayout}>
        <main className={styles.mainContent}>
          <div className={styles.heroSection}>
            <div className={styles.typingContainer}>
              <p className={styles.typingText}>
                {currentText}
                <span className={styles.cursor}>|</span>
              </p>
            </div>
          </div>

          <div className={styles.postsContainer}>
            {posts.map(post => (
              <div key={post.id} className={styles.post}>
                <div className={styles.postHeader}>
                  <div className={styles.postAuthor}>
                    <img src="/avatar.png" alt={post.author} className={styles.postAvatar} />
                    <div>
                      <h3>{post.author}</h3>
                      <span>{post.role}</span>
                    </div>
                  </div>
                  <span className={styles.timestamp}>{post.timestamp}</span>
                </div>
                <div className={styles.postContent}>
                  {expandedPost === post.id ? (
                    <div className={styles.expandedContent}>
                      {post.fullContent.split('\n').map((line, index) => (
                        <p key={index}>{line}</p>
                      ))}
                    </div>
                  ) : (
                    <p>{post.content}</p>
                  )}
                  <button 
                    className={styles.readMoreButton}
                    onClick={() => togglePostExpansion(post.id)}
                  >
                    {expandedPost === post.id ? 'Show less' : 'Read more'}
                  </button>
                </div>
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
            <button className={styles.sidebarButton}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Start Chat
            </button>
          </div>

          <div className={styles.sidebarCard}>
            <h3>Get Heard</h3>
            <p>Connect with our AI for voice support and guidance</p>
            <button className={styles.sidebarButton}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Start AI Call
            </button>
          </div>

          <div className={styles.sidebarCard}>
            <h3>Connect to Helper</h3>
            <p>Find and connect with mental health professionals</p>
            <button className={styles.sidebarButton}>
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
    </div>
  );
}