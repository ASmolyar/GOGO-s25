import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import styled, { keyframes } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { animate, stagger } from 'animejs';
import COLORS from '../../assets/colors';

// Ambient gradient animation
const ambientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// Pulse animation for stats
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.1);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(255, 255, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
`;

// Number counter animation
const countUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Add these new keyframes at the top with other animations
const blobAnimation = keyframes`
  0% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0, 0) scale(1);
  }
`;

const blobAnimation2 = keyframes`
  0% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(-30px, 50px) scale(0.9);
  }
  66% {
    transform: translate(20px, -20px) scale(1.1);
  }
  100% {
    transform: translate(0, 0) scale(1);
  }
`;

// Spotify-inspired audio wave animation
const audioWave = keyframes`
  0% { height: 5px; }
  20% { height: 20px; }
  40% { height: 10px; }
  60% { height: 25px; }
  80% { height: 15px; }
  100% { height: 5px; }
`;

// Subtle rotating gradient animation for accents
const gradientRotate = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// New styled components for updated sections
const ImpactContainer = styled.section`
  padding: 3rem 0;
  background: linear-gradient(180deg, #171717 0%, #121212 100%);
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      ${COLORS.gogo_blue}88,
      ${COLORS.gogo_pink}88,
      ${COLORS.gogo_purple}88,
      ${COLORS.gogo_green}88
    );
    z-index: 1;
  }

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at center,
      ${COLORS.gogo_purple}10,
      transparent 70%
    );
    z-index: 0;
  }
`;

const SectionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
`;

const GradientBg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle at center,
    ${COLORS.gogo_blue}22 0%,
    ${COLORS.gogo_purple}22 30%,
    ${COLORS.gogo_pink}22 60%,
    transparent 90%
  );
  background-size: 100% 100%;
  z-index: 0;
  filter: blur(60px);
  opacity: 0.5;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 900;
  color: white;
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
`;

const Subtitle = styled.div`
  font-size: 1.3rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const StatsTitle = styled.h3`
  font-size: 2.2rem;
  font-weight: 900;
  color: white;
  margin-bottom: 2.5rem;
  text-align: center;
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  position: relative;
  overflow: hidden;
  padding: 3rem 2rem;
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.3);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  text-align: center;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
        circle at 20% 20%,
        ${COLORS.gogo_purple}22 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 80%,
        ${COLORS.gogo_blue}22 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 50% 50%,
        ${COLORS.gogo_teal}22 0%,
        transparent 50%
      );
    z-index: 0;
    animation: ${ambientShift} 20s ease infinite;
  }

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
        circle at 30% 30%,
        ${COLORS.gogo_pink}15 0%,
        transparent 40%
      ),
      radial-gradient(
        circle at 70% 70%,
        ${COLORS.gogo_yellow}15 0%,
        transparent 40%
      );
    z-index: 0;
    animation: ${ambientShift} 25s ease-in-out infinite reverse;
  }
`;

const StatItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1;
  text-align: center;

  &:hover {
    transform: translateY(-10px) scale(1.03);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

const PercentageCircle = styled.div`
  position: relative;
  width: 140px;
  height: 140px;
  margin-bottom: 2rem;
  animation: ${pulse} 2s infinite;
  z-index: 1;

  svg {
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
  }
`;

const PercentageText = styled.h3`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2.5rem;
  font-weight: 900;
  color: white;
  margin: 0;
  transition: all 0.3s ease;

  .percent {
    font-size: 1.2rem;
    font-weight: 400;
    vertical-align: super;
    margin-left: 2px;
  }

  .number {
    display: inline-block;
    opacity: 0;
    transform: translateY(10px);
    animation: ${countUp} 0.5s forwards;
  }
`;

const StatDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  z-index: 1;
  position: relative;
`;

const SubsectionTitle = styled.h3`
  font-size: 2rem;
  color: white;
  margin: 4rem 0 1.5rem;
  position: relative;
  padding-left: 1rem;
  display: inline-block;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: ${COLORS.gogo_blue};
    border-radius: 4px;
  }
`;

const SubsectionContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const MeasurementCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2rem;
  height: 100%;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

const MeasurementTitle = styled.h4`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${COLORS.gogo_yellow};
  margin-bottom: 1.2rem;
  position: relative;
  padding-bottom: 1rem;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 3px;
    background: ${COLORS.gogo_yellow}66;
    border-radius: 3px;
  }
