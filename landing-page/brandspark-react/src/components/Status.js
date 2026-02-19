import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

const StatusSection = styled.section`
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

const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const StatusItem = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: var(--shadow);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatusInfo = styled.div`
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;

  &.operational {
    color: var(--secondary-color);
  }

  &.degraded {
    color: var(--accent-color);
  }
`;

const services = [
  { name: 'Website & API', status: 'operational' },
  { name: 'AI Content Studio', status: 'operational' },
  { name: 'Analytics & Reporting', status: 'degraded' },
  { name: 'Email & Notifications', status: 'operational' },
];

const Status = () => {
  return (
    <StatusSection>
      <div className="container">
        <SectionHeader>
          <SectionTitle>System Status</SectionTitle>
        </SectionHeader>
        <StatusGrid>
          {services.map((service, index) => (
            <StatusItem
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <StatusInfo>
                <h3>{service.name}</h3>
              </StatusInfo>
              <StatusIndicator className={service.status}>
                <FontAwesomeIcon icon={service.status === 'operational' ? faCheckCircle : faExclamationCircle} />
                <span>{service.status.charAt(0).toUpperCase() + service.status.slice(1)}</span>
              </StatusIndicator>
            </StatusItem>
          ))}
        </StatusGrid>
      </div>
    </StatusSection>
  );
};

export default Status;
