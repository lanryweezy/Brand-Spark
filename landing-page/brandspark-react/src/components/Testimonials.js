import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const TestimonialsSection = styled.section`
  padding: 100px 0;
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

const TestimonialSlider = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const TestimonialCard = styled(motion.div)`
  background: ${({ theme }) => theme.backgroundLight};
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.borderColor};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-7px);
    box-shadow: ${({ theme }) => theme.shadowLg};
  }
`;

const TestimonialText = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 1.5rem;
  font-style: italic;
  line-height: 1.7;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  margin-top: auto; // Pushes author to the bottom
`;

const AuthorImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 1rem;
  object-fit: cover;
`;

const AuthorInfo = styled.div`
  p {
    margin: 0;
  }
`;

const AuthorName = styled.p`
  font-weight: 700;
  color: ${({ theme }) => theme.textPrimary};
`;

const AuthorTitle = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.875rem;
`;

const testimonials = [
  {
    text: "BrandSpark has been a game-changer for our agency. We've been able to double our client capacity without sacrificing quality. The unified dashboard is a dream come true!",
    author: {
      name: 'Sarah Johnson',
      title: 'Marketing Director, Acme Inc.',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
  },
  {
    text: "The AI content generator is like having a team of copywriters on demand. It's saved us countless hours and improved our campaign performance significantly.",
    author: {
      name: 'Michael Chen',
      title: 'Founder, Digital Growth Agency',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
  },
  {
    text: "The analytics features are incredibly powerful and easy to understand. We can now make data-driven decisions faster than ever before.",
    author: {
      name: 'Emily White',
      title: 'CMO, Global Brands',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
  },
];

const Testimonials = () => {
  return (
    <TestimonialsSection id="testimonials">
      <div className="container">
        <SectionHeader>
          <SectionTitle>Loved by Leading Brands</SectionTitle>
        </SectionHeader>
        <TestimonialSlider>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
            >
              <TestimonialText>"{testimonial.text}"</TestimonialText>
              <TestimonialAuthor>
                <AuthorImage src={testimonial.author.image} alt={testimonial.author.name} />
                <AuthorInfo>
                  <AuthorName>{testimonial.author.name}</AuthorName>
                  <AuthorTitle>{testimonial.author.title}</AuthorTitle>
                </AuthorInfo>
              </TestimonialAuthor>
            </TestimonialCard>
          ))}
        </TestimonialSlider>
      </div>
    </TestimonialsSection>
  );
};

export default Testimonials;