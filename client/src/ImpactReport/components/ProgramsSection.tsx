import React, { useEffect, useState } from 'react';

function ProgramsSection(): JSX.Element {
  const [inView, setInView] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.2 },
    );

    const section = document.querySelector('.programs-section');
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  const programData = [
    {
      id: 1,
      title: 'Music Education',
      description: 'Guitar, Bass, Keys, Drums, Production, and more',
      icon: '🎸',
      color: 'var(--spotify-green)',
    },
    {
      id: 2,
      title: 'Mentorship',
      description: 'One-on-one guidance from professional musicians',
      icon: '🎯',
      color: 'var(--spotify-blue)',
    },
    {
      id: 3,
      title: 'Mental Health Support',
      description: 'M-Power wellness program and counseling services',
      icon: '🧠',
      color: 'var(--spotify-purple)',
    },
  ];

  return (
    <section className="programs-section">
      <div className="section-header">
        <h2>Our Programs</h2>
        <div className="playlist-filter">
          <div className="filter-item active">All</div>
          <div className="filter-item">Music</div>
          <div className="filter-item">Mentorship</div>
          <div className="filter-item">Wellness</div>
        </div>
      </div>

      <div className="program-list">
        {programData.map((program, index) => (
          <div
            key={program.id}
            className={`program-item ${inView ? 'slide-up' : ''}`}
            style={{
              animationDelay: `${index * 0.2}s`,
              borderColor:
                hoveredItem === program.id ? program.color : 'transparent',
            }}
            onMouseEnter={() => setHoveredItem(program.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div
              className="program-icon"
              style={{ backgroundColor: program.color }}
            >
              <span>{program.icon}</span>
            </div>
            <h3>{program.title}</h3>
            <p>{program.description}</p>
            <div
              className={`program-play-button ${
                hoveredItem === program.id ? 'visible' : ''
              }`}
            >
              <span>▶</span>
            </div>
            <div className="program-number">{`0${program.id}`}</div>
          </div>
        ))}
      </div>

      <div className="spotify-like-footer">
        <div className="footer-text">
          <span>More than</span> 8,500 hours{' '}
          <span>of programming per year</span>
        </div>
        <button type="button" className="spotify-button outlined">
          <span>View All Programs</span>
        </button>
      </div>
    </section>
  );
}

export default ProgramsSection;
