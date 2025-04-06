import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import COLORS from '../../assets/colors.ts';

const AchievementsSectionWrapper = styled.section`
  padding: 5rem 0;
  position: relative;
  background: linear-gradient(180deg, #232328 0%, #171717 100%);
  overflow: hidden;
`;

const SectionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  width: 100%;
`;

const SectionHeading = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  text-align: center;
  color: ${COLORS.gogo_blue};
`;

const TimelineContainer = styled.div`
  position: relative;
  margin: 4rem 0;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 4px;
    background: linear-gradient(
      to bottom,
      ${COLORS.gogo_blue},
      ${COLORS.gogo_purple},
      ${COLORS.gogo_pink}
    );
    border-radius: 4px;
    transform: translateX(-50%);
    z-index: 1;
  }

  @media (max-width: 768px) {
    &:before {
      left: 30px;
    }
  }
`;

interface TimelineItemProps {
  isLeft: boolean;
}

const TimelineItem = styled.div<TimelineItemProps>`
  display: flex;
  justify-content: ${(props) => (props.isLeft ? 'flex-end' : 'flex-start')};
  padding-bottom: 4rem;
  position: relative;
  width: 100%;

  &:last-child {
    padding-bottom: 0;
  }

  @media (max-width: 768px) {
    justify-content: flex-start;
    padding-left: 80px;
  }
`;

const TimelineContent = styled.div`
  background: rgba(35, 35, 40, 0.7);
  border-radius: 12px;
  padding: 1.5rem;
  width: 45%;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;

  &:before {
    content: '';
    position: absolute;
    top: 24px;
    width: 25px;
    height: 2px;
    background: ${COLORS.gogo_blue};
  }

  @media (max-width: 768px) {
    width: 100%;

    &:before {
      left: -50px;
    }
  }
`;

const TimelineContentLeft = styled(TimelineContent)`
  &:before {
    right: -25px;
  }

  @media (max-width: 768px) {
    &:before {
      right: auto;
      left: -50px;
    }
  }
`;

const TimelineContentRight = styled(TimelineContent)`
  &:before {
    left: -25px;
  }
`;

const TimelineDot = styled.div`
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${(props) => props.color || COLORS.gogo_blue};
  border: 4px solid #171717;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;

  @media (max-width: 768px) {
    left: 30px;
    transform: translateX(-50%);
  }
`;

const TimelineYear = styled.div`
  position: absolute;
  left: 50%;
  top: 55px;
  transform: translateX(-50%);
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
  z-index: 2;

  @media (max-width: 768px) {
    left: 30px;
    transform: translateX(-50%);
  }
`;

const AchievementTitle = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 0.8rem;
  color: ${COLORS.gogo_yellow};
  font-weight: 600;
`;

const AchievementDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #e0e0e0;
`;

const AchievementImage = styled.div`
  margin-top: 1rem;
  height: 150px;
  border-radius: 8px;
  background-color: rgba(25, 25, 30, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  overflow: hidden;
`;

// Achievement data
const achievements = [
  {
    year: 2008,
    title: 'GOGO Founded in Miami',
    description:
      'Established first program with 15 students in Liberty City, Miami.',
    icon: '🎸',
    color: COLORS.gogo_blue,
  },
  {
    year: 2014,
    title: 'Chicago Expansion',
    description:
      'Opened first program site in Chicago with 30 students across two locations.',
    icon: '🏙️',
    color: COLORS.gogo_purple,
  },
  {
    year: 2016,
    title: 'First National Recognition',
    description:
      'Named as Top 10 Music Education Nonprofits by National Arts Association.',
    icon: '🏆',
    color: COLORS.gogo_yellow,
  },
  {
    year: 2019,
    title: '5,000th Student Milestone',
    description: 'Celebrated serving our 5,000th student across all programs.',
    icon: '🎓',
    color: COLORS.gogo_green,
  },
  {
    year: 2021,
    title: 'Los Angeles Launch',
    description:
      'Expanded to the West Coast with three new program sites in LA.',
    icon: '🌊',
    color: COLORS.gogo_pink,
  },
  {
    year: 2023,
    title: '10,000+ Students Reached',
    description:
      'Surpassed 10,000 students served since founding, with 85% reporting improved academic performance.',
    icon: '📈',
    color: COLORS.gogo_teal,
  },
];

const AchievementsSection: React.FC = () => {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 },
    );

    const section = document.querySelector('.achievements-section');
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  return (
    <AchievementsSectionWrapper className="achievements-section">
      <SectionContainer>
        <SectionHeading>Key Milestones</SectionHeading>

        <TimelineContainer>
          {achievements.map((achievement, index) => {
            const isLeft = index % 2 === 0;
            const ContentComponent = isLeft
              ? TimelineContentLeft
              : TimelineContentRight;

            return (
              <TimelineItem
                key={`achievement-${index}`}
                isLeft={isLeft}
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(50px)',
                  transition: `opacity 0.6s ease ${
                    index * 0.2
                  }s, transform 0.6s ease ${index * 0.2}s`,
                }}
              >
                <TimelineDot color={achievement.color} />
                <TimelineYear>{achievement.year}</TimelineYear>
                <ContentComponent>
                  <AchievementTitle>{achievement.title}</AchievementTitle>
                  <AchievementDescription>
                    {achievement.description}
                  </AchievementDescription>
                  <AchievementImage>{achievement.icon}</AchievementImage>
                </ContentComponent>
              </TimelineItem>
            );
          })}
        </TimelineContainer>
      </SectionContainer>
    </AchievementsSectionWrapper>
  );
};

export default AchievementsSection;
