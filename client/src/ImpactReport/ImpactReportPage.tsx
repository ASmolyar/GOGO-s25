import React, { useEffect } from 'react';
import 'leaflet/dist/leaflet.css'; // Ensure Leaflet CSS is imported first
import './ImpactReportStructure.css';
import '../assets/fonts/fonts.css'; // Import GOGO fonts
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import MissionSection from './components/MissionSection';
import ImpactSection from './components/ImpactSection';
import ProgramsSection from './components/ProgramsSection';
import LocationsSection from './sections/LocationsSection';
import TestimonialSection from './components/TestimonialSection';
import AchievementsSection from './components/AchievementsSection';
import PartnersSection from './components/PartnersSection';
import FutureVisionSection from './components/FutureVisionSection';

function ImpactReportPage() {
  // Apply GOGO-like styles to body when component mounts
  useEffect(() => {
    // Save original styles to restore them later
    const originalBackground = document.body.style.backgroundColor;
    const originalColor = document.body.style.color;
    const originalFontFamily = document.body.style.fontFamily;
    const originalOverflow = document.body.style.overflowX;

    // Apply GOGO-inspired styles
    document.body.style.backgroundColor = 'var(--spotify-black, #171717)';
    document.body.style.color = 'white';
    document.body.style.fontFamily =
      'var(--font-body, "Century Gothic", "Arial", sans-serif)';
    document.body.style.overflowX = 'hidden';
    document.body.classList.add('has-spotify-header');

    // No need to add Google Fonts for Montserrat, using GOGO fonts instead

    // Cleanup function to restore original styles
    return () => {
      document.body.style.backgroundColor = originalBackground;
      document.body.style.color = originalColor;
      document.body.style.fontFamily = originalFontFamily;
      document.body.style.overflowX = originalOverflow;
      document.body.classList.remove('has-spotify-header');
    };
  }, []);

  return (
    <div className="impact-report">
      <div className="spotify-gradient-background" />
      <Header />
      <div className="main-content">
        <HeroSection />
        <MissionSection />
        <ImpactSection />
        <AchievementsSection />
        <ProgramsSection />
        <TestimonialSection />
        <LocationsSection />
        <PartnersSection />
        <FutureVisionSection />
      </div>
      <footer className="spotify-footer">
        <div className="footer-content">
          <div className="footer-logo">Guitars Over Guns</div>
          <div className="footer-links">
            <a href="/about" className="footer-link">
              About
            </a>
            <a href="/programs" className="footer-link">
              Programs
            </a>
            <a href="/donate" className="footer-link">
              Donate
            </a>
            <a href="/contact" className="footer-link">
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
