import React, { useEffect, useRef, useMemo } from 'react';
import styled from 'styled-components';
import { animate, stagger } from 'animejs';
import COLORS from '../../assets/colors';

// Styled components for the Spotify-inspired GOGO achievements section
const AchievementsContainer = styled.section`
  padding: 5rem 0;
  background: linear-gradient(to bottom, #0e0e0e, #191919);
  position: relative;
  overflow: hidden;
`;

const SpotifyPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.03;
  background-image: radial-gradient(
    rgba(255, 255, 255, 0.1) 1px,
    transparent 1px
  );
  background-size: 20px 20px;
  pointer-events: none;
  z-index: 1;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3.5rem;
  position: relative;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 900;
  color: white;
  margin-bottom: 1.5rem;
  background: linear-gradient(
    to right,
    ${COLORS.gogo_teal},
    ${COLORS.gogo_blue}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  letter-spacing: 0.02em;
`;

const SectionSubtitle = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const AchievementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const AchievementCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.4s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-8px);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.1);
  }

  &:hover .achievement-bg {
    opacity: 0.2;
    transform: scale(1.05);
  }
`;

const AchievementBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(25, 70, 245, 0.15),
    rgba(190, 43, 147, 0.15)
  );
  opacity: 0;
  transition: all 0.6s ease;
  z-index: 0;
  border-radius: 12px;
`;

const AchievementContent = styled.div`
  position: relative;
  z-index: 1;
`;

const AchievementYear = styled.div`
  display: inline-block;
  font-size: 0.9rem;
  color: ${COLORS.gogo_teal};
  margin-bottom: 1rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  background: rgba(177, 235, 242, 0.1);
`;

const AchievementTitle = styled.h3`
  font-size: 1.5rem;
  color: white;
  margin-bottom: 1rem;
  font-weight: 700;
  letter-spacing: 0.02em;
`;

const AchievementDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1.5rem;
`;

const AchievementStats = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const AchievementStat = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${COLORS.gogo_yellow};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const MediaLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  padding: 0.75rem 1.25rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  margin-top: 0.5rem;

  &:hover {
    background: rgba(25, 70, 245, 0.4);
    transform: translateY(-2px);
  }
`;

const BottomCta = styled.div`
  text-align: center;
  margin-top: 4rem;
`;

const SpotifyButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: ${COLORS.gogo_blue};
  color: white;
  font-weight: 700;
  font-size: 1rem;
  padding: 0.9rem 2rem;
  border-radius: 500px;
  text-decoration: none;
  letter-spacing: 0.02em;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(25, 70, 245, 0.3);

  &:hover {
    transform: scale(1.05);
    background: #2953fa;
    box-shadow: 0 12px 25px rgba(25, 70, 245, 0.4);
  }
`;

// Data for achievements
const achievementsData = [
  {
    id: 1,
    year: '2023',
    title: 'Community Partnerships',
    description:
      'Strengthened key community partnerships like Lollapalooza, TEDxChicago, the Obama Foundation’s MBK Alliance, and Illinois State Senators Johnson, Sims, Hunter, and Peters to elevate opportunities for our youth in Chicago.',
    stats: [
      { value: '120+', label: 'New Students' },
      { value: '8', label: 'New Mentors' },
    ],
    mediaLink: 'Link?',
    backgroundColor: 'rgba(104, 54, 154, 0.1)', // Purple
  },
  {
    id: 2,
    year: '2022',
    title: 'Partnership Expansion',
    description:
      'Expanded our relationship with the Miami-Dade County Department of Parks, Recreation & Open Spaces, including the launch of the Papa Keith Music & Media Studio at Gwen Cherry Park.',
    stats: [
      { value: '4', label: 'Public Parks Served' },
      { value: '1', label: 'New Studio Launched' },
    ],
    mediaLink: 'Read the Story',
    backgroundColor: 'rgba(190, 43, 147, 0.1)', // Pink
  },
  {
    id: 3,
    year: '2021',
    title: 'New York Location Launch',
    description:
      'Launched GOGO New York with a pilot program in two Harlem schools, establishing lasting partnerships in the community.',
    stats: [{ value: '23+', label: 'students served' }],
    mediaLink: 'Link?',
    backgroundColor: 'rgba(25, 70, 245, 0.1)', // Blue
  },
  {
    id: 4,
    year: '2020',
    title: 'M-Power Program',
    description:
      'Grew our M-Power mental wellness department nationally with the addition of Wellness Mentors in Miami and Chicago, new partnerships with local universities’ social work intern programs, and the implementation of Youth Mental Health First Aid certification for our mentors and staff.',
    stats: [
      { value: '18', label: 'Wellness Mentors' },
      { value: '1', label: 'New University Partnerships' },
    ],
    mediaLink: 'Link?',
    backgroundColor: 'rgba(141, 221, 166, 0.1)', // Green
  },
  {
    id: 5,
    year: '2019',
    title: 'Alumni & New Developments',
    description:
      'Debuted a powerful new version of our signature music/arts and mental wellness curriculum, equipping mentors with the training and resources to carry out the GOGO methodology, stronger than ever.',
    stats: [
      { value: '42%', label: 'of our full-time staff are former mentors' },
      { value: '6%', label: 'are program alumni' },
    ],
    mediaLink: 'Link?',
    backgroundColor: 'rgba(233, 187, 77, 0.1)', // Yellow
  },
  {
    id: 6,
    year: '2026?',
    title: "What's Next?",
    description:
      'Our goal is to serve 10,000 students annually across the U.S. as a national leader in arts-based youth development.',
    stats: [
      { value: '10K', label: 'students annually' },
      { value: '100', label: 'locations' },
    ],
    mediaLink:
      'Email info@guitarsoverguns.org for Audited Financial Statements and Form 990',
    backgroundColor: 'rgba(177, 235, 242, 0.1)', // Teal
  },
];

