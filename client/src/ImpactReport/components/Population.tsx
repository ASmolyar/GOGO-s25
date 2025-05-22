import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import Photo1 from '../../assets/populationPhotos/Photo1.jpg';
import Photo2 from '../../assets/populationPhotos/Photo2.jpg';
import Photo3 from '../../assets/populationPhotos/Photo3.jpg';
import Photo4 from '../../assets/populationPhotos/Photo4.jpg';
import Photo5 from '../../assets/populationPhotos/Photo5.jpg';
import Photo6 from '../../assets/populationPhotos/Photo6.jpg';

const Container = styled.section`
  width: 80vw;
  margin: 4rem auto;
  padding: 2.5rem 2rem;
  background: linear-gradient(120deg, #1ed76011, #169c4611 80%, #fff0 100%);
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(30, 215, 96, 0.08);
  color: #181818;
`;

const Title = styled.h1`
  font-size: 2.7rem;
  font-weight: 900;
  color: #169c46;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.h2`
  font-size: 1.3rem;
  color: #555;
  margin-bottom: 0rem !important;
`;

const GraphsContainer = styled.div<{ active: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  gap: 2.5rem;
  margin: 2.5rem 0 2rem 0;
  padding: 2.5rem 1.5rem;
  border-radius: 16px;
  background: transparent;
  box-shadow: none;
  filter: ${({ active }) =>
    active ? 'none' : 'grayscale(1) brightness(0.6) opacity(0.3)'};
  transition: filter 0.5s;
  cursor: pointer;
`;

const GraphCard = styled.div`
  flex: 1;
  background: white;
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(30, 215, 96, 0.09);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3.5rem 1.5rem;
  min-width: 0;
`;

const PieChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PieCaption = styled.div`
  font-size: 1rem;
  color: #444;
  margin-top: 0.7rem;
  text-align: center;
`;

const PercentCircle = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fffbe6 60%, #fff3cd 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  box-shadow: 0 0 0 8px #e0e0e0;
  position: relative;
