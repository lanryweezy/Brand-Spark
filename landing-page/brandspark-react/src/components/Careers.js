import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const CareersSection = styled.section`
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

const JobGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const JobOpening = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: var(--shadow);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const JobInfo = styled.div`
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
  }

  p {
    color: var(--text-secondary);
  }
`;

const ApplyButton = styled.a`
  background: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s ease;

  &:hover {
    background: var(--primary-dark);
  }
`;

const jobs = [
  {
    title: 'Senior Frontend Developer',
    location: 'Remote',
    department: 'Engineering',
  },
  {
    title: 'Product Marketing Manager',
    location: 'New York, NY',
    department: 'Marketing',
  },
  {
    title: 'UI/UX Designer',
    location: 'Remote',
    department: 'Design',
  },
];

const Careers = () => {
  return (
    <CareersSection>
      <div className="container">
        <SectionHeader>
          <SectionTitle>Join Our Team</SectionTitle>
        </SectionHeader>
        <JobGrid>
          {jobs.map((job, index) => (
            <JobOpening
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <JobInfo>
                <h3>{job.title}</h3>
                <p>{job.location} • {job.department}</p>
              </JobInfo>
              <ApplyButton href="#">Apply Now</ApplyButton>
            </JobOpening>
          ))}
        </JobGrid>
      </div>
    </CareersSection>
  );
};

export default Careers;
