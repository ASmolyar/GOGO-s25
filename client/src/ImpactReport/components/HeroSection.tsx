import React, { useEffect, useState } from 'react';

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const titleText = "IMPACT REPORT 2024";

  return (
    <section className="hero-section">
      <div className={`content-wrapper ${isLoaded ? 'fade-in' : ''}`}>
        <div className="title-wrapper">
          <h1>{titleText}</h1>
        </div>
        <h2>Guitars Over Guns</h2>
        <div className="hero-cta">
          <button className="spotify-button primary">
            <span className="icon">▶</span>
            <span>Watch Our Story</span>
          </button>
          <button className="spotify-button secondary">
            <span>Support Our Mission</span>
          </button>
        </div>
      </div>
      <div className="hero-visual">
        <div className="sound-wave">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="wave-bar" 
              style={{ 
                animationDelay: `${i * 0.1}s`,
                height: `${Math.sin(i/3) * 30 + 70}%` 
              }}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 