import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const PressSection = styled.section`
  padding: 140px 0 100px;
  background: var(--background-light);
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: 4.5rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
`;

const PressGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const PressRelease = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: var(--shadow);
`;

const PressInfo = styled.div`
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
  }

  p {
    color: var(--text-secondary);
    margin-bottom: 1rem;
  }
`;

const ReadMoreLink = styled.a`
  color: var(--primary-color);
  font-weight: 600;
  text-decoration: none;
`;

const pressReleases = [
  {
    title: 'BrandSpark Launches New AI-Powered Content Studio',
    date: 'October 26, 2025',
    source: 'TechCrunch',
  },
  {
    title: 'BrandSpark Raises $10M in Series A Funding',
    date: 'September 15, 2025',
    source: 'Forbes',
  },
  {
    title: 'The Future of Marketing is Multi-Brand, says BrandSpark CEO',
    date: 'August 1, 2025',
    source: 'Marketing Weekly',
  },
];

const Press = () => {
  return (
    <PressSection>
      <div className="container">
        <SectionHeader>
          <SectionTitle>In the Press</SectionTitle>
        </SectionHeader>
        <PressGrid>
          {pressReleases.map((release, index) => (
            <PressRelease
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <PressInfo>
                <h3>{release.title}</h3>
                <p>{release.date} • {release.source}</p>
                <ReadMoreLink href="#">Read More</ReadMoreLink>
              </PressInfo>
            </PressRelease>
          ))}
        </PressGrid>
      </div>
    </PressSection>
  );
};

export default Press;
