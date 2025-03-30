import React, { useEffect, useState } from 'react';

const ImpactSection = () => {
  const [inView, setInView] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.querySelector('.impact-section');
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  const impactData = [
    { percentage: 90, description: "of students say their mentor can be counted on for help" },
    { percentage: 87, description: "of students felt encouraged to work through challenges" },
    { percentage: 85, description: "of students showed measurable growth" }
  ];

  return (
    <section className="impact-section">
      <div className="section-header">
        <h2>Our Impact</h2>
        <div className="spotify-now-playing">
          <span className="pulse"></span>
          <span>Making a difference</span>
        </div>
      </div>
      
      <div className="impact-stats">
        {impactData.map((item, index) => (
          <div 
            key={index} 
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
                  strokeDashoffset={339.292 * (1 - (inView ? item.percentage / 100 : 0))}
                  style={{ 
                    transition: `stroke-dashoffset 1.5s ease ${index * 0.3}s`,
                    stroke: index === 0 
                      ? 'var(--spotify-green)' 
                      : index === 1 
                        ? 'var(--spotify-blue)' 
                        : 'var(--spotify-purple)'
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
                transform: `scaleX(${activeIndex === index ? 1 : 0})`
              }}
            ></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ImpactSection; 