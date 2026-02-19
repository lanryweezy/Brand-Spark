import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const AboutSection = styled.section`
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

const SectionSubtitle = styled.p`
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
`;

const TeamMember = styled(motion.div)`
  text-align: center;

  img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    margin-bottom: 1rem;
    box-shadow: var(--shadow-lg);
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
  }

  p {
    color: var(--text-secondary);
  }
`;

const team = [
  {
    name: 'John Doe',
    title: 'CEO & Founder',
    image: 'https://randomuser.me/api/portraits/men/11.jpg',
  },
  {
    name: 'Jane Smith',
    title: 'CTO',
    image: 'https://randomuser.me/api/portraits/women/11.jpg',
  },
  {
    name: 'Peter Jones',
    title: 'Head of Marketing',
    image: 'https://randomuser.me/api/portraits/men/12.jpg',
  },
  {
    name: 'Mary Williams',
    title: 'Head of Design',
    image: 'https://randomuser.me/api/portraits/women/12.jpg',
  },
];

const About = () => {
  return (
    <AboutSection>
      <div className="container">
        <SectionHeader>
          <SectionTitle>About BrandSpark</SectionTitle>
          <SectionSubtitle>
            We are a passionate team of marketers, developers, and designers dedicated to helping businesses unlock their full potential. Our mission is to provide the tools and resources you need to build and manage successful brands.
          </SectionSubtitle>
        </SectionHeader>
        <TeamGrid>
          {team.map((member, index) => (
            <TeamMember
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <img src={member.image} alt={member.name} />
              <h3>{member.name}</h3>
              <p>{member.title}</p>
            </TeamMember>
          ))}
        </TeamGrid>
      </div>
    </AboutSection>
  );
};

export default About;
