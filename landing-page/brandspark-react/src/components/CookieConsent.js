import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const CookieConsentBanner = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  background: var(--background-light);
  color: var(--text-primary);
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: var(--shadow-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1001;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const CookieText = styled.p`
  font-size: 1rem;
  color: var(--text-secondary);
`;

const CookieButton = styled.button`
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: var(--primary-dark);
  }
`;

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <CookieConsentBanner
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
        >
          <CookieText>
            We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
          </CookieText>
          <CookieButton onClick={handleAccept}>Accept</CookieButton>
        </CookieConsentBanner>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
