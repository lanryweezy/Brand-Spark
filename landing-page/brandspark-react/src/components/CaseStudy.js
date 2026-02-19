import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

const CaseStudySection = styled.section`
  padding: 100px 0;
  background: ${({ theme }) => theme.backgroundLight};
`;

const CaseStudyContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const CaseStudyText = styled.div`
  h2 {
    font-family: 'Inter', sans-serif;
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 1.5rem;
    color: ${({ theme }) => theme.textPrimary};

    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }

  p {
    font-size: 1.125rem;
    color: ${({ theme }) => theme.textSecondary};
    margin-bottom: 2.5rem;
    line-height: 1.7;
  }
`;

const Button = styled(NavLink)`
  background: linear-gradient(90deg, ${({ theme }) => theme.primaryColor} 0%, ${({ theme }) => theme.secondaryColor} 100%);
  color: white;
  padding: 1rem 2.5rem;
  border-radius: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-decoration: none;
  display: inline-block;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const CaseStudyVisual = styled(motion.div)`
  img {
    width: 100%;
    border-radius: 1rem;
    box-shadow: ${({ theme }) => theme.shadowLg};
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.02);
    }
  }
`;

const CaseStudy = () => {
  return (
    <CaseStudySection id="case-study">
      <div className="container">
        <CaseStudyContent>
          <CaseStudyText>
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
            >
              How Acme Inc. Doubled Their ROI in 6 Months
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Acme Inc. struggled to manage their diverse portfolio of brands. With BrandSpark, they were able to unify their marketing efforts, automate repetitive tasks, and gain a holistic view of their performance. The results were astounding, leading to a significant increase in ROI and market share.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button to="/case-studies/acme-inc">Read the Full Story</Button>
            </motion.div>
          </CaseStudyText>
          <CaseStudyVisual
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="Team collaborating" />
          </CaseStudyVisual>
        </CaseStudyContent>
      </div>
    </CaseStudySection>
  );
};

export default CaseStudy;