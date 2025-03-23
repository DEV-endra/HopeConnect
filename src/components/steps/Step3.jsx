import { useState } from 'react';
import styles from '../../styles/SignUp.module.css';

export default function Step3({ onBack, updateFormData, formData, navigate }) {
  const [name, setName] = useState(formData.name || '');
  const [avatar, setAvatar] = useState(formData.avatar || null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      setAvatar(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }

    updateFormData({ name, avatar });
    
    // Simulate account creation
    try {
      // Here you would typically make an API call to create the account
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/dashboard');
    } catch (error) {
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

        <div className={styles.avatarUpload}>
          <div className={styles.avatarPreview}>
            {previewUrl ? (
              <img src={previewUrl} alt="Profile preview" />
            ) : (
              <span className={styles.uploadText}>No image selected</span>
            )}
          </div>
          <input
            type="file"
            id="avatar"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <label htmlFor="avatar" className={styles.uploadButton}>
            {previewUrl ? 'Change Photo' : 'Upload Photo'}
          </label>
          <p className={styles.uploadText}>Maximum file size: 5MB</p>
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