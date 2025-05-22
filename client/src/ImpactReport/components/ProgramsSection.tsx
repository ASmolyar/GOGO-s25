import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { animate, stagger } from 'animejs';
import COLORS from '../../assets/colors';
import photo1 from '../../assets/programPhotos/photo1.png';
import photo2 from '../../assets/programPhotos/photo2.png';
import photo3 from '../../assets/programPhotos/photo3.png';

// Animation keyframes
const shimmer = keyframes`
  0% {
    background-position: -100% 0;
  }
  50% {
    background-position: 50% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(29, 185, 84, 0.4);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(29, 185, 84, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(29, 185, 84, 0);
  }
`;

const ripple = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2.4);
    opacity: 0;
  }
`;

const rotateSlowly = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// Styled components for Spotify-like design
const ProgramsContainer = styled.section`
  padding: 7rem 0;
  background: linear-gradient(to bottom, #191919, #0d0d0d);
  position: relative;
  overflow: hidden;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(rgba(0, 0, 0, 0.2) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.2) 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.05;
  pointer-events: none;
`;

const GlowEffect = styled.div`
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: ${(props) => props.color || COLORS.gogo_blue}11;
  filter: blur(100px);
  opacity: 0.6;
  z-index: 1;
  animation: ${float} 15s ease infinite;
`;

const SoundWave = styled.div`
  position: absolute;
  top: 20%;
  left: 0;
  right: 0;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  opacity: 0.2;
  transform: rotate(-2deg);
  z-index: 0;
`;

const SoundBar = styled.div<{ height: number; delay: number }>`
  height: ${(props) => props.height}px;
  width: 3px;
  background-color: ${COLORS.gogo_green};
  border-radius: 3px;
  animation: ${float} 1.5s ease-in-out infinite;
  animation-delay: ${(props) => props.delay}s;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 5;
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 4rem;
  text-align: center;
  position: relative;
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
  background: linear-gradient(
    to right,
    ${COLORS.gogo_blue} 0%,
    ${COLORS.gogo_purple} 33%,
    ${COLORS.gogo_pink} 67%,
    ${COLORS.gogo_blue} 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${shimmer} 8s ease-in-out infinite;
`;

const UnderlineEffect = styled.div`
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(
    90deg,
    ${COLORS.gogo_blue} 0%,
    ${COLORS.gogo_purple} 33%,
    ${COLORS.gogo_teal} 67%,
    ${COLORS.gogo_blue} 100%
  );
  background-size: 300% 100%;
  animation: ${shimmer} 6s ease-in-out infinite;
`;

const SectionSubtitle = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 700px;
  margin: 1.5rem auto 0;
  line-height: 1.7;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.8rem;
  margin: 3rem 0;
  flex-wrap: wrap;
  position: relative;
  z-index: 3;
  padding: 0.5rem;

  &:before {
    content: '';
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 1px;
    height: 20px;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const FilterItem = styled.div<{ active: boolean }>`
  padding: 0.8rem 1.8rem;
  border-radius: 500px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  background: ${(props) =>
    props.active ? COLORS.gogo_green : 'rgba(255, 255, 255, 0.05)'};
  color: ${(props) => (props.active ? '#000' : 'rgba(255, 255, 255, 0.8)')};
  border: 1px solid
    ${(props) =>
      props.active ? COLORS.gogo_green : 'rgba(255, 255, 255, 0.05)'};
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: ${(props) =>
    props.active ? '0 5px 15px rgba(30, 215, 96, 0.3)' : 'none'};
  position: relative;
  overflow: hidden;

  &:hover {
    background: ${(props) =>
      props.active ? COLORS.gogo_green : 'rgba(255, 255, 255, 0.1)'};
    color: ${(props) => (props.active ? '#000' : 'white')};
    transform: translateY(-3px);
    border-color: ${(props) =>
      props.active ? COLORS.gogo_green : 'rgba(255, 255, 255, 0.1)'};
  }

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.3) 0%,
      rgba(255, 255, 255, 0) 60%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:active:after {
    opacity: 1;
  }
`;

const ProgramGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2.5rem;
  margin-bottom: 2rem;
`;

const ProgramCard = styled.div<{
  hovered: boolean;
  color: string;
  delay: number;
}>`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2.5rem;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  opacity: 0;
  transform: translateY(30px);
  animation: fadeIn 0.8s forwards;
  animation-delay: ${(props) => props.delay * 0.1}s;
  animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);

  @keyframes fadeIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  ${({ hovered, color }) =>
    hovered &&
    `
    transform: translateY(-10px) scale(1.02);
    background: rgba(255, 255, 255, 0.08);
    border-color: ${color}66;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25), 0 0 30px ${color}22;
  `}

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: ${(props) => props.color};
    opacity: ${(props) => (props.hovered ? 1 : 0.5)};
    transition: opacity 0.3s ease;
  }
`;

const ProgramBackground = styled.div<{ color: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at bottom right,
    ${(props) => props.color}33,
    transparent 70%
  );
  opacity: 0;
  transition: all 0.5s ease;
  z-index: 0;
  transform: scale(0.8);

  ${ProgramCard}:hover & {
    opacity: 1;
    transform: scale(1);
  }
