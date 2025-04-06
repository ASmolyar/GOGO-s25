import React, { useEffect, useState } from 'react';

function ImpactSection(): JSX.Element {
  const [inView, setInView] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.2 },
    );

    const section = document.querySelector('.impact-section');
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  const impactData = [
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
  ];

  // Helper function to determine stroke color based on index
  const getStrokeColor = (index: number): string => {
    if (index === 0) return 'var(--spotify-green)';
    if (index === 1) return 'var(--spotify-blue)';
    return 'var(--spotify-purple)';
  };

  return (
    <section className="impact-section">
      <div className="section-header">
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
            className={`impact-stat ${inView ? 'slide-up' : ''}`}
            style={{ animationDelay: `${index * 0.2}s` }}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
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
                  strokeDashoffset={
                    339.292 * (1 - (inView ? item.percentage / 100 : 0))
                  }
                  style={{
                    transition: `stroke-dashoffset 1.5s ease ${index * 0.3}s`,
                    stroke: getStrokeColor(index),
                  }}
                />
              </svg>
              <h3>{item.percentage}%</h3>
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
