import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import '../assets/fonts/fonts.css';
import COLORS from '../assets/colors.ts';
import { animate, stagger } from 'animejs';

// Modern animations
const shimmer = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 0.8;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.03);
  }
`;

const equalizer = keyframes`
  0% {
    height: 15%;
  }
  10% {
    height: 70%;
  }
  30% {
    height: 45%;
  }
  50% {
    height: 85%;
  }
  70% {
    height: 30%;
  }
  90% {
    height: 60%;
  }
  100% {
    height: 15%;
  }
`;

// Add the scrolling animations back
const slideLeft = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-25%);
  }
`;

const slideRight = keyframes`
  0% {
    transform: translateX(-25%);
  }
  100% {
    transform: translateX(0);
  }
`;

// Section container with improved glass effect
const SectionContainer = styled.div`
  padding: 4rem 2rem;
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  background: linear-gradient(
    135deg,
    rgba(18, 18, 18, 0.9),
    rgba(25, 25, 35, 0.8)
  );
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      120deg,
      ${COLORS.gogo_blue}20,
      ${COLORS.gogo_purple}20,
      ${COLORS.gogo_teal}20,
      ${COLORS.gogo_blue}20
    );
    background-size: 100% 100%;
    z-index: -1;
    filter: blur(60px);
    opacity: 0.6;
  }
`;

// Improved glass card with hover effects
const ImageCard = styled.div`
  position: relative;
  width: 140px;
  height: 140px;
  margin: 0 1rem;
  flex-shrink: 0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
  background: rgba(25, 25, 35, 0.3);
  backdrop-filter: blur(8px);
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  transform-origin: center;
  animation: ${float} 6s ease-in-out infinite;
  animation-delay: calc(var(--index) * 0.2s);

  &:hover {
    transform: translateY(-12px) scale(1.05);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4), 0 0 0 2px ${COLORS.gogo_blue}66;
    z-index: 10;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      120deg,
      ${COLORS.gogo_blue}40,
      ${COLORS.gogo_purple}40,
      ${COLORS.gogo_pink}40,
      ${COLORS.gogo_blue}40
    );
    background-size: 100% 100%;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }

  &:hover::before {
    opacity: 0.3;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);

  &:hover {
    transform: scale(1.1);
  }
`;

// Replace CardRow with scrolling ConveyorBelt
const ConveyorBelt = styled.div<{ direction: 'left' | 'right' }>`
  display: flex;
  width: 400%;
  overflow: hidden;
  position: relative;
  padding: 2rem 0;
  animation: ${(props) => (props.direction === 'left' ? slideLeft : slideRight)}
    30s linear infinite;
  z-index: 0;
`;

// Modern animated statement with gradient
const Statement = styled.div`
  color: white;
  font-size: 3.1rem;
  text-align: center;
  margin: 4rem auto;
  padding: 3rem;
  max-width: 1000px;
  font-family: 'Century Gothic', 'Arial', sans-serif;
  font-weight: bold;
  line-height: 1.4;
  position: relative;
  z-index: 2;
  background: rgba(25, 25, 35, 0.15);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(255, 255, 255, 0.06);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.22), 0 0 0 2px rgb(134, 150, 255);
  }

  p {
    background: linear-gradient(
      to right,
      #ffffff,
      rgb(140, 195, 255),
      rgb(134, 150, 255),
      #ffffff
    );
    background-size: 100% 100%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
  }
`;

// Stats display with animated equalizer
const StatsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 3rem;
  flex-wrap: wrap;
`;

const StatCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  border-radius: 16px;
  background: rgba(25, 25, 35, 0.3);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
  min-width: 160px;
  transition: all 0.3s ease;
  animation: ${pulse} 8s ease-in-out infinite;
  animation-delay: calc(var(--index) * 0.5s);

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4), 0 0 0 2px ${COLORS.gogo_blue}66;
  }
`;

