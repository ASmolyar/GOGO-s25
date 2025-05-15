import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { animate, stagger } from 'animejs';
import COLORS from '../../assets/colors';

// Animations
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const soundwave = keyframes`
  0% { height: 3px; }
  50% { height: 20px; }
  100% { height: 3px; }
`;

// Styled Components
const FutureVisionWrapper = styled.section`
  padding: 7rem 0;
  background: linear-gradient(135deg, #121212 0%, #1e1e1e 50%, #121212 100%);
  position: relative;
  overflow: hidden;
`;

const BackgroundDecoration = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background: radial-gradient(
      circle at 20% 20%,
      rgba(25, 70, 245, 0.08) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 80%,
      rgba(190, 43, 147, 0.08) 0%,
      transparent 50%
    );
`;

const SoundWaveContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 3px;
  padding: 0 20px;
  opacity: 0.4;
  z-index: 0;
`;

const SoundWaveLine = styled.div<{ delay: number }>`
  width: 3px;
  background: linear-gradient(to top, ${COLORS.gogo_blue}, ${COLORS.gogo_teal});
  border-radius: 3px;
  height: 3px;
  animation: ${soundwave} ${(props) => 0.8 + props.delay * 0.2}s ease-in-out
    infinite;
  animation-delay: ${(props) => props.delay * 0.1}s;
`;

const MainContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 5rem;
  position: relative;
`;

const GlowingCircle = styled.div<{
  color: string;
  size: string;
  top: string;
  left: string;
  animationDuration: string;
}>`
  position: absolute;
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  border-radius: 50%;
  background: ${(props) => props.color};
  opacity: 0.3;
  filter: blur(40px);
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  z-index: -1;
  animation: ${pulse} ${(props) => props.animationDuration} infinite ease-in-out;
`;

const SectionTitle = styled.h2`
  font-size: 4rem;
  font-weight: 900;
  background: linear-gradient(
    to right,
    ${COLORS.gogo_green},
    ${COLORS.gogo_blue},
    ${COLORS.gogo_purple}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
  letter-spacing: -0.02em;
`;

const SectionSubtitle = styled.p`
  font-size: 1.3rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  max-width: 700px;
  margin: 0 auto;
`;

const PlaylistContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5rem;
  margin-bottom: 5rem;
`;

const PlaylistRow = styled.div<{ isEven: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.isEven ? 'row-reverse' : 'row')};
  gap: 4rem;
  align-items: center;
  position: relative;

  @media (max-width: 992px) {
    flex-direction: column;
    text-align: center;
    gap: 3rem;
  }
`;

const VinylContainer = styled.div`
  position: relative;
  flex-basis: 35%;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const VinylRecord = styled.div<{ color: string; isPlaying: boolean }>`
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: ${(props) =>
    `radial-gradient(circle at center, #333 20%, ${props.color}77 60%, #333 62%, #222 100%)`};
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: ${spin} 20s linear infinite;
  animation-play-state: ${(props) => (props.isPlaying ? 'running' : 'paused')};
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50px;
    height: 50px;
    background: #121212;
    border-radius: 50%;
    border: 3px solid #333;
    z-index: 2;
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
    height: 200px;
    background: transparent;
    border-radius: 50%;
    border: 2px solid #555;
    z-index: 2;
  }
`;

const AlbumCover = styled.div<{ image: string }>`
  width: 150px;
  height: 150px;
  background-image: url(${(props) => props.image});
  background-size: cover;
  background-position: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  z-index: 3;
`;

const AlbumShadow = styled.div`
  position: absolute;
  width: 320px;
  height: 60px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  filter: blur(15px);
  bottom: -40px;
  z-index: 0;
`;

const PlaybackControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 2rem;
  justify-content: center;
`;

const PlayButton = styled.button<{ isPlaying: boolean }>`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${COLORS.gogo_blue};
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(25, 70, 245, 0.3);

  &:hover {
    transform: scale(1.1);
    background: #2953fa;
  }
`;

const NextPrevButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
`;

const PlaylistContent = styled.div`
  flex-grow: 1;
`;

const PlaylistTag = styled.div<{ color: string }>`
  display: inline-block;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  background: ${(props) => `${props.color}22`};
  color: ${(props) => props.color};
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const PlaylistTitle = styled.h3<{ color: string }>`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: white;
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 4px;
    background: ${(props) => props.color};
    border-radius: 2px;
  }

  @media (max-width: 992px) {
    &::after {
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;

const PlaylistDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
  max-width: 550px;

  @media (max-width: 992px) {
    margin: 0 auto 2rem;
  }
`;

const TrackList = styled.div`
  margin-top: 2rem;
`;

const Track = styled.div<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  background: ${(props) =>
    props.isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  border-radius: 8px;
  margin-bottom: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateX(5px);
  }
`;

const TrackNumber = styled.div`
  width: 24px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  margin-right: 1rem;
`;

const TrackTitle = styled.div<{ isActive: boolean }>`
  font-size: 1rem;
  font-weight: ${(props) => (props.isActive ? '600' : '400')};
  color: ${(props) => (props.isActive ? 'white' : 'rgba(255, 255, 255, 0.8)')};
`;

const TrackDuration = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  margin-left: auto;
`;

const PlaylistMore = styled.button`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 500px;
  padding: 0.8rem 2rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1.5rem;

  &:hover {
    border-color: white;
    background: rgba(255, 255, 255, 0.05);
    transform: scale(1.05);
  }
`;

const BottomCTA = styled.div`
  text-align: center;
  margin-top: 6rem;
  position: relative;
`;

const CTATitle = styled.h3`
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 1.5rem;
`;

const CTADescription = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  max-width: 600px;
  margin: 0 auto 2.5rem;
`;

const PlaylistButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: ${COLORS.gogo_blue};
  color: white;
  font-weight: 700;
  font-size: 1rem;
  padding: 1rem 3rem;
  border-radius: 500px;
  text-decoration: none;
  letter-spacing: 0.02em;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(25, 70, 245, 0.3);
  margin-top: 1rem;

  &:hover {
    transform: scale(1.05);
    background: #2953fa;
    box-shadow: 0 12px 25px rgba(25, 70, 245, 0.4);
  }
`;

const FloatingNotes = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
`;

const MusicalNote = styled.div<{
  size: string;
  top: string;
  left: string;
  duration: string;
  delay: string;
}>`
  position: absolute;
  font-size: ${(props) => props.size};
  color: rgba(255, 255, 255, 0.1);
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  animation: ${float} ${(props) => props.duration} ease-in-out infinite;
  animation-delay: ${(props) => props.delay};
