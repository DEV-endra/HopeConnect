import { useState } from 'react';
import styles from "../../styles/SignUp.module.css";

export default function Step1({ onNext, updateFormData, formData }) {
  const [username, setUsername] = useState(formData.username);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    updateFormData({ username });
    onNext();
  };

  return (
    <div className={styles.stepContent}>
      <h1 className={styles.title}>Meet HopeConnect!</h1>
      <p className={styles.subtitle}>Let's start with choosing your username.</p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="username" className={styles.label}>
            New ID
          </label>
          <input
            type="text"
            id="username"
            className={styles.input}
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError('');
            }}
            placeholder="Choose a unique username"
          />
          {error && <p className={styles.error}>{error}</p>}
        </div>

        <div className={styles.terms}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              required
            />
            <span>I agree to Terms and Conditions & Privacy Policy</span>
          </label>
        </div>

        <button type="submit" className={styles.button}>
          Next Step
        </button>
      </form>
    </div>
  );
} 