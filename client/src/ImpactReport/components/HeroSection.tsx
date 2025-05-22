import React, { useEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { animate, stagger, createTimeline, createAnimatable } from 'animejs';
import COLORS from '../../assets/colors';

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
  /* Ensure this container receives all mouse events */
  cursor: default;
`;

// Waveform container that spans the entire width of the page as a background element
const WaveBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between; /* Spread bars across full width */
  gap: 3px; /* Larger gap for fewer bars */
  z-index: 1; /* Lower z-index to ensure it's below content */
  opacity: 0;
  padding: 0 1%; /* Small padding to prevent edge cutoff */
  pointer-events: none; /* Don't catch events directly - parent will handle them */
  background: rgba(80, 56, 160, 0.15); /* Semi-transparent background tint */
`;

// Individual wave bar styled for a music waveform
const WaveBar = styled.div`
  width: 4px; /* Thicker bars for better visibility with even fewer of them */
  height: 4px; /* Default minimal height */
  border-radius: 2px;
  transition: height 0.15s ease-out, opacity 0.15s ease-out; /* Simpler, faster transitions */
  transform-origin: center; /* Center so it can extend both up and down */
  opacity: 0.6; /* Semi-transparent by default */
  pointer-events: none; /* Don't catch events */
`;

// Content wrapper with better Spotify-like spacing
const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 0 5%;
  position: relative;
  margin-top: 8%;
  z-index: 2; /* Content above wave but still allows events to pass through */
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 2rem;
  pointer-events: none; /* Let events pass through to the container */
`;

// Left side content container
const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  pointer-events: none; /* Let events pass through */
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
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  pointer-events: none; /* Let events pass through */
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
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  pointer-events: none; /* Let events pass through */
`;

// Green underline
const TitleUnderline = styled.div`
  width: 100px;
  height: 4px;
  background-color: rgba(119, 221, 171, 0.8);
  margin: 1.5rem 0;
  transform: scaleX(0);
  transform-origin: left;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  pointer-events: none; /* Let events pass through */
`;

// Report year text
const ReportYear = styled.div`
  font-size: 2.2rem;
  color: var(--spotify-orange, #e9bb4d);
  font-family: 'Century Gothic-Bold', 'Arial', sans-serif;
  font-weight: 500;
  margin-top: 1rem;
  opacity: 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  pointer-events: none; /* Let events pass through */
`;

// Motto text
const Motto = styled.div`
  font-size: 1.5rem;
  color: var(--gogo-purple, #6836A');
  font-family: 'Century Gothic-Bold', 'Arial', sans-serif;
  font-weight: 500;
  margin-top: 1.5rem;
  margin-bottom: 3rem;
  opacity: 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  pointer-events: none; /* Let events pass through */
`;

// Button container
const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
  pointer-events: auto; /* Re-enable pointer events for buttons */
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  pointer-events: auto; /* Ensure buttons catch events */

  &:hover {
    background: var(--spotify-purple, #68369a);
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  pointer-events: auto; /* Ensure buttons catch events */

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  }
`;

// Right content area - we'll keep this even though the wave is now in the background
const RightContent = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  pointer-events: none; /* Let events pass through */
`;

// Define a type for wave bar elements and wave parameters
interface WaveBarElement extends HTMLElement {
  height?: string;
  marginTop?: string;
  marginBottom?: string;
}

function HeroSection(): JSX.Element {
  // Create refs for animations
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const underlineRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);
  const mottoRef = useRef<HTMLDivElement>(null);
  const primaryButtonRef = useRef<HTMLButtonElement>(null);
  const secondaryButtonRef = useRef<HTMLButtonElement>(null);
  const waveBackgroundRef = useRef<HTMLDivElement>(null);
  const waveBarsRef = useRef<HTMLDivElement[]>([]);

  // Performance optimization - prevent excessive re-renders
  const isAnimatingRef = useRef<boolean>(false);
  const requestRef = useRef<number | null>(null);

  // Define wave bar colors with more vibrant options and semi-transparency
  const getWaveBarColor = (index: number, total: number) => {
    // Create more vibrant colors with transparency
    const position = index / total;
    const opacity = 0.5; // Base opacity for background effect

    // Ultra-simplified color spectrum - just 3 colors
    if (position < 0.33) {
      return `rgba(0, 210, 180, ${opacity})`;
    }
    if (position < 0.67) {
      return `rgba(30, 120, 255, ${opacity})`;
    }
    return `rgba(200, 55, 180, ${opacity})`;
  };

  // Reset all animations to default state
  const resetAllBars = () => {
    // Cancel any ongoing animations
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }

    isAnimatingRef.current = false;

    // Get all bars
    const waveBars = document.querySelectorAll('.wave-bar');
    if (waveBars.length === 0) return;

    // Create a new animation using default parameters
    animate(waveBars, {
      height: (el: any, i: number) => {
        const position = i / waveBars.length;
        const centralFactor = 0.5 + Math.abs(position - 0.5);
        return 5 + centralFactor * 10;
      },
      marginTop: (el: any, i: number) => {
        const position = i / waveBars.length;
        const centralFactor = 0.5 + Math.abs(position - 0.5);
        const height = 5 + centralFactor * 10;
        return -height / 2;
      },
      marginBottom: (el: any, i: number) => {
        const position = i / waveBars.length;
        const centralFactor = 0.5 + Math.abs(position - 0.5);
        const height = 5 + centralFactor * 10;
        return -height / 2;
      },
      opacity: 0.6,
      easing: 'easeOutQuad',
      duration: 400,
    });
  };

  // Define the handleMouseMove callback with proper type for DOM events
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isAnimatingRef.current || !waveBackgroundRef.current) return;
    isAnimatingRef.current = true;

    // Define animation parameters within the callback to avoid dependency issues
    // Use requestAnimationFrame for better performance
    requestRef.current = requestAnimationFrame(() => {
      const container = waveBackgroundRef.current?.parentElement;
      if (!container) {
        isAnimatingRef.current = false;
        return;
      }

      const waveBars = Array.from(
        document.querySelectorAll('.wave-bar'),
      ).filter((el): el is HTMLElement => el instanceof HTMLElement);
      if (waveBars.length === 0) {
        isAnimatingRef.current = false;
        return;
      }

      // Get container dimensions and mouse position
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const containerWidth = rect.width;

      // Calculate the mouse position ratio (0 to 1)
      const positionRatioX = mouseX / containerWidth;

      // Use anime.js to animate the bars
      animate(waveBars, {
        height: (el: any, i: number) => {
          const position = i / waveBars.length;
          const distance = Math.abs(position - positionRatioX);

          if (distance < 0.15) {
            const intensity = 1 - distance / 0.15;
            return 5 + intensity * 80;
          }
          return parseFloat(getComputedStyle(el).height);
        },
        marginTop: (el: any, i: number) => {
          const position = i / waveBars.length;
          const distance = Math.abs(position - positionRatioX);

          if (distance < 0.15) {
            const intensity = 1 - distance / 0.15;
            const height = 5 + intensity * 80;
            return -height / 2;
          }
          return parseFloat(getComputedStyle(el).marginTop);
        },
        marginBottom: (el: any, i: number) => {
          const position = i / waveBars.length;
          const distance = Math.abs(position - positionRatioX);

          if (distance < 0.15) {
            const intensity = 1 - distance / 0.15;
            const height = 5 + intensity * 80;
            return -height / 2;
          }
          return parseFloat(getComputedStyle(el).marginBottom);
        },
        opacity: (el: any, i: number) => {
          const position = i / waveBars.length;
          const distance = Math.abs(position - positionRatioX);

          if (distance < 0.15) {
            const intensity = 1 - distance / 0.15;
            return 0.6 + intensity * 0.2;
          }
          return 0.6;
        },
        duration: 250,
        easing: 'easeOutQuad',
      });

      isAnimatingRef.current = false;
    });
  }, []);

  // Simple ripple effect using anime.js
  const createWaveRipple = useCallback((e: MouseEvent) => {
    const container = waveBackgroundRef.current?.parentElement;
    if (!container) return;

    const waveBars = Array.from(document.querySelectorAll('.wave-bar'));
    if (waveBars.length === 0) return;

    // If we're already animating, cancel it
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }

    // Get container dimensions and mouse position
    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const containerWidth = rect.width;
    const clickPosition = mouseX / containerWidth;

    // Create timeline for ripple animation
    const duration = 1500;
    const maxWaveHeight = 120;

    // Create keyframes for a ripple effect that propagates outward
    const keyframes = 10; // Number of animation keyframes
    const rippleTimeline: Array<{
      targets: HTMLElement[];
      height: (target: any, i: number) => number;
      marginTop: (target: any, i: number) => number;
      marginBottom: (target: any, i: number) => number;
      opacity: (target: any, i: number) => number;
      duration: number;
      easing: string;
    }> = [];

    for (let frame = 0; frame < keyframes; frame++) {
      const progress = frame / (keyframes - 1);
      const rippleRadius = progress * 0.8;

      rippleTimeline.push({
        targets: waveBars as HTMLElement[],
        height: (el: HTMLElement, i: number) => {
          const position = i / waveBars.length;
          const distance = Math.abs(position - clickPosition);
          const distanceFromRipple = rippleRadius - distance;

          if (distanceFromRipple > -0.1 && distanceFromRipple < 0.2) {
            const waveIntensity = 1 - Math.abs(distanceFromRipple - 0.05) * 10;
            const normalizedIntensity = Math.max(0, Math.min(1, waveIntensity));
            const heightFactor = normalizedIntensity ** 2 * maxWaveHeight;
            return 5 + heightFactor;
          }
          return 5; // Default size
        },
        marginTop: (el: HTMLElement, i: number) => {
          const position = i / waveBars.length;
          const distance = Math.abs(position - clickPosition);
          const distanceFromRipple = rippleRadius - distance;

          if (distanceFromRipple > -0.1 && distanceFromRipple < 0.2) {
            const waveIntensity = 1 - Math.abs(distanceFromRipple - 0.05) * 10;
            const normalizedIntensity = Math.max(0, Math.min(1, waveIntensity));
            const heightFactor = normalizedIntensity ** 2 * maxWaveHeight;
            const height = 5 + heightFactor;
            return -height / 2;
          }
          return -2.5; // Default margin
        },
        marginBottom: (el: HTMLElement, i: number) => {
          const position = i / waveBars.length;
          const distance = Math.abs(position - clickPosition);
          const distanceFromRipple = rippleRadius - distance;

          if (distanceFromRipple > -0.1 && distanceFromRipple < 0.2) {
            const waveIntensity = 1 - Math.abs(distanceFromRipple - 0.05) * 10;
            const normalizedIntensity = Math.max(0, Math.min(1, waveIntensity));
            const heightFactor = normalizedIntensity ** 2 * maxWaveHeight;
            const height = 5 + heightFactor;
            return -height / 2;
          }
          return -2.5; // Default margin
        },
        opacity: (el: HTMLElement, i: number) => {
          const position = i / waveBars.length;
          const distance = Math.abs(position - clickPosition);
          const distanceFromRipple = rippleRadius - distance;

          if (distanceFromRipple > -0.1 && distanceFromRipple < 0.2) {
            const waveIntensity = 1 - Math.abs(distanceFromRipple - 0.05) * 10;
            const normalizedIntensity = Math.max(0, Math.min(1, waveIntensity));
            return 0.6 + normalizedIntensity * 0.3;
          }
          return 0.6;
        },
        duration: duration / keyframes,
        easing: 'easeOutQuad',
      });
    }

    // Execute each frame in sequence
    let currentFrame = 0;
    const animateFrame = () => {
      if (currentFrame < rippleTimeline.length) {
        animate(rippleTimeline[currentFrame].targets, {
          height: rippleTimeline[currentFrame].height,
          marginTop: rippleTimeline[currentFrame].marginTop,
          marginBottom: rippleTimeline[currentFrame].marginBottom,
          opacity: rippleTimeline[currentFrame].opacity,
          duration: rippleTimeline[currentFrame].duration,
          easing: rippleTimeline[currentFrame].easing,
        });

        const frameIndex = currentFrame;
        currentFrame = currentFrame + 1;

        // Wait for a timeout before starting next frame
        setTimeout(animateFrame, rippleTimeline[frameIndex].duration);
      } else {
        // Reset to default state after animation completes
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
          requestRef.current = null;
        }

        isAnimatingRef.current = false;

        // Get all bars and reset them to default state
        const barElements = document.querySelectorAll('.wave-bar');
        if (barElements.length === 0) return;

        // Reset to default appearance
        animate(barElements, {
          height: (el: any, i: number) => {
            const position = i / barElements.length;
            const centralFactor = 0.5 + Math.abs(position - 0.5);
            return 5 + centralFactor * 10;
          },
          marginTop: (el: any, i: number) => {
            const position = i / barElements.length;
            const centralFactor = 0.5 + Math.abs(position - 0.5);
            const height = 5 + centralFactor * 10;
            return -height / 2;
          },
          marginBottom: (el: any, i: number) => {
            const position = i / barElements.length;
            const centralFactor = 0.5 + Math.abs(position - 0.5);
            const height = 5 + centralFactor * 10;
            return -height / 2;
          },
          opacity: 0.6,
          easing: 'easeOutQuad',
          duration: 400,
        });
      }
    };

    // Start animation
    animateFrame();
  }, []);

  useEffect(() => {
    // Create animation for each element
    if (titleRef.current) {
      animate(titleRef.current, {
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 1000,
        easing: 'easeOutExpo',
      });
    }

    // Add underline animation
    if (underlineRef.current) {
      animate(underlineRef.current, {
        scaleX: [0, 1],
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutExpo',
        delay: 200,
      });
    }

    // Add subtitle animation
    if (subtitleRef.current) {
      animate(subtitleRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        easing: 'easeOutExpo',
        delay: 400,
      });
    }

    // Add year animation
    if (yearRef.current) {
      animate(yearRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        easing: 'easeOutExpo',
        delay: 600,
      });
    }

    // Add motto animation
    if (mottoRef.current) {
      animate(mottoRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        easing: 'easeOutExpo',
        delay: 400,
      });
    }

    // Animate buttons with staggered timing
    const buttons = [
      primaryButtonRef.current,
      secondaryButtonRef.current,
    ].filter((button): button is HTMLButtonElement => button !== null);

    if (buttons.length > 0) {
      animate(buttons, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        easing: 'easeOutExpo',
        delay: stagger(200, { start: 800 }),
      });
    }

    // Animate wave background
    if (waveBackgroundRef.current) {
      animate(waveBackgroundRef.current, {
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeOutExpo',
        delay: 1000,
      });
    }

    // Initialize basic wave appearance
    resetAllBars();

    // Setup event listeners with performance optimizations
    const heroContainer = waveBackgroundRef.current?.parentElement;
    if (heroContainer) {
      heroContainer.addEventListener('mousemove', handleMouseMove, {
        passive: true,
      });
      heroContainer.addEventListener('mouseleave', resetAllBars);
      heroContainer.addEventListener('click', createWaveRipple);
    }

    // Cleanup on unmount
    return () => {
      if (heroContainer) {
        heroContainer.removeEventListener('mousemove', handleMouseMove);
        heroContainer.removeEventListener('mouseleave', resetAllBars);
        heroContainer.removeEventListener('click', createWaveRipple);
      }

      // Cancel any ongoing animations
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [handleMouseMove, createWaveRipple]);

  // Drastically reduced number of wave bars for much better performance
  const numWaveBars = 60; // Only half of the previous count

  return (
    <HeroContainer>
      {/* Music waveform visualization as full background - extremely optimized */}
      <WaveBackground ref={waveBackgroundRef}>
        {Array.from({ length: numWaveBars }).map((_, i) => {
          const uniqueId = `wave-bar-${i}`;

          // Ultra-simplified initial height calculation
          const position = i / numWaveBars;
          const centralFactor = 0.5 + Math.abs(position - 0.5); // Simpler calculation
          const initialHeight = 5 + centralFactor * 10; // Much smaller range
          const halfHeight = initialHeight / 2;

          return (
            <WaveBar
              key={uniqueId}
              className="wave-bar"
              ref={(el) => {
                if (el) {
                  // Create a new array if needed
                  if (!waveBarsRef.current) {
                    waveBarsRef.current = [];
                  }
                  // Ensure the array is large enough
                  if (waveBarsRef.current.length <= i) {
                    waveBarsRef.current.length = i + 1;
                  }
                  waveBarsRef.current[i] = el;
                }
              }}
              style={{
                backgroundColor: getWaveBarColor(i, numWaveBars),
                height: `${initialHeight}px`,
                marginTop: `-${halfHeight}px`,
                marginBottom: `-${halfHeight}px`,
                opacity: 0.6,
              }}
            />
          );
        })}
      </WaveBackground>

      <ContentWrapper>
        <LeftContent>
          <MainTitle ref={titleRef}>IMPACT REPORT</MainTitle>
          <TitleUnderline ref={underlineRef} />
          <SubtitleText ref={subtitleRef}>GUITARS OVER GUNS</SubtitleText>
          <ReportYear ref={yearRef}>2024-2025</ReportYear>
          <Motto ref={mottoRef}>Unlocking Youth Potential Through Music, Mentorship, and the Arts</Motto>

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

        <RightContent>
          {/* This section intentionally left empty for layout balance */}
        </RightContent>
      </ContentWrapper>
    </HeroContainer>
  );
}

export default HeroSection;
