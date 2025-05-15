import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import COLORS from '../../assets/colors.ts';

const PartnersSectionWrapper = styled.section`
  padding: 5rem 0;
  position: relative;
  background-color: #171717;
`;

const SectionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  width: 100%;
`;

const SectionHeading = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  text-align: center;
  color: ${COLORS.gogo_blue};
`;

const SectionSubheading = styled.p`
  font-size: 1.2rem;
  max-width: 700px;
  margin: 0 auto 3rem;
  text-align: center;
  color: #e0e0e0;
`;

const PartnersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const PartnerCard = styled.div`
  background: rgba(35, 35, 40, 0.5);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    background: rgba(35, 35, 40, 0.7);
  }
`;

const PartnerLogo = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${(props) => props.color || '#ffffff'};
  margin: 0 auto 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  color: #171717;
`;

const PartnerName = styled.h4`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const PartnerDescription = styled.p`
  font-size: 0.9rem;
  color: #aaa;
  line-height: 1.4;
`;

const CategoryTitle = styled.h3`
  font-size: 1.8rem;
  margin: 3rem 0 1.5rem;
  color: ${COLORS.gogo_purple};
  text-align: center;
  position: relative;

  &:after {
    content: '';
    display: block;
    width: 60px;
    height: 3px;
    background: ${COLORS.gogo_purple};
    margin: 0.8rem auto 0;
  }
`;

const SupportButton = styled.button`
  background: ${COLORS.gogo_blue};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 30px;
  font-weight: bold;
  font-size: 1rem;
  margin: 4rem auto 0;
  display: block;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${COLORS.gogo_purple};
    transform: scale(1.05);
  }
`;

// Define types for the partners data
interface Partner {
  name: string;
  description: string;
  logo: string;
  color: string;
}

interface PartnersData {
  foundations: Partner[];
  corporate: Partner[];
}

// Partner data
const partners: PartnersData = {
  foundations: [
    {
      name: 'Harmony Foundation',
      description: 'Supporting music education since 1985',
      logo: 'HF',
      color: COLORS.gogo_blue,
    },
    {
      name: 'Arts for All',
      description: 'Committed to accessible arts programming',
      logo: 'AFA',
      color: COLORS.gogo_yellow,
    },
    {
      name: 'NextGen Youth',
      description: "Investing in tomorrow's leaders",
      logo: 'NGY',
      color: COLORS.gogo_purple,
    },
  ],
  corporate: [
    {
      name: 'Soundwave Audio',
      description: 'Professional audio equipment provider',
      logo: 'SA',
      color: COLORS.gogo_green,
    },
    {
      name: 'Rhythm Records',
      description: 'Independent record label',
      logo: 'RR',
      color: COLORS.gogo_pink,
    },
    {
      name: 'MusicTech Inc.',
      description: 'Innovative music technology solutions',
      logo: 'MT',
      color: COLORS.gogo_teal,
    },
    {
      name: 'Global Sounds',
      description: 'World music promotion and distribution',
      logo: 'GS',
      color: COLORS.gogo_yellow,
    },
  ],
};

function PartnersSection(): JSX.Element {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.2 },
    );

    const section = document.querySelector('.partners-section');
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  const renderPartners = (partnersList: Partner[], startDelay = 0) => {
    return partnersList.map((partner: Partner, index: number) => (
      <PartnerCard
        key={`partner-${partner.name}`}
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(30px)',
          transition: `opacity 0.5s ease ${
            startDelay + index * 0.1
          }s, transform 0.5s ease ${startDelay + index * 0.1}s`,
        }}
      >
        <PartnerLogo color={partner.color}>{partner.logo}</PartnerLogo>
        <PartnerName>{partner.name}</PartnerName>
        <PartnerDescription>{partner.description}</PartnerDescription>
      </PartnerCard>
    ));
  };

  return (
    <PartnersSectionWrapper className="partners-section">
      <SectionContainer>
        <SectionHeading>Our Partners & Supporters</SectionHeading>
        <SectionSubheading>
          GOGO&apos;s work is made possible through the generous support of
          foundations, corporations, and individuals who share our commitment to
          empowering youth through music.
        </SectionSubheading>

        <CategoryTitle
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        >
          Foundation Partners
        </CategoryTitle>
        <PartnersGrid>{renderPartners(partners.foundations)}</PartnersGrid>

        <CategoryTitle
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.5s ease 0.3s, transform 0.5s ease 0.3s',
          }}
        >
          Corporate Supporters
        </CategoryTitle>
        <PartnersGrid>{renderPartners(partners.corporate, 0.5)}</PartnersGrid>

        <SupportButton
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.5s ease 0.8s, transform 0.5s ease 0.8s',
          }}
        >
          Become a Partner
        </SupportButton>
      </SectionContainer>
    </PartnersSectionWrapper>
  );
}

export default PartnersSection;
