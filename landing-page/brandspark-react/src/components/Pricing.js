import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const PricingSection = styled.section`
  padding: 100px 0;
  background: ${({ theme }) => theme.backgroundLight};
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

const PricingToggle = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 3rem;
  background: ${({ theme }) => theme.background};
  border-radius: 0.75rem;
  padding: 0.5rem;
  box-shadow: ${({ theme }) => theme.shadow};
`;

const ToggleButton = styled(motion.button)`
  background: transparent;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 0.5rem;

  &.active {
    background: linear-gradient(90deg, ${({ theme }) => theme.primaryColor} 0%, ${({ theme }) => theme.secondaryColor} 100%);
    color: white;
    box-shadow: ${({ theme }) => theme.shadow};
  }

  &:hover:not(.active) {
    color: ${({ theme }) => theme.primaryColor};
  }
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const PricingCard = styled(motion.div)`
  background: ${({ theme }) => theme.background};
  border-radius: 1rem;
  padding: 2.5rem;
  box-shadow: ${({ theme }) => theme.shadow};
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  border: 1px solid ${({ theme }) => theme.borderColor};
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-7px);
    box-shadow: ${({ theme }) => theme.shadowLg};
    border-color: ${({ theme }) => theme.primaryColor};
  }

  &.featured {
    border: 2px solid ${({ theme }) => theme.secondaryColor};
    transform: scale(1.05);
    z-index: 1;
  }
`;

const PricingBadge = styled.div`
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(90deg, ${({ theme }) => theme.accentColor} 0%, #FFD700 100%);
  color: white;
  padding: 0.4rem 1.2rem;
  border-radius: 1.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

const PricingHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const PricingTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.textPrimary};
`;

const PricingPrice = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: center;
  margin-bottom: 1rem;
`;

const PriceCurrency = styled.span`
  font-size: 1.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textSecondary};
`;

const PriceAmount = styled.span`
  font-size: 4rem;
  font-weight: 800;
  color: ${({ theme }) => theme.primaryColor};
`;

const PricePeriod = styled.span`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.textSecondary};
`;

const PricingDescription = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 1rem;
  min-height: 40px; // Ensure consistent height
`;

const PricingFeatures = styled.ul`
  list-style: none;
  margin-bottom: 2.5rem;
  flex-grow: 1; // Allows features list to take available space
`;

const PricingFeature = styled.li`
  padding: 0.6rem 0;
  color: ${({ theme }) => theme.textSecondary};
  position: relative;
  padding-left: 1.8rem;
  font-size: 0.95rem;

  &::before {
    content: '\2713';
    position: absolute;
    left: 0;
    color: ${({ theme }) => theme.secondaryColor};
    font-weight: 700;
    font-size: 1.1rem;
  }
`;

const PricingCta = styled.button`
  width: 100%;
  padding: 1.2rem;
  border: none;
  background: ${({ theme }) => theme.primaryColor};
  color: white;
  border-radius: 0.75rem;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
    background: ${({ theme }) => theme.secondaryColor};
  }

  &.primary {
    background: linear-gradient(90deg, ${({ theme }) => theme.primaryColor} 0%, ${({ theme }) => theme.secondaryColor} 100%);

    &:hover {
      background: linear-gradient(90deg, ${({ theme }) => theme.secondaryColor} 0%, ${({ theme }) => theme.primaryColor} 100%);
    }
  }
`;

const pricingData = {
  monthly: [
    { title: 'Growth', price: 49, description: 'Perfect for growing teams and businesses looking to expand their reach.', features: ['10 Brands', '10 Team Members', 'Advanced AI Tools', '50GB Storage', 'Priority Support', 'Basic Integrations'] },
    { title: 'Scale', price: 99, description: 'Designed for agencies and large teams managing multiple clients and complex campaigns.', features: ['Unlimited Brands', 'Unlimited Team Members', 'Full AI Suite', '200GB Storage', '24/7 Dedicated Support', 'White-label Options', 'Custom Integrations'], featured: true },
    { title: 'Enterprise', price: 'Custom', description: 'Tailored solutions for organizations with unique requirements and extensive operational needs.', features: ['Custom Brand Limits', 'Dedicated Infrastructure', 'Custom Integrations', 'SLA & Security Reviews', 'Personalized Onboarding', 'Advanced Compliance'] },
  ],
  yearly: [
    { title: 'Growth', price: 490, description: 'Perfect for growing teams and businesses looking to expand their reach.', features: ['10 Brands', '10 Team Members', 'Advanced AI Tools', '50GB Storage', 'Priority Support', 'Basic Integrations'] },
    { title: 'Scale', price: 990, description: 'Designed for agencies and large teams managing multiple clients and complex campaigns.', features: ['Unlimited Brands', 'Unlimited Team Members', 'Full AI Suite', '200GB Storage', '24/7 Dedicated Support', 'White-label Options', 'Custom Integrations'], featured: true },
    { title: 'Enterprise', price: 'Custom', description: 'Tailored solutions for organizations with unique requirements and extensive operational needs.', features: ['Custom Brand Limits', 'Dedicated Infrastructure', 'Custom Integrations', 'SLA & Security Reviews', 'Personalized Onboarding', 'Advanced Compliance'] },
  ],
};

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  return (
    <PricingSection id="pricing">
      <div className="container">
        <SectionHeader>
          <SectionTitle>Find Your Perfect Plan</SectionTitle>
          <SectionSubtitle>Simple, transparent pricing that scales with you. No hidden fees, just powerful features.</SectionSubtitle>
        </SectionHeader>
        <PricingToggle>
          <ToggleButton
            className={billingCycle === 'monthly' ? 'active' : ''}
            onClick={() => setBillingCycle('monthly')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Monthly
          </ToggleButton>
          <ToggleButton
            className={billingCycle === 'yearly' ? 'active' : ''}
            onClick={() => setBillingCycle('yearly')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Yearly <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>(Save 20%)</motion.span>
          </ToggleButton>
        </PricingToggle>
        <PricingGrid>
          {pricingData[billingCycle].map((plan, index) => (
            <PricingCard
              key={index}
              className={plan.featured ? 'featured' : ''}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
            >
              {plan.featured && <PricingBadge>Most Popular</PricingBadge>}
              <PricingHeader>
                <PricingTitle>{plan.title}</PricingTitle>
                <PricingPrice>
                  {typeof plan.price === 'number' ? (
                    <>
                      <PriceCurrency>$</PriceCurrency>
                      <PriceAmount>{plan.price}</PriceAmount>
                      <PricePeriod>/{billingCycle === 'monthly' ? 'mo' : 'yr'}</PricePeriod>
                    </>
                  ) : (
                    <PriceAmount>{plan.price}</PriceAmount>
                  )}
                </PricingPrice>
                <PricingDescription>{plan.description}</PricingDescription>
              </PricingHeader>
              <PricingFeatures>
                {plan.features.map((feature, i) => (
                  <PricingFeature key={i}>{feature}</PricingFeature>
                ))}
              </PricingFeatures>
              <PricingCta className={plan.featured ? 'primary' : ''}>
                {plan.price === 'Custom' ? 'Contact Sales' : 'Start Free Trial'}
              </PricingCta>
            </PricingCard>
          ))}
        </PricingGrid>
      </div>
    </PricingSection>
  );
};

export default Pricing;