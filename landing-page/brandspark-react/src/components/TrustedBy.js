import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const TrustedBySection = styled.section`
  padding: 40px 0;
  background: ${({ theme }) => theme.background};
  text-align: center;
`;

const TrustedByTitle = styled(motion.h4)`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 2.5rem;
`;

const Logos = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 2rem;
  }
`;

const Logo = styled(motion.img)`
  height: 35px;
  filter: grayscale(100%);
  opacity: 0.6;
  transition: all 0.3s ease;

  &:hover {
    filter: grayscale(0%);
    opacity: 1;
    transform: scale(1.05);
  }
`;

const TrustedBy = () => {
  const logos = [
    { src: "https://s2.svgbox.net/enterprise.svg?ic=google&color=000", alt: "Google Logo" },
    { src: "https://s2.svgbox.net/enterprise.svg?ic=microsoft&color=000", alt: "Microsoft Logo" },
    { src: "https://s2.svgbox.net/enterprise.svg?ic=amazon&color=000", alt: "Amazon Logo" },
    { src: "https://s2.svgbox.net/enterprise.svg?ic=netflix&color=000", alt: "Netflix Logo" },
    { src: "https://s2.svgbox.net/enterprise.svg?ic=stripe&color=000", alt: "Stripe Logo" },
  ];

  return (
    <TrustedBySection>
      <div className="container">
        <TrustedByTitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Trusted by the world's most innovative companies
        </TrustedByTitle>
        <Logos
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {logos.map((logo, index) => (
            <Logo
              key={index}
              src={logo.src}
              alt={logo.alt}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            />
          ))}
        </Logos>
      </div>
    </TrustedBySection>
  );
};

export default TrustedBy;