`;

const MeasurementList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const MeasurementItem = styled.li`
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.8rem;
  padding-left: 1.8rem;
  position: relative;
  line-height: 1.5;

  &:before {
    content: '•';
    color: ${COLORS.gogo_teal};
    position: absolute;
    left: 0;
    font-size: 1.5rem;
    line-height: 1;
  }

  &:hover {
    color: white;
    transform: translateX(3px);
    transition: all 0.2s ease;
  }
`;

// Background shimmer effect
const shimmerEffect = keyframes`
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const Blob = styled.div<{
  color: string;
  size: string;
  top: string;
  left: string;
  delay: string;
}>`
  position: absolute;
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  background: ${(props) => props.color};
  border-radius: 50%;
  filter: blur(20px);
  opacity: 0.3;
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  animation: ${blobAnimation} 15s ease-in-out infinite;
  animation-delay: ${(props) => props.delay};
  z-index: 0;
`;

const Blob2 = styled(Blob)`
  animation: ${blobAnimation2} 20s ease-in-out infinite;
`;

// Update the MeasurementContainer with Spotify-like styling
const MeasurementContainer = styled.section`
  padding: 6rem 0;
  background: linear-gradient(135deg, #1e1e1e 0%, #121212 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at 20% 25%,
      rgba(109, 174, 132, 0.15) 0%,
      transparent 50%
    );
    z-index: 0;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at 80% 75%,
      rgba(30, 215, 96, 0.15) 0%,
      transparent 50%
    );
    z-index: 0;
  }
`;

const MeasurementWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
`;

const SpotifyCard = styled.div`
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    rgba(25, 25, 25, 0.9) 0%,
    rgba(18, 18, 18, 0.8) 100%
  );
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.07);
  overflow: hidden;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
    border-color: rgba(30, 215, 96, 0.2);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #1ed760, #169c46);
    opacity: 0.7;
    z-index: 1;
  }
`;

// Change MeasurementHeader to have Spotify-like left alignment with accent bar
const MeasurementHeader = styled.div`
  text-align: left;
  margin-top: -2rem;
  margin-bottom: 1rem;
  position: relative;
  padding-left: 1rem;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 70%;
    background: linear-gradient(180deg, #1ed760, #169c46);
    border-radius: 4px;
  }
`;

// Update MeasureTitle to have Spotify-like typography
const MeasureTitle = styled.h2`
  font-size: 3.5rem;
  font-weight: 900;
  color: white;
  margin-bottom: 0.5rem;
  position: relative;
  display: inline-block;
  line-height: 1.1;

  .highlight {
    color: #1ed760;
    position: relative;
    z-index: 1;
    font-style: italic;
  }

  .regular {
    opacity: 0.9;
  }
`;

const SpotifySubtitle = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  max-width: 70vw;
  margin-top: 0.5rem;
  line-height: 1.6;
`;

const AudioWaveContainer = styled.div`
  display: flex;
  align-items: flex-end;
  height: 30px;
  gap: 3px;
  margin: 1.5rem 0;
`;

const AudioBar = styled.div<{ index: number }>`
  width: 4px;
  background: linear-gradient(to top, #1ed760, #169c46);
  border-radius: 2px;
  height: 5px;
  animation: ${audioWave} 1.5s ease infinite;
  animation-delay: ${(props) => props.index * 0.1}s;
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 3rem;
  margin-top: 3rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SpotifyGrid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 2rem;
  margin-top: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SpotifyMethodsList = styled.div`
  margin-bottom: 2rem;
`;

const SpotifyMethod = styled.div`
  background: rgba(30, 30, 30, 0.5);
  border-radius: 8px;
  padding: 1.2rem 1.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  border-left: 3px solid rgba(30, 215, 96, 0.5);

  &:hover {
    background: rgba(40, 40, 40, 0.6);
    transform: translateX(5px);
    border-left-color: #1ed760;
  }
`;

const MethodName = styled.h4`
  color: white;
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 700;
  display: flex;
  align-items: center;

  svg {
    margin-right: 0.5rem;
    color: #1ed760;
  }
`;

const MethodDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const ToolsSection = styled.div`
  background: rgba(30, 30, 30, 0.5);
  border-radius: 12px;
  padding: 1.5rem;

  h3 {
    color: white;
    font-size: 1.3rem;
    margin-top: 0;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 0.8rem;
  }
`;

const ToolItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.8rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    .tool-name {
      color: #1ed760;
    }
  }
`;

const ToolIcon = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #1ed760, #169c46);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;

  svg {
    color: white;
    width: 16px;
    height: 16px;
  }
`;

const ToolInfo = styled.div`
  flex: 1;
`;

const ToolName = styled.div`
  color: white;
  font-weight: 600;
  font-size: 1rem;
  transition: color 0.2s ease;
