import React, { useState, useEffect, useRef } from 'react';
import { animate } from 'animejs';
import styled, { keyframes } from 'styled-components';
import EnhancedLeafletMap from '../components/map/EnhancedLeafletMap';
import COLORS from '../../assets/colors.ts';

// Animations
const shimmer = keyframes`
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(30, 215, 96, 0.4);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(30, 215, 96, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(30, 215, 96, 0);
  }
`;

const ripple = keyframes`
  0% {
    opacity: 0.8;
    transform: scale(0.8);
  }
  100% {
    opacity: 0;
    transform: scale(2);
  }
`;

// Create a SectionContainer component since we can't import it
const SectionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  width: 100%;
  position: relative;
  z-index: 1;
`;

const LocationsSectionWrapper = styled.div`
  margin-bottom: 8rem;
  padding-top: 6rem;
  position: relative;
  background: linear-gradient(180deg, #121212 0%, #0a0a0a 100%);
  overflow: hidden;

  &:before {
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
`;

const BackgroundGlow = styled.div`
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: ${(props) => props.color || COLORS.gogo_blue}22;
  filter: blur(80px);
  animation: ${float} 8s ease infinite;
  z-index: 0;
  opacity: 0.5;
`;

const SectionHeading = styled.h2`
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 1.5rem;
  text-align: center;
  background: linear-gradient(
    to right,
    ${COLORS.gogo_blue},
    ${COLORS.gogo_purple},
    ${COLORS.gogo_teal}
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${shimmer} 5s linear infinite;
  position: relative;
`;

const SectionSubheading = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 4rem;
  text-align: center;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  color: rgba(255, 255, 255, 0.8);
  position: relative;
`;

const MapOuterContainer = styled.div`
  position: relative;
  margin-bottom: 3rem;

  &:before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(
      45deg,
      ${COLORS.gogo_blue}66,
      ${COLORS.gogo_purple}66,
      ${COLORS.gogo_teal}66,
      ${COLORS.gogo_blue}66
    );
    border-radius: 14px;
    z-index: 0;
    padding: 2px;
    animation: ${shimmer} 8s linear infinite;
    background-size: 200% auto;
    opacity: 0.8;
  }
`;

const MapContainer = styled.div`
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
  border-radius: 12px;
  overflow: hidden;
  background: ${COLORS.black};
  position: relative;
  z-index: 1;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
  }
`;

const PulsingDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${COLORS.gogo_green};
  position: relative;
  display: inline-block;
  margin-right: 10px;
  animation: ${pulse} 2s infinite;

  &:before,
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: ${COLORS.gogo_green};
    animation: ${ripple} 2s infinite;
    z-index: -1;
  }

  &:after {
    animation-delay: 0.5s;
  }
`;

const CaptionText = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  font-style: italic;
  margin: 2rem auto;
  max-width: 600px;
  line-height: 1.6;
  position: relative;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.1);
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: ${(props) => props.color || COLORS.gogo_blue};
    opacity: 0.8;
  }
`;

const StatValue = styled.div`
  font-size: 2.8rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
  color: white;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
`;

function LocationsSection(): JSX.Element {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [countingUp, setCountingUp] = useState(false);

  // Animated number counter
  const [stats, setStats] = useState([
    { value: 0, target: 42, label: 'Schools', color: COLORS.gogo_blue },
    {
      value: 0,
      target: 9,
      label: 'Programs in States',
      color: COLORS.gogo_purple,
    },
    {
      value: 0,
      target: 17,
      label: 'Community Centers',
      color: COLORS.gogo_pink,
    },
    {
      value: 0,
      target: 5,
      label: 'Recording Studios',
      color: COLORS.gogo_teal,
    },
  ]);

  // Calculate background glow positions
  const glowPositions = [
    {
      top: '20%',
      left: '10%',
      color: COLORS.gogo_blue,
      delay: '0s',
      id: 'blue-top-left',
    },
    {
      top: '70%',
      left: '85%',
      color: COLORS.gogo_purple,
      delay: '2s',
      id: 'purple-bottom-right',
    },
    {
      top: '30%',
      left: '75%',
      color: COLORS.gogo_teal,
      delay: '4s',
      id: 'teal-mid-right',
    },
  ];

  // Intersection observer to trigger animations when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          // Animate the heading
          const heading = entry.target.querySelector('.section-heading');
          if (heading) {
            animate(heading, {
              opacity: [0, 1],
              translateY: [30, 0],
              duration: 1000,
              easing: 'easeOutCubic',
            });
          }

          // Animate the subheading
          const subheading = entry.target.querySelector('.section-subheading');
          if (subheading) {
            animate(subheading, {
              opacity: [0, 1],
              translateY: [20, 0],
              duration: 800,
              delay: 200,
              easing: 'easeOutCubic',
            });
          }

          // Animate the map container
          const mapContainer = entry.target.querySelector('.map-container');
          if (mapContainer) {
            animate(mapContainer, {
              opacity: [0, 1],
              translateY: [30, 0],
              duration: 1000,
              delay: 400,
              easing: 'easeOutCubic',
            });
          }

          // Start counting up the stats
          setCountingUp(true);

          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 },
    );

    const currentSection = sectionRef.current;

    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  // Handle counting up animation
  useEffect(() => {
    if (!countingUp) return;

    const duration = 2000; // ms
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      setStats((prevStats) =>
        prevStats.map((stat) => ({
          ...stat,
          value: Math.floor(progress * stat.target),
        })),
      );

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [countingUp]);

  return (
    <LocationsSectionWrapper id="locations" ref={sectionRef}>
      {/* Background glows */}
      {glowPositions.map((pos) => (
        <BackgroundGlow
          key={`bg-glow-${pos.id}`}
          style={{
            top: pos.top,
            left: pos.left,
            animationDelay: pos.delay,
          }}
          color={pos.color}
        />
      ))}

      <SectionContainer>
        <SectionHeading className="section-heading" style={{ opacity: 0 }}>
          Our National Impact
        </SectionHeading>
        <SectionSubheading
          className="section-subheading"
          style={{ opacity: 0 }}
        >
          GOGO is making a difference across the United States. Explore our map
          to see where we&apos;re active and the communities we&apos;re serving
          through our various programs and partnerships.
        </SectionSubheading>

        <MapOuterContainer>
          <MapContainer className="map-container" style={{ opacity: 0 }}>
            <EnhancedLeafletMap />
          </MapContainer>
        </MapOuterContainer>

        <CaptionText>
          <PulsingDot />
          Click on regions or locations to explore details about our programs
          and impact in each area.
        </CaptionText>

        <StatsContainer>
          {stats.map((stat) => (
            <StatCard key={`location-stat-${stat.label}`} color={stat.color}>
              <StatValue>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsContainer>
      </SectionContainer>
    </LocationsSectionWrapper>
  );
}

export default LocationsSection;
