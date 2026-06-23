import { useCallback, useEffect, useRef } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { motion } from 'framer-motion';

/**
 * Deep space starry background rendered with tsParticles.
 * Stars slowly drift and twinkle.
 *
 * @param {{ onStarClick?: () => void }} props
 */
export default function StarryBackground({ onStarClick }) {
  const containerRef = useRef(null);

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  // Attach click listener to the particles canvas for star-click easter egg
  useEffect(() => {
    const canvas = document.querySelector('#tsparticles canvas');
    if (canvas && onStarClick) {
      canvas.style.pointerEvents = 'auto';
      canvas.style.cursor = 'default';
      const handler = (e) => {
        // Only count clicks on the canvas itself
        if (e.target === canvas) {
          onStarClick();
        }
      };
      canvas.addEventListener('click', handler);
      return () => canvas.removeEventListener('click', handler);
    }
  }, [onStarClick]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: false,
          background: {
            color: { value: 'transparent' },
          },
          fpsLimit: 60,
          particles: {
            number: {
              value: 200,
              density: { enable: true, area: 800 },
            },
            color: {
              value: ['#ffffff', '#a8c8ff', '#ffd700', '#e8e8ff', '#ffe4b5'],
            },
            shape: { type: 'circle' },
            opacity: {
              value: { min: 0.1, max: 0.8 },
              animation: {
                enable: true,
                speed: 0.5,
                sync: false,
                minimumValue: 0.1,
              },
            },
            size: {
              value: { min: 0.5, max: 2.5 },
              animation: {
                enable: true,
                speed: 0.3,
                sync: false,
                minimumValue: 0.3,
              },
            },
            move: {
              enable: true,
              speed: 0.08,
              direction: 'none',
              random: true,
              straight: false,
              outModes: { default: 'out' },
            },
            twinkle: {
              particles: {
                enable: true,
                frequency: 0.02,
                opacity: 0.8,
              },
            },
          },
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: 'bubble',
              },
            },
            modes: {
              bubble: {
                distance: 150,
                size: 4,
                duration: 1,
                opacity: 0.8,
              },
            },
          },
          detectRetina: true,
        }}
        className="w-full h-full"
      />
      {/* Subtle radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-night/40" />
    </div>
  );
}
