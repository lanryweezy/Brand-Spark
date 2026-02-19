import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

const CTASection = styled.section`
  padding: 80px 0;
  background: var(--gradient);
  color: white;
  text-align: center;
`;

const CTATitle = styled(motion.h2)`
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const CTASubtitle = styled(motion.p)`
  font-size: 1.125rem;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const CTAButton = styled(motion.button)`
  background: white;
  color: var(--primary-color);
  border: none;
  padding: 1.25rem 2.5rem;
  border-radius: 0.75rem;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
`;

const CTANote = styled(motion.p)`
  margin-top: 1rem;
  opacity: 0.8;
  font-size: 0.875rem;
`;

const CTA = () => {
  return (
    <CTASection>
      <div className="container">
        <CTATitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Ready to Ignite Your Growth?
        </CTATitle>
        <CTASubtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Join hundreds of marketing teams already scaling with BrandSpark.
        </CTASubtitle>
        <NavLink to="/login">
          <CTAButton
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Start Your Free Trial Today
          </CTAButton>
        </NavLink>
        <CTANote
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          14-day free trial • No credit card required • Cancel anytime
        </CTANote>
      </div>
    </CTASection>
  );
};

export default CTA;