const StatValue = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
  font-family: 'Century Gothic', 'Arial', sans-serif;
  background: linear-gradient(
    to right,
    #ffffff,
    ${COLORS.gogo_blue},
    ${COLORS.gogo_purple}
  );
  background-size: 100% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  margin-bottom: 1rem;
`;

const Equalizer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 40px;
  margin-top: 1rem;
`;

const EqualizerBar = styled.div`
  width: 6px;
  background: linear-gradient(
    to top,
    ${COLORS.gogo_blue},
    ${COLORS.gogo_purple}
  );
  border-radius: 2px;
  height: 15%;
  animation: ${equalizer} 1.2s ease-in-out infinite;
  animation-delay: calc(var(--index) * 0.1s);
`;

interface MissionStatementProps {
  topImages: string[];
  bottomImages: string[];
  statement: string;
}

const MissionStatement: React.FC<MissionStatementProps> = ({
  topImages,
  bottomImages,
  statement,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Create extended arrays for smooth scrolling
  const extendedTopImages = [
    ...topImages,
    ...topImages,
    ...topImages,
    ...topImages,
  ];
  const extendedBottomImages = [
    ...bottomImages,
    ...bottomImages,
    ...bottomImages,
    ...bottomImages,
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    // Animate in the statement
    animate(
      {
        targets: containerRef.current.querySelector('.statement'),
        translateY: [40, 0],
        opacity: [0, 1],
        easing: 'easeOutCubic',
        duration: 1000,
        delay: 300,
      },
      {},
    );

    // Animate in stats cards
    animate(
      {
        targets: containerRef.current.querySelectorAll('.stat-card'),
        scale: [0.9, 1],
        opacity: [0, 1],
        delay: stagger(100, { start: 600 }),
        easing: 'easeOutElastic(1, 0.6)',
        duration: 1200,
      },
      {},
    );
  }, []);

  return (
    <SectionContainer ref={containerRef}>
      <ConveyorBelt direction="left">
        {extendedTopImages.map((src, index) => (
          <ImageCard
            key={index}
            className="image-card"
            style={
              { '--index': index % topImages.length } as React.CSSProperties
            }
          >
            <Image src={src} alt={`Illustration ${index + 1}`} />
          </ImageCard>
        ))}
      </ConveyorBelt>

      <Statement className="statement">
        <p>{statement}</p>
      </Statement>

      <ConveyorBelt direction="right">
        {extendedBottomImages.map((src, index) => (
          <ImageCard
            key={index}
            className="image-card"
            style={
              { '--index': index % bottomImages.length } as React.CSSProperties
            }
          >
            <Image src={src} alt={`Illustration ${index + 1}`} />
          </ImageCard>
        ))}
      </ConveyorBelt>

      {/* <StatsContainer>
        <StatCard
          className="stat-card"
          style={{ '--index': 0 } as React.CSSProperties}
        >
          <StatValue>250K</StatValue>
          <StatLabel>Students Reached</StatLabel>
          <Equalizer>
            {[...Array(5)].map((_, i) => (
              <EqualizerBar
                key={i}
                style={{ '--index': i } as React.CSSProperties}
              />
            ))}
          </Equalizer>
        </StatCard>

        <StatCard
          className="stat-card"
          style={{ '--index': 1 } as React.CSSProperties}
        >
          <StatValue>98%</StatValue>
          <StatLabel>Satisfaction Rate</StatLabel>
          <Equalizer>
            {[...Array(5)].map((_, i) => (
              <EqualizerBar
                key={i}
                style={{ '--index': i } as React.CSSProperties}
              />
            ))}
          </Equalizer>
        </StatCard>

        <StatCard
          className="stat-card"
          style={{ '--index': 2 } as React.CSSProperties}
        >
          <StatValue>15+</StatValue>
          <StatLabel>Years of Impact</StatLabel>
          <Equalizer>
            {[...Array(5)].map((_, i) => (
              <EqualizerBar
                key={i}
                style={{ '--index': i } as React.CSSProperties}
              />
            ))}
          </Equalizer>
        </StatCard>
      </StatsContainer> */}
    </SectionContainer>
  );
};

export default MissionStatement;
