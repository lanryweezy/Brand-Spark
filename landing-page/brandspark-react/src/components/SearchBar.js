import React from 'react';
import styled from 'styled-components';

const SearchBarContainer = styled.div`
  margin-bottom: 2rem;
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

const SearchBar = ({ onSearch }) => {
  return (
    <SearchBarContainer>
      <Input type="text" placeholder="Search articles..." onChange={(e) => onSearch(e.target.value)} />
    </SearchBarContainer>
  );
};

export default SearchBar;
