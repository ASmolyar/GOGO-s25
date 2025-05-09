import React, { useEffect, useState, useRef, useMemo } from 'react';
import { animate, stagger } from 'animejs';

function ImpactSection(): JSX.Element {
  const [inView, setInView] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Create refs for each impact stat
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRefs = useRef<(SVGCircleElement | null)[]>([]);
  const percentageRefs = useRef<(HTMLHeadingElement | null)[]>([]);

  // Define impact data with useMemo to avoid recreating it on every render
  const impactData = useMemo(
    () => [
      {
        id: 'mentor-trust',
        percentage: 90,
        description: 'of students say their mentor can be counted on for help',
      },
      {
        id: 'challenge-encouragement',
        percentage: 87,
        description: 'of students felt encouraged to work through challenges',
      },
      {
        id: 'measurable-growth',
        percentage: 85,
        description: 'of students showed measurable growth',
      },
    ],
    [],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);

          // Animate the section header
          if (headerRef.current) {
            animate(headerRef.current, {
              opacity: [0, 1],
              translateY: [30, 0],
              easing: 'easeOutExpo',
              duration: 800,
            });
          }

          // Animate each stat card with staggered timing
          const validStatRefs = statRefs.current.filter(Boolean);
          if (validStatRefs.length > 0) {
            animate(validStatRefs, {
              opacity: [0, 1],
              translateY: [50, 0],
              scale: [0.9, 1],
              easing: 'easeOutExpo',
              duration: 1200,
              delay: stagger(200),
            });
          }

          // Animate each percentage with counting
          impactData.forEach((item, index) => {
            const percentageEl = percentageRefs.current[index];
            if (percentageEl) {
              // Starting at 0
              const startValue = 0;
              const obj = { value: startValue };

              // Animate the percentage number
              animate(obj, {
                value: item.percentage,
                duration: 2000,
                easing: 'easeOutCubic',
                delay: 300 + index * 200,
                update(anim: any) {
                  const value = Math.round(obj.value);
                  percentageEl.textContent = `${value}%`;
                },
              });

              // Animate the circle stroke
              if (progressRefs.current[index]) {
                const circlePath = progressRefs.current[index];
                if (circlePath) {
                  animate(circlePath, {
                    strokeDashoffset: [
                      339.292,
                      339.292 * (1 - item.percentage / 100),
                    ],
                    easing: 'easeOutCubic',
                    duration: 2000,
                    delay: 300 + index * 200,
                  });
                }
              }
            }
          });
        }
      },
      { threshold: 0.2 },
    );

    // Store reference to current value to use in cleanup function
    const currentSectionRef = sectionRef.current;

    if (currentSectionRef) {
      observer.observe(currentSectionRef);
    }

    return () => {
      if (currentSectionRef) {
        observer.unobserve(currentSectionRef);
      }
    };
  }, [impactData]); // Add impactData as a dependency

  // Helper function to determine stroke color based on index
  const getStrokeColor = (index: number): string => {
    if (index === 0) return 'var(--spotify-green)';
    if (index === 1) return 'var(--spotify-blue)';
    return 'var(--spotify-purple)';
  };

  // Handle mouse enter animation
  const handleMouseEnter = (index: number) => {
    setActiveIndex(index);

    // Animate the progress ring on hover
    if (progressRefs.current[index]) {
      animate(progressRefs.current[index], {
        scale: 1.05,
        duration: 300,
        easing: 'easeOutElastic(1, .8)',
      });
    }

    // Animate the percentage text on hover
    if (percentageRefs.current[index]) {
      animate(percentageRefs.current[index], {
        scale: 1.2,
        duration: 300,
        easing: 'easeOutElastic(1, .8)',
      });
    }
  };

  // Handle mouse leave animation
  const handleMouseLeave = (index: number) => {
    setActiveIndex(null);

    // Animate back to normal
    const targets = [
      progressRefs.current[index],
      percentageRefs.current[index],
    ].filter(Boolean);

    if (targets.length > 0) {
      animate(targets, {
        scale: 1,
        duration: 500,
        easing: 'easeOutElastic(1, .5)',
      });
    }
  };

  return (
    <section className="impact-section" ref={sectionRef} style={{ opacity: 0 }}>
      <div className="section-header" ref={headerRef}>
        <h2>Our Impact</h2>
        <div className="spotify-now-playing">
          <span className="pulse" />
          <span>Making a difference</span>
        </div>
      </div>

      <div className="impact-stats">
        {impactData.map((item, index) => (
          <div
            key={item.id}
            className="impact-stat"
            ref={(el) => {
              statRefs.current[index] = el;
            }}
            style={{ opacity: 0 }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
          >
            <div className="progress-ring">
              <svg viewBox="0 0 120 120">
                <circle
                  className="progress-ring-circle-bg"
                  cx="60"
                  cy="60"
                  r="54"
                  strokeWidth="8"
                />
                <circle
                  className="progress-ring-circle"
                  cx="60"
                  cy="60"
                  r="54"
                  strokeWidth="8"
                  strokeDasharray="339.292"
                  strokeDashoffset={339.292} // Start at 0% progress
                  style={{
                    stroke: getStrokeColor(index),
                  }}
                  ref={(el) => {
                    progressRefs.current[index] = el;
                  }}
                />
              </svg>
              <h3
                ref={(el) => {
                  percentageRefs.current[index] = el;
                }}
              >
                0%
              </h3>
            </div>
            <p>{item.description}</p>
            <div
              className="stat-highlight"
              style={{
                opacity: activeIndex === index ? 1 : 0,
                transform: `scaleX(${activeIndex === index ? 1 : 0})`,
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default ImpactSection;
