import { useState } from 'react';
import styles from '../../styles/SignUp.module.css';

export default function Step2({ onNext, onBack, updateFormData, formData }) {
  const [email, setEmail] = useState(formData.email || '');
  const [password, setPassword] = useState(formData.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const duplicate = async (email) => {
    try {
      const response = await fetch("https://hopeconnect-backend.onrender.com/users/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email }),
      });
      const data = await response.json();
      if (data.verify) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    const isDuplicate = await duplicate(email);
    if (isDuplicate) {
      setError('Email already registered');
      return;
    }
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    updateFormData({ email, password });
    onNext();
  };


  return (
    <div className={styles.form}>
      <div className={styles.formTitle}>
        <h1>Set up your login</h1>
        <p className={styles.formSubtitle}>Choose your email and password for signing in</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email address</label>
          <input
            type="email"
            id="email"
            className={`${styles.input} ${error && error.includes('email') ? styles.inputError : ''}`}
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <div className={styles.passwordInput}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className={`${styles.input} ${error && error.includes('Password') ? styles.inputError : ''}`}
              placeholder="Create a password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {error && <span className={styles.error}>{error}</span>}

        <button type="submit" className={styles.button}>
          Next Step
        </button>
        <button type="button" onClick={onBack} className={styles.backButton}>
          Go Back
        </button>
      </form>
    </div>
  );
} 