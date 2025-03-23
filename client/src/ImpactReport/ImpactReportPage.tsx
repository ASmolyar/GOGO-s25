import React from 'react';
import './ImpactReportStructure.css';

function ImpactReportPage() {
  return (
    <div className="impact-report">
      {/* Hero Section */}
      <section className="hero-section">
        <h1>IMPACT REPORT 2024</h1>
        <h2>Guitars Over Guns</h2>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <h2>Our Mission</h2>
        <p>
          Empowering youth through music, art and mentorship. Since 2008, we
          have served nearly 12,000 students through arts education and
          mentorship with professional musicians.
        </p>
        <div className="stats-container">
          <div className="stat-item">
            <h3>1622</h3>
            <p>Students</p>
          </div>
          <div className="stat-item">
            <h3>105</h3>
            <p>Mentors</p>
          </div>
          <div className="stat-item">
            <h3>59</h3>
            <p>School & Community Sites</p>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="impact-section">
        <h2>Our Impact</h2>
        <div className="impact-stats">
          <div className="impact-stat">
            <h3>90%</h3>
            <p>of students say their mentor can be counted on for help</p>
          </div>
          <div className="impact-stat">
            <h3>87%</h3>
            <p>of students felt encouraged to work through challenges</p>
          </div>
          <div className="impact-stat">
            <h3>85%</h3>
            <p>of students showed measurable growth</p>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="programs-section">
        <h2>Our Programs</h2>
        <div className="program-list">
          <div className="program-item">
            <h3>Music Education</h3>
            <p>Guitar, Bass, Keys, Drums, Production, and more</p>
          </div>
          <div className="program-item">
            <h3>Mentorship</h3>
            <p>One-on-one guidance from professional musicians</p>
          </div>
          <div className="program-item">
            <h3>Mental Health Support</h3>
            <p>M-Power wellness program and counseling services</p>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="locations-section">
        <h2>Where We Work</h2>
        <div className="locations-grid">
          <div className="location">Miami (Since 2008)</div>
          <div className="location">Chicago (Since 2014)</div>
          <div className="location">Los Angeles (Since 2021)</div>
          <div className="location">New York (Since 2024)</div>
        </div>
      </section>
    </div>
  );
}

export default ImpactReportPage;
