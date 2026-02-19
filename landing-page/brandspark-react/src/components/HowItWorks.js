import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const HowItWorksSection = styled.section`
  padding: 80px 0;
  background: ${({ theme }) => theme.backgroundLight};
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-family: 'Inter', sans-serif;
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.textPrimary};
`;

const HowItWorksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 4rem;
  text-align: center;
`;

const Step = styled(motion.div)`
  background: ${({ theme }) => theme.background};
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.borderColor};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadowLg};
  }
`;

const StepNumber = styled.div`
  font-size: 3.5rem;
  font-weight: 700;
  background: linear-gradient(90deg, ${({ theme }) => theme.primaryColor} 0%, ${({ theme }) => theme.secondaryColor} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1.5rem;
`;

const StepTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.textPrimary};
`;

const StepDescription = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  line-height: 1.7;
`;

const HowItWorks = () => {
  const steps = [
    {
      title: 'Connect Your Brands',
      description: 'Integrate all your brand accounts and marketing channels in one unified dashboard, effortlessly.',
    },
    {
      title: 'Automate & Create',
      description: 'Leverage AI-powered tools to generate compelling content, automate campaigns, and streamline workflows for maximum efficiency.',
    },
    {
      title: 'Analyze & Scale',
      description: 'Track performance with our advanced, real-time analytics and make data-driven decisions to scale your success exponentially.',
    },
  ];

  return (
    <HowItWorksSection id="how-it-works">
      <div className="container">
        <SectionHeader>
          <SectionTitle>Spark Your Success in 3 Simple Steps</SectionTitle>
        </SectionHeader>
        <HowItWorksGrid>
          {steps.map((step, index) => (
            <Step
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <StepNumber>{index + 1}</StepNumber>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Step>
          ))}
        </HowItWorksGrid>
      </div>
    </HowItWorksSection>
  );
};

export default HowItWorks;