import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBullhorn,
  faChartLine,
  faUsers,
  faTasks,
  faBoxOpen,
  faLightbulb,
  faRobot,
  faGlobe,
  faShieldAlt,
} from '@fortawesome/free-solid-svg-icons';

const FeaturesSection = styled.section`
  padding: 80px 0;
  background: ${({ theme }) => theme.background};
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

const SectionSubtitle = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.textSecondary};
  max-width: 600px;
  margin: 0 auto;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
`;

const Tab = styled.button`
  background: transparent;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  position: relative;
  transition: color 0.3s ease;

  &.active {
    color: ${({ theme }) => theme.primaryColor};
  }
`;

const Underline = styled(motion.div)`
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, ${({ theme }) => theme.primaryColor} 0%, ${({ theme }) => theme.secondaryColor} 100%);
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled(motion.div)`
  background: ${({ theme }) => theme.backgroundLight};
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: ${({ theme }) => theme.shadow};
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  border: 1px solid ${({ theme }) => theme.borderColor};

  &:hover {
    transform: translateY(-7px);
    box-shadow: ${({ theme }) => theme.shadowLg};
    border-color: ${({ theme }) => theme.primaryColor};
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(45deg, ${({ theme }) => theme.primaryColor}, ${({ theme }) => theme.secondaryColor});
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  color: white;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.textPrimary};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  line-height: 1.7;
`;

const featuresData = {
  marketing: [
    { icon: faRobot, title: 'AI-Powered Content Studio', description: 'Generate high-converting copy, social posts, and campaign ideas with our advanced AI, saving time and boosting creativity.' },
    { icon: faChartLine, title: 'Predictive Analytics', description: 'Gain deep insights with advanced analytics and predictive modeling to optimize campaigns and forecast trends.' },
    { icon: faBullhorn, title: 'Multi-Channel Campaign Management', description: 'Orchestrate and manage campaigns across all digital channels from a single, intuitive platform.' },
  ],
  management: [
    { icon: faUsers, title: 'Unified Brand Management', description: 'Seamlessly manage campaigns, assets, and teams across unlimited brands from one centralized dashboard.' },
    { icon: faTasks, title: 'Automation Workflows', description: 'Automate repetitive tasks, set up triggers, and create sophisticated marketing workflows that scale with your business.' },
    { icon: faBoxOpen, title: 'Dynamic Asset Management', description: 'Organize, share, and track brand assets, templates, and content with version control and easy access for all teams.' },
  ],
  collaboration: [
    { icon: faLightbulb, title: 'Real-time Team Collaboration', description: 'Invite team members, assign roles, and collaborate on campaigns with built-in approval workflows and communication tools.' },
    { icon: faGlobe, title: 'Global Team Synchronization', description: 'Ensure all your global teams are aligned and working with the latest brand guidelines and campaign strategies.' },
    { icon: faShieldAlt, title: 'Secure Access & Permissions', description: 'Manage user roles and permissions with granular control, ensuring data security and compliance across all brands.' },
  ],
};

const Features = () => {
  const [activeTab, setActiveTab] = useState('marketing');

  return (
    <FeaturesSection id="features">
      <div className="container">
        <SectionHeader>
          <SectionTitle>A Universe of Powerful Features</SectionTitle>
          <SectionSubtitle>Everything you need to elevate your brand portfolio and drive unparalleled growth.</SectionSubtitle>
        </SectionHeader>
        <Tabs>
          {Object.keys(featuresData).map((tab) => (
            <Tab
              key={tab}
              className={activeTab === tab ? 'active' : ''}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && <Underline layoutId="underline" />}
            </Tab>
          ))}
        </Tabs>
        <FeaturesGrid>
          {featuresData[activeTab].map((feature, index) => (
            <FeatureCard
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <FeatureIcon><FontAwesomeIcon icon={feature.icon} /></FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </div>
    </FeaturesSection>
  );
};

export default Features;