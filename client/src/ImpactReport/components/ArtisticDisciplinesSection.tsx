import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { animate, stagger } from 'animejs';
import COLORS from '../../assets/colors';

const SectionContainer = styled.section`
  padding: 6rem 0;
  background: linear-gradient(180deg, #121212 0%, #0a0a0a 100%);
  position: relative;
  overflow: hidden;
`;

// Background pulse animation
const pulse = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(29, 185, 84, 0.3);
  }
  
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 20px rgba(29, 185, 84, 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(29, 185, 84, 0);
  }
`;

// Music wave animation
const wave = keyframes`
  0% {
    height: 5px;
  }
  50% {
    height: 20px;
  }
  100% {
    height: 5px;
  }
`;

const BackgroundWave = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 120px;
  background: linear-gradient(
    90deg,
    ${COLORS.gogo_blue}11,
    ${COLORS.gogo_pink}11,
    ${COLORS.gogo_purple}11,
    ${COLORS.gogo_green}11
  );
  opacity: 0.3;
  z-index: 0;
  border-top-left-radius: 50% 80%;
  border-top-right-radius: 50% 80%;
  transform-origin: bottom;
  animation: ${pulse} 15s infinite linear;
`;

const MusicWaveContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: center;
  z-index: 1;
  padding: 0 10%;
  gap: 3px;
`;

const MusicBar = styled.div<{ delay: number }>`
  width: 3px;
  height: 5px;
  background: ${COLORS.gogo_green};
  border-radius: 3px;
  animation: ${wave} 1.5s ease-in-out infinite;
  animation-delay: ${(props) => props.delay}s;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: white;
  margin-bottom: 1rem;
  background: linear-gradient(
    to right,
    ${COLORS.gogo_blue},
    ${COLORS.gogo_teal}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
`;

const SectionSubtitle = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  max-width: 700px;
  margin: 0 auto;
`;

const DisciplinesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const DisciplineCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.05);

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 0;
    background: linear-gradient(to bottom, ${COLORS.gogo_teal}22, transparent);
    transition: height 0.4s ease;
    z-index: 0;
  }

  &:hover {
    transform: translateY(-8px) scale(1.03);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.1);

    &:before {
      height: 100%;
    }
  }

  &:active {
    transform: translateY(-3px) scale(0.98);
  }

  & > * {
    position: relative;
    z-index: 1;
  }
`;

const IconPulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
`;

const DisciplineIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: ${COLORS.gogo_teal};
  transition: all 0.3s ease;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: ${COLORS.gogo_teal}22;
    transform: translate(-50%, -50%);
    z-index: -1;
    animation: ${IconPulse} 3s infinite ease-in-out;
  }
`;

const DisciplineName = styled.h3`
  font-size: 1.2rem;
  color: white;
  margin-bottom: 0.8rem;
  font-weight: 700;
  transition: color 0.3s ease;
`;

const DisciplineDescription = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
  transition: opacity 0.3s ease;
`;

