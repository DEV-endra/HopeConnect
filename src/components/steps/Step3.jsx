import { useState } from 'react';
import styles from '../../styles/SignUp.module.css';

export default function Step3({ onBack, updateFormData, formData, navigate }) {
  const [name, setName] = useState(formData.name || '');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }

    updateFormData({name});
    // Simulate account creation

    try {
      const response = await fetch("/api/SignUp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name:name, username:formData.username, email:formData.email, role:"helper", password:formData.password}),
      });
      const data = await response.json();
      alert(data.message);
      navigate('/dashboard');
    } catch (error) {
      console.log(error);
      setError('Failed to create account. Please try again.');
    }
  };

  return (
    <div className={styles.form}>
      <div className={styles.formTitle}>
        <h1>Personal Details</h1>
        <p className={styles.formSubtitle}>Add your personal information</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>Full Name</label>
          <input
            type="text"
            id="name"
            className={`${styles.input} ${error && error.includes('name') ? styles.inputError : ''}`}
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
          />
        </div>

        {error && <span className={styles.error}>{error}</span>}

        <button type="submit" className={styles.button}>
          Complete Sign Up
        </button>
        <button type="button" onClick={onBack} className={styles.backButton}>
          Go Back
        </button>
      </form>
    </div>
  );
} 