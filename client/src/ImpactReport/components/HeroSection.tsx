import React, { useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  animate,
  stagger,
  createTimeline,
  createAnimatable,
  utils,
} from 'animejs';
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
  width: 6px; /* Thicker bars to allow fewer of them */
  height: 4px; /* Default minimal height */
  border-radius: 2px;
  transform-origin: center;
  opacity: 0.6;
  pointer-events: none;
  will-change: transform, height, opacity; /* Better performance with transform */
  transform: translateZ(0); /* Hardware acceleration */
`;

// Content wrapper with better Spotify-like spacing
const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 0 5%;
  position: relative;
  margin-top: 0;
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
  letter-spacing: 0.05em;
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
  letter-spacing: 0.05em;
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
  margin-bottom: 3rem;
  opacity: 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  pointer-events: none; /* Let events pass through */
  letter-spacing: 0.02em;
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
  letter-spacing: 0.02em;

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
  letter-spacing: 0.02em;

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

function HeroSection(): JSX.Element {
  // Create refs for animations
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const underlineRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);
  const primaryButtonRef = useRef<HTMLButtonElement>(null);
  const secondaryButtonRef = useRef<HTMLButtonElement>(null);
  const waveBackgroundRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  // Animation control refs - no state usage
  const isAnimatingRef = useRef<boolean>(false);
  const lastMoveTimeRef = useRef<number>(0);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const rippleTimeoutRef = useRef<number | null>(null);
  const waveAnimatablesRef = useRef<any[]>([]);
  const containerBoundsRef = useRef<DOMRect | null>(null);

  // Set default wave colors - alternate colors instead of sections
  const getWaveBarColor = (index: number, total: number) => {
    // Alternate between two colors based on even/odd index
    return index % 2 === 0
      ? `rgba(30, 120, 255, 0.7)`
      : `rgba(0, 210, 180, 0.7)`;
  };

  // Set idle wave pattern
  const setIdleWavePattern = useCallback(() => {
    if (!waveAnimatablesRef.current.length) return;

    waveAnimatablesRef.current.forEach(({ animatable, position }) => {
      // Create a more interesting pattern with sines
      const baseHeight = 8 + Math.sin(position * Math.PI * 4) * 15;
      const height = baseHeight + Math.random() * 5;
      const halfHeight = height / 2;

      // Use chained animatable methods
      animatable
        .height(height, 800, 'inOutSine')
        .marginTop(-halfHeight, 800, 'inOutSine')
        .marginBottom(-halfHeight, 800, 'inOutSine')
        .opacity(0.5 + Math.random() * 0.3, 800, 'inOutSine')
        .scale(1, 800, 'inOutSine');
    });
  }, []);

  // Initialize wave animatables - using createAnimatable for better performance
  const initializeWaveAnimatables = useCallback(() => {
    const waveBars = document.querySelectorAll('.wave-bar');
    if (!waveBars.length) return;

    // Clear previous animatables
    waveAnimatablesRef.current = [];

    // Create animatable for each bar
    waveBars.forEach((bar, index) => {
      const animatable = createAnimatable(bar, {
        height: 350,
        marginTop: 350,
        marginBottom: 350,
        opacity: 250,
        scale: 350,
        ease: 'out(4)', // Snappy, responsive easing
      });

      waveAnimatablesRef.current.push({
        el: bar,
        animatable,
        index,
        position: index / waveBars.length,
      });
    });

    // Set initial idle wave pattern
    setIdleWavePattern();
  }, [setIdleWavePattern]);

  // Throttled mouse move handler using animatables
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      // Basic throttling - increase to 50ms for better performance
      const now = Date.now();
      if (now - lastMoveTimeRef.current < 50) return;
      lastMoveTimeRef.current = now;

      // Store current position
      mousePosRef.current = { x: e.clientX, y: e.clientY };

      // Bail if already in click animation
      if (isAnimatingRef.current) return;

      // Clear any pending reset
      if (rippleTimeoutRef.current) {
        clearTimeout(rippleTimeoutRef.current);
        rippleTimeoutRef.current = null;
      }

      const container = containerRef.current;
      if (!container || !waveAnimatablesRef.current.length) return;

      // Update bounds if needed
      if (!containerBoundsRef.current) {
        containerBoundsRef.current = container.getBoundingClientRect();
      }

      const rect = containerBoundsRef.current;
      const posX = (e.clientX - rect.left) / rect.width;

      // Get the vertical position relative to center line (normalized from -1 to 1)
      // This will determine the intensity of the effect
      const centerLineY = rect.top + rect.height / 2;
      const distanceFromCenterY =
        Math.abs(e.clientY - centerLineY) / (rect.height / 2);
      const normalizedDistY = utils.clamp(1 - distanceFromCenterY, 0, 1);

      // Enhanced intensity based on distance from center line
      const intensityMultiplier = 0.5 + normalizedDistY * 2; // 0.5x to 2.5x based on centerline proximity

      // Apply animation to ALL bars individually using animatables with chained methods
      waveAnimatablesRef.current.forEach(({ animatable, position }) => {
        const distance = Math.abs(position - posX);

        // Always calculate an intensity, but it drops off with distance
        // The active range is still 0.3, but we always calculate some effect
        const rawIntensity =
          Math.max(0, 1 - distance / 0.3) ** 2 * intensityMultiplier;

        // Only apply significant changes if we're in range
        if (distance < 0.3) {
          const height = Math.min(5 + rawIntensity * 100, 105);
          const halfHeight = height / 2;

          // Use chained methods with short duration for responsive feel
          animatable
            .height(height, 100, 'outQuad')
            .marginTop(-halfHeight, 100, 'outQuad')
            .marginBottom(-halfHeight, 100, 'outQuad')
            .opacity(0.6 + Math.min(rawIntensity * 0.4, 0.4), 100, 'outQuad');
        } else {
          // For bars outside the range, we still apply a very small effect
          // This ensures they're "aware" of the cursor and will animate smoothly
          const minHeight = 5 + Math.random() * 3; // Small random height for idle state
          const halfHeight = minHeight / 2;

          animatable
            .height(minHeight, 300, 'outQuad')
            .marginTop(-halfHeight, 300, 'outQuad')
            .marginBottom(-halfHeight, 300, 'outQuad')
            .opacity(0.5 + Math.random() * 0.1, 300, 'outQuad');
        }
      });

      // Set a timeout to reset the wave if mouse isn't moving
      rippleTimeoutRef.current = window.setTimeout(() => {
        // Gradual transition back to idle wave pattern
        if (!isAnimatingRef.current) {
          // Don't interfere with click animations
          setIdleWavePattern();
        }
      }, 800); // Shorter timeout for more responsive reset
    },
    [setIdleWavePattern],
  );

  // Wave click handler using animatables
  const handleWaveClick = useCallback(
    (e: MouseEvent) => {
      // Bail early if animation is already in progress
      if (isAnimatingRef.current) {
        console.log('⚠️ Click ignored - animation already in progress');
        return;
      }

      // Bail early if wave doesn't exist
      const container = containerRef.current;
      if (!container || !waveAnimatablesRef.current.length) {
        console.log('⚠️ Click ignored - container or wave bars not available');
        return;
      }

      console.log('🎯 Click handler started, setting up animation');

      // Cancel any pending reset
      if (rippleTimeoutRef.current) {
        clearTimeout(rippleTimeoutRef.current);
        rippleTimeoutRef.current = null;
        console.log('🧹 Cleared pending reset timeout');
      }

      // Mark as animating to avoid mouse move interference
      isAnimatingRef.current = true;
      console.log('🔒 Animation lock acquired');

      // Update bounds if needed
      if (!containerBoundsRef.current) {
        containerBoundsRef.current = container.getBoundingClientRect();
      }

      const rect = containerBoundsRef.current;
      const clickX = (e.clientX - rect.left) / rect.width;

      // Get the vertical position relative to center line (normalized from -1 to 1)
      const centerLineY = rect.top + rect.height / 2;
      const distanceFromCenterY =
        Math.abs(e.clientY - centerLineY) / (rect.height / 2);
      const normalizedDistY = utils.clamp(1 - distanceFromCenterY, 0, 1);

      // Enhanced intensity based on distance from center line
      const intensityMultiplier = 0.5 + normalizedDistY * 2.5; // 0.5x to 3x based on centerline proximity

      console.log(
        '🌊 Shockwave click detected at position:',
        clickX.toFixed(3),
        'Intensity:',
        intensityMultiplier.toFixed(2),
        'Animatable count:',
        waveAnimatablesRef.current.length,
      );

      // First wave - intense spike at click point
      console.log('🔽 Starting initial spike animation');

      // Reset all bars to base state to ensure clean animation
      waveAnimatablesRef.current.forEach(({ animatable, position }) => {
        const distance = Math.abs(position - clickX);

        // Set initial spike height and properties using proper animatable methods
        if (distance < 0.15) {
          const intensity = (1 - distance / 0.15) ** 2 * intensityMultiplier;
          const height = Math.min(5 + intensity * 150, 180);
          const halfHeight = height / 2;

          // Use chained animatable methods with proper duration and easing
          animatable
            .height(height)
            .marginTop(-halfHeight)
            .marginBottom(-halfHeight)
            .opacity(0.95 + (1 - distance / 0.15) * 0.05)
            .scale(distance < 0.05 ? 1.2 : 1);
        } else {
          // Reset other bars with direct animatable method calls
          animatable
            .height(5)
            .marginTop(-2.5)
            .marginBottom(-2.5)
            .opacity(0.6)
            .scale(1);
        }
      });

      console.log('✅ Initial spike animation complete');

      // Set up the shockwave effect with a series of timed animations
      console.log('🚀 Setting up shockwave sequence');

      // Track animation phases to allow for cleanup
      let currentPhase = 0;
      let isCancelled = false;

      // Phase 1: First shockwave - Starting animation
      setTimeout(() => {
        if (isCancelled) return;
        currentPhase = 1;
        console.log('📊 Shockwave phase 1 - starting wave propagation');

        // Prepare animation intervals for smooth wave movement
        const totalSteps = 20;
        const stepDuration = 50; // ms between steps
        let currentStep = 0;

        // Animation interval instead of frames
        const propagateWave = setInterval(() => {
          if (isCancelled) {
            clearInterval(propagateWave);
            return;
          }

          currentStep += 1;
          const progress = Math.min(currentStep / totalSteps, 1);
          const waveProgress = progress * 0.95; // Don't go all the way to edges

          if (currentStep % 5 === 0) {
            console.log(
              `📊 Shockwave progress: ${Math.round(progress * 100)}%`,
            );
          }

          // Apply the wave position to each bar
          waveAnimatablesRef.current.forEach(({ animatable, position }) => {
            const distanceRight = Math.abs(position - (clickX + waveProgress));
            const distanceLeft = Math.abs(position - (clickX - waveProgress));
            const minDistance = Math.min(distanceRight, distanceLeft);

            // If bar is at the shockwave front
            if (minDistance < 0.08) {
              const frontIntensity =
                (1 - minDistance / 0.08) * intensityMultiplier;
              const height = 5 + frontIntensity * 80;
              const halfHeight = height / 2;

              // Apply shockwave with animatable methods - short duration for responsive feel
              animatable
                .height(height, 100, 'outExpo')
                .marginTop(-halfHeight, 100, 'outExpo')
                .marginBottom(-halfHeight, 100, 'outExpo')
                .opacity(0.8 + frontIntensity * 0.2, 100, 'outExpo')
                .scale(1 + frontIntensity * 0.15, 100, 'outExpo');
            }
            // Bars in the wake of the shockwave
            else if (
              (position > clickX - waveProgress && position < clickX) ||
              (position < clickX + waveProgress && position > clickX)
            ) {
              const distanceFromClick = Math.abs(position - clickX);
              const wakePosition = distanceFromClick / waveProgress;
              const wakeIntensity =
                Math.sin(wakePosition * Math.PI) * 0.5 * intensityMultiplier;

              if (wakeIntensity > 0.05) {
                const height = 5 + wakeIntensity * 30;
                const halfHeight = height / 2;

                animatable
                  .height(height, 100, 'outSine')
                  .marginTop(-halfHeight, 100, 'outSine')
                  .marginBottom(-halfHeight, 100, 'outSine')
                  .opacity(0.6 + wakeIntensity * 0.3, 100, 'outSine')
                  .scale(1 + wakeIntensity * 0.1, 100, 'outSine');
              } else {
                // Return to minimal height
                animatable
                  .height(5, 100, 'outSine')
                  .marginTop(-2.5, 100, 'outSine')
                  .marginBottom(-2.5, 100, 'outSine')
                  .opacity(0.6, 100, 'outSine')
                  .scale(1, 100, 'outSine');
              }
            }
          });

          // Once complete, clean up and reset
          if (currentStep >= totalSteps) {
            clearInterval(propagateWave);
            console.log('🏁 Shockwave animation complete');

            // Phase 3: Reset to idle pattern
            setTimeout(() => {
              if (isCancelled) return;
              currentPhase = 3;
              console.log('🔄 Resetting to idle pattern');
              setIdleWavePattern();
              isAnimatingRef.current = false;
              console.log('🔓 Animation lock released');
            }, 300);
          }
        }, stepDuration);
      }, 350);

      // Return a cleanup function that can be used to cancel animation
      // eslint-disable-next-line consistent-return
      return () => {
        console.log(`⚠️ Cancelling shockwave at phase ${currentPhase}`);
        isCancelled = true;
        setIdleWavePattern();
        isAnimatingRef.current = false;
        console.log('🔓 Animation lock released (cancellation)');
      };
    },
    [setIdleWavePattern],
  );

  // Define handler for mouseleave with detailed logging
  const mouseLeaveHandler = useCallback(() => {
    console.log(
      '🖱️ Mouse left - animation state:',
      isAnimatingRef.current ? 'locked' : 'unlocked',
    );
    if (!isAnimatingRef.current) {
      setTimeout(setIdleWavePattern, 300);
    } else {
      console.log('⏭️ Skipping idle pattern reset due to active animation');
    }
  }, [setIdleWavePattern]);

  // Set up everything on mount and handle cleanup
  useEffect(() => {
    // Initialize animations for text elements using direct AnimeJS calls
    if (titleRef.current) {
      animate(titleRef.current, {
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 1000,
        easing: 'easeOutExpo',
      });
    }

    if (underlineRef.current) {
      animate(underlineRef.current, {
        scaleX: [0, 1],
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutExpo',
        delay: 200,
      });
    }

    if (subtitleRef.current) {
      animate(subtitleRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        easing: 'easeOutExpo',
        delay: 400,
      });
    }

    if (yearRef.current) {
      animate(yearRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        easing: 'easeOutExpo',
        delay: 600,
      });
    }

    // Animate buttons
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
        opacity: [0, 0.7],
        duration: 1200,
        easing: 'easeOutExpo',
        delay: 1000,
      });
    }

    // Set container ref for events
    const heroContainer = waveBackgroundRef.current?.parentElement;
    if (heroContainer) {
      containerRef.current = heroContainer;
      containerBoundsRef.current = heroContainer.getBoundingClientRect();
    }

    // Initialize wave animatables
    setTimeout(initializeWaveAnimatables, 100);

    // Handle window resize to update container bounds
    const handleResize = () => {
      if (containerRef.current) {
        containerBoundsRef.current =
          containerRef.current.getBoundingClientRect();
      }
    };

    // Define event handlers for cleanup
    const clickHandler = (e: Event) => {
      // Cast to MouseEvent since we know it's a mouse event
      handleWaveClick(e as MouseEvent);
    };

    // Set up event listeners with better event handling
    if (heroContainer) {
      // Use explicit event listeners without throttling in the listener itself
      // The throttling is handled inside the function
      heroContainer.addEventListener('mousemove', handleMouseMove);

      // Make sure click event propagates properly
      heroContainer.addEventListener('click', clickHandler);

      // Simple mouseleave handler
      heroContainer.addEventListener('mouseleave', mouseLeaveHandler);

      // Add resize listener
      window.addEventListener('resize', handleResize);
    }

    // Cleanup function
    return () => {
      if (heroContainer) {
        heroContainer.removeEventListener('mousemove', handleMouseMove);
        heroContainer.removeEventListener('click', clickHandler);
        heroContainer.removeEventListener('mouseleave', mouseLeaveHandler);
      }

      window.removeEventListener('resize', handleResize);

      if (rippleTimeoutRef.current) {
        clearTimeout(rippleTimeoutRef.current);
      }
    };
  }, [
    handleWaveClick,
    initializeWaveAnimatables,
    setIdleWavePattern,
    mouseLeaveHandler,
    handleMouseMove,
  ]);

  // Reduced number of wave bars for better performance
  const numWaveBars = 80; // Increased to 80 for more visual detail

  return (
    <HeroContainer>
      {/* Music waveform visualization */}
      <WaveBackground ref={waveBackgroundRef}>
        {Array.from({ length: numWaveBars }).map((_, i) => {
          const uniqueId = `wave-bar-${i}`;
          const position = i / numWaveBars;
          const initialHeight = 5 + Math.abs(position - 0.5) * 15;
          const halfHeight = initialHeight / 2;

          return (
            <WaveBar
              key={uniqueId}
              className="wave-bar"
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

          <ButtonContainer>
            <a
              href="https://youtu.be/21ufVKC5TEo?si=3N7xugwbc3Z4RNm-"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <PrimaryButton ref={primaryButtonRef}>
                <span>▶</span>
                <span>Watch Our Story</span>
              </PrimaryButton>
            </a>
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
