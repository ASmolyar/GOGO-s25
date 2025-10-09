import React, { memo } from 'react';
import styled from 'styled-components';
import COLORS from '../../assets/colors';

const Section = styled.section`
  position: relative;
  padding: 5rem 0;
  background: linear-gradient(180deg, #121212 0%, #0f0f10 100%);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: -20% -10% auto -10%;
    height: 40rem;
    background: radial-gradient(
      closest-side,
      rgba(25, 70, 245, 0.12),
      transparent
    );
    filter: blur(40px);
    pointer-events: none;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
`;

const Heading = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  margin: 0 0 0.75rem;
  font-size: 3rem;
  font-weight: 900;
  letter-spacing: 0.01em;
  background: linear-gradient(90deg, ${COLORS.gogo_blue}, ${COLORS.gogo_teal});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const SubTitle = styled.p`
  margin: 0 auto;
  max-width: 760px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 1.15rem;
  line-height: 1.7;
`;

const Cards = styled.div`
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
`;

const Card = styled.a`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.25rem 1.5rem;
  border-radius: 14px;
  text-decoration: none;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.06),
    rgba(255, 255, 255, 0.03)
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #f3f4f6;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
  transition: transform 0.25s ease, box-shadow 0.25s ease,
    border-color 0.25s ease, background 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(99, 102, 241, 0.35);
    background: linear-gradient(
      180deg,
      rgba(79, 70, 229, 0.14),
      rgba(255, 255, 255, 0.04)
    );
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.35);
  }
`;

const CardTitle = styled.span`
  font-weight: 800;
  font-size: 1.05rem;
`;

const CardText = styled.span`
  font-size: 0.95rem;
  color: #cbd5e1;
`;

const Inline = styled.div`
  margin-top: 1.5rem;
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Pill = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border-radius: 999px;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  font-weight: 800;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.14);
  }
`;

function ContactUsSection(): JSX.Element {
  return (
    <Section>
      <Container>
        <Heading>
          <Title>Thank You</Title>
          <SubTitle>
            Thank you for exploring our Impact Report. Your time, advocacy and
            support empower young people to create, grow and lead. We would love
            to connect.
          </SubTitle>
        </Heading>

        <Cards>
          <Card href="/contact">
            <CardTitle>Contact Page</CardTitle>
            <CardText>Reach our team and regional offices</CardText>
          </Card>
          <Card href="mailto:info@guitarsoverguns.org">
            <CardTitle>Email</CardTitle>
            <CardText>info@guitarsoverguns.org</CardText>
          </Card>
          <Card
            href="https://www.classy.org/give/352794/#!/donation/checkout"
            target="_blank"
            rel="noopener noreferrer"
          >
            <CardTitle>Donate</CardTitle>
            <CardText>Fuel mentorship and arts education</CardText>
          </Card>
          <Card href="/volunteer">
            <CardTitle>Volunteer</CardTitle>
            <CardText>Become a mentor or event volunteer</CardText>
          </Card>
        </Cards>

        <Inline>
          <Pill
            href="https://guitarsoverguns.org/"
            target="_blank"
            rel="noreferrer noopener"
          >
            Website ↗
          </Pill>
          <Pill
            href="https://instagram.com/guitarsoverguns"
            target="_blank"
            rel="noreferrer noopener"
          >
            Instagram ↗
          </Pill>
          <Pill
            href="https://facebook.com/guitarsoverguns"
            target="_blank"
            rel="noreferrer noopener"
          >
            Facebook ↗
          </Pill>
        </Inline>
      </Container>
    </Section>
  );
}

export default memo(ContactUsSection);
