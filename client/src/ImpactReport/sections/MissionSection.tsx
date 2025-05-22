import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import MissionStatement from '../../components/MissionStatement';
import COLORS from '../../assets/colors.ts';
import photo1 from '../../assets/missionPhotos/Photo1.jpg';
import photo2 from '../../assets/missionPhotos/Photo2.jpg';
import photo3 from '../../assets/missionPhotos/Photo3.jpg';
import photo4 from '../../assets/missionPhotos/Photo4.jpg';
import photo5 from '../../assets/missionPhotos/Photo5.jpg';
import photo6 from '../../assets/missionPhotos/Photo6.jpg';
import photo7 from '../../assets/missionPhotos/Photo7.jpg';
import photo8 from '../../assets/missionPhotos/Photo8.jpg';
import photo9 from '../../assets/missionPhotos/Photo9.jpg';
import photo10 from '../../assets/missionPhotos/Photo10.jpg';
import photo11 from '../../assets/missionPhotos/Photo11.jpg';
import photo12 from '../../assets/missionPhotos/Photo12.jpg';
import photo13 from '../../assets/missionPhotos/Photo13.jpg';
import photo14 from '../../assets/missionPhotos/Photo14.jpg';

// Animations
const pulseEqualizer = keyframes`
  0% {
    height: 20%;
  }
  50% {
    height: 100%;
  }
  100% {
    height: 20%;
  }
`;

const SectionContainer = styled.section`
  position: relative;
  padding: 6rem 2rem;
  background: linear-gradient(180deg, #121212 0%, #0a0a0a 100%);
  margin: 2rem auto;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  max-width: 1200px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
        circle at 30% 20%,
        ${COLORS.gogo_blue}08,
        transparent 40%
      ),
      radial-gradient(
        circle at 70% 80%,
        ${COLORS.gogo_purple}08,
        transparent 40%
      );
    z-index: 0;
  }

  &.fade-in {
    animation: fadeIn 1s ease-out forwards;
  }
`;

const SectionHeader = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  z-index: 1;
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(
    to right,
    ${COLORS.gogo_blue},
    ${COLORS.gogo_purple},
    ${COLORS.gogo_teal}
  );
  background-size: 100% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -10px;
    width: 60px;
    height: 4px;
    background: linear-gradient(
      to right,
      #5fa8d3, /* softer blue */
      #7b7fd1 /* softer purple */
    );
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

const SpotifyBadge = styled.div`
  display: flex;
  align-items: center;
  padding: 0.6rem 1.2rem;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  .badge-icon {
    margin-right: 0.8rem;
    font-size: 1.2rem;
    color: #7b7fd1;
  }

  span {
    font-size: 0.9rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.8);
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 4rem 0 2rem;
  position: relative;
  z-index: 1;
`;

const StatItem = styled.div`
  position: relative;
  background: rgba(25, 25, 25, 0.6);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${COLORS.gogo_green};
    transition: width 0.3s ease, opacity 0.3s ease;
  }

  &:nth-child(2)::before {
    background: ${COLORS.gogo_blue};
  }

  &:nth-child(3)::before {
    background: ${COLORS.gogo_purple};
  }

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
  }

  &:hover::before {
    width: 100%;
    opacity: 0.1;
  }

  &.slide-up {
    animation: slideUp 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }
`;

const StatContent = styled.div`
  position: relative;
  z-index: 1;
`;

const StatNumber = styled.h3`
  font-size: 3.5rem;
  font-weight: 900;
  margin: 0 0 0.8rem;
  background: linear-gradient(
    45deg,
    #fff,
    ${(props) => props.color || COLORS.gogo_green}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

const StatLabel = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-weight: 600;
`;

const EqualizerIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 40px;
  gap: 4px;
  margin-top: 1.5rem;
`;

const EqualizerBar = styled.div`
  width: 6px;
  background: ${(props) => props.color || COLORS.gogo_green};
  border-radius: 3px;
  animation: ${pulseEqualizer} ease-in-out infinite;

  &:nth-child(1) {
    animation-duration: 1s;
  }
  &:nth-child(2) {
    animation-duration: 1.6s;
  }
  &:nth-child(3) {
    animation-duration: 1.2s;
  }
  &:nth-child(4) {
    animation-duration: 0.9s;
  }
`;

const ListenNow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 3rem;
  padding: 1rem 2rem;
  background: rgba(25, 70, 245, 0.2);
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    transform: translateY(-3px);
    background: rgba(25, 70, 245, 0.3);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }

  .listen-icon {
    font-size: 1.2rem;
    color: ${COLORS.gogo_blue};
    margin-right: 0.8rem;
  }

  span {
    font-size: 1rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
  }
`;

function MissionSection(): JSX.Element {
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

    const section = document.querySelector('.mission-section');
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  // Define the stats data outside the JSX for better organization
  const statsData = [
    {
      id: 'students',
      number: '1622',
      label: 'Students',
      delay: 0,
      color: COLORS.gogo_green,
    },
    {
      id: 'mentors',
      number: '105',
      label: 'Mentors',
      delay: 0.2,
      color: COLORS.gogo_blue,
    },
    {
      id: 'sites',
      number: '59',
      label: 'School & Community Sites',
      delay: 0.4,
      color: COLORS.gogo_purple,
    },
  ];

  return (
    <SectionContainer className={`mission-section ${inView ? 'fade-in' : ''}`}>
      <SectionHeader>
        <SectionTitle>Our Mission</SectionTitle>
        <SpotifyBadge>
          <div className="badge-icon">♫</div>
          <span>Since 2008</span>
        </SpotifyBadge>
      </SectionHeader>

      <MissionStatement
        topImages={[photo1, photo2, photo3, photo4, photo5, photo6, photo7]}
        bottomImages={[
          photo8,
          photo9,
          photo10,
          photo11,
          photo12,
          photo13,
          photo14,
        ]}
        statement="Our mission is to empower youth through music, art and mentorship. Guitars Over Guns offers students from our most vulnerable communities a combination of arts education and mentorship with professional musicians to help them overcome hardship, find their voice and reach their potential as tomorrow's leaders. Since 2008, we have served nearly 12,000 students."
      />

      <StatsContainer>
        {statsData.map((stat) => (
          <StatItem
            key={stat.id}
            className={`${inView ? 'slide-up' : ''}`}
            style={{
              animationDelay: `${stat.delay}s`,
              transitionDelay: `${stat.delay}s`,
            }}
          >
            <StatContent>
              <StatNumber color={stat.color}>{stat.number}</StatNumber>
              <StatLabel>{stat.label}</StatLabel>
            </StatContent>
            <EqualizerIcon>
              {['bass', 'mid-low', 'mid-high', 'treble'].map((freqRange, i) => (
                <EqualizerBar
                  key={`${stat.id}-${freqRange}`}
                  color={stat.color}
                  style={{
                    animationDuration: `${0.8 + i * 0.2}s`,
                    height: `${Math.random() * 60 + 40}%`,
                  }}
                />
              ))}
            </EqualizerIcon>
          </StatItem>
        ))}
      </StatsContainer>

      {/* <ListenNow>
        <div className="listen-icon">▶</div>
        <span>Listen to our students&apos; music</span>
      </ListenNow> */}
    </SectionContainer>
  );
}

export default MissionSection;
