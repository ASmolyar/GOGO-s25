import React from 'react';
import styled, { keyframes } from 'styled-components';
import COLORS from '../../assets/colors.ts';

// Animation keyframes
const gradientFlow = keyframes`
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

// Styled components for different background types
const BackgroundContainer = styled.div<{ opacity?: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  opacity: ${(props) => props.opacity || 0.1};
`;

const GradientBackground = styled(BackgroundContainer)`
  background: linear-gradient(
    135deg,
    ${COLORS.gogo_blue},
    ${COLORS.gogo_purple},
    ${COLORS.gogo_pink},
    ${COLORS.gogo_blue}
  );
  background-size: 400% 400%;
  animation: ${gradientFlow} 15s ease infinite;
`;

const RadialGlowBackground = styled(BackgroundContainer)`
  background: radial-gradient(
      circle at 20% 30%,
      ${COLORS.gogo_purple} 0%,
      transparent 60%
    ),
    radial-gradient(circle at 80% 70%, ${COLORS.gogo_blue} 0%, transparent 60%);
`;

interface AnimatedBackgroundProps {
  type?: 'gradient' | 'radial';
  opacity?: number;
}

/**
 * AnimatedBackground component that provides animated gradient or radial backgrounds
 * for sections in the Impact Report.
 */
const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  type = 'gradient',
  opacity = 0.1,
}) => {
  if (type === 'radial') {
    return <RadialGlowBackground opacity={opacity} />;
  }

  return <GradientBackground opacity={opacity} />;
};

export default AnimatedBackground;