`;

// Data for future vision "playlists"
const futurePlaylists = [
  {
    id: 1,
    title: 'National Expansion',
    tag: 'Coming 2026',
    tagColor: COLORS.gogo_blue,
    color: COLORS.gogo_blue,
    description:
      "Building on our success in Miami, Chicago, and LA, we're taking GOGO nationwide with exciting new partnerships and program locations.",
    coverImage: 'https://source.unsplash.com/random/300x300/?music,city',
    tracks: [
      { title: 'Launch in Three New Cities', duration: '2025-2026' },
      { title: '50+ New School Partnerships', duration: '2024-2026' },
      { title: '75% Growth in Program Sites', duration: '2026' },
      { title: 'Coast-to-Coast GOGO Concert Tour', duration: 'Summer 2026' },
    ],
  },
  {
    id: 2,
    title: 'Digital Studio Experience',
    tag: 'Coming 2025',
    tagColor: COLORS.gogo_purple,
    color: COLORS.gogo_purple,
    description:
      'Our new digital platform will bring professional studio experiences to every student, bridging physical distance with virtual collaboration.',
    coverImage: 'https://source.unsplash.com/random/300x300/?music,studio',
    tracks: [
      { title: 'GOGO Mobile App Launch', duration: 'Early 2025' },
      { title: 'Virtual Recording Sessions', duration: 'Mid 2025' },
      { title: 'Remote Collaboration Tools', duration: 'Q3 2025' },
      { title: 'AI-Enhanced Learning Platform', duration: 'Q4 2025' },
    ],
  },
  {
    id: 3,
    title: 'Research & Impact Amplification',
    tag: 'Starting 2024',
    tagColor: COLORS.gogo_pink,
    color: COLORS.gogo_pink,
    description:
      "We're establishing GOGO as a leading voice in arts education research and advocacy to maximize our impact on educational policy.",
    coverImage: 'https://source.unsplash.com/random/300x300/?music,research',
    tracks: [
      { title: 'Impact Study Publication', duration: 'Spring 2024' },
      { title: 'University Research Partnerships', duration: '2024-2027' },
      { title: 'Policy Advocacy Campaign', duration: 'Ongoing' },
      { title: 'Arts Education Summit Hosting', duration: 'Fall 2024' },
    ],
  },
];

// Generate soundwave lines
const generateSoundwaveLines = (count: number) => {
  const lines = [];
  for (let i = 0; i < count; i += 1) {
    const delay = i % 10;
    lines.push(
      <SoundWaveLine
        key={`soundwave-line-${i}-delay-${delay}-${Math.random()
          .toString(36)
          .substr(2, 5)}`}
        delay={delay}
      />,
    );
  }
  return lines;
};

// Generate floating music notes
const generateFloatingNotes = (count: number) => {
  const notes = ['♪', '♫', '♩', '♬', '♭', '♮', '♯'];
  const floatingNotes = [];

  for (let i = 0; i < count; i += 1) {
    const size = `${Math.random() * 2 + 1}rem`;
    const top = `${Math.random() * 100}%`;
    const left = `${Math.random() * 100}%`;
    const duration = `${Math.random() * 5 + 5}s`;
    const delay = `${Math.random() * 5}s`;
    const noteIndex = Math.floor(Math.random() * notes.length);

    floatingNotes.push(
      <MusicalNote
        key={`floating-note-${i}-${notes[noteIndex]}`}
        size={size}
        top={top}
        left={left}
        duration={duration}
        delay={delay}
      >
        {notes[noteIndex]}
      </MusicalNote>,
    );
  }

  return floatingNotes;
};

function FutureVisionSection(): JSX.Element {
  const [activePlaylist, setActivePlaylist] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const playlistRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Animate the title when section comes into view
          if (titleRef.current) {
            animate(titleRef.current, {
              opacity: [0, 1],
              translateY: [30, 0],
              duration: 800,
              easing: 'easeOutExpo',
            });
          }

          // Stagger-animate each playlist row
          const validRefs = playlistRefs.current.filter(Boolean);
          if (validRefs.length > 0) {
            animate(validRefs.filter(Boolean) as Element[], {
              opacity: [0, 1],
              translateY: [30, 0],
              duration: 800,
              delay: stagger(120),
              easing: 'easeOutExpo',
            });
          }

          // Animate goal cards with stagger effect
          const cards = sectionRef.current?.querySelectorAll('.goal-card');
          if (cards && cards.length > 0) {
            const cardElements = Array.from(cards).filter(
              (el): el is HTMLElement => el instanceof HTMLElement,
            );
            animate(cardElements, {
              opacity: [0, 1],
              translateY: [30, 0],
              scale: [0.9, 1],
              duration: 800,
              delay: stagger(150, { start: 300 }),
              easing: 'easeOutExpo',
            });
          }
        }
      },
      { threshold: 0.2 },
    );

    // Store reference to the current section ref
    const currentSectionRef = sectionRef.current;

    if (currentSectionRef) {
      observer.observe(currentSectionRef);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const togglePlaylist = (id: number) => {
    if (activePlaylist === id) {
      setActivePlaylist(null);
    } else {
      setActivePlaylist(id);
    }
  };

  return (
    <FutureVisionWrapper ref={sectionRef}>
      <BackgroundDecoration />
      <FloatingNotes>{generateFloatingNotes(15)}</FloatingNotes>
      <SoundWaveContainer>{generateSoundwaveLines(150)}</SoundWaveContainer>

      <MainContainer>
        <SectionHeader>
          <GlowingCircle
            color={COLORS.gogo_blue}
            size="300px"
            top="-150px"
            left="-50px"
            animationDuration="8s"
          />
          <GlowingCircle
            color={COLORS.gogo_pink}
            size="250px"
            top="-100px"
            left="70%"
            animationDuration="10s"
          />

          <SectionTitle ref={titleRef}>The Future is Music</SectionTitle>
          <SectionSubtitle>
            Our vision for the next chapter of Guitars Over Guns is as dynamic
            and ambitious as a platinum album. We&apos;re expanding our reach,
            enhancing our programs, and creating even greater impact through the
            power of music.
          </SectionSubtitle>
        </SectionHeader>

        <PlaylistContainer>
          {futurePlaylists.map((playlist, index) => (
            <PlaylistRow
              key={`playlist-${playlist.id}-${playlist.title.replace(
                /\s+/g,
                '-',
              )}`}
              isEven={index % 2 === 0}
              ref={(el) => {
                playlistRefs.current[index] = el;
              }}
              style={{ opacity: 0 }}
            >
              <VinylContainer>
                <VinylRecord
                  color={playlist.color}
                  isPlaying={activePlaylist === playlist.id}
                />
                <AlbumCover image={playlist.coverImage} />
                <AlbumShadow />

                <PlaybackControls>
                  <NextPrevButton>◀◀</NextPrevButton>
                  <PlayButton
                    isPlaying={activePlaylist === playlist.id}
                    onClick={() => togglePlaylist(playlist.id)}
                  >
                    {activePlaylist === playlist.id ? '❚❚' : '▶'}
                  </PlayButton>
                  <NextPrevButton>▶▶</NextPrevButton>
                </PlaybackControls>
              </VinylContainer>

              <PlaylistContent>
                <PlaylistTag color={playlist.tagColor}>
                  {playlist.tag}
                </PlaylistTag>
                <PlaylistTitle color={playlist.color}>
                  {playlist.title}
                </PlaylistTitle>
                <PlaylistDescription>
                  {playlist.description.replace("We're", 'We&apos;re')}
                </PlaylistDescription>

                <TrackList>
                  {playlist.tracks.map((track, trackIndex) => (
                    <Track
                      key={`track-${
                        playlist.id
                      }-${trackIndex}-${track.title.replace(/\s+/g, '-')}`}
                      isActive={
                        trackIndex === 0 && activePlaylist === playlist.id
                      }
                    >
                      <TrackNumber>{trackIndex + 1}</TrackNumber>
                      <TrackTitle
                        isActive={
                          trackIndex === 0 && activePlaylist === playlist.id
                        }
                      >
                        {track.title}
                      </TrackTitle>
                      <TrackDuration>{track.duration}</TrackDuration>
                    </Track>
                  ))}
                </TrackList>

                <PlaylistMore>View Full Plan</PlaylistMore>
              </PlaylistContent>
            </PlaylistRow>
          ))}
        </PlaylistContainer>

        <BottomCTA>
          <GlowingCircle
            key="bottom-cta-glow"
            color={COLORS.gogo_teal}
            size="200px"
            top="-100px"
            left="20%"
            animationDuration="12s"
          />
          <CTATitle>Join Our Next Track</CTATitle>
          <CTADescription>
            Be part of our vision for the future by supporting Guitars Over
            Guns. Together, we can amplify our impact and create harmony in
            communities nationwide.
          </CTADescription>
          <PlaylistButton href="/donate">Support Our Vision</PlaylistButton>
        </BottomCTA>
      </MainContainer>
    </FutureVisionWrapper>
  );
}

export default FutureVisionSection;
