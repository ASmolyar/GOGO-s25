import React from 'react';
import styled, { keyframes } from 'styled-components';
import '../assets/fonts/fonts.css';

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

const jump = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background-color: #1a2a3a; /* Dark blue background */
  padding: 2rem 0;
  overflow: hidden;
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100px;
    z-index: 1;
    pointer-events: none;
  }

  &::before {
    left: 0;
    background: linear-gradient(to right, #1a2a3a, transparent);
  }

  &::after {
    right: 0;
    background: linear-gradient(to left, #1a2a3a, transparent);
  }
`;

const ConveyorBelt = styled.div<{ direction: 'left' | 'right' }>`
  display: flex;
  width: 400%;
  animation: ${props => props.direction === 'left' ? slideLeft : slideRight} 30s linear infinite;
  position: relative;
  z-index: 0;
`;

const ImageContainer = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 1rem;
  flex-shrink: 0;
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    animation: ${jump} 0.5s ease;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
`;

const Statement = styled.div`
  color: white;
  font-size: 2rem;
  text-align: center;
  margin: 3rem 0;
  padding: 0 2rem;
  max-width: 1000px;
  font-family: 'Century Gothic', 'Arial', sans-serif;
  font-weight: bold;
  line-height: 1.5;
  position: relative;
  z-index: 2;
`;

interface MissionStatementProps {
  topImages: string[];
  bottomImages: string[];
  statement: string;
}

const MissionStatement: React.FC<MissionStatementProps> = ({ topImages, bottomImages, statement }) => {
  // Create a longer array of images for smooth animation
  const extendedTopImages = [...topImages, ...topImages, ...topImages, ...topImages, ...topImages];
  const extendedBottomImages = [...bottomImages, ...bottomImages, ...bottomImages, ...bottomImages, ...bottomImages];

  return (
    <Container>
      <ConveyorBelt direction="left">
        {extendedTopImages.map((src, index) => (
          <ImageContainer key={index}>
            <Image src={src} alt={`Conveyor Image ${index}`} />
          </ImageContainer>
        ))}
      </ConveyorBelt>

      <Statement>{statement}</Statement>

      <ConveyorBelt direction="right">
        {extendedBottomImages.map((src, index) => (
          <ImageContainer key={index}>
            <Image src={src} alt={`Conveyor Image ${index}`} />
          </ImageContainer>
        ))}
      </ConveyorBelt>
    </Container>
  );
};

export default MissionStatement; 