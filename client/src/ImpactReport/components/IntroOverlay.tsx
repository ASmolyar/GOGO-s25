import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import gogoLogoBK from '../../assets/logos/gogoLogoBK';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: transparent;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
`;

const Stage = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
`;

// Animate an inner <g> instead of the root <svg> to avoid massive textures
// Keep scale near 1 to reduce rasterization cost; width of the root svg will fill screen
// Linear scale => linear change in on-screen width
// Fade out at the end to avoid the visual "whisk" as scale approaches 0
const shrinkGroup = keyframes`
  0% { transform: scale(1); opacity: 1; }
  85% { transform: scale(0.12); opacity: 1; }
  100% { transform: scale(0.05); opacity: 1; }
`;

const fadeOutText = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
`;

const Logo = styled.svg`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1000vmin; /* fill the screen without gigantic transforms */
  height: auto;
  transform-origin: center center;
  pointer-events: none;
  overflow: visible;
`;

// Inner group that we actually animate; keeps the root svg a reasonable size
const LogoGroup = styled.g`
  transform: scale(1);
  transform-origin: 51% 50%;
  transform-box: view-box;
  will-change: transform, opacity;
  shape-rendering: optimizeSpeed;

  &.shrink {
    animation: ${shrinkGroup} 3000ms linear forwards;
  }
`;

const Headline = styled.h1`
  position: absolute;
  top: calc(50% + 22vmin);
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  font-family: 'Century Gothic', Arial, sans-serif;
  font-weight: bold;
  color: #171717;
  text-align: center;
  letter-spacing: 0.08em;
  will-change: opacity, transform;

  &.fade {
    animation: ${fadeOutText} 500ms ease-in-out forwards;
  }
`;

const Subline = styled.div`
  position: absolute;
  top: calc(50% + 28vmin);
  left: 50%;
  transform: translateX(-50%);
  margin-top: 0.75rem;
  font-family: 'Century Gothic', Arial, sans-serif;
  color: #171717;
  display: flex;
  align-items: center;
  gap: 10px;
  will-change: opacity, transform;

  &.fade {
    animation: ${fadeOutText} 500ms ease-in-out forwards;
  }
`;

const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #171717;
  display: inline-block;
`;

type IntroOverlayProps = {
  onFinish?: () => void;
  minimumDurationMs?: number;
};

function IntroOverlay({
  onFinish,
  minimumDurationMs = 2000,
}: IntroOverlayProps): JSX.Element | null {
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  const logoGroupRef = useRef<SVGGElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const sublineRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const hasRunRef = { current: false } as { current: boolean };
    const timeouts: number[] = [];

    const logo = logoRef.current;
    const logoGroup = logoGroupRef.current;
    const headline = headlineRef.current;
    const subline = sublineRef.current;
    if (!logo || !logoGroup || !headline || !subline) return;

    if (hasRunRef.current) return;
    hasRunRef.current = true;

    // Ensure initial visible state
    headline.style.opacity = '1';
    subline.style.opacity = '1';

    // After the minimum duration, fade out text
    const t1 = window.setTimeout(() => {
      headline.classList.add('fade');
      subline.classList.add('fade');

      // After text fade completes, shrink logo (animate inner group, not root svg)
      const t2 = window.setTimeout(() => {
        // Listen for the end of the shrink to finish overlay
        const onEnd = () => {
          setDone(true);
          onFinish && onFinish();
        };
        logoGroup.addEventListener('animationend', onEnd, { once: true });
        logoGroup.classList.add('shrink');
      }, 520);
      timeouts.push(t2);
    }, minimumDurationMs);
    timeouts.push(t1);

    return () => {
      timeouts.forEach((id) => window.clearTimeout(id));
    };
  }, [minimumDurationMs, onFinish]);

  if (done) {
    return null;
  }

  return (
    <Overlay ref={overlayRef}>
      <Stage>
        <Logo
          ref={logoRef}
          viewBox={gogoLogoBK.viewBox}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <LogoGroup ref={logoGroupRef}>
            {gogoLogoBK.paths.map((p, i) => (
              <path key={i} d={p.d} transform={p.transform} fill="#ffffff" />
            ))}
          </LogoGroup>
        </Logo>
        <Headline ref={headlineRef}>IMPACT REPORT 2024–2025</Headline>
        <Subline ref={sublineRef}>
          <span>loading</span>
          <Dot />
          <Dot />
          <Dot />
        </Subline>
      </Stage>
    </Overlay>
  );
}

export default IntroOverlay;
