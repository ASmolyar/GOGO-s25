import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import anime from 'animejs/lib/anime.es.js';

// Update title styling to use GOGO brand colors
const GogoTitle = styled.h1`
  font-family: 'Airwaves', sans-serif;
  background: linear-gradient(90deg, #fff, var(--spotify-blue, #1946f5) 70%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  display: inline-block;
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 800;
  margin-bottom: 10px;
  letter-spacing: -0.05em;
  line-height: 0.9;
  position: relative;
  z-index: 1;
  opacity: 0; /* Start hidden for animation */
`;

const TitleLetter = styled.span`
  display: inline-block;
  opacity: 0;
  transform: translateY(20px);
`;

// Update button styling to use GOGO colors
const PrimaryButton = styled.button`
  background: var(--spotify-blue, #1946f5);
  border: none;
  border-radius: 25px;
  color: white;
  cursor: pointer;
  font-family: var(--font-body);
  font-weight: bold;
  padding: 12px 24px;
  margin-right: 12px;
  transition: all 0.3s ease;
  opacity: 0; /* Start hidden for animation */

  &:hover {
    background: var(--spotify-purple, #68369a);
    transform: scale(1.05);
  }
`;

const SecondaryButton = styled.button`
  background: transparent;
  border: 2px solid var(--spotify-orange, #e9bb4d);
  border-radius: 25px;
  color: white;
  cursor: pointer;
  font-family: var(--font-body);
  font-weight: bold;
  padding: 12px 24px;
  transition: all 0.3s ease;
  opacity: 0; /* Start hidden for animation */

  &:hover {
    background: var(--spotify-orange, #e9bb4d);
    color: black;
    transform: scale(1.05);
  }
`;

const Subtitle = styled.h2`
  opacity: 0; /* Start hidden for animation */
`;

function HeroSection(): JSX.Element {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Create refs for animations
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const primaryButtonRef = useRef<HTMLButtonElement>(null);
  const secondaryButtonRef = useRef<HTMLButtonElement>(null);
  const waveContainerRef = useRef<HTMLDivElement>(null);
  const waveBarsRef = useRef<HTMLDivElement[]>([]);
  
  // Split text for letter animation
  const titleText = 'IMPACT REPORT 2024';
  const titleLetters = titleText.split('');

  useEffect(() => {
    setIsLoaded(true);
    
    // Staggered animation for title letters
    anime({
      targets: '.title-letter',
      opacity: [0, 1],
      translateY: [40, 0],
      easing: 'easeOutExpo',
      duration: 1200,
      delay: anime.stagger(50, {start: 300}),
      complete: () => {
        // Animate subtitle after title completes
        anime({
          targets: subtitleRef.current,
          opacity: [0, 1],
          translateY: [20, 0],
          easing: 'easeOutExpo',
          duration: 800,
          complete: () => {
            // Animate buttons after subtitle
            anime({
              targets: [primaryButtonRef.current, secondaryButtonRef.current],
              opacity: [0, 1],
              translateY: [20, 0],
              easing: 'easeOutExpo',
              duration: 800,
              delay: anime.stagger(200)
            });
          }
        });
      }
    });
    
    // Animate the wave bars
    if (waveContainerRef.current) {
      // Create a dynamic wave animation using anime.js
      const waveAnimation = anime({
        targets: '.wave-bar',
        height: (el: Element, i: number) => {
          // Base height with sine wave pattern
          const baseHeight = Math.sin(i / 3) * 30 + 70;
          // Return array of heights for animation
          return [
            `${baseHeight * 0.7}%`, 
            `${baseHeight}%`,
            `${baseHeight * 0.85}%`,
            `${baseHeight * 0.95}%`
          ];
        },
        easing: 'easeInOutSine',
        duration: 2000,
        delay: anime.stagger(100),
        loop: true,
        direction: 'alternate'
      });
    }
  }, []);

  // Define wave bar colors array to avoid nested ternary
  const waveBarColors = [
    'var(--spotify-blue, #1946F5)',
    'var(--spotify-purple, #68369A)',
    'var(--spotify-green, #8DDDA6)',
  ];

  return (
    <section className="hero-section">
      <div className={`content-wrapper ${isLoaded ? 'fade-in' : ''}`}>
        <div className="title-wrapper">
          <GogoTitle ref={titleRef}>
            {titleLetters.map((letter, index) => (
              <TitleLetter 
                key={`${letter}-${index}`} 
                className="title-letter"
              >
                {letter === ' ' ? '\u00A0' : letter}
              </TitleLetter>
            ))}
          </GogoTitle>
        </div>
        <Subtitle ref={subtitleRef}>Guitars Over Guns</Subtitle>
        <div className="hero-cta">
          <PrimaryButton ref={primaryButtonRef}>
            <span className="icon">▶</span>
            <span>Watch Our Story</span>
          </PrimaryButton>
          <SecondaryButton ref={secondaryButtonRef}>
            <span>Support Our Mission</span>
          </SecondaryButton>
        </div>
      </div>
      <div className="hero-visual">
        <div className="sound-wave" ref={waveContainerRef}>
          {Array.from({ length: 20 }).map((_, i) => {
            // Create a unique identifier based on position
            return (
              <div
                key={`wave-bar-${i}`}
                className="wave-bar"
                ref={(el) => el && (waveBarsRef.current[i] = el)}
                style={{
                  backgroundColor: waveBarColors[i % 3],
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
