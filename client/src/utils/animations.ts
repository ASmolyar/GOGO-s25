import { animate, stagger } from 'animejs';

// Animations for page transitions
export const pageEnterAnimation = (container: Element) => {
  animate(container, {
    opacity: [0, 1],
    translateY: [20, 0],
    easing: 'easeOutExpo',
    duration: 600,
    delay: 100,
  });
};

export const pageExitAnimation = (container: Element) => {
  return animate(container, {
    opacity: [1, 0],
    translateY: [0, -20],
    easing: 'easeInExpo',
    duration: 400,
  });
};

// Card grid animations
export const cardsEnterAnimation = (cards: Element[]) => {
  animate(cards, {
    opacity: [0, 1],
    translateY: [40, 0],
    scale: [0.9, 1],
    easing: 'easeOutExpo',
    duration: 800,
    delay: stagger(60, { start: 200 }),
  });
};

// Album cover animation
export const albumCoverEnterAnimation = (cover: Element) => {
  animate(cover, {
    opacity: [0, 1],
    scale: [0.8, 1],
    easing: 'easeOutExpo',
    duration: 800,
    delay: 200,
  });
};

// Album info animation
export const albumInfoEnterAnimation = (
  info: Element,
  titleElement: Element,
) => {
  animate(info, {
    opacity: [0, 1],
    translateX: [20, 0],
    easing: 'easeOutExpo',
    duration: 800,
    delay: 300,
  });

  animate(titleElement, {
    opacity: [0, 1],
    translateY: [20, 0],
    easing: 'easeOutExpo',
    duration: 800,
    delay: 400,
  });
};

// Track list animations
export const trackListEnterAnimation = (tracks: Element[]) => {
  animate(tracks, {
    opacity: [0, 1],
    translateY: [10, 0],
    easing: 'easeOutExpo',
    duration: 500,
    delay: stagger(50, { start: 600 }),
  });
};

// Play button animation
export const playButtonAnimation = (button: Element) => {
  animate(button, {
    scale: [1, 1.2, 1],
    duration: 600,
    easing: 'easeOutElastic(1, .5)',
  });
};

// Now playing bar animation
export const nowPlayingEnterAnimation = (bar: Element) => {
  animate(bar, {
    translateY: [80, 0],
    opacity: [0, 1],
    easing: 'easeOutExpo',
    duration: 600,
  });
};

// Background animation for headers
export const backgroundGradientAnimation = (element: Element) => {
  animate(element, {
    background: [
      'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)',
      'linear-gradient(135deg, #121212 0%, #5038a0 100%)',
    ],
    easing: 'easeOutQuad',
    duration: 800,
  });
};

// Hover effect for cards
export const cardHoverAnimation = (card: Element, entering: boolean) => {
  animate(card, {
    scale: entering ? 1.05 : 1,
    boxShadow: entering
      ? '0 10px 30px rgba(0, 0, 0, 0.3)'
      : '0 2px 10px rgba(0, 0, 0, 0.1)',
    easing: 'easeOutElastic(1, .5)',
    duration: 400,
  });
};

// Album tracks hover animation
export const trackHoverAnimation = (track: Element, entering: boolean) => {
  animate(track, {
    backgroundColor: entering
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(255, 255, 255, 0)',
    scale: entering ? 1.01 : 1,
    easing: 'easeOutExpo',
    duration: 300,
  });
};

// Animation for currently playing track
export const currentTrackAnimation = (element: Element) => {
  animate(element, {
    color: ['#1db954', '#ffffff', '#1db954'],
    easing: 'easeInOutSine',
    duration: 1500,
    loop: true,
  });
};

// Loading animation
export const loadingAnimation = (element: Element) => {
  const animation = animate(element, {
    opacity: [0.2, 1],
    scale: [0.9, 1],
    easing: 'easeInOutQuad',
    duration: 800,
    direction: 'alternate',
    loop: true,
  });

  return animation;
};
