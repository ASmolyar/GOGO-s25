import React, { useEffect, useRef } from 'react';
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
import { animate, stagger } from 'animejs';
import MissionStatement from '../components/MissionStatement';
import photo1 from '../assets/missionPhotos/Photo1.jpg';
import gogoLogo from '../assets/GOGO_LOGO_STACKED_WH.png';
import gogoWideLogo from '../assets/GOGO_LOGO_WIDE_WH.png';

// ... existing code ...
