import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
// Import the vanilla JavaScript Leaflet implementation
import PlainLeafletMap from './map/PlainLeafletMap';

// Styled component for the map container to fit the GOGO aesthetic
const MapContainer = styled.div`
  margin: 50px auto;
  max-width: 1200px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  background: var(--spotify-dark-gray, #172a3a);
  padding: 20px;
  position: relative;
  z-index: 10;
  min-height: 500px;

  h3 {
    font-size: 24px;
    margin-bottom: 20px;
    color: var(--spotify-blue, #1946f5);
    font-weight: 700;
    font-family: var(--font-main);
  }
`;

function LocationsSection(): JSX.Element {
  const [inView, setInView] = useState(false);
  const [activeLocation, setActiveLocation] = useState<number | null>(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          // Add a delay before showing the map to ensure DOM is fully loaded
          setTimeout(() => setShowMap(true), 500);
        }
      },
      { threshold: 0.2 },
    );

    const section = document.querySelector('.locations-section');
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  const locationData = [
    {
      id: 1,
      name: 'Miami',
      year: 2008,
      image: '🌴',
      color: 'var(--spotify-green, #8DDDA6)',
    },
    {
      id: 2,
      name: 'Chicago',
      year: 2014,
      image: '🏙️',
      color: 'var(--spotify-blue, #1946F5)',
    },
    {
      id: 3,
      name: 'Los Angeles',
      year: 2021,
      image: '🌊',
      color: 'var(--spotify-purple, #68369A)',
    },
    {
      id: 4,
      name: 'New York',
      year: 2024,
      image: '🗽',
      color: 'var(--spotify-orange, #E9BB4D)',
    },
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
              transition: `transform 0.6s ease ${
                index * 0.15
              }s, opacity 0.6s ease ${index * 0.15}s`,
            }}
            onMouseEnter={() => setActiveLocation(location.id)}
            onMouseLeave={() => setActiveLocation(null)}
          >
            <div
              className="location-background"
              style={{
                backgroundColor: location.color,
                opacity: activeLocation === location.id ? 0.15 : 0.05,
              }}
            />
            <div className="location-content">
              <div className="location-image">{location.image}</div>
              <div className="location-name">{location.name}</div>
              <div className="location-year">Since {location.year}</div>

              <div
                className={`location-action ${
                  activeLocation === location.id ? 'visible' : ''
                }`}
              >
                <button type="button" className="location-button">
                  <span>Learn More</span>
                </button>
              </div>
            </div>

            <div className="location-badge">
              <div className="badge-dot" />
              <span>{index + 1}</span>
            </div>
          </div>
        ))}
      </div>

      <div
        className="spotify-map-heading"
        style={{
          textAlign: 'center',
          margin: '30px 0 10px',
          color: 'var(--spotify-blue, #1946f5)',
        }}
      >
        <h3>Interactive Map of Our Locations</h3>
      </div>

      {showMap && (
        <MapContainer
          className={inView ? 'fade-in' : ''}
          style={{ animationDelay: '0.3s' }}
        >
          <PlainLeafletMap />
        </MapContainer>
      )}
    </section>
  );
}

export default LocationsSection;
