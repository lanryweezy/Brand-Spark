import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const FooterSection = styled.footer`
  background: var(--text-primary);
  color: white;
  padding: 60px 0 30px;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 4rem;
  margin-bottom: 3rem;
`;

const FooterBrand = styled.div`
  max-width: 300px;
`;

const FooterLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.25rem;
  margin-bottom: 1rem;

  svg {
    width: 32px;
    height: 32px;
    color: var(--secondary-color);
  }
`;

const FooterDescription = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
`;

const FooterLinks = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
`;

const FooterColumn = styled.div`
  h4 {
    font-weight: 600;
    margin-bottom: 1rem;
    color: white;
  }
`;

const FooterLink = styled(NavLink)`
  display: block;
  color: var(--text-secondary);
  text-decoration: none;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;

  &:hover {
    color: var(--secondary-color);
  }
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid #2A4A68;
  color: var(--text-secondary);
`;

const FooterLegal = styled.div`
  display: flex;
  gap: 2rem;
`;

const Footer = () => {
  return (
    <FooterSection>
      <div className="container">
        <FooterContent>
          <FooterBrand>
            <FooterLogo>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
              <span>BrandSpark</span>
            </FooterLogo>
            <FooterDescription>Ignite Your Brand's Potential.</FooterDescription>
          </FooterBrand>
          <FooterLinks>
            <FooterColumn>
              <h4>Product</h4>
              <FooterLink to="/features">Features</FooterLink>
              <FooterLink to="/pricing">Pricing</FooterLink>
              <FooterLink to="/integrations">Integrations</FooterLink>
            </FooterColumn>
            <FooterColumn>
              <h4>Company</h4>
              <FooterLink to="/about">About</FooterLink>
              <FooterLink to="/blog">Blog</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
            </FooterColumn>
            <FooterColumn>
              <h4>Support</h4>
              <FooterLink to="/help">Help Center</FooterLink>
              <FooterLink to="/docs">Documentation</FooterLink>
              <FooterLink to="/status">Status</FooterLink>
            </FooterColumn>
          </FooterLinks>
        </FooterContent>
        <FooterBottom>
          <p>&copy; {new Date().getFullYear()} BrandSpark. All rights reserved.</p>
          <FooterLegal>
            <FooterLink to="/privacy">Privacy Policy</FooterLink>
            <FooterLink to="/terms">Terms of Service</FooterLink>
          </FooterLegal>
        </FooterBottom>
      </div>
    </FooterSection>
  );
};

export default Footer;
