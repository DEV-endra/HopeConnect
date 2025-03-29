import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Login.module.css';
import Logo from "../assets/Logo2.png"

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch("/api/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: password }),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem("token", data.token); // Store token for future requests
        alert("Login successful!");
        navigate("/SeekerDashboard");
      } else {
        alert("Login failed: " + data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.leftSection}>
        <nav className={styles.navbar}>
          <div className={styles.navRight}>
            <a href="/help" className={styles.helpLink}>Help</a>
            <button onClick={() => navigate('/signup')} className={styles.signUpButton}>
              Sign up
            </button>
          </div>
        </nav>

        <div className={styles.formContainer}>
          <div className={styles.welcomeText}>
            <h2>Welcome back to</h2>
            <h1>HopeConnect</h1>
          </div>

          <div className={styles.form}>
            <div className={styles.formTitle}>
              <h1>Sign in</h1>
              <p className={styles.formSubtitle}>Enter your account details below</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>Email address or Username</label>
                <input
                  type="text"
                  id="email"
                  className={`${styles.input} ${error ? styles.inputError : ''}`}
                  placeholder="Enter your email or username"
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
                    className={`${styles.input} ${error ? styles.inputError : ''}`}
                    placeholder="Enter your password"
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

              <div className={styles.forgotPassword}>
                <a href="/forgot-password">Forgot password?</a>
              </div>

              {error && <span className={styles.error}>{error}</span>}

              <button type="submit" className={styles.button}>
                Sign in
              </button>

              <div className={styles.signupPrompt}>
                Don't have an account?{' '}
                <button 
                  type="button" 
                  className={styles.textButton}
                  onClick={() => navigate('/signup')}
                >
                  Sign up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <div className={styles.rightSection}>
        <div className={styles.logoContainer}>
          <img src={Logo} alt="HopeConnect" className={styles.largeLogo} />
        </div>
      </div>
    </div>
  );
} 