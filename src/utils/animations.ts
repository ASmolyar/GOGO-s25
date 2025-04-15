// import anime from 'animejs/lib/anime.es.js';
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

// ... existing code ...
