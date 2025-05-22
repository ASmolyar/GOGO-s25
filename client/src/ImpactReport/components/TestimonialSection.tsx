import React, { useEffect, useState, useRef, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { animate } from 'animejs';
import COLORS from '../../assets/colors.ts';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

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
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

// Section wrapper
const TestimonialSectionWrapper = styled.section`
  padding: 7rem 0;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    rgba(18, 18, 18, 1) 0%,
    rgba(30, 30, 35, 1) 100%
  );

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
        circle at 30% 20%,
        ${COLORS.gogo_purple}08,
        transparent 40%
      ),
      radial-gradient(circle at 70% 80%, ${COLORS.gogo_blue}08, transparent 40%);
    z-index: 0;
  }
`;

const GlowEffect = styled.div`
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: ${COLORS.gogo_blue}22;
  filter: blur(50px);
  animation: ${pulse} 8s ease infinite;
  z-index: 0;
`;

const SectionContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  width: 100%;
  position: relative;
  z-index: 1;
`;

const SectionHeading = styled.h2`
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 1.5rem;
  text-align: center;
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

const SectionSubheading = styled.p`
  font-size: 1.2rem;
  text-align: center;
  max-width: 700px;
  margin: 0 auto 1.5rem !important;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
`;

const CarouselContainer = styled.div`
  position: relative;
  margin: 1rem 0;
`;

const TestimonialsTrack = styled.div<{ transform: string; transition: string }>`
  display: flex;
  transform: ${(props) => props.transform};
  transition: ${(props) => props.transition};
  gap: 2rem;
  padding: 2rem 0;
  width: max-content;
`;

const TestimonialCard = styled.div<{ active: boolean; color: string }>`
  background: rgba(35, 35, 40, 0.7);
  border-radius: 20px;
  padding: 2.5rem;
  width: 460px;
  max-width: 95vw;
  box-shadow: ${(props) =>
    props.active
      ? '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(128, 128, 255, 0.1)'
      : '0 10px 30px rgba(0, 0, 0, 0.3)'};
  border-top: 4px solid;
  border-top-color: ${(props) => props.color || COLORS.gogo_blue};
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  backdrop-filter: blur(10px);
  transform: ${(props) =>
    props.active ? 'translateY(-15px) scale(1.03)' : 'translateY(0) scale(1)'};
  opacity: ${(props) => (props.active ? 1 : 0.6)};
  cursor: pointer;
  animation: ${fadeIn} 0.5s ease forwards;

  &:hover {
    transform: ${(props) =>
      props.active
        ? 'translateY(-15px) scale(1.03)'
        : 'translateY(-5px) scale(1.01)'};
    opacity: ${(props) => (props.active ? 1 : 0.8)};
  }

  &:before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 20px;
    padding: 2px;
    background: linear-gradient(
      to bottom right,
      ${(props) => props.color || COLORS.gogo_blue}66,
      transparent
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: ${(props) => (props.active ? 1 : 0.3)};
    transition: opacity 0.3s ease;
  }
`;

const QuoteMark = styled.div<{ color: string }>`
  position: absolute;
  top: -22px;
  left: 20px;
  font-size: 8rem;
  line-height: 1;
  font-family: Georgia, serif;
  color: ${(props) => props.color || COLORS.gogo_blue};
  opacity: 0.3;
  pointer-events: none;
  z-index: 0;
  text-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const QuoteText = styled.p`
  font-size: 1.2rem;
  line-height: 1.7;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
  color: rgba(255, 255, 255, 0.9);
  font-style: italic;

  &:after {
    content: '"';
    font-family: Georgia, serif;
    display: inline;
  }

  &:before {
    content: '"';
    font-family: Georgia, serif;
    display: inline;
  }
`;

const PersonInfo = styled.div`
  display: flex;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  padding-top: 1.5rem;
  margin-top: 1rem;
`;

const AvatarGlow = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.5);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(255, 255, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
`;

const PersonAvatar = styled.div<{ color: string; active: boolean }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 1.2rem;
  background-color: ${(props) => props.color || COLORS.gogo_blue};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.2);
  position: relative;
  transition: all 0.3s ease;
  animation: ${(props) =>
    props.active
      ? css`
          ${AvatarGlow} 2s infinite
        `
      : 'none'};

  &:before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(
      45deg,
      ${(props) => props.color || COLORS.gogo_blue},
      transparent,
      ${(props) => props.color || COLORS.gogo_blue}
    );
    border-radius: 50%;
    z-index: -1;
    animation: ${(props) =>
      props.active
        ? css`
            ${float} 6s ease infinite
          `
        : 'none'};
    opacity: ${(props) => (props.active ? 0.7 : 0)};
    transition: opacity 0.3s ease;
  }
