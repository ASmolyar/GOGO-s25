import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

interface AnimatedTitleProps {
  title: string;
  imageSrc: string;
  imageAlt?: string;
  animationDuration?: number;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  width: 100%;
  position: relative;
  z-index: 1;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  animation: ${fadeIn} 1s ease-out;
  color: #ffffff;
`;

const ImageContainer = styled.div<{ duration: number }>`
  animation: ${float} ${(props) => props.duration}s ease-in-out infinite;
  width: 200px;
  margin: 0 auto;
`;

const Image = styled.img`
  max-width: 100%;
  height: auto;
  animation: ${fadeIn} 1.5s ease-out;
  display: block;
`;

const MainTitle: React.FC<AnimatedTitleProps> = ({
  title,
  imageSrc,
  imageAlt = 'Animated image',
  animationDuration = 3,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Delay visibility to trigger animations
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Container>
      {isVisible && (
        <>
          <Title>{title}</Title>
          <ImageContainer duration={animationDuration}>
            <Image src={imageSrc} alt={imageAlt} />
          </ImageContainer>
        </>
      )}
    </Container>
  );
};

export default MainTitle;