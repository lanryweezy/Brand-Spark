import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import SearchBar from './SearchBar';

const BlogSection = styled.section`
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

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
`;

const BlogPost = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  box-shadow: var(--shadow);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
`;

const BlogPostContent = styled.div`
  padding: 2rem;

  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--text-primary);
  }

  p {
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
  }
`;

const ReadMoreLink = styled(NavLink)`
  color: var(--primary-color);
  font-weight: 600;
  text-decoration: none;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 4rem;
`;

const PageButton = styled.button`
  background: transparent;
  border: 2px solid var(--primary-color);
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--primary-color);
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 0.5rem;

  &.active {
    background: var(--primary-color);
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const posts = [
  // ... (add more posts to test pagination)
];

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const filteredPosts = useMemo(() => {
    return posts.filter(post =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [posts, searchQuery]);

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return filteredPosts.slice(startIndex, startIndex + postsPerPage);
  }, [filteredPosts, currentPage, postsPerPage]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    <BlogSection>
      <div className="container">
        <SectionHeader>
          <SectionTitle>From the Blog</SectionTitle>
        </SectionHeader>
        <SearchBar onSearch={setSearchQuery} />
        <BlogGrid>
          {paginatedPosts.map((post, index) => (
            <BlogPost
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <img src={post.image} alt={post.title} />
              <BlogPostContent>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <ReadMoreLink to={`/blog/${post.slug}`}>Read More</ReadMoreLink>
              </BlogPostContent>
            </BlogPost>
          ))}
        </BlogGrid>
        <Pagination>
          <PageButton onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
            Previous
          </PageButton>
          {[...Array(totalPages)].map((_, i) => (
            <PageButton key={i} className={currentPage === i + 1 ? 'active' : ''} onClick={() => setCurrentPage(i + 1)}>
              {i + 1}
            </PageButton>
          ))}
          <PageButton onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>
            Next
          </PageButton>
        </Pagination>
      </div>
    </BlogSection>
  );
};

export default Blog;