`;

const PersonDetails = styled.div`
  flex-grow: 1;
`;

const PersonName = styled.h4`
  font-size: 1.2rem;
  margin: 0 0 0.25rem;
  font-weight: 700;
  color: white;
`;

const PersonRole = styled.p`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
`;

const CarouselButtons = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 3rem;
  gap: 1rem;
`;

const CarouselIndicator = styled.button<{ active: boolean }>`
  width: ${(props) => (props.active ? '2.5rem' : '1rem')};
  height: 0.5rem;
  border-radius: 1rem;
  background-color: ${(props) =>
    props.active ? 'white' : 'rgba(255, 255, 255, 0.3)'};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) =>
      props.active ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  }
`;

const CarouselNavButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  opacity: 0.6;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-50%) scale(1.1);
    opacity: 1;
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  &.prev {
    left: 10px;
  }

  &.next {
    right: 10px;
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
`;

// Testimonial data
const testimonials = [
  {
    quote:
      "Watching GOGO New York – a vision and a dream – become reality, I couldn't be prouder. I had to pinch myself watching the kids perform, watching the school community rally so hard behind the students, listening to one of the most incredible principals we've ever had the honor of working with tell us that we're reaching kids that aren't typically engaged or who may don't normally have the access or opportunity to hold the mic, to tell their own story",
    name: 'Chad Bernstein',
    role: 'CEO/Co-Founder',
    avatarText: 'C',
    color: COLORS.gogo_purple,
  },
  {
    quote:
      "In my very first session with the students, I brought up the idea of living life unapologetically yourself. Being able to stick to your values and do what makes you your own person. As I reached my final session with the group, one of the students shared their song from our songwriting activity. She was asked what her inspiration was and she responded that her 6th and 7th grades of middle school were terrible for her but as she went through her 8th-grade year, she lived her life as her own and didn't try to follow anyone else's footsteps. She followed up by saying that this year was immensely better and she is super proud of herself for doing so.",
    name: 'Benjamin Eisenberg',
    role: 'M-Power Intern, Spring 2024',
    avatarText: 'B',
    color: COLORS.gogo_blue,
  },
  {
    quote:
      "One of our students shared how helpful these wellness discussions and activities were in assisting her through a traumatic experience she faced and how the exposure of Guitars Over Guns' resources assisted in her healing process. She also expressed how grateful she was to have an understanding of why she wants to become a singer and how music has always been an outlet that has brought her so much joy, peace, and serves as her very own therapy. From students from single-parent homes, to students dealing with depression, anxieties and traumatic experiences, the M-Power program provides students with a strong support system and exposure to positive coping strategies to help the students better express their emotions, cope through life's challenges.",
    name: 'Daniella Lexine',
    role: 'M-Power Intern, Spring & Summer 2024',
    avatarText: 'D',
    color: COLORS.gogo_green,
  },
  {
    quote:
      'It makes me look at a different outlook in life when it comes to changing myself and changing my decisions,',
    name: 'James',
    role: 'Mentee, TASC',
    avatarText: 'J',
    color: COLORS.gogo_pink,
  },
  {
    quote:
      "Really, I see Guitars Over Guns as a way to express myself. Before I got into music production I didn't know what I wanted to do. [My mentors] Ron and Dolan helped me figure out what I wanted to do, and it helped me work with other people a little better",
    name: 'Elijah',
    role: 'Mentee, TASC',
    avatarText: 'E',
    color: COLORS.gogo_teal,
  },
];

function TestimonialSection(): JSX.Element {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [translateValue, setTranslateValue] = useState(0);
  const [inView, setInView] = useState(false);
  const [autoplay, setAutoplay] = useState(true);

  // Define navigation functions with useCallback
  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    const nextIndex = (activeIndex + 1) % testimonials.length;
    const cardWidth =
      trackRef.current?.querySelector('.testimonial-card')?.clientWidth || 0;
    const newTranslateValue = -(cardWidth + 40) * nextIndex; // 40 is the card margin

    setActiveIndex(nextIndex);
    setTranslateValue(newTranslateValue);

    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  }, [activeIndex, isAnimating]);

  const handlePrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    const nextIndex =
      activeIndex === 0 ? testimonials.length - 1 : activeIndex - 1;
    const cardWidth =
      trackRef.current?.querySelector('.testimonial-card')?.clientWidth || 0;
    const newTranslateValue = -(cardWidth + 40) * nextIndex; // 40 is the card margin

    setActiveIndex(nextIndex);
    setTranslateValue(newTranslateValue);

    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  }, [activeIndex, isAnimating]);

  const handleIndicatorClick = useCallback(
    (index: number) => {
      if (isAnimating || index === activeIndex) return;
      setIsAnimating(true);

      const cardWidth =
        trackRef.current?.querySelector('.testimonial-card')?.clientWidth || 0;
      const newTranslateValue = -(cardWidth + 40) * index; // 40 is the card margin

      setActiveIndex(index);
      setTranslateValue(newTranslateValue);

      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    },
    [activeIndex, isAnimating],
  );

  // Event handlers for pausing autoplay
  const handleMouseEnter = useCallback(() => setAutoplay(false), []);
  const handleMouseLeave = useCallback(() => setAutoplay(true), []);

  // Autoplay
  useEffect(() => {
    if (!autoplay || !inView) {
      return;
    }

    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    // Clean up the interval on unmount
    return () => {
      clearInterval(interval);
    };
  }, [autoplay, inView, handleNext]);

  // Handle intersection observer for section visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          // Once the section is visible, we can unobserve it
          if (carouselRef.current) {
            observer.unobserve(carouselRef.current);
          }
        } else {
          setInView(false);
        }
      },
      { threshold: 0.3 },
    );

    // Store a reference to the current value of carouselRef.current
    const currentCarouselRef = carouselRef.current;

    if (currentCarouselRef) {
      observer.observe(currentCarouselRef);
    }

    // Clean up
    return () => {
      observer.disconnect();
    };
  }, []);

  // Set random positions for glow effects
  const glowPositions = [
    { top: '20%', left: '10%' },
    { top: '70%', left: '80%' },
    { top: '30%', left: '85%' },
  ];

  return (
    <TestimonialSectionWrapper className="testimonial-section">
      {glowPositions.map((pos, i) => (
        <GlowEffect
          key={`testimonial-glow-${i}-${pos.top}-${pos.left}`}
          style={{
            top: pos.top,
            left: pos.left,
            animationDelay: `${i * 2}s`,
          }}
        />
      ))}

      <SectionContainer>
        <SectionHeading className="section-heading" style={{ opacity: 100 }}>
          Stories of Impact
        </SectionHeading>

        <CarouselContainer ref={carouselRef}>
          <CarouselNavButton
            className="prev"
            onClick={handlePrev}
            aria-label="Previous testimonial"
          >
            ←
          </CarouselNavButton>

          <TestimonialsTrack
            ref={trackRef}
            transform={`translateX(${translateValue}px)`}
            transition={isAnimating ? 'transform 0.5s ease' : 'none'}
          >
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={`testimonial-card-${testimonial.name.replace(
                  /\s+/g,
                  '-',
                )}-${testimonial.role.replace(/\s+/g, '-')}`}
                color={testimonial.color}
                active={index === activeIndex}
                onClick={() => handleIndicatorClick(index)}
                className="testimonial-card"
              >
                <QuoteMark color={testimonial.color}>&ldquo;</QuoteMark>
                <QuoteText>{testimonial.quote}</QuoteText>
                <PersonInfo>
                  <PersonAvatar
                    color={testimonial.color}
                    active={index === activeIndex}
                  >
                    {testimonial.avatarText}
                  </PersonAvatar>
                  <PersonDetails>
                    <PersonName>{testimonial.name}</PersonName>
                    <PersonRole>{testimonial.role}</PersonRole>
                  </PersonDetails>
                </PersonInfo>
              </TestimonialCard>
            ))}
          </TestimonialsTrack>

          <CarouselNavButton
            className="next"
            onClick={handleNext}
            aria-label="Next testimonial"
          >
            →
          </CarouselNavButton>
        </CarouselContainer>

        <CarouselButtons>
          {testimonials.map((testimonial, index) => (
            <CarouselIndicator
              key={`carousel-indicator-${testimonial.name.replace(
                /\s+/g,
                '-',
              )}-${testimonial.role.replace(/\s+/g, '-')}`}
              active={activeIndex === index}
              onClick={() => handleIndicatorClick(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </CarouselButtons>
      </SectionContainer>
    </TestimonialSectionWrapper>
  );
}

export default TestimonialSection;
