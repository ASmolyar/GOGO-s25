import React, { useEffect } from 'react';
import './ImpactReportStructure.css';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import MissionSection from './components/MissionSection';
import ImpactSection from './components/ImpactSection';
import ProgramsSection from './components/ProgramsSection';
import LocationsSection from './components/LocationsSection';

function ImpactReportPage() {
  // Apply Spotify-like styles to body when component mounts
  useEffect(() => {
    // Save original styles to restore them later
    const originalBackground = document.body.style.backgroundColor;
    const originalColor = document.body.style.color;
    const originalFontFamily = document.body.style.fontFamily;
    const originalOverflow = document.body.style.overflowX;

    // Apply Spotify-inspired styles
    document.body.style.backgroundColor = 'var(--spotify-black, #121212)';
    document.body.style.color = 'white';
    document.body.style.fontFamily =
      'var(--font-main, "Gotham", "Montserrat", "Helvetica Neue", sans-serif)';
    document.body.style.overflowX = 'hidden';
    document.body.classList.add('has-spotify-header');

    // Add Google Fonts for Montserrat
    const fontLink = document.createElement('link');
    fontLink.href =
      'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // Cleanup function to restore original styles
    return () => {
      document.body.style.backgroundColor = originalBackground;
      document.body.style.color = originalColor;
      document.body.style.fontFamily = originalFontFamily;
      document.body.style.overflowX = originalOverflow;
      document.body.classList.remove('has-spotify-header');
      document.head.removeChild(fontLink);
    };
  }, []);

  return (
    <div className="impact-report">
      <div className="spotify-gradient-background"></div>
      <Header />
      <div className="main-content">
        <HeroSection />
        <MissionSection />
        <ImpactSection />
        <ProgramsSection />
        <LocationsSection />
      </div>
      <footer className="spotify-footer">
        <div className="footer-content">
          <div className="footer-logo">Guitars Over Guns</div>
          <div className="footer-links">
            <a href="#" className="footer-link">
              About
            </a>
            <a href="#" className="footer-link">
              Programs
            </a>
            <a href="#" className="footer-link">
              Donate
            </a>
            <a href="#" className="footer-link">
              Contact
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="social-icons">
            <span className="icon">♫</span>
            <span className="icon">♪</span>
            <span className="icon">🎵</span>
          </div>
          <div className="copyright">
            © 2024 Guitars Over Guns. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ImpactReportPage;
