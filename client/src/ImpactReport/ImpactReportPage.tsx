import React, { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';
import 'leaflet/dist/leaflet.css'; // Ensure Leaflet CSS is imported first
import './ImpactReportStructure.css';
import '../assets/fonts/fonts.css'; // Import GOGO fonts
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import MissionSection from './sections/MissionSection';
import ImpactSection from './components/ImpactSection';
import ProgramsSection from './components/ProgramsSection';
import LocationsSection from './sections/LocationsSection';
import TestimonialSection from './components/TestimonialSection';
import AchievementsSection from './components/AchievementsSection';
import PartnersSection from './components/PartnersSection';
import FutureVisionSection from './components/FutureVisionSection';
import MissionStatement from '../components/MissionStatement';
import photo1 from '../assets/missionPhotos/Photo1.jpg';
import gogoLogo from '../assets/GOGO_LOGO_STACKED_WH.png';
import gogoWideLogo from '../assets/GOGO_LOGO_WIDE_WH.png';

function ImpactReportPage() {
  // Refs for each section to animate
  const heroRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const impactRef = useRef<HTMLDivElement>(null);
  const achievementsRef = useRef<HTMLDivElement>(null);
  const programsRef = useRef<HTMLDivElement>(null);
  const testimonialRef = useRef<HTMLDivElement>(null);
  const locationsRef = useRef<HTMLDivElement>(null);
  const partnersRef = useRef<HTMLDivElement>(null);
  const futureRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

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

  // Set up Intersection Observer for animations
  useEffect(() => {
    // Initial animation for hero section
    if (heroRef.current) {
      animate(heroRef.current, {
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 1000,
        easing: 'easeOutExpo',
      });
    }

    // Observer for other sections
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Different animation for each section
            const { target } = entry;

            animate(target, {
              opacity: [0, 1],
              translateY: [50, 0],
              duration: 800,
              easing: 'easeOutExpo',
              delay: 200,
              complete: () => {
                // Animate child elements after the section appears
                const children = target.querySelectorAll('.animate-child');
                animate(children, {
                  opacity: [0, 1],
                  translateY: [20, 0],
                  scale: [0.98, 1],
                  duration: 600,
                  delay: stagger(100),
                  easing: 'easeOutExpo',
                });
              },
            });

            // Unobserve after animation is triggered
            observer.unobserve(target);
          }
        });
      },
      { threshold: 0.1 }, // 10% of the element is visible
    );

    // Observe all sections except hero (which is animated on load)
    const sections = [
      missionRef.current,
      impactRef.current,
      achievementsRef.current,
      programsRef.current,
      testimonialRef.current,
      locationsRef.current,
      partnersRef.current,
      futureRef.current,
      footerRef.current,
    ];

    sections.forEach((section) => {
      if (section) {
        // Set initial opacity to 0 for all sections
        // Using inline styles directly instead of modifying the parameter
        section.setAttribute('style', 'opacity: 0');
        observer.observe(section);
      }
    });

    // Cleanup observer on unmount
    return () => observer.disconnect();
  }, []);

  return (
    <div className="impact-report">
      <div className="spotify-gradient-background" />
      <Header />
      <div className="main-content">
        <div ref={heroRef} style={{ opacity: 0 }}>
          <HeroSection />
        </div>
        <div ref={missionRef}>
          <MissionSection />
        </div>
        <div ref={impactRef}>
          <ImpactSection />
        </div>
        <div ref={achievementsRef}>
          <AchievementsSection />
        </div>
        <div ref={programsRef}>
          <ProgramsSection />
        </div>
        <div ref={testimonialRef}>
          <TestimonialSection />
        </div>
        <div ref={locationsRef}>
          <LocationsSection />
        </div>
        <div ref={partnersRef}>
          <PartnersSection />
        </div>
        <div ref={futureRef}>
          <FutureVisionSection />
        </div>
      </div>
      <footer className="spotify-footer" ref={footerRef}>
        <div className="footer-content">
          <div className="footer-logo animate-child">Guitars Over Guns</div>
          <div className="footer-links animate-child">
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
        <div className="footer-bottom animate-child">
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
