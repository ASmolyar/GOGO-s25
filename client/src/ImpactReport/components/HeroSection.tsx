import React, { useEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { animate, stagger } from 'animejs';
import '../../assets/fonts/fonts.css';

// Main container with Spotify-like gradient background
const HeroContainer = styled.section`
  width: 100%;
  min-height: 85vh;
  display: flex;
  justify-content: center;
  position: relative;
  background: linear-gradient(180deg, #5038a0 0%, #121242 100%);
  overflow: hidden;
  padding: 0;
`;

// Content wrapper with better Spotify-like spacing
const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  max-width: 1400px;
  padding: 0 5%;
  height: 100%;
  position: relative;
  margin-top: 8%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 2rem;
`;

// Left side content container
const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

// Main title - "IMPACT REPORT"
const MainTitle = styled.h1`
  font-family: 'Airwaves', sans-serif;
  font-size: clamp(4rem, 8vw, 7rem);
  font-weight: 800;
  color: white;
  margin: 0;
  text-align: left;
  line-height: 0.9;
  letter-spacing: -0.02em;
  opacity: 0; /* Start hidden for animation */
`;

// Subtitle - "GUITARS OVER GUNS"
const SubtitleText = styled.h2`
  font-family: 'Airwaves', sans-serif;
  font-size: clamp(2rem, 3vw, 2.5rem);
  font-weight: 700;
  color: rgba(119, 221, 171, 0.8);
  margin: 0;
  text-align: left;
  opacity: 0;
  position: relative;
`;

// Green underline
const TitleUnderline = styled.div`
  width: 100px;
  height: 4px;
  background-color: rgba(119, 221, 171, 0.8);
  margin: 1.5rem 0;
  transform: scaleX(0);
  transform-origin: left;
`;

// Report year text
const ReportYear = styled.div`
  font-size: 2.2rem;
  color: var(--spotify-orange, #e9bb4d);
  font-family: 'Century Gothic-Bold', 'Arial', sans-serif;
  font-weight: 500;
  margin-top: 1rem;
  margin-bottom: 3rem;
  opacity: 0;
`;

// Button container
const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

// Primary button styling (more Spotify-like)
const PrimaryButton = styled.button`
  background: var(--spotify-blue, #1946f5);
  border: none;
  border-radius: 500px;
  color: white;
  cursor: pointer;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 1rem;
  padding: 1rem 2rem;
  transition: all 0.3s ease;
  opacity: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: var(--spotify-purple, #68369a);
    transform: scale(1.05);
  }
`;

// Secondary button styling (more Spotify-like)
const SecondaryButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 500px;
  color: white;
  cursor: pointer;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 1rem;
  padding: 1rem 2rem;
  transition: all 0.3s ease;
  opacity: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.05);
  }
`;

// Waveform container, wider and right-aligned
const SoundWaveContainer = styled.div`
  position: relative;
  height: 280px;
  width: 100%;
  max-width: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  opacity: 0;
  margin-left: auto;
`;

// Individual wave bar with better styling
const WaveBar = styled.div`
  width: 5px;
  height: 50%;
  border-radius: 8px;
  transition: height 0.2s ease;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  background-color: rgba(255, 255, 255, 0.7);
`;

function HeroSection(): JSX.Element {
  // Create refs for animations
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const underlineRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);
  const primaryButtonRef = useRef<HTMLButtonElement>(null);
  const secondaryButtonRef = useRef<HTMLButtonElement>(null);
  const waveContainerRef = useRef<HTMLDivElement>(null);
  const waveBarsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Animate title elements
    if (titleRef.current) {
      animate(titleRef.current, {
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 1000,
        easing: 'easeOutExpo',
      });
    }

    // Animate underline
    if (underlineRef.current) {
      animate(underlineRef.current, {
        scaleX: [0, 1],
        opacity: [0, 1],
        duration: 800,
        delay: 300,
        easing: 'easeOutCubic',
      });
    }

    // Animate subtitle
    if (subtitleRef.current) {
      animate(subtitleRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 1000,
        delay: 600,
        easing: 'easeOutExpo',
      });
    }

    // Animate year
    if (yearRef.current) {
      animate(yearRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 1000,
        delay: 800,
        easing: 'easeOutExpo',
      });
    }

    // Animate buttons
    const buttons = [
      primaryButtonRef.current,
      secondaryButtonRef.current,
    ].filter(Boolean);
    if (buttons.length > 0) {
      animate(buttons, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        delay: stagger(200, { start: 1000 }),
        easing: 'easeOutExpo',
      });
    }

    // Animate waveform container
    if (waveContainerRef.current) {
      animate(waveContainerRef.current, {
        opacity: [0, 1],
        translateX: [50, 0],
        scale: [0.8, 1],
        duration: 1000,
        delay: 1200,
        easing: 'easeOutExpo',
      });
    }

    // Create dynamic wave animation for bars
    const waveBars = document.querySelectorAll('.wave-bar');
    if (waveBars.length > 0) {
      // Instead of using callback functions with types that don't match,
      // we can define static values for different bars
      const heightValues: string[][] = [];
      const durationValues: number[] = [];
      const delayValues: number[] = [];

      // Pre-calculate values for each bar - more varied for visual interest
      for (let i = 0; i < waveBars.length; i++) {
        // Create a more varied and interesting pattern
        let baseHeight;
        if (i % 4 === 0) {
          baseHeight = 30 + (i % 7) * 8; // Shorter bars
        } else if (i % 4 === 1) {
          baseHeight = 45 + (i % 5) * 6; // Medium-short bars
        } else if (i % 4 === 2) {
          baseHeight = 60 + (i % 5) * 5; // Medium-tall bars
        } else {
          baseHeight = 70 + (i % 4) * 4; // Taller bars
        }

        heightValues.push([`${baseHeight}%`, `${baseHeight + 15}%`]);
        durationValues.push(1400 + (i % 5) * 200);
        delayValues.push(i * 30);
      }

      waveBars.forEach((bar, i) => {
        animate(bar, {
          height: heightValues[i],
          duration: durationValues[i],
          easing: 'easeInOutSine',
          delay: delayValues[i],
          loop: true,
          direction: 'alternate',
        });
      });
    }

    // Set up wave container interactivity
    const waveContainer = waveContainerRef.current;
    if (waveContainer) {
      waveContainer.addEventListener('mousemove', handleWaveMouseMove);
      waveContainer.addEventListener('mouseleave', resetWaveAnimation);
      waveContainer.addEventListener('click', createWaveRipple);
    }

    // Cleanup function
    return () => {
      if (waveContainer) {
        waveContainer.removeEventListener('mousemove', handleWaveMouseMove);
        waveContainer.removeEventListener('mouseleave', resetWaveAnimation);
        waveContainer.removeEventListener('click', createWaveRipple);
      }
    };
  }, []);

  // Handle mouse movement over wave bars
  const handleWaveMouseMove = (e: MouseEvent) => {
    const container = waveContainerRef.current;
    if (!container) return;

    const waveBars = Array.from(document.querySelectorAll('.wave-bar'));
    if (waveBars.length === 0) return;

    // Get container dimensions and mouse position
    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const containerWidth = rect.width;
    const containerHeight = rect.height;

    // Calculate mouse position ratios (0 to 1)
    const positionRatioX = mouseX / containerWidth;
    const positionRatioY = 1 - mouseY / containerHeight; // Invert Y so top is 1

    // Apply height changes based on mouse position
    waveBars.forEach((bar, index) => {
      const barPositionRatio = index / (waveBars.length - 1);

      // Distance calculation with higher sensitivity
      const distanceFromMouse = Math.abs(positionRatioX - barPositionRatio);
      const maxDistance = 0.3; // Maximum influence distance (increased for better reaction)

      if (distanceFromMouse < maxDistance) {
        // Calculate intensity based on distance (closer = higher)
        const intensity = 1 - distanceFromMouse / maxDistance;

        // Factor in vertical position - higher mouse = taller bars
        const heightFactor = 0.5 + positionRatioY * 0.5;

        // Calculate dynamic height
        const minHeight = 20; // Minimum height percentage
        const maxHeight = 100; // Maximum height percentage
        const range = maxHeight - minHeight;
        const calculatedHeight = minHeight + range * intensity * heightFactor;

        animate(bar, {
          height: `${calculatedHeight}%`,
          duration: 50, // Faster response
          easing: 'easeOutQuad',
        });
      }
    });
  };

  // Reset wave animation when mouse leaves
  const resetWaveAnimation = () => {
    const waveBars = document.querySelectorAll('.wave-bar');
    if (waveBars.length === 0) return;

    // Similar to the initial animation, pre-calculate values
    // to avoid using functions with incompatible types
    const heightValues: string[][] = [];
    const durationValues: number[] = [];
    const delayValues: number[] = [];

    // Pre-calculate values for each bar - more varied for visual interest
    for (let i = 0; i < waveBars.length; i++) {
      // Create a more varied and interesting pattern
      let baseHeight;
      if (i % 4 === 0) {
        baseHeight = 30 + (i % 7) * 8; // Shorter bars
      } else if (i % 4 === 1) {
        baseHeight = 45 + (i % 5) * 6; // Medium-short bars
      } else if (i % 4 === 2) {
        baseHeight = 60 + (i % 5) * 5; // Medium-tall bars
      } else {
        baseHeight = 70 + (i % 4) * 4; // Taller bars
      }

      heightValues.push([`${baseHeight}%`, `${baseHeight + 15}%`]);
      durationValues.push(1400 + (i % 5) * 200);
      delayValues.push(i * 30);
    }

    waveBars.forEach((bar, i) => {
      animate(bar, {
        height: heightValues[i],
        duration: durationValues[i],
        easing: 'easeInOutSine',
        delay: delayValues[i],
        loop: true,
        direction: 'alternate',
      });
    });
  };

  // Create ripple effect on click
  const createWaveRipple = (e: MouseEvent) => {
    const container = waveContainerRef.current;
    if (!container) return;

    const waveBars = Array.from(document.querySelectorAll('.wave-bar'));
    if (waveBars.length === 0) return;

    // Get container dimensions and mouse position
    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const containerWidth = rect.width;

    // Calculate the click position ratio (0 to 1)
    const clickRatio = mouseX / containerWidth;

    // The clicked bar index (approximated)
    const clickedBarIndex = Math.floor(clickRatio * waveBars.length);

    // Create ripple animation
    waveBars.forEach((bar, index) => {
      // Calculate distance from clicked bar
      const distance = Math.abs(index - clickedBarIndex);

      // Animate with delay based on distance (ripple effect)
      animate(bar, {
        height: ['60%', '110%', '60%'],
        duration: 800,
        easing: 'easeOutElastic(1, 0.3)',
        delay: distance * 30, // Ripple delay
      });
    });

    // Reset the normal animation after the ripple
    setTimeout(resetWaveAnimation, 1400);
  };

  // Define wave bar colors - Spotify-like gradient
  const getWaveBarColor = (index: number) => {
    const colors = [
      'rgba(25, 70, 245, 0.9)', // Blue
      'rgba(104, 54, 154, 0.9)', // Purple
      'rgba(141, 221, 166, 0.9)', // Green
    ];
    return colors[index % colors.length];
  };

  return (
    <HeroContainer>
      <ContentWrapper>
        <LeftContent>
          <MainTitle ref={titleRef}>IMPACT REPORT</MainTitle>
          <TitleUnderline ref={underlineRef} />
          <SubtitleText ref={subtitleRef}>GUITARS OVER GUNS</SubtitleText>
          <ReportYear ref={yearRef}>2024-2025</ReportYear>

          <ButtonContainer>
            <PrimaryButton ref={primaryButtonRef}>
              <span>▶</span>
              <span>Watch Our Story</span>
            </PrimaryButton>
            <SecondaryButton ref={secondaryButtonRef}>
              <span>Support Our Mission</span>
            </SecondaryButton>
          </ButtonContainer>
        </LeftContent>

        <SoundWaveContainer ref={waveContainerRef}>
          {Array.from({ length: 24 }).map((_, i) => {
            const uniqueId = `wave-bar-${i}-${Math.random()
              .toString(36)
              .substr(2, 5)}`;
            return (
              <WaveBar
                key={uniqueId}
                className="wave-bar"
                ref={(el) => {
                  if (el) waveBarsRef.current[i] = el;
                }}
                style={{
                  backgroundColor: getWaveBarColor(i),
                }}
              />
            );
          })}
        </SoundWaveContainer>
      </ContentWrapper>
    </HeroContainer>
  );
}

export default HeroSection;
