import React from 'react';
import styled, { keyframes } from 'styled-components';

const slideLeft = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
`;

const slideRight = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background-color: #000000;
  padding: 2rem 0;
  overflow: hidden;
`;

const ConveyorBelt = styled.div<{ direction: 'left' | 'right' }>`
  display: flex;
  width: 200%;
  animation: ${props => props.direction === 'left' ? slideLeft : slideRight} 20s linear infinite;
`;

const ImageContainer = styled.div`
  width: 200px;
  height: 150px;
  margin: 0 1rem;
  flex-shrink: 0;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
`;

const Statement = styled.div`
  color: white;
  font-size: 2rem;
  text-align: center;
  margin: 3rem 0;
  padding: 0 2rem;
  max-width: 800px;
`;

interface MissionStatementProps {
  topImages: string[];
  bottomImages: string[];
  statement: string;
}

const MissionStatement: React.FC<MissionStatementProps> = ({ topImages, bottomImages, statement }) => {
  return (
    <Container>
      <ConveyorBelt direction="left">
        {topImages.concat(topImages).map((src, index) => (
          <ImageContainer key={index}>
            <Image src={src} alt={`Conveyor Image ${index}`} />
          </ImageContainer>
        ))}
      </ConveyorBelt>

      <Statement>{statement}</Statement>

      <ConveyorBelt direction="right">
        {bottomImages.concat(bottomImages).map((src, index) => (
          <ImageContainer key={index}>
            <Image src={src} alt={`Conveyor Image ${index}`} />
          </ImageContainer>
        ))}
      </ConveyorBelt>
    </Container>
  );
};

export default MissionStatement;