const DisciplineStats = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;

  ${DisciplineCard}:hover & {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  margin: 0 0.5rem;
  font-size: 0.8rem;
  color: ${COLORS.gogo_green};
`;

// Map of disciplines to emoji icons
const disciplineIcons: Record<string, string> = {
  'Music Production': '🎛️',
  Guitar: '🎸',
  Drums: '🥁',
  Piano: '🎹',
  Vocals: '🎤',
  Bass: '🎸',
  DJing: '💿',
  Songwriting: '✍️',
  Dance: '💃',
  'Visual Art': '🎨',
  'Digital Art': '💻',
  'Spoken Word': '📝',
  Theater: '🎭',
  'Sound Engineering': '🎚️',
  'Brass Instruments': '🎺',
  'Woodwind Instruments': '🎷',
  Strings: '🎻',
};

const disciplinesData = [
  {
    name: 'Music Production',
    description:
      'Learn to create, record, and mix music using professional software and hardware.',
    students: 78,
    projects: 120,
  },
  {
    name: 'Guitar',
    description:
      'Master acoustic and electric guitar techniques across various musical styles.',
    students: 95,
    projects: 150,
  },
  {
    name: 'Drums',
    description:
      'Develop rhythm skills and percussion techniques on drum kits and other percussion instruments.',
    students: 65,
    projects: 85,
  },
  {
    name: 'Piano',
    description:
      'Build keyboard skills from basic to advanced, including theory and composition.',
    students: 70,
    projects: 110,
  },
  {
    name: 'Vocals',
    description:
      'Develop singing techniques, vocal control, and performance skills.',
    students: 85,
    projects: 130,
  },
  {
    name: 'Bass',
    description:
      'Learn to hold down the groove with electric and acoustic bass guitar techniques.',
    students: 55,
    projects: 75,
  },
  {
    name: 'DJing',
    description:
      'Master turntable techniques, beatmatching, and live performance skills.',
    students: 60,
    projects: 95,
  },
  {
    name: 'Songwriting',
    description:
      'Craft compelling lyrics and melodies while learning song structure and composition.',
    students: 72,
    projects: 140,
  },
  {
    name: 'Dance',
    description:
      'Express yourself through movement with various dance styles and choreography.',
    students: 68,
    projects: 90,
  },
  {
    name: 'Visual Art',
    description:
      'Create using traditional media including drawing, painting, and sculpture.',
    students: 63,
    projects: 105,
  },
  {
    name: 'Digital Art',
    description:
      'Explore digital creativity through graphic design, animation, and digital illustration.',
    students: 58,
    projects: 80,
  },
  {
    name: 'Spoken Word',
    description:
      'Develop poetic expression and performance techniques for spoken word art.',
    students: 50,
    projects: 85,
  },
  {
    name: 'Theater',
    description:
      'Build acting skills, stage presence, and theatrical performance techniques.',
    students: 45,
    projects: 60,
  },
  {
    name: 'Sound Engineering',
    description:
      'Learn professional audio recording, mixing, and live sound reinforcement.',
    students: 40,
    projects: 65,
  },
  {
    name: 'Brass Instruments',
    description:
      'Master trumpet, trombone, and other brass instruments with professional techniques.',
    students: 35,
    projects: 50,
  },
  {
    name: 'Woodwind Instruments',
    description:
      'Develop skills on saxophone, flute, clarinet, and other woodwind instruments.',
    students: 30,
    projects: 45,
  },
  {
    name: 'Strings',
    description:
      'Learn to play violin, viola, cello, and other string instruments.',
    students: 25,
    projects: 40,
  },
];

function ArtisticDisciplinesSection(): JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    // Animation for the title with enhanced easing
    const titleEl = titleRef.current;
    if (titleEl) {
      animate(titleEl, {
        translateY: [40, 0],
        opacity: [0, 1],
        duration: 1200,
        easing: 'easeOutElastic(1, .5)',
      });
    }

    // Animation for subtitle
    const subtitleEl = subtitleRef.current;
    if (subtitleEl) {
      animate(subtitleEl, {
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 1000,
        delay: 300,
        easing: 'easeOutCubic',
      });
    }

    // Animation for the cards - more interesting staggered animation
    const cardElements = cardRefs.current.filter(Boolean);
    if (cardElements && cardElements.length > 0) {
      setTimeout(() => {
        // Delay card animations for better visual effect
        animate(cardElements, {
          translateY: [60, 0],
          scale: [0.9, 1],
          opacity: [0, 1],
          delay: stagger(80, { start: 500 }),
          duration: 1200,
          easing: 'easeOutElastic(1, .5)',
        });
      }, 300);
    }
  }, []);

  // This function will be used to set refs
  const setCardRef = (el: HTMLDivElement | null, index: number) => {
    if (el) {
      // Ensure the array has enough space
      while (cardRefs.current.length <= index) {
        cardRefs.current.push(null as unknown as HTMLDivElement);
      }
      cardRefs.current[index] = el;
    }
  };

  // Handle card hover for more interactive effects
  const handleCardHover = (index: number) => {
    setActiveIndex(index);
  };

  // Generate music wave bars
  const renderMusicWave = () => {
    const bars = 40; // Number of bars
    return Array.from({ length: bars }).map((_, i) => {
      const delay = (i / bars) * 1.5;
      return (
        <MusicBar
          key={`artistic-music-wave-bar-${i}-${delay.toFixed(2)}`}
          delay={(i / bars) * 1.5}
        />
      );
    });
  };

  return (
    <SectionContainer ref={sectionRef}>
      <BackgroundWave />
      <MusicWaveContainer>{renderMusicWave()}</MusicWaveContainer>

      <ContentWrapper>
        <SectionHeader>
          <SectionTitle
            className="section-title"
            style={{ opacity: 0 }}
            ref={titleRef}
          >
            Artistic Disciplines Taught
          </SectionTitle>
          <SectionSubtitle ref={subtitleRef} style={{ opacity: 0 }}>
            Our mentorship programs cover a wide range of artistic disciplines,
            empowering students to explore their creative passions.
          </SectionSubtitle>
        </SectionHeader>

        <DisciplinesGrid>
          {disciplinesData.map((discipline, index) => (
            <DisciplineCard
              key={`discipline-${discipline.name.replace(/\s+/g, '-')}`}
              ref={(el) => setCardRef(el, index)}
              style={{ opacity: 0 }}
              onMouseEnter={() => handleCardHover(index)}
              onMouseLeave={() => setActiveIndex(null)}
              className={activeIndex === index ? 'active' : ''}
            >
              <DisciplineIcon>
                {disciplineIcons[discipline.name] || '🎵'}
              </DisciplineIcon>
              <DisciplineName>{discipline.name}</DisciplineName>
              <DisciplineDescription>
                {discipline.description}
              </DisciplineDescription>
              <DisciplineStats>
                <StatItem>🧑‍🎓 {discipline.students} students</StatItem>
                <StatItem>🎵 {discipline.projects} projects</StatItem>
              </DisciplineStats>
            </DisciplineCard>
          ))}
        </DisciplinesGrid>
      </ContentWrapper>
    </SectionContainer>
  );
}

export default ArtisticDisciplinesSection;
