import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
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

// New styled components for updated sections
const ImpactContainer = styled.section`
  padding: 6rem 0;
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
        circle at 30% 20%,
        ${COLORS.gogo_purple}05,
        transparent 40%
      ),
      radial-gradient(circle at 70% 60%, ${COLORS.gogo_blue}05, transparent 40%);
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
  top: -10%;
  left: -10%;
  width: 120%;
  height: 120%;
  background: linear-gradient(
    120deg,
    ${COLORS.gogo_blue}05,
    ${COLORS.gogo_purple}05,
    ${COLORS.gogo_pink}05,
    ${COLORS.gogo_green}05
  );
  background-size: 400% 400%;
  animation: ${ambientShift} 25s ease infinite;
  z-index: 0;
  filter: blur(60px);
  opacity: 0.8;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  position: relative;
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 900;
  color: white;
  margin-bottom: 1.5rem;
  background: linear-gradient(
    to right,
    ${COLORS.gogo_blue},
    ${COLORS.gogo_purple},
    ${COLORS.gogo_pink}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% auto;
  animation: ${ambientShift} 5s ease infinite;
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 5rem;
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
  border: 1px solid rgba(255, 255, 255, 0.05);
  overflow: hidden;

  &:hover {
    transform: translateY(-10px) scale(1.03);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.1);
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at center,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.5s ease;
    z-index: 0;
  }

  &:hover:before {
    opacity: 1;
  }

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transform: translateX(-100%);
    transition: transform 0.5s ease;
  }

  &:hover:after {
    transform: translateX(100%);
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

const YearHighlight = styled.div`
  background: linear-gradient(
    120deg,
    ${COLORS.gogo_purple}22,
    ${COLORS.gogo_blue}22,
    ${COLORS.gogo_teal}22,
    ${COLORS.gogo_purple}22
  );
  background-size: 200% 100%;
  animation: ${shimmerEffect} 8s ease infinite;
  border-radius: 16px;
  padding: 3rem 2rem;
  margin: 4rem 0;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
    z-index: 0;
  }
`;

const YearTitle = styled.h3`
  font-size: 2.2rem;
  font-weight: 900;
  color: white;
  margin-bottom: 2.5rem;
  text-align: center;
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
`;

const YearStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2.5rem;
  position: relative;
  z-index: 1;
`;

const YearStatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    background: rgba(0, 0, 0, 0.3);
  }
`;

const YearStatValue = styled.span`
  font-size: 3.5rem;
  font-weight: 900;
  color: ${COLORS.gogo_yellow};
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  position: relative;

  .number {
    display: inline-block;
    opacity: 0;
    transform: translateY(10px);
    animation: ${countUp} 0.3s forwards;
  }
`;

const YearStatLabel = styled.span`
  font-size: 1.1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.4;
`;

function ImpactSection(): JSX.Element {
  const [inView, setInView] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [counting, setCounting] = useState(false);

  // Create refs for each impact stat
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRefs = useRef<(SVGCircleElement | null)[]>([]);
  const percentageRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const yearStatsRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  const yearStats = useMemo(
    () => [
      {
        value: 3500,
        label: 'Students supported through our programs',
      },
      {
        value: 95,
        label: 'Percentage of students who remained in school',
      },
      {
        value: 120,
        label: 'Mentor-led music and art sessions',
      },
      {
        value: 42,
        label: 'Community performances organized',
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

          // Animate year stats after a delay
          setTimeout(() => {
            if (yearStatsRefs.current.length > 0) {
              animate(yearStatsRefs.current.filter(Boolean), {
                opacity: [0, 1],
                translateY: [30, 0],
                delay: stagger(150),
                duration: 800,
                easing: 'easeOutCubic',
              });
            }
          }, 1200);
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
          key={`digit-${value}-${i}-${digit}`}
          className="number"
          style={{ animationDelay: `${i * 0.1 + 0.3}s` }}
        >
          {digit}
        </span>
      ));
  };

  return (
    <ImpactContainer ref={sectionRef}>
      <SectionContainer>
        <SectionHeader ref={headerRef} style={{ opacity: 0 }}>
          <SectionTitle>Our Impact</SectionTitle>
          <Subtitle>During the 2023-24 program year...</Subtitle>
        </SectionHeader>

        <StatsGrid>
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
                    strokeDashoffset={339.292} // Start at 0% progress
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

        <YearHighlight>
          <YearTitle>2024-2025 At a Glance</YearTitle>
          <YearStatsGrid>
            {yearStats.map((stat, index) => (
              <YearStatItem
                key={`year-stat-${stat.value}`}
                ref={(el) => {
                  yearStatsRefs.current[index] = el;
                }}
              >
                <YearStatValue>{renderCounter(stat.value)}</YearStatValue>
                <YearStatLabel>{stat.label}</YearStatLabel>
              </YearStatItem>
            ))}
          </YearStatsGrid>
        </YearHighlight>

        <SubsectionTitle>How do we measure impact?</SubsectionTitle>
        <StatDescription style={{ maxWidth: '800px', margin: '0 auto 2rem' }}>
          Guitars Over Guns mentees complete biannual surveys using Hello
          Insight, a nationally recognized platform that helps youth development
          programs evaluate and respond to the needs of their young people. In
          these surveys, mentees self-report their growth across six Positive
          Youth Development (PYD) pillars, including the ability to engage
          authentically and manage their goals. We also ask them to list the
          number of supportive adults in their lives who believe in them,
          broaden their interests, and challenge them to grow artistically,
          emotionally, and academically.
        </StatDescription>
        <StatDescription style={{ maxWidth: '800px', margin: '0 auto 2rem' }}>
          Guitars Over Guns mentors use healing-centered, culturally affirming
          PYD practices in program sessions. By investing in the mental health
          and creative capacities of our young people, we create space for each
          student to work hard and own their path in life.
        </StatDescription>

        <SubsectionTitle>Measurement &amp; Evaluation Tools</SubsectionTitle>
        <MeasurementList
          style={{ maxWidth: '800px', margin: '0 auto 2rem' }}
          className="measurement-item"
        >
          <MeasurementItem>
            Hello Insight SEL &amp; Positive Youth Development Evaluation
            Platform
          </MeasurementItem>
          <MeasurementItem>
            Student, Parent, and Partner Satisfaction Surveys
          </MeasurementItem>
          <MeasurementItem>Quarterly Artistic Progress Reports</MeasurementItem>
          <MeasurementItem>Academic Achievement Data</MeasurementItem>
        </MeasurementList>

        <SubsectionTitle>Measurement Methods</SubsectionTitle>
        <MeasurementList
          style={{ maxWidth: '800px', margin: '0 auto' }}
          className="measurement-item"
        >
          <MeasurementItem>Hello Insight</MeasurementItem>
          <MeasurementItem>Artistic scale measurement</MeasurementItem>
          <MeasurementItem>Academic achievement data</MeasurementItem>
        </MeasurementList>
      </SectionContainer>
    </ImpactContainer>
  );
}

export default ImpactSection;
