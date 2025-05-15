import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/SignUp.module.css';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import Logo from "../assets/Logo2.png"

export default function SignUp() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    role: ''
  });
  formData.role = localStorage.getItem('role');
  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const updateFormData = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 onNext={handleNextStep} updateFormData={updateFormData} formData={formData} />;
      case 2:
        return <Step2 onNext={handleNextStep} onBack={handlePrevStep} updateFormData={updateFormData} formData={formData} />;
      case 3:
        return <Step3 onBack={handlePrevStep} updateFormData={updateFormData} formData={formData} navigate={navigate} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.pageContainer}>

      {/* LEFT SECTION */}

      <div className={styles.leftSection}>

        {/* NAV BAR */}

        <nav className={styles.navbar}>
          <div className={styles.navRight}>
            <a href="/help" className={styles.helpLink}>Help</a>
            <button onClick={() => navigate('/Login')} className={styles.signInButton}>
              Sign in
            </button>
          </div>
        </nav>

        <div className={styles.formContainer}>

          <div className={styles.welcomeText}>
            <h2>Welcome to</h2>
            <h1>HopeConnect</h1>
          </div>

          <div className={styles.stepIndicator}>
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`${styles.step} ${step === currentStep ? styles.activeStep : ''
                  } ${step < currentStep ? styles.completedStep : ''}`}
              >
                {step}
              </div>
            ))}
          </div>

          {renderStep()}
        </div>

      </div>

      {/*RIGHT SECTION*/}

      <div className={styles.rightSection}>
        <div className={styles.logoContainer}>
          <img src={Logo} alt="HopeConnect" className={styles.largeLogo} />
        </div>
      </div>

    </div>
  );
} 