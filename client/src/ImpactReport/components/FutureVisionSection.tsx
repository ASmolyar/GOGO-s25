import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import COLORS from '../../assets/colors.ts';

const FutureVisionWrapper = styled.section`
  padding: 5rem 0;
  background: linear-gradient(to right, #171717, #232328, #171717);
  position: relative;
  overflow: hidden;
`;

const SectionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  width: 100%;
  position: relative;
  z-index: 2;
`;

const SectionHeading = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  text-align: center;
  color: ${COLORS.gogo_blue};
`;

const SectionSubheading = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto 3rem;
  text-align: center;
  color: #e0e0e0;
`;

const BackgroundDecoration = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: 0.05;
  background: 
    radial-gradient(circle at 10% 20%, ${COLORS.gogo_purple}, transparent 400px),
    radial-gradient(circle at 90% 80%, ${COLORS.gogo_blue}, transparent 400px);
`;

const GoalsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const GoalCard = styled.div`
  background: rgba(35, 35, 40, 0.7);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.05);
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
  }
  
  transition: transform 0.3s ease, box-shadow 0.3s ease;
`;

const GoalHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const GoalIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${props => props.color || COLORS.gogo_blue};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-right: 1rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
`;

const GoalTitle = styled.h3`
  font-size: 1.5rem;
  margin: 0;
  color: ${props => props.color || COLORS.gogo_yellow};
  font-weight: 600;
`;

const GoalDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #e0e0e0;
  margin-bottom: 1rem;
  flex-grow: 1;
`;

const GoalList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1.5rem 0 0 0;
`;

const GoalListItem = styled.li`
  position: relative;
  padding-left: 25px;
  margin-bottom: 0.7rem;
  font-size: 0.95rem;
  color: #ccc;
  
  &:before {
    content: '•';
    position: absolute;
    left: 0;
    top: 0;
    color: ${props => props.color || COLORS.gogo_blue};
    font-size: 1.2rem;
  }
`;

const TargetYear = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.3);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  color: ${props => props.color || 'white'};
`;

const CallToAction = styled.div`
  margin-top: 4rem;
  text-align: center;
`;

const CTAButton = styled.button`
  background: ${COLORS.gogo_blue};
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 30px;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${COLORS.gogo_purple};
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
`;

// Future goals data
const futureGoals = [
  {
    title: "National Expansion",
    description: "Build on our success in Miami, Chicago, and Los Angeles to expand GOGO's impact nationwide.",
    icon: "🗺️",
    color: COLORS.gogo_blue,
    targetYear: "2026",
    steps: [
      "Launch programs in three new major cities",
      "Establish partnerships with 50+ new schools",
      "Increase total program sites by 75%"
    ]
  },
  {
    title: "Technology Integration",
    description: "Leverage digital tools to enhance our music education programs and reach students everywhere.",
    icon: "💻",
    color: COLORS.gogo_purple,
    targetYear: "2025",
    steps: [
      "Develop GOGO mobile app for virtual lessons",
      "Create digital curriculum for remote learning",
      "Implement streaming platform for student performances"
    ]
  },
  {
    title: "Research & Advocacy",
    description: "Establish GOGO as a leading voice in music education research and youth development advocacy.",
    icon: "📊",
    color: COLORS.gogo_pink,
    targetYear: "2024",
    steps: [
      "Publish comprehensive impact study",
      "Partner with universities for longitudinal research",
      "Advocate for increased arts funding in public schools"
    ]
  }
];

const FutureVisionSection: React.FC = () => {
  const [inView, setInView] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.2 }
    );
    
    const section = document.querySelector('.future-vision-section');
    if (section) observer.observe(section);
    
    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);
  
  return (
    <FutureVisionWrapper className="future-vision-section">
      <BackgroundDecoration />
      <SectionContainer>
        <SectionHeading>Our Vision for the Future</SectionHeading>
        <SectionSubheading>
          As we look ahead, GOGO is committed to expanding our reach, enhancing our programs, 
          and creating even greater impact for young people through music and mentorship.
        </SectionSubheading>
        
        <GoalsGrid>
          {futureGoals.map((goal, index) => (
            <GoalCard 
              key={`goal-${index}`}
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(30px)',
                transition: `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`
              }}
            >
              <TargetYear color={goal.color}>{goal.targetYear}</TargetYear>
              <GoalHeader>
                <GoalIcon color={goal.color}>{goal.icon}</GoalIcon>
                <GoalTitle color={goal.color}>{goal.title}</GoalTitle>
              </GoalHeader>
              <GoalDescription>{goal.description}</GoalDescription>
              <GoalList>
                {goal.steps.map((step, stepIndex) => (
                  <GoalListItem 
                    key={`step-${index}-${stepIndex}`}
                    color={goal.color}
                  >
                    {step}
                  </GoalListItem>
                ))}
              </GoalList>
            </GoalCard>
          ))}
        </GoalsGrid>
        
        <CallToAction 
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease 0.6s, transform 0.6s ease 0.6s'
          }}
        >
          <CTAButton>Help Us Shape the Future</CTAButton>
        </CallToAction>
      </SectionContainer>
    </FutureVisionWrapper>
  );
};

export default FutureVisionSection; 