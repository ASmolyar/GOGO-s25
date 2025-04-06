import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

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

  &:hover {
    background: var(--spotify-orange, #e9bb4d);
    color: black;
    transform: scale(1.05);
  }
`;

function HeroSection(): JSX.Element {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const titleText = 'IMPACT REPORT 2024';

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
          <GogoTitle>{titleText}</GogoTitle>
        </div>
        <h2>Guitars Over Guns</h2>
        <div className="hero-cta">
          <PrimaryButton>
            <span className="icon">▶</span>
            <span>Watch Our Story</span>
          </PrimaryButton>
          <SecondaryButton>
            <span>Support Our Mission</span>
          </SecondaryButton>
        </div>
      </div>
      <div className="hero-visual">
        <div className="sound-wave">
          {Array.from({ length: 20 }).map((_, i) => {
            // Create a unique identifier based on position and calculated height
            const height = Math.sin(i / 3) * 30 + 70;
            const uniqueId = `wave-bar-pos-${i}-height-${height.toFixed(2)}`;

            return (
              <div
                key={uniqueId}
                className="wave-bar"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  height: `${height}%`,
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
