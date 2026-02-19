import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../ThemeContext';

const Nav = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.backgroundLight};
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  z-index: 1000;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const NavBrand = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.textPrimary};
  text-decoration: none;

  svg {
    color: ${({ theme }) => theme.primaryColor};
    width: 32px;
    height: 32px;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2.5rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLinkStyled = styled(NavLink)`
  text-decoration: none;
  color: ${({ theme }) => theme.textSecondary};
  font-weight: 500;
  transition: color 0.3s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: ${({ theme }) => theme.primaryColor};
    transition: width 0.3s ease;
  }

  &:hover::after,
  &.active::after {
    width: 100%;
  }

  &:hover {
    color: ${({ theme }) => theme.primaryColor};
  }
`;

const NavLinkCta = styled(NavLink)`
  background: ${({ theme }) => theme.accentColor};
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background: #D95814;
    transform: translateY(-2px);
  }
`;

const MobileNavToggle = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.8rem;
  color: ${({ theme }) => theme.textPrimary};
  z-index: 1001;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileNav = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.backgroundLight};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2.5rem;
  z-index: 999;

  ${NavLinkStyled} {
    font-size: 1.5rem;
  }
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.textSecondary};
  transition: color 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.primaryColor};
  }
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <NavContainer>
        <NavBrand to="/">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span>BrandSpark</span>
        </NavBrand>
        <NavLinks>
          <NavLinkStyled to="/features">Features</NavLinkStyled>
          <NavLinkStyled to="/pricing">Pricing</NavLinkStyled>
          <NavLinkStyled to="/about">About</NavLinkStyled>
          <NavLinkStyled to="/blog">Blog</NavLinkStyled>
          <NavLinkStyled to="/contact">Contact</NavLinkStyled>
          <ThemeToggle onClick={toggleTheme}>
            <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
          </ThemeToggle>
          <NavLinkCta to="/login">Sign In</NavLinkCta>
        </NavLinks>
        <MobileNavToggle onClick={toggleMenu}>
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
        </MobileNavToggle>
      </NavContainer>
      {isOpen && (
        <MobileNav
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <NavLinkStyled to="/features" onClick={toggleMenu}>Features</NavLinkStyled>
          <NavLinkStyled to="/pricing" onClick={toggleMenu}>Pricing</NavLinkStyled>
          <NavLinkStyled to="/about" onClick={toggleMenu}>About</NavLinkStyled>
          <NavLinkStyled to="/blog" onClick={toggleMenu}>Blog</NavLinkStyled>
          <NavLinkStyled to="/contact" onClick={toggleMenu}>Contact</NavLinkStyled>
          <ThemeToggle onClick={toggleMenu}>
            <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
          </ThemeToggle>
          <NavLinkCta to="/login" onClick={toggleMenu}>Sign In</NavLinkCta>
        </MobileNav>
      )}
    </Nav>
  );
};

export default Navbar;
