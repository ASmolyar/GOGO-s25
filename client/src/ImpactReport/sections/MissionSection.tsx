import React, { useEffect, useState } from 'react';
import MissionStatement from '../../components/MissionStatement';
import photo1 from '../../assets/missionPhotos/Photo1.jpg';
import photo2 from '../../assets/missionPhotos/Photo2.jpg';
import photo3 from '../../assets/missionPhotos/Photo3.jpg';
import photo4 from '../../assets/missionPhotos/Photo4.jpg';
import photo5 from '../../assets/missionPhotos/Photo5.jpg';
import photo6 from '../../assets/missionPhotos/Photo6.jpg';
import photo7 from '../../assets/missionPhotos/Photo7.jpg';
import photo8 from '../../assets/missionPhotos/Photo8.jpg';
import photo9 from '../../assets/missionPhotos/Photo9.jpg';
import photo10 from '../../assets/missionPhotos/Photo10.jpg';
import photo11 from '../../assets/missionPhotos/Photo11.jpg';
import photo12 from '../../assets/missionPhotos/Photo12.jpg';
import photo13 from '../../assets/missionPhotos/Photo13.jpg';
import photo14 from '../../assets/missionPhotos/Photo14.jpg';

function MissionSection(): JSX.Element {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.2 },
    );

    const section = document.querySelector('.mission-section');
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  // Define the stats data outside the JSX for better organization
  const statsData = [
    { id: 'students', number: '1622', label: 'Students', delay: 0 },
    { id: 'mentors', number: '105', label: 'Mentors', delay: 0.2 },
    {
      id: 'sites',
      number: '59',
      label: 'School & Community Sites',
      delay: 0.4,
    },
  ];

  return (
    <section className={`mission-section ${inView ? 'fade-in' : ''}`}>
      <div className="section-header">
        <h2>Our Mission</h2>
        <div className="spotify-badge">
          <div className="badge-icon">♫</div>
          <span>Since 2008</span>
        </div>
      </div>

      <MissionStatement
        topImages={[photo1, photo2, photo3, photo4, photo5, photo6, photo7]}
        bottomImages={[
          photo8,
          photo9,
          photo10,
          photo11,
          photo12,
          photo13,
          photo14,
        ]}
        statement="Our mission is to empower youth through music, art and mentorship. Guitars Over Guns offers students from our most vulnerable communities a combination of arts education and mentorship with professional musicians to help them overcome hardship, find their voice and reach their potential as tomorrow's leaders. Since 2008, we have served nearly 12,000 students."
      />

      <div className="stats-container">
        {statsData.map((stat) => (
          <div
            key={stat.id}
            className={`stat-item ${inView ? 'slide-up' : ''}`}
            style={{
              animationDelay: `${stat.delay}s`,
              transitionDelay: `${stat.delay}s`,
            }}
          >
            <div className="stat-content">
              <h3>{stat.number}</h3>
              <p>{stat.label}</p>
            </div>
            <div className="equalizer-icon">
              {['bass', 'mid-low', 'mid-high', 'treble'].map((freqRange, i) => (
                <div
                  key={`${stat.id}-${freqRange}`}
                  className="equalizer-bar"
                  style={{
                    animationDuration: `${0.8 + i * 0.2}s`,
                    height: `${Math.random() * 60 + 40}%`,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="listen-now">
        <div className="listen-icon">▶</div>
        <span>Listen to our students&apos; music</span>
      </div>
    </section>
  );
}

export default MissionSection;
