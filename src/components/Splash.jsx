import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from "../styles/splash.module.css"; // Importing CSS module

const ImprovedVoiceChat = ({ onBack }) => {
  const [isActive, setIsActive] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'user', text: 'Hello, how are you?' },
    { id: 2, sender: 'ai', text: 'I am fine, thank you! How can I assist you today?' }
  ]);

  const toggleVoiceChat = () => {
    setIsActive(!isActive);

    if (!isActive) {
      console.log("Starting voice recording...");
      setTimeout(() => {
        const newUserMessage = { id: messages.length + 1, sender: 'user', text: 'Can you help me with my mental health concerns?' };
        const newAiMessage = { id: messages.length + 2, sender: 'ai', text: 'Of course, I\'m here to support you. Would you like to tell me more about what you\'re experiencing?' };

        setMessages([...messages, newUserMessage, newAiMessage]);
      }, 2000);
    } else {
      console.log("Stopping voice recording...");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack} aria-label="Go back to home">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#00C9A7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left" viewBox="0 0 24 24">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <div className={styles.headerTitle}>HopeConnect</div>
      </div>
      <div className={styles.chatArea}>
        {messages.map(message => (
          <div
            key={message.id}
            className={`${styles.message} ${message.sender === 'user' ? styles.userMessage : styles.aiMessage}`}
          >
            {message.text}
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        <motion.button
          className={styles.voiceButton}
          whileTap={{ scale: 0.95 }}
          onClick={toggleVoiceChat}
          animate={{
            boxShadow: isActive ? '0 0 15px rgba(0, 201, 167, 0.6)' : 'none',
            backgroundColor: isActive ? '#00C9A7' : '#fff',
            color: isActive ? '#fff' : '#00C9A7'
          }}
          transition={{ duration: 0.3 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        </motion.button>
        <div className={styles.statusText}>
          {isActive ? "Listening..." : "Tap to speak"}
        </div>
      </div>
    </div>
  );
};

export default ImprovedVoiceChat;
