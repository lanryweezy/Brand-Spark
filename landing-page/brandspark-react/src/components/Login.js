import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

const LoginSection = styled.section`
  padding: 140px 0 100px;
  background: var(--background-light);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginForm = styled(motion.form)`
  width: 100%;
  max-width: 400px;
  background: white;
  padding: 3rem;
  border-radius: 1rem;
  box-shadow: var(--shadow-lg);
`;

const SectionTitle = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 2rem;
  color: var(--text-primary);
  text-align: center;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--border-color);
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const Button = styled.button`
  width: 100%;
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
`;

const SignUpLink = styled.p`
  text-align: center;
  margin-top: 2rem;
  color: var(--text-secondary);

  a {
    color: var(--primary-color);
    font-weight: 600;
    text-decoration: none;
  }
`;

const Login = () => {
  return (
    <LoginSection>
      <LoginForm
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <SectionTitle>Sign In</SectionTitle>
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" name="email" />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <Input type="password" id="password" name="password" />
        </FormGroup>
        <Button type="submit">Sign In</Button>
        <SignUpLink>
          Don't have an account? <NavLink to="/signup">Sign Up</NavLink>
        </SignUpLink>
      </LoginForm>
    </LoginSection>
  );
};

export default Login;