`;

const ToolDescription = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  margin-top: 0.2rem;
`;

// SVG Icon components for method icons
function InsightIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 16.5V8.5M12 8.5L15 11.5M12 8.5L9 11.5M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArtisticIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 12H4.5M4.5 12C5.88071 12 7 10.8807 7 9.5C7 8.11929 5.88071 7 4.5 7C3.11929 7 2 8.11929 2 9.5C2 10.8807 3.11929 12 4.5 12ZM19.5 12H22M19.5 12C18.1193 12 17 10.8807 17 9.5C17 8.11929 18.1193 7 19.5 7C20.8807 7 22 8.11929 22 9.5C22 10.8807 20.8807 12 19.5 12ZM12 19.5V22M12 19.5C10.6193 19.5 9.5 18.3807 9.5 17C9.5 15.6193 10.6193 14.5 12 14.5C13.3807 14.5 14.5 15.6193 14.5 17C14.5 18.3807 13.3807 19.5 12 19.5ZM12 4.5V2M12 4.5C13.3807 4.5 14.5 5.61929 14.5 7C14.5 8.38071 13.3807 9.5 12 9.5C10.6193 9.5 9.5 8.38071 9.5 7C9.5 5.61929 10.6193 4.5 12 4.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AcademicIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 14L3 8.5L12 3L21 8.5L12 14Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 13.5L12 19L21 13.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 18.5L12 24L21 18.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrackingIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 17L4 12L9 7M15 7L20 12L15 17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ImpactSection(): JSX.Element {
  const [inView, setInView] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [counting, setCounting] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  // Create refs for each impact stat
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRefs = useRef<(SVGCircleElement | null)[]>([]);
  const percentageRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const measureRef = useRef(null);

  // Define impact data with useMemo to avoid recreating it on every render
  const impactData = useMemo(
    () => [
      {
        id: 'mentor-trust',
        percentage: 90,
        description:
          'of students said that their mentor pays attention to their lives and can be counted on for help',
        color: '#d159a3', // Pink
      },
      {
        id: 'challenge-encouragement',
        percentage: 87,
        description:
          'of students felt encouraged to work through difficult challenges',
        color: '#6d51a3', // Purple
      },
      {
        id: 'goal-setting',
        percentage: 87,
        description:
          'of students reported that GOGO gave them opportunities to set and reflect on goals',
        color: '#6d51a3', // Purple
      },
      {
        id: 'measurable-growth',
        percentage: 85,
        description:
          'of students demonstrated measurable growth in multiple core Positive Youth Development capacities',
        color: '#3d3d3d', // Dark gray
      },
      {
        id: 'envisioning-future',
        percentage: 80,
        description:
          'of students reported that their mentor encourages them to envision their future',
        color: '#6dae84', // Green
      },
    ],
    [],
  );

  // Function to animate progress circles - wrap in useCallback
  const animateProgress = useCallback(() => {
    progressRefs.current.forEach((circle, index) => {
      if (circle) {
        const { percentage } = impactData[index];
        const circumference = 2 * Math.PI * 50; // 50 is the radius
        const offset = circumference - (percentage / 100) * circumference;

        // Animate the progress using anime.js
        animate(circle, {
          strokeDashoffset: [circumference, offset],
          duration: 1500,
          easing: 'easeOutCubic',
        });
      }
    });
  }, [impactData]);

  // Intersection observer to trigger animations when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.unobserve(entries[0].target);

          // Animate header with staggered entrance
          if (headerRef.current) {
            animate(headerRef.current.querySelectorAll('.animate-item'), {
              opacity: [0, 1],
              translateY: [30, 0],
              delay: stagger(150),
              duration: 800,
              easing: 'easeOutCubic',
            });
          }

          // Delay before starting circle animations
          setTimeout(() => {
            // Animate stat items
            if (statRefs.current.length > 0) {
              animate(statRefs.current.filter(Boolean), {
                opacity: [0, 1],
                translateY: [50, 0],
                delay: stagger(200),
                duration: 800,
                easing: 'easeOutCubic',
                complete: () => {
                  // Once stats are visible, start progress animations
                  animateProgress();
                  setCounting(true);
                },
              });
            }
          }, 400);
        }
      },
      { threshold: 0.2 },
    );

    // Save current section reference to avoid issues in cleanup
    const currentSection = sectionRef.current;

    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.disconnect();
      }
    };
  }, [animateProgress]);

  // Function to create number counters with staggered animation
  const renderCounter = (value: number) => {
    return value
      .toString()
      .split('')
      .map((digit, i) => (
        <span
          key={`${value}-digit-${digit}-${Math.random()}`}
          className="number"
          style={{ animationDelay: `${i * 0.1 + 0.3}s` }}
        >
          {digit}
        </span>
      ));
  };

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setExpanded(entry.isIntersecting);
      },
      { threshold: 0.5 },
    );
    if (measureRef.current) observer.observe(measureRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <ImpactContainer ref={sectionRef}>
        <SectionContainer>
          <SectionHeader ref={headerRef}>
            <SectionTitle>Our Impact</SectionTitle>
          </SectionHeader>

          <StatsGrid>
            <Blob
              color={COLORS.gogo_purple}
              size="300px"
              top="10%"
              left="10%"
              delay="0s"
            />
            <Blob2
              color={COLORS.gogo_blue}
              size="250px"
              top="60%"
              left="70%"
              delay="-5s"
            />
            <Blob
              color={COLORS.gogo_teal}
              size="200px"
              top="40%"
              left="40%"
              delay="-2s"
            />
            <Blob2
              color={COLORS.gogo_pink}
              size="280px"
              top="20%"
              left="80%"
              delay="-7s"
            />
            <Blob
              color={COLORS.gogo_yellow}
              size="220px"
              top="70%"
              left="20%"
              delay="-3s"
            />
            <StatsTitle>IN 2023-2024...</StatsTitle>
            {impactData.map((item, index) => (
              <StatItem
                key={item.id}
                ref={(el) => {
                  statRefs.current[index] = el;
                }}
                style={{ opacity: 0 }}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <PercentageCircle>
                  <svg viewBox="0 0 140 140" width="140" height="140">
                    <circle
                      cx="70"
                      cy="70"
                      r="60"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="8"
                    />
                    <circle
                      cx="70"
                      cy="70"
                      r="60"
                      fill="none"
                      stroke={item.color}
                      strokeWidth="8"
                      strokeDasharray="339.292"
                      strokeDashoffset={339.292}
                      ref={(el) => {
                        progressRefs.current[index] = el;
                      }}
                      transform="rotate(-90 70 70)"
                    />
                  </svg>
                  <PercentageText>
                    <span className="percent">%</span>
                    <span className="number">{item.percentage}</span>
                  </PercentageText>
                </PercentageCircle>
                <StatDescription>{item.description}</StatDescription>
              </StatItem>
            ))}
          </StatsGrid>
        </SectionContainer>
      </ImpactContainer>

      {/* New Spotify-inspired measurement section */}
      <MeasurementContainer ref={measureRef}>
        <MeasurementWrapper>
          <MeasurementHeader>
            <MeasureTitle>
              <span className="regular">How do we </span>
              <span className="highlight">measure impact</span>
              <span className="regular">?</span>
            </MeasureTitle>
            <SpotifySubtitle style={{ marginTop: '0.1rem' }}>
              We use Hello Insight, a nationally recognized evaluation tool, to
              track students' self-reported growth across 6 Positive Youth
              Development (PYD) pillars. Guitars Over Guns mentors use
              healing-centered, culturally affirming PYD practices in program
              sessions.
            </SpotifySubtitle>

            <AudioWaveContainer>
              {[...Array(18)].map((_, i) => (
                <AudioBar key={i} index={i} />
              ))}
            </AudioWaveContainer>
          </MeasurementHeader>

          <SpotifyGrid>
            <div>
              <SpotifyCard>
                <h4
                  style={{
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1.5rem',
                    margin: '0 0 0.4rem 0',
                    letterSpacing: '0.02em',
                  }}
                >
                  Our Method Provides
                </h4>
                <div
                  style={{
                    width: '80px',
                    height: '2.5px',
                    background:
                      'linear-gradient(90deg, #1ed760,rgb(20, 105, 50))',
                    borderRadius: '2px',
                    marginBottom: '1.3rem',
                  }}
                />
                <SpotifyMethodsList>
                  <SpotifyMethod>
                    <MethodName>
                      <InsightIcon /> Trusting relationships with caring adults
                    </MethodName>
                    <MethodDescription>
                      Our model pairs youth with a caring adult mentor. Mentees
                      self-report the number of supportive adults in their lives
                      who support their growth and expand their interests
                    </MethodDescription>
                  </SpotifyMethod>

                  <SpotifyMethod>
                    <MethodName>
                      <ArtisticIcon /> High-quality, no-cost arts education
                      during typically unsupervised hours
                    </MethodName>
                    <MethodDescription>
                      Providing enriching, safe activities from a
                      research-driven curriculum
                    </MethodDescription>
                  </SpotifyMethod>

                  <SpotifyMethod>
                    <MethodName>
                      <AcademicIcon /> Skill Development
                    </MethodName>
                    <MethodDescription>
                      Through performance opportunities and after school
                      programs
                    </MethodDescription>
                  </SpotifyMethod>

                  <SpotifyMethod>
                    <MethodName>
                      <TrackingIcon /> Trauma-informed mental health support
                    </MethodName>
                    <MethodDescription>
                      By investing in the mental health and creative capacities
                      of our young people, we create space for each student to
                      work hard and own their path in life.
                    </MethodDescription>
                  </SpotifyMethod>
                </SpotifyMethodsList>
              </SpotifyCard>
            </div>

            <div>
              <ToolsSection>
                <h3>Measurement & Evaluation Tools</h3>

                <ToolItem>
                  <ToolIcon>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 7.8C3 6.11984 3 5.27976 3.32698 4.63803C3.6146 4.07354 4.07354 3.6146 4.63803 3.32698C5.27976 3 6.11984 3 7.8 3H16.2C17.8802 3 18.7202 3 19.362 3.32698C19.9265 3.6146 20.3854 4.07354 20.673 4.63803C21 5.27976 21 6.11984 21 7.8V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V7.8Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.5 11L11.5 14L16 9"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </ToolIcon>
                  <ToolInfo>
                    <ToolName className="tool-name">
                      Hello Insight SEL & PYD Evaluation Platform
                    </ToolName>
                    <ToolDescription>
                      Primary assessment tool for all students
                    </ToolDescription>
                  </ToolInfo>
                </ToolItem>

                <ToolItem>
                  <ToolIcon>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 10H5V18H8M8 10V18M8 10V6C8 4.89543 8.89543 4 10 4H11.5C12.6046 4 13.5 4.89543 13.5 6V10M8 14H13.5M13.5 10H16.5M13.5 10V14M16.5 10H19.5V14M16.5 10V6C16.5 4.89543 17.3954 4 18.5 4H20C21.1046 4 22 4.89543 22 6V10M19.5 14H16.5M19.5 14V18H16.5V14"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </ToolIcon>
                  <ToolInfo>
                    <ToolName className="tool-name">
                      Satisfaction Surveys
                    </ToolName>
                    <ToolDescription>
                      Student, parent, and partner feedback
                    </ToolDescription>
                  </ToolInfo>
                </ToolItem>

                <ToolItem>
                  <ToolIcon>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 16.5L12 21.5L21 16.5M3 12L12 17L21 12M3 7.5L12 12.5L21 7.5L12 2.5L3 7.5Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </ToolIcon>
                  <ToolInfo>
                    <ToolName className="tool-name">
                      Artistic Progress Reports
                    </ToolName>
                    <ToolDescription>
                      Quarterly assessments using the artistic scale measurement
                    </ToolDescription>
                  </ToolInfo>
                </ToolItem>

                <ToolItem>
                  <ToolIcon>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.4 8.5H15.6M8.4 11.5H12M15 16H9C7.34315 16 6 14.6569 6 13V7C6 5.34315 7.34315 4 9 4H15C16.6569 4 18 5.34315 18 7V13C18 14.6569 16.6569 16 15 16ZM13.5 16V19.5C13.5 19.7761 13.2761 20 13 20H11C10.7239 20 10.5 19.7761 10.5 19.5V16H13.5Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </ToolIcon>
                  <ToolInfo>
                    <ToolName className="tool-name">
                      Academic Achievement Data
                    </ToolName>
                    <ToolDescription>
                      As observed from school records
                    </ToolDescription>
                  </ToolInfo>
                </ToolItem>
              </ToolsSection>

              <SpotifySubtitle
                style={{
                  fontSize: '0.95rem',
                  margin: '1.5rem 0',
                  textAlign: 'center',
                }}
              >
                GOGO largely supports kids affected by systemic challenges that reduce their access to opportunities
              </SpotifySubtitle>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  margin: '2rem 0 1rem',
                }}
              >
                <div
                  role="button"
                  tabIndex={0}
                  style={{
                    background: 'linear-gradient(90deg, #1ED760, #169C46)',
                    color: 'white',
                    padding: '0.7rem 1.5rem',
                    borderRadius: '50px',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 10px rgba(30, 215, 96, 0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onClick={() => navigate('/population')}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate('/population'); }}
                >
                  <span style={{ marginRight: '0.5rem' }}>
                    Learn More About Who We Serve
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </SpotifyGrid>
        </MeasurementWrapper>
      </MeasurementContainer>
    </>
  );
}

export default ImpactSection;
