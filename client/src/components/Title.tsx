import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';

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
    transform: translateY(-30px);
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
  width: 90vw;
  margin: 0 auto;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  animation: ${fadeIn} 1.5s ease-out;
  display: block;
  object-fit: cover;
  object-position: center;
  cursor: pointer;
`;

// eslint-disable-next-line react/function-component-definition
const MainTitle: React.FC<AnimatedTitleProps> = ({
  title,
  imageSrc,
  imageAlt = 'Animated image',
  animationDuration = 3,
}) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  const handleImageClick = () => {
    navigate('/HomePage'); // Change '/home' to whatever route you want
  };

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
            <Image src={imageSrc} alt={imageAlt} onClick={handleImageClick} />
          </ImageContainer>
        </>
      )}
    </Container>
  );
};

export default MainTitle;
