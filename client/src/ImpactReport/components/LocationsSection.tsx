import React, { useEffect, useState } from 'react';

const LocationsSection = () => {
  const [inView, setInView] = useState(false);
  const [activeLocation, setActiveLocation] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.querySelector('.locations-section');
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  const locationData = [
    { id: 1, name: "Miami", year: 2008, image: "🌴", color: "var(--spotify-green)" },
    { id: 2, name: "Chicago", year: 2014, image: "🏙️", color: "var(--spotify-blue)" },
    { id: 3, name: "Los Angeles", year: 2021, image: "🌊", color: "var(--spotify-purple)" },
    { id: 4, name: "New York", year: 2024, image: "🗽", color: "var(--spotify-orange)" }
  ];

  return (
    <section className="locations-section">
      <div className="section-header">
        <h2>Where We Work</h2>
        <div className="spotify-devices">
          <div className="device-icon">📍</div>
          <span>4 cities and growing</span>
        </div>
      </div>
      
      <div className={`locations-grid ${inView ? 'fade-in' : ''}`}>
        {locationData.map((location, index) => (
          <div 
            key={location.id} 
            className="location"
            style={{ 
              animationDelay: `${index * 0.15}s`,
              transform: inView ? 'translateY(0)' : 'translateY(30px)',
              opacity: inView ? 1 : 0,
              transition: `transform 0.6s ease ${index * 0.15}s, opacity 0.6s ease ${index * 0.15}s`
            }}
            onMouseEnter={() => setActiveLocation(location.id)}
            onMouseLeave={() => setActiveLocation(null)}
          >
            <div 
              className="location-background" 
              style={{ 
                backgroundColor: location.color,
                opacity: activeLocation === location.id ? 0.15 : 0.05
              }}
            ></div>
            <div className="location-content">
              <div className="location-image">{location.image}</div>
              <div className="location-name">{location.name}</div>
              <div className="location-year">Since {location.year}</div>
              
              <div 
                className={`location-action ${activeLocation === location.id ? 'visible' : ''}`}
              >
                <button className="location-button">
                  <span>Learn More</span>
                </button>
              </div>
            </div>
            
            <div className="location-badge">
              <div className="badge-dot"></div>
              <span>{index + 1}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="spotify-map-link">
        <svg viewBox="0 0 16 16" width="16" height="16">
          <path d="M8 0C3.58 0 0 3.58 0 8C0 12.41 3.58 16 8 16C12.41 16 16 12.41 16 8C16 3.58 12.41 0 8 0ZM7.5 11.5L3.5 7.5L4.91 6.09L7.5 8.67L11.09 5.09L12.5 6.5L7.5 11.5Z"></path>
        </svg>
        <span>View our full map of impact locations</span>
      </div>
    </section>
  );
};

export default LocationsSection; 