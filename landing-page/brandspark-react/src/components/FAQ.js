import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

const FAQSection = styled.section`
  padding: 80px 0;
  background: var(--background);
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-primary);
`;

const FAQGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  max-width: 800px;
  margin: 0 auto;
`;

const FAQItem = styled.div`
  border-bottom: 1px solid var(--border-color);
`;

const FAQQuestion = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
  cursor: pointer;

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
  }
`;

const FAQAnswer = styled(motion.div)`
  overflow: hidden;

  p {
    padding-bottom: 1.5rem;
    color: var(--text-secondary);
    line-height: 1.6;
  }
`;

const faqData = [
  {
    question: 'What is BrandSpark?',
    answer: 'BrandSpark is a multi-brand marketing platform that helps you manage campaigns, automate workflows, and scale your marketing efforts across all your brands.',
  },
  {
    question: 'Who is BrandSpark for?',
    answer: 'BrandSpark is for marketing agencies, holding companies, and any business that manages multiple brands.',
  },
  {
    question: 'How does the free trial work?',
    answer: 'Our 14-day free trial gives you full access to the Scale plan. No credit card is required to get started.',
  },
  {
    question: 'Can I change my plan later?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time.',
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <FAQSection id="faq">
      <div className="container">
        <SectionHeader>
          <SectionTitle>Frequently Asked Questions</SectionTitle>
        </SectionHeader>
        <FAQGrid>
          {faqData.map((faq, index) => (
            <FAQItem key={index}>
              <FAQQuestion onClick={() => toggleFAQ(index)}>
                <h3>{faq.question}</h3>
                <FontAwesomeIcon icon={activeIndex === index ? faMinus : faPlus} />
              </FAQQuestion>
              <AnimatePresence>
                {activeIndex === index && (
                  <FAQAnswer
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p>{faq.answer}</p>
                  </FAQAnswer>
                )}
              </AnimatePresence>
            </FAQItem>
          ))}
        </FAQGrid>
      </div>
    </FAQSection>
  );
};

export default FAQ;
