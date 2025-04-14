import React, { useState, useEffect } from 'react';
import gogoWideLogo from '../../assets/GOGO_LOGO_WIDE_WH.png';

function Header(): JSX.Element {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNavItemClick = (index: number) => {
    // Close the menu
    setMenuOpen(false);

    // Scroll to the corresponding section
    let targetSection;
    switch (index) {
      case 0:
        // Scroll to top/hero section
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      case 1:
        targetSection = document.querySelector('.mission-section');
        break;
      case 2:
        targetSection = document.querySelector('.impact-section');
        break;
      case 3:
        targetSection = document.querySelector('.programs-section');
        break;
      case 4:
        targetSection = document.querySelector('.locations-section');
        break;
      case 5:
        // Scroll to footer for "Contact"
        targetSection = document.querySelector('.spotify-footer');
        break;
      default:
        targetSection = null;
    }

    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <header className={`spotify-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-left">
          <button
            type="button"
            className={`menu-button ${menuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <div className="pause-icon" />
          </button>
          <div className="logo-container">
            <div className="header-brand">
              <img 
                src={gogoWideLogo} 
                alt="GOGO Logo" 
                style={{ 
                  height: '60px',
                  width: '180px',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }} 
              />
            </div>
          </div>
        </div>

        <div className="header-center">
          <h2 className="header-title">Impact Report</h2>
        </div>

        <div className="header-right">
          <button
            type="button"
            className="spotify-icon-button heart-button"
            aria-label="Like"
          >
            <svg viewBox="0 0 16 16" width="16" height="16">
              <path d="M8 3.266C7.156 2.531 6.125 2 5 2 2.797 2 1 3.797 1 6c0 3.75 7 8 7 8s7-4.25 7-8c0-2.203-1.797-4-4-4-1.125 0-2.156.531-3 1.266z" />
            </svg>
          </button>
        </div>
      </header>

      <div className={`side-nav ${menuOpen ? 'open' : ''}`}>
        <nav className="nav-content">
          <div className="nav-section">
            <div
              className="nav-item active"
              onClick={() => handleNavItemClick(0)}
              onKeyDown={(e) => e.key === 'Enter' && handleNavItemClick(0)}
              role="button"
              tabIndex={0}
            >
              <div className="nav-icon">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v6H20V7.577l-7.5-4.33zm-2-1.732a3 3 0 0 1 3 0l7.5 4.33a2 2 0 0 1 1 1.732V21a1 1 0 0 1-1 1h-6.5a1 1 0 0 1-1-1v-6h-3v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.577a2 2 0 0 1 1-1.732l7.5-4.33z" />
                </svg>
              </div>
              <span>Home</span>
            </div>
            <div
              className="nav-item"
              onClick={() => handleNavItemClick(1)}
              onKeyDown={(e) => e.key === 'Enter' && handleNavItemClick(1)}
              role="button"
              tabIndex={0}
            >
              <div className="nav-icon">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path d="M10.533 1.27893C10.751 0.791759 11.2239 0.5 11.7553 0.5H12.2447C12.7761 0.5 13.249 0.791759 13.467 1.27893L15.071 5.00197L19.1818 5.38868C19.7084 5.43415 20.1563 5.79977 20.3231 6.31043C20.49 6.8211 20.3328 7.38893 19.9287 7.75279L16.8581 10.5855L17.594 14.6512C17.6849 15.1726 17.4565 15.7009 17.0262 15.9971C16.5959 16.2933 16.0359 16.3011 15.5981 16.0178L12 14.0784L8.40191 16.0178C7.96407 16.3011 7.40414 16.2933 6.97385 15.9971C6.54356 15.7009 6.3151 15.1726 6.40601 14.6512L7.14185 10.5855L4.07127 7.75279C3.66724 7.38893 3.51004 6.8211 3.67686 6.31043C3.84368 5.79977 4.2916 5.43415 4.81823 5.38868L8.92898 5.00197L10.533 1.27893Z" />
                </svg>
              </div>
              <span>Our Mission</span>
            </div>
            <div
              className="nav-item"
              onClick={() => handleNavItemClick(3)}
              onKeyDown={(e) => e.key === 'Enter' && handleNavItemClick(3)}
              role="button"
              tabIndex={0}
            >
              <div className="nav-icon">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zm0 2c4.971 0 9 4.029 9 9s-4.029 9-9 9-9-4.029-9-9 4.029-9 9-9zm-1 11.5H9v2h2v-2zm1.976-7.219c-.208-.273-.48-.487-.817-.642-.336-.155-.703-.232-1.1-.232-.391 0-.748.068-1.073.204a2.75 2.75 0 00-.833.54c-.233.23-.412.49-.538.777-.125.287-.189.585-.19.895h2c0-.27.073-.493.219-.669a.725.725 0 01.603-.293c.253 0 .453.087.603.26.15.173.226.352.226.536 0 .184-.053.337-.16.46a1.542 1.542 0 01-.369.334 5.97 5.97 0 01-.457.26 6.256 6.256 0 00-.418.232c-.235.141-.43.306-.587.495-.156.19-.278.393-.366.611-.088.218-.141.458-.16.72v.766h2v-.525a.98.98 0 01.112-.436c.075-.13.17-.241.286-.334.116-.092.24-.171.375-.236.135-.065.26-.132.375-.2.115-.069.219-.148.312-.237.92.088.179.186.261.292.082.107.15.226.203.356.053.13.092.275.118.435.026.16.039.335.039.524 0 .405-.086.762-.258 1.071a2.388 2.388 0 01-.684.778c-.285.206-.615.362-.991.469-.377.107-.771.16-1.18.16-.408 0-.802-.054-1.179-.16a3.011 3.011 0 01-.993-.468 2.314 2.314 0 01-.683-.778c-.173-.31-.26-.667-.26-1.072H7c0 .68.158 1.296.475 1.845.316.549.738.995 1.264 1.338.527.343 1.129.597 1.806.762.678.165 1.384.248 2.12.248.735 0 1.437-.075 2.106-.226.67-.15 1.267-.39 1.792-.718.525-.328.945-.75 1.26-1.266.315-.516.473-1.14.473-1.872 0-.42-.085-.8-.254-1.14-.17-.34-.397-.627-.683-.862z" />
                </svg>
              </div>
              <span>Programs</span>
            </div>
            <div
              className="nav-item"
              onClick={() => handleNavItemClick(2)}
              onKeyDown={(e) => e.key === 'Enter' && handleNavItemClick(2)}
              role="button"
              tabIndex={0}
            >
              <div className="nav-icon">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path d="M15 4v12.167a3.5 3.5 0 11-3.5-3.5H13V4h2zm-2 10.667h-1.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
                </svg>
              </div>
              <span>Impact</span>
            </div>
            <div
              className="nav-item"
              onClick={() => handleNavItemClick(4)}
              onKeyDown={(e) => e.key === 'Enter' && handleNavItemClick(4)}
              role="button"
              tabIndex={0}
            >
              <div className="nav-icon">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path d="M12 3a9 9 0 100 18 9 9 0 000-18zM1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12z" />
                  <path d="M12 6.05a1 1 0 011 1v4.566l3.7 2.135a1 1 0 11-1 1.732l-4.2-2.424A1 1 0 0111 12.05V7.05a1 1 0 011-1z" />
                </svg>
              </div>
              <span>Locations</span>
            </div>
          </div>

          <div className="playlist-section">
            <h3>Playlists</h3>
            <div
              className="nav-item"
              onClick={() => setMenuOpen(false)}
              onKeyDown={(e) => e.key === 'Enter' && setMenuOpen(false)}
              role="button"
              tabIndex={0}
            >
              <div className="nav-icon playlist-icon">
                <div className="playlist-icon-inner">
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path d="M15.25 8a.75.75 0 01-.75.75H8.75v5.75a.75.75 0 01-1.5 0V8.75H1.5a.75.75 0 010-1.5h5.75V1.5a.75.75 0 011.5 0v5.75h5.75a.75.75 0 01.75.75z" />
                  </svg>
                </div>
              </div>
              <span>Create a playlist</span>
            </div>
            <div
              className="nav-item"
              onClick={() => setMenuOpen(false)}
              onKeyDown={(e) => e.key === 'Enter' && setMenuOpen(false)}
              role="button"
              tabIndex={0}
            >
              <div className="playlist-thumb">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path d="M4.5 12.75l6 5.25V7.5l-6 5.25z" />
                </svg>
              </div>
              <span>Student Music</span>
            </div>
            <div
              className="nav-item"
              onClick={() => setMenuOpen(false)}
              onKeyDown={(e) => e.key === 'Enter' && setMenuOpen(false)}
              role="button"
              tabIndex={0}
            >
              <div className="playlist-thumb special">
                <span>♫</span>
              </div>
              <span>Mentor Performances</span>
            </div>
          </div>

          <div className="playlist-tracks">
            <h4
              style={{
                margin: '20px 0 12px',
                fontSize: '14px',
                color: 'var(--spotify-light-gray)',
              }}
            >
              Student Tracks
            </h4>

            <div
              className="playlist-track"
              onClick={() => setMenuOpen(false)}
              onKeyDown={(e) => e.key === 'Enter' && setMenuOpen(false)}
              role="button"
              tabIndex={0}
            >
              <div className="track-number">1</div>
              <div className="track-details">
                <div className="track-title">Urban Rhythms</div>
                <div className="track-artist">Chicago Youth Ensemble</div>
              </div>
              <div className="play-icon">
                <svg viewBox="0 0 24 24" width="12" height="12">
                  <path d="M8 5.14v14l11-7-11-7z" />
                </svg>
              </div>
            </div>

            <div
              className="playlist-track"
              onClick={() => setMenuOpen(false)}
              onKeyDown={(e) => e.key === 'Enter' && setMenuOpen(false)}
              role="button"
              tabIndex={0}
            >
              <div className="track-number">2</div>
              <div className="track-details">
                <div className="track-title">Rise Up</div>
                <div className="track-artist">Miami Beat Makers</div>
              </div>
              <div className="play-icon">
                <svg viewBox="0 0 24 24" width="12" height="12">
                  <path d="M8 5.14v14l11-7-11-7z" />
                </svg>
              </div>
            </div>

            <div
              className="playlist-track"
              onClick={() => setMenuOpen(false)}
              onKeyDown={(e) => e.key === 'Enter' && setMenuOpen(false)}
              role="button"
              tabIndex={0}
            >
              <div className="track-number">3</div>
              <div className="track-details">
                <div className="track-title">Dreams and Determination</div>
                <div className="track-artist">Youth Voice Collective</div>
              </div>
              <div className="play-icon">
                <svg viewBox="0 0 24 24" width="12" height="12">
                  <path d="M8 5.14v14l11-7-11-7z" />
                </svg>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Playback Controls Similar to Spotify */}
      <div className="now-playing-bar">
        <div className="now-playing-left">
          <div className="now-playing-cover">♫</div>
          <div className="now-playing-info">
            <div className="now-playing-title">Impact Story</div>
            <div className="now-playing-artist">Guitars Over Guns</div>
          </div>
        </div>

        <div className="now-playing-center">
          <div className="playback-controls">
            <button
              type="button"
              className="spotify-icon-button"
              aria-label="Shuffle"
            >
              <svg viewBox="0 0 16 16" width="16" height="16">
                <path d="M13.151.922a.75.75 0 10-1.06 1.06L13.109 3H11.16a3.75 3.75 0 00-2.873 1.34l-6.173 7.356A2.25 2.25 0 01.39 12.5H0V14h.391a3.75 3.75 0 002.873-1.34l6.173-7.356a2.25 2.25 0 011.724-.804h1.947l-1.017 1.018a.75.75 0 001.06 1.06L15.98 3.75 13.15.922zM.391 3.5H0V2h.391c1.109 0 2.16.49 2.873 1.34L4.89 5.277l-.979 1.167-1.796-2.14A2.25 2.25 0 00.39 3.5z" />
              </svg>
            </button>
            <button
              type="button"
              className="spotify-icon-button"
              aria-label="Previous"
            >
              <svg viewBox="0 0 16 16" width="16" height="16">
                <path d="M3.3 1a.7.7 0 01.7.7v5.15l9.95-5.744a.7.7 0 011.05.606v12.575a.7.7 0 01-1.05.607L4 9.149V14.3a.7.7 0 01-.7.7H1.7a.7.7 0 01-.7-.7V1.7a.7.7 0 01.7-.7h1.6z" />
              </svg>
            </button>
            <button
              type="button"
              className="playback-button play-pause"
              aria-label="Play"
            >
              <svg viewBox="0 0 16 16" width="16" height="16">
                <path d="M3 1.713a.7.7 0 011.05-.607l10.89 6.288a.7.7 0 010 1.212L4.05 14.894A.7.7 0 013 14.288V1.713z" />
              </svg>
            </button>
            <button
              type="button"
              className="spotify-icon-button"
              aria-label="Next"
            >
              <svg viewBox="0 0 16 16" width="16" height="16">
                <path d="M12.7 1a.7.7 0 00-.7.7v5.15L2.05 1.107A.7.7 0 001 1.712v12.575a.7.7 0 001.05.607L12 9.149V14.3a.7.7 0 00.7.7h1.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7h-1.6z" />
              </svg>
            </button>
            <button
              type="button"
              className="spotify-icon-button"
              aria-label="Repeat"
            >
              <svg viewBox="0 0 16 16" width="16" height="16">
                <path d="M0 4.75A3.75 3.75 0 013.75 1h8.5A3.75 3.75 0 0116 4.75v5a3.75 3.75 0 01-3.75 3.75H9.81l1.018 1.018a.75.75 0 11-1.06 1.06L6.939 12.75l2.829-2.828a.75.75 0 111.06 1.06L9.811 12h2.439a2.25 2.25 0 002.25-2.25v-5a2.25 2.25 0 00-2.25-2.25h-8.5A2.25 2.25 0 001.5 4.75v5A2.25 2.25 0 003.75 12H5v1.5H3.75A3.75 3.75 0 010 9.75v-5z" />
              </svg>
            </button>
          </div>

          <div className="playback-bar">
            <div className="playback-time">0:00</div>
            <div className="progress-bar">
              <div className="progress-bar-bg" />
              <div className="progress-bar-fg" />
            </div>
            <div className="playback-time">3:45</div>
          </div>
        </div>

        <div className="now-playing-right">
          <div
            className="volume-control"
            onClick={(e) => {
              // This would handle volume adjustment based on click position
              // For now it's just a demonstration UI element
              const container = e.currentTarget.querySelector(
                '.progress-bar-container',
              );
              if (container) {
                const rect = container.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const percentage = Math.min(
                  Math.max(clickX / rect.width, 0),
                  1,
                );
                console.log(
                  `Volume would be set to: ${Math.round(percentage * 100)}%`,
                );
                // In a real implementation, this would set the volume
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                // Toggle mute in a real implementation
                console.log('Volume would be toggled (mute/unmute)');
              } else if (e.key === 'ArrowRight') {
                console.log('Volume would increase');
              } else if (e.key === 'ArrowLeft') {
                console.log('Volume would decrease');
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Volume control"
          >
            <div className="volume-icon">
              <svg viewBox="0 0 16 16" width="16" height="16">
                <path d="M9.741.85a.75.75 0 01.375.65v13a.75.75 0 01-1.125.65l-6.925-4a3.642 3.642 0 01-1.33-4.967 3.639 3.639 0 011.33-1.332l6.925-4a.75.75 0 01.75 0zm-6.924 5.3a2.139 2.139 0 000 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 010 4.88z" />
                <path d="M11.5 13.614a5.752 5.752 0 000-11.228v1.55a4.252 4.252 0 010 8.127v1.55z" />
              </svg>
            </div>
            <div className="progress-bar-container" style={{ width: '100px' }}>
              <div className="progress-bar-fill" style={{ width: '70%' }} />
              <div className="progress-bar-handle" style={{ left: '70%' }} />
            </div>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div
          className="overlay"
          onClick={toggleMenu}
          onKeyDown={(e) => e.key === 'Enter' && toggleMenu()}
          role="button"
          tabIndex={0}
          aria-label="Close menu"
        />
      )}
    </>
  );
}

export default Header;
