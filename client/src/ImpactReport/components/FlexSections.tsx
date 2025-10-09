import React from 'react';
import styled from 'styled-components';
import { Reveal } from '../../animations';
import COLORS from '../../assets/colors';

const Wrapper = styled.section`
  padding: 5rem 0;
  background: #0f0f0f;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  gap: 6rem;
`;

const Label = styled.div<{ $bg: string }>`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  font-size: 0.8rem;
  background: ${(p) => p.$bg};
  color: #111;
`;

const Title = styled.h2`
  margin: 12px 0 16px;
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 900;
  line-height: 1.05;
  color: #fff;
`;

const Copy = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.05rem;
  line-height: 1.8;
  margin: 0 0 1rem;
`;

const BigImage = styled.div<{ $src: string }>`
  margin-top: 1.75rem;
  border-radius: 16px;
  background: url('${(p) => p.$src}') center/cover no-repeat;
  width: 100%;
  height: 440px;
`;

// Article B (split layout)
const Split = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 2rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const SplitBox = styled.div`
  background: #121212;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 2rem;
`;

const SplitImage = styled.div<{ $src: string }>`
  border-radius: 16px;
  min-height: 380px;
  background: url('${(p) => p.$src}') center/cover no-repeat;
`;

// Article C (accent band with items)
const Band = styled.div`
  background: linear-gradient(90deg, ${COLORS.gogo_teal}, ${COLORS.gogo_blue});
  border-radius: 18px;
  padding: 2rem;
`;

const BandInner = styled.div`
  background: rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  padding: 1.25rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const BandItem = styled.div`
  color: #fff;
`;

function FlexSections(): JSX.Element {
  return (
    <Wrapper>
      <Container>
        {/* Article A: Program Spotlight */}
        <Reveal variant="fade-up">
          <div>
            <Label $bg={COLORS.gogo_yellow}>Program Spotlight</Label>
            <Title>Overtown Youth Center</Title>
            <Copy>
              A staple of Miami's historic Overtown neighborhood, OYC is a hub
              for community empowerment and enrichment. With a program launch in
              December 2023, mentors now facilitate programming both after
              school and during the summer.
            </Copy>
            <Copy>
              During GOGO's summer camp at OYC, students created original songs
              and emboldened one another through friendly competition. The
              process culminated in two of the catchiest hits of the summer.
            </Copy>
            <BigImage $src={'https://picsum.photos/1400/800?random=21'} />
          </div>
        </Reveal>

        {/* Article B: A Different Outlook on Life */}
        <Reveal variant="fade-up">
          <Split>
            <SplitBox>
              <Label $bg={COLORS.gogo_purple}>Program Spotlight</Label>
              <Title style={{ marginTop: 12 }}>
                A Different Outlook on Life
              </Title>
              <Copy>
                Youth involved in the justice system often have stories told
                about them, but don't always have the chance to tell their own.
                This flexible layout is great for long-form narratives with a
                companion image.
              </Copy>
              <Copy>
                Replace this copy with your program story, quotes, or stats. The
                container adapts for mobile and desktop.
              </Copy>
            </SplitBox>
            <SplitImage $src={'https://picsum.photos/1000/1200?random=22'} />
          </Split>
        </Reveal>

        {/* Article C: Mini Documentary */}
        <Reveal variant="fade-up">
          <div>
            <Label $bg={COLORS.gogo_teal}>New York City</Label>
            <Title>Mini Documentary</Title>
            <Copy>
              Capturing the work being done during our New York launch was
              essential. Use this banded layout to highlight a quote or a few
              quick stats below the main content.
            </Copy>
            <BigImage $src={'https://picsum.photos/1400/700?random=23'} />
            <Band style={{ marginTop: '1.25rem' }}>
              <BandInner>
                <BandItem>
                  <strong>
                    “Transformative power of music is undeniable.”
                  </strong>
                </BandItem>
                <BandItem>
                  <strong>48 mentors</strong>
                  <div>collaborated across sites</div>
                </BandItem>
                <BandItem>
                  <strong>120+ students</strong>
                  <div>featured in media</div>
                </BandItem>
                <BandItem>
                  <strong>Scan to watch</strong>
                  <div>(placeholder QR area)</div>
                </BandItem>
              </BandInner>
            </Band>
          </div>
        </Reveal>
      </Container>
    </Wrapper>
  );
}

export default FlexSections;