`;

const CircleDecoration = styled.div<{ color: string }>`
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 1px solid ${(props) => props.color}33;
  top: -100px;
  right: -100px;
  transition: all 0.5s ease;
  z-index: 0;
  opacity: 0;

  ${ProgramCard}:hover & {
    opacity: 1;
    transform: scale(1.1) rotate(10deg);
  }
`;

const ProgramContent = styled.div`
  position: relative;
  z-index: 1;
`;

const ProgramIcon = styled.div<{ color: string }>`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 20px ${(props) => props.color}66;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.3) 0%,
      transparent 50%
    );
  }

  &:after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    right: -50%;
    bottom: -50%;
    background: radial-gradient(
      circle,
      ${(props) => props.color}00 30%,
      ${(props) => props.color}55 100%
    );
    animation: ${rotateSlowly} 10s linear infinite;
  }

  ${ProgramCard}:hover & {
    animation: ${pulse} 2s infinite;
  }
`;

const ProgramTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1.2rem;
  transition: transform 0.3s ease;

  ${ProgramCard}:hover & {
    transform: translateY(-3px);
  }
`;

const ProgramDescription = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1.8rem;
  transition: opacity 0.3s ease;
`;

const ProgramFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
`;

const ProgramFeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.8rem;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  transition: transform 0.3s ease, color 0.3s ease;

  &:before {
    content: '•';
    color: ${COLORS.gogo_green};
    margin-right: 0.8rem;
    font-size: 1.3rem;
    line-height: 1;
  }

  ${ProgramCard}:hover & {
    transform: translateX(3px);
    color: rgba(255, 255, 255, 0.9);
  }

  &:hover {
    color: white;
  }
`;

const PlayButton = styled.div<{ visible: boolean }>`
  position: absolute;
  bottom: 2.5rem;
  right: 2.5rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${COLORS.gogo_green};
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transform: ${(props) =>
    props.visible ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.9)'};
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  box-shadow: 0 8px 15px rgba(30, 215, 96, 0.3);
  z-index: 2;

  &:hover {
    transform: scale(1.1);
    background: ${COLORS.gogo_green};
  }

  &:active {
    transform: scale(0.95);
  }

  &:before,
  &:after {
    content: '';
    position: absolute;
    background: ${COLORS.gogo_green}33;
    border-radius: 50%;
    animation: ${ripple} 2s infinite;
  }

  &:before {
    width: 100%;
    height: 100%;
    animation-delay: 0s;
  }

  &:after {
    width: 100%;
    height: 100%;
    animation-delay: 0.5s;
  }
`;

const PlayIcon = styled.div`
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 7px 0 7px 12px;
  border-color: transparent transparent transparent black;
  margin-left: 3px;
  z-index: 1;
`;

const NumberIndicator = styled.div`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  font-size: 4.5rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.04);
  line-height: 1;
  user-select: none;
  pointer-events: none;
  transition: color 0.3s ease, transform 0.5s ease;

  ${ProgramCard}:hover & {
    color: rgba(255, 255, 255, 0.08);
    transform: rotate(5deg) scale(1.1);
  }
`;

const FooterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3rem;
  gap: 2rem;
  position: relative;
  padding-top: 3rem;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const FooterText = styled.div`
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  text-align: center;
  max-width: 700px;
`;

const SpotifyButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2rem;
  border-radius: 500px;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  color: #000;
  background: ${COLORS.gogo_green};
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(30, 215, 96, 0.3);
  border: none;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 15px 25px rgba(30, 215, 96, 0.4);
  }

  &:active {
    transform: scale(0.98);
  }

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: translateX(-100%);
    transition: transform 0.5s ease;
  }

  &:hover:after {
    transform: translateX(100%);
  }
`;

const ProgramImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-top: 1.5rem;
`;

// Define the program data
const programData = [
  {
    id: 'm-power',
    title: 'M-Power Program',
    description:
      'Our M-Power Mental Health and Wellness program has experienced remarkable expansion across all regions, emphasizing the need for comprehensive support services for both youth and mentors.',
    icon: '🌱',
    category: 'wellness',
    color: COLORS.gogo_pink,
    features: [
      'Enhanced curriculum with reflective, community-building circle sessions',
      'Mentors lead interactive exercises that promote connection and growth',
      'All staff trained in Youth Mental Health First Aid',
      'Mental wellness fully integrated into every aspect of our programming',
    ],
  },
  {
    id: 'tasc',
    title: 'Pilot Program with the TASC Reporting Center',
    description:
      'GOGO partnered with TASC to give justice-involved youth a voice through music, supporting support 39 Cook County youth on probation',
    icon: '🎙️',
    category: 'music',
    color: COLORS.gogo_yellow,
    features: [
      'Youth learned songwriting, rap, and music production from caring mentors',
      'Safe, creative spaces helped build self-esteem and emotional resilience',
      'Program addressed critical risks like incarceration, school dropout, and poor mental health',
      'Mentees gained clarity, confidence, and a renewed sense of direction through music',
    ],
  },
  {
    id: 'oyc',
    title: 'Overtown Youth Center (OYC)',
    description:
      'In partnership with the Playing for Change and We The Best Foundations, Guitars Over Guns collaborated with the community hub of Overtown, OYC.',
    icon: '🎨',
    category: 'music',
    color: COLORS.gogo_teal,
    features: [
      'Dedicated mentors led trauma-informed programming after school and during summer',
      'Students wrote, produced, and recorded original RnB tracks like "All I Do" and "Future Role Model"',
      'Friendly competition fostered creativity, confidence, and collaboration',
      'The summer showcase spotlighted student talent and built a strong sense of community',
    ],
  },
];

const programImages = {
  'm-power': photo1,
  tasc: photo2,
  oyc: photo3,
};

function ProgramsSection(): JSX.Element {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [filteredPrograms, setFilteredPrograms] = useState(programData);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Function to generate random heights for sound bars
  const generateSoundBars = useCallback(() => {
    const count = 40;
    return Array.from({ length: count }).map((_, i) => ({
      height: Math.floor(Math.random() * 20) + 5, // Random height between 5 and 25
      delay: (i / count) * 2, // Staggered delay
    }));
  }, []);

  const [soundBars] = useState(() => generateSoundBars());

  // Filter programs when filter changes
  useEffect(() => {
    if (filter === 'all') {
      setFilteredPrograms(programData);
    } else {
      setFilteredPrograms(
        programData.filter(
          (program) => program.category.toLowerCase() === filter.toLowerCase(),
        ),
      );
    }
  }, [filter]);

  // Setup intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);

          // Animate the header
          const header = headerRef.current;
          if (header) {
            animate(header.querySelectorAll('.animate-item'), {
              opacity: [0, 1],
              translateY: [30, 0],
              delay: stagger(150),
              duration: 800,
              easing: 'easeOutCubic',
            });
          }

          observer.unobserve(entries[0].target);
        }
      },
      { threshold: 0.2 },
    );

    const currentSection = sectionRef.current;

    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  return (
    <ProgramsContainer ref={sectionRef}>
      <BackgroundPattern />

      {/* Background glows */}
      <GlowEffect
        color={COLORS.gogo_blue}
        style={{ top: '10%', left: '5%', animationDelay: '0s' }}
      />
      <GlowEffect
        color={COLORS.gogo_purple}
        style={{ top: '60%', right: '5%', animationDelay: '2s' }}
      />

      {/* Sound wave visualization */}
      <SoundWave>
        {soundBars.map((bar, index) => (
          <SoundBar
            key={`sound-bar-${index}-${bar.height}`}
            height={bar.height}
            delay={bar.delay}
          />
        ))}
      </SoundWave>

      <ContentContainer>
        <SectionHeader ref={headerRef}>
          <SectionTitle className="animate-item" style={{ opacity: 0 }}>
            Our Programs
            <UnderlineEffect />
          </SectionTitle>
          <SectionSubtitle className="animate-item" style={{ opacity: 0 }}>
            GOGO offers diverse programs led by professional artist mentors who
            are passionate about nurturing creativity, building confidence, and
            developing skills in young artists.
          </SectionSubtitle>
        </SectionHeader>

        <FilterContainer>
          <FilterItem
            active={filter === 'all'}
            onClick={() => setFilter('all')}
          >
            All Programs
          </FilterItem>
          <FilterItem
            active={filter === 'music'}
            onClick={() => setFilter('music')}
          >
            Music
          </FilterItem>
          <FilterItem
            active={filter === 'wellness'}
            onClick={() => setFilter('wellness')}
          >
            Wellness
          </FilterItem>
        </FilterContainer>

        <ProgramGrid>
          {filteredPrograms.map((program, index) => (
            <ProgramCard
              key={program.id}
              hovered={hoveredCard === program.id}
              color={program.color}
              delay={index}
              onMouseEnter={() => setHoveredCard(program.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <ProgramBackground color={program.color} />
              <CircleDecoration color={program.color} />
              <ProgramContent>
                <ProgramIcon color={program.color}>{program.icon}</ProgramIcon>
                <ProgramTitle>{program.title}</ProgramTitle>
                <ProgramDescription>{program.description}</ProgramDescription>
                <ProgramFeatures>
                  {program.features.map((feature, i) => (
                    <ProgramFeatureItem
                      key={`feature-${program.id}-${feature.replace(
                        /\s+/g,
                        '-',
                      )}`}
                    >
                      {feature}
                    </ProgramFeatureItem>
                  ))}
                </ProgramFeatures>
                <ProgramImage
                  src={programImages[program.id as keyof typeof programImages]}
                  alt={`${program.title} image`}
                />
              </ProgramContent>
              <NumberIndicator>{index + 1}</NumberIndicator>
              <PlayButton visible={hoveredCard === program.id}>
                <PlayIcon />
              </PlayButton>
            </ProgramCard>
          ))}
        </ProgramGrid>

        {/* was a footer here i deleted */}
      </ContentContainer>
    </ProgramsContainer>
  );
}

export default ProgramsSection;