function AchievementsSection(): JSX.Element {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Use useMemo to prevent recreating these objects on every render
  const titleAnimationParams = useMemo(
    () => ({
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 800,
      easing: 'easeOutExpo',
    }),
    [],
  );

  const cardsAnimationParams = useMemo(
    () => ({
      opacity: [0, 1],
      translateY: [50, 0],
      scale: [0.92, 1],
      delay: stagger(100),
      duration: 800,
      easing: 'easeOutExpo',
    }),
    [],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Animate title when section enters viewport
          if (titleRef.current) {
            animate(titleRef.current, titleAnimationParams);
          }

          // Staggered animation for cards
          const validCardRefs = cardRefs.current.filter(Boolean);
          if (validCardRefs.length > 0) {
            animate(
              validCardRefs.filter(Boolean) as HTMLDivElement[],
              cardsAnimationParams,
            );
          }
        }
      },
      { threshold: 0.1 },
    );

    // Store reference to the current section ref
    const currentSectionRef = sectionRef.current;

    if (currentSectionRef) {
      observer.observe(currentSectionRef);
    }

    return () => {
      observer.disconnect();
    };
  }, [cardsAnimationParams, titleAnimationParams]);

  return (
    <AchievementsContainer ref={sectionRef}>
      <SpotifyPattern />
      <ContentContainer>
        <SectionHeader>
          <SectionTitle ref={titleRef}>
            Our Achievements and Strategic Highlights
          </SectionTitle>
          <SectionSubtitle>
            Milestones that showcase our commitment to empowering youth through
            music and mentorship
          </SectionSubtitle>
        </SectionHeader>

        <AchievementsGrid>
          {achievementsData.map((achievement, index) => (
            <AchievementCard
              key={`achievement-${achievement.id}-${achievement.year}`}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              style={{ opacity: 0 }}
            >
              <AchievementBackground
                className="achievement-bg"
                style={{ background: achievement.backgroundColor }}
              />
              <AchievementContent>
                <AchievementYear>{achievement.year}</AchievementYear>
                <AchievementTitle>{achievement.title}</AchievementTitle>
                <AchievementDescription>
                  {achievement.description}
                </AchievementDescription>

                <AchievementStats>
                  {achievement.stats.map((stat, i) => (
                    <AchievementStat
                      key={`stat-${achievement.id}-${stat.label}`}
                    >
                      <StatValue>{stat.value}</StatValue>
                      <StatLabel>{stat.label}</StatLabel>
                    </AchievementStat>
                  ))}
                </AchievementStats>

                <MediaLink href="#">
                  <span className="play-icon">▶</span>
                  {achievement.mediaLink}
                </MediaLink>
              </AchievementContent>
            </AchievementCard>
          ))}
        </AchievementsGrid>
      </ContentContainer>
    </AchievementsContainer>
  );
}

export default AchievementsSection;