`;

const PercentText = styled.span`
  font-size: 2.8rem;
  font-weight: 800;
  background: linear-gradient(90deg, #ffb347 30%, #ffd700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
`;

const CardLabel = styled.div`
  font-size: 1.08rem;
  color: #444;
  margin-top: 0.5rem;
  text-align: center;
  line-height: 1.5;
`;

const Text = styled.p<{ white?: boolean }>`
  font-size: 1.15rem;
  color: white;
  line-height: 1.7;
`;

const SkillsList = styled.ul`
  margin: 1.2rem 0 0 0;
  padding-left: 1.5rem;
  color: white;
  font-size: 1.08rem;
  line-height: 1.7;
`;

const SkillsItem = styled.li`
  margin-bottom: 0.3rem;
  color: white;
`;

const SimplePercentsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  gap: 1.5rem;
  margin: 2.5rem 0 1.5rem 0;
`;

const SimplePercentCard = styled.div`
  flex: 1;
  background: #23272b;
  border-radius: 12px;
  box-shadow: 0 1px 6px rgba(30, 215, 96, 0.07);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.7rem 0.5rem 1.2rem 0.5rem;
  min-width: 0;
`;

const SimplePercentValue = styled.div`
  font-size: 2.1rem;
  font-weight: 700;
  color: #ffd700;
  margin-bottom: 0.5rem;
`;

const SimplePercentLabel = styled.div`
  font-size: 1rem;
  color: #fff;
  text-align: center;
`;

const ImageGallery = styled.div`
  display: flex;
  gap: 1.2rem;
  overflow-x: auto;
  margin: 3rem 0 0 0;
  padding-bottom: 1rem;
`;

const GalleryImage = styled.img`
  width: 160px;
  height: 110px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(30, 215, 96, 0.08);
  background: #222;
`;

/**
 * Returns an SVG path for a pie slice.
 * cx, cy: center; r: radius; startAngle, endAngle: in degrees
 */
function getPieSlicePath(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
) {
  const start = {
    x: cx + r * Math.cos((Math.PI / 180) * startAngle),
    y: cy + r * Math.sin((Math.PI / 180) * startAngle),
  };
  const end = {
    x: cx + r * Math.cos((Math.PI / 180) * endAngle),
    y: cy + r * Math.sin((Math.PI / 180) * endAngle),
  };
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
  return [
    `M${cx},${cy}`,
    `L${start.x},${start.y}`,
    `A${r},${r} 0 ${largeArcFlag} 1 ${end.x},${end.y}`,
    'Z',
  ].join(' ');
}

const Population: React.FC = () => {
  const [active, setActive] = useState(false);
  const graphsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (graphsRef.current) {
        const rect = graphsRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
          setActive(true);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Container>
      <Title>TALENT IS UNIVERSALLY DISTRIBUTED, BUT OPPORTUNITY IS NOT.</Title>
      <Text white>
        That is why, since 2008, Guitars Over Guns has used the transformative
        power of music, mentorship, and the arts to unlock possibilities for the
        young people society is failing to reach.
      </Text>
      <Subtitle>Guitars Over Guns: Our Population</Subtitle>
      <GraphsContainer
        ref={graphsRef}
        active={active}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
      >
        <GraphCard>
          <PieChartWrapper>
            <svg width="120" height="120" viewBox="0 0 120 120">
              {/* Blue slice: 46% */}
              <path d={getPieSlicePath(60, 60, 56, 0, 165.6)} fill="#7b7fd1" />
              {/* Purple slice: 44% (starts after blue) */}
              <path
                d={getPieSlicePath(60, 60, 56, 165.6, 324)}
                fill="#a259d9"
              />
              {/* Remainder: light green */}
              <path d={getPieSlicePath(60, 60, 56, 324, 360)} fill="#b2d8c5" />
            </svg>
            <div
              style={{
                display: 'flex',
                gap: '0.7rem',
                marginTop: '0.5rem',
                justifyContent: 'center',
              }}
            >
              <span
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <span
                  style={{
                    width: 14,
                    height: 14,
                    background: '#a259d9',
                    borderRadius: '50%',
                    display: 'inline-block',
                  }}
                />
                <span style={{ fontSize: '0.95rem', color: '#444' }}>
                  44% Black/African American
                </span>
              </span>
              <span
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <span
                  style={{
                    width: 14,
                    height: 14,
                    background: '#7b7fd1',
                    borderRadius: '50%',
                    display: 'inline-block',
                  }}
                />
                <span style={{ fontSize: '0.95rem', color: '#444' }}>
                  46% Hispanic/Latinx
                </span>
              </span>
            </div>
            <PieCaption>
              Ages 8-18: 96% at or below the Federal Poverty Level
            </PieCaption>
          </PieChartWrapper>
        </GraphCard>
        <GraphCard>
          <PercentCircle>
            <PercentText>94%</PercentText>
          </PercentCircle>
          <CardLabel>
            of Guitars Over Guns students made or maintained academic gains in
            the school year 2023-2024.
          </CardLabel>
        </GraphCard>
        <GraphCard>
          <PercentCircle>
            <PercentText>95%</PercentText>
          </PercentCircle>
          <CardLabel>
            of Guitars Over Guns students improved conduct in their classes over
            the course of the school year in 2023-2024.
          </CardLabel>
        </GraphCard>
      </GraphsContainer>
      <Text>
        <em>
          Through Guitars Over Guns' programs, youth develop core skills and a
          support system that are crucial for personal and professional success:
        </em>
        <SkillsList>
          <SkillsItem>Confidence and self-awareness</SkillsItem>
          <SkillsItem>Empathy and a sense of belonging</SkillsItem>
          <SkillsItem>Emotional intelligence and creativity</SkillsItem>
          <SkillsItem>Self-presentation and expression</SkillsItem>
          <SkillsItem>Workforce readiness and life skills</SkillsItem>
          <SkillsItem>Trusted mentors & positive role models</SkillsItem>
          <SkillsItem>Supportive community of peers</SkillsItem>
        </SkillsList>
      </Text>
      <hr
        style={{
          border: 'none',
          borderTop: '2px solid #b2d8c5',
          margin: '2rem 0',
        }}
      />
      <Text>
        The Childhood Global Assessment Scale (C-GAS) is a widely recognized
        tool to measure young people's psychological and social well-being.
      </Text>
      <SimplePercentsContainer>
        <SimplePercentCard>
          <SimplePercentValue>62%</SimplePercentValue>
          <SimplePercentLabel>
            2023-24 students scored 81+ on C-GAS
          </SimplePercentLabel>
        </SimplePercentCard>
        <SimplePercentCard>
          <SimplePercentValue>100%</SimplePercentValue>
          <SimplePercentLabel>
            of GOGO students with initial problems improved 5+ points
          </SimplePercentLabel>
        </SimplePercentCard>
        <SimplePercentCard>
          <SimplePercentValue>85%</SimplePercentValue>
          <SimplePercentLabel>
            Fall 2023: students increased or maintained C-GAS
          </SimplePercentLabel>
        </SimplePercentCard>
        <SimplePercentCard>
          <SimplePercentValue>84%</SimplePercentValue>
          <SimplePercentLabel>
            Spring 2024: studentsincreased or maintained C-GAS
          </SimplePercentLabel>
        </SimplePercentCard>
      </SimplePercentsContainer>
      <ImageGallery>
        <GalleryImage src={Photo1} alt="Photo 1" />
        <GalleryImage src={Photo2} alt="Photo 2" />
        <GalleryImage src={Photo3} alt="Photo 3" />
        <GalleryImage src={Photo4} alt="Photo 4" />
        <GalleryImage src={Photo5} alt="Photo 5" />
        <GalleryImage src={Photo6} alt="Photo 6" />
      </ImageGallery>
    </Container>
  );
};

export default Population;
