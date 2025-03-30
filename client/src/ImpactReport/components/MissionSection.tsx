import React, { useEffect, useState } from 'react';

const MissionSection = () => {
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

    const section = document.querySelector('.mission-section');
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  return (
    <section className={`mission-section ${inView ? 'fade-in' : ''}`}>
      <div className="section-header">
        <h2>Our Mission</h2>
        <div className="spotify-badge">
          <div className="badge-icon">♫</div>
          <span>Since 2008</span>
        </div>
      </div>
      
      <p className="mission-text">
        Empowering youth through music, art and mentorship. Since 2008, we
        have served nearly 12,000 students through arts education and
        mentorship with professional musicians.
      </p>
      
      <div className="stats-container">
        {[
          { number: "1622", label: "Students", delay: 0 },
          { number: "105", label: "Mentors", delay: 0.2 },
          { number: "59", label: "School & Community Sites", delay: 0.4 }
        ].map((stat, index) => (
          <div 
            key={index} 
            className={`stat-item ${inView ? 'slide-up' : ''}`} 
            style={{ 
              animationDelay: `${stat.delay}s`,
              transitionDelay: `${stat.delay}s`
            }}
          >
            <div className="stat-content">
              <h3>{stat.number}</h3>
              <p>{stat.label}</p>
            </div>
            <div className="equalizer-icon">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i} 
                  className="equalizer-bar"
                  style={{ 
                    animationDuration: `${0.8 + (i * 0.2)}s`,
                    height: `${Math.random() * 60 + 40}%` 
                  }}
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="listen-now">
        <div className="listen-icon">▶</div>
        <span>Listen to our students' music</span>
      </div>
    </section>
  );
};

export default MissionSection; 