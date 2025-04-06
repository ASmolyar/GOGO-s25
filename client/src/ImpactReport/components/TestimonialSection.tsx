import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import COLORS from '../../assets/colors.ts';

// Section wrapper
const TestimonialSectionWrapper = styled.section`
  padding: 5rem 0;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(23, 23, 23, 1) 0%, rgba(35, 35, 40, 1) 100%);
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

const TestimonialsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  margin-top: 3rem;
`;

const TestimonialCard = styled.div`
  background: rgba(35, 35, 40, 0.7);
  border-radius: 16px;
  padding: 2rem;
  max-width: 340px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border-top: 4px solid;
  border-top-color: ${props => props.color || COLORS.gogo_blue};
  transition: transform 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-10px);
  }
`;

const QuoteMark = styled.div`
  position: absolute;
  top: -15px;
  left: 20px;
  font-size: 8rem;
  line-height: 1;
  font-family: Georgia, serif;
  color: ${props => props.color || COLORS.gogo_blue};
  opacity: 0.3;
  pointer-events: none;
  z-index: 0;
`;

const QuoteText = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
`;

const PersonInfo = styled.div`
  display: flex;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
`;

const PersonAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 1rem;
  background-color: ${props => props.color || COLORS.gogo_blue};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const PersonDetails = styled.div`
  flex-grow: 1;
`;

const PersonName = styled.h4`
  font-size: 1.1rem;
  margin: 0 0 0.25rem;
  font-weight: 600;
`;

const PersonRole = styled.p`
  font-size: 0.9rem;
  color: #aaa;
  margin: 0;
`;

// Testimonial data
const testimonials = [
  {
    quote: "GOGO has changed my life. I've discovered my passion for music and found a community where I belong. My mentor has been there for me through some tough times.",
    name: "Jasmine",
    role: "Student, Chicago",
    avatarText: "J",
    color: COLORS.gogo_purple
  },
  {
    quote: "Having the opportunity to mentor these amazing young people has been the most rewarding experience. I've watched them grow not just as musicians, but as confident young adults.",
    name: "Marcus",
    role: "Mentor, Miami",
    avatarText: "M",
    color: COLORS.gogo_blue
  },
  {
    quote: "Before GOGO, I didn't have a creative outlet. Now I'm producing my own music and have performed at local venues. This program gave me skills I'll use for life.",
    name: "Carlos",
    role: "Student, Los Angeles",
    avatarText: "C",
    color: COLORS.gogo_green
  }
];

const TestimonialSection: React.FC = () => {
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
    
    const section = document.querySelector('.testimonial-section');
    if (section) observer.observe(section);
    
    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);
  
  return (
    <TestimonialSectionWrapper className="testimonial-section">
      <SectionContainer>
        <SectionHeading>Stories of Impact</SectionHeading>
        <TestimonialsContainer>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={`testimonial-${index}`} 
              color={testimonial.color}
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(30px)',
                transition: `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`
              }}
            >
              <QuoteMark color={testimonial.color}>"</QuoteMark>
              <QuoteText>{testimonial.quote}</QuoteText>
              <PersonInfo>
                <PersonAvatar color={testimonial.color}>
                  {testimonial.avatarText}
                </PersonAvatar>
                <PersonDetails>
                  <PersonName>{testimonial.name}</PersonName>
                  <PersonRole>{testimonial.role}</PersonRole>
                </PersonDetails>
              </PersonInfo>
            </TestimonialCard>
          ))}
        </TestimonialsContainer>
      </SectionContainer>
    </TestimonialSectionWrapper>
  );
};

export default TestimonialSection; 