import L from 'leaflet';
import { LocationType } from '../types';
import COLORS from '../../../../assets/colors.ts';

// TypeScript definition for missing Leaflet types
declare module 'leaflet' {
  export function divIcon(options: any): L.Icon;
}

// Helper function to darken a color by a percentage
function darkenColor(color: string, percent: number): string {
  // For simple implementation, we'll just reduce the hex values
  let processedColor = color;
  if (processedColor.startsWith('#')) {
    processedColor = processedColor.substring(1);
  } else if (processedColor.startsWith('rgb')) {
    // Extract values from rgb/rgba format
    const rgbMatch = processedColor.match(
      /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/,
    );
    if (rgbMatch) {
      const r = Math.max(
        0,
        (parseInt(rgbMatch[1], 10) * (100 - percent)) / 100,
      );
      const g = Math.max(
        0,
        (parseInt(rgbMatch[2], 10) * (100 - percent)) / 100,
      );
      const b = Math.max(
        0,
        (parseInt(rgbMatch[3], 10) * (100 - percent)) / 100,
      );
      return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    }
    return processedColor; // Return original if format not recognized
  }

  // Convert to RGB
  const r = parseInt(processedColor.substr(0, 2), 16);
  const g = parseInt(processedColor.substr(2, 2), 16);
  const b = parseInt(processedColor.substr(4, 2), 16);

  // Darken
  const darkenR = Math.max(0, Math.round((r * (100 - percent)) / 100));
  const darkenG = Math.max(0, Math.round((g * (100 - percent)) / 100));
  const darkenB = Math.max(0, Math.round((b * (100 - percent)) / 100));

  // Convert back to hex
  return `#${darkenR.toString(16).padStart(2, '0')}${darkenG
    .toString(16)
    .padStart(2, '0')}${darkenB.toString(16).padStart(2, '0')}`;
}

// Helper function to lighten a color by a percentage
function lightenColor(color: string, percent: number): string {
  // For simple implementation, we'll just increase the hex values
  let processedColor = color;
  if (processedColor.startsWith('#')) {
    processedColor = processedColor.substring(1);
  } else if (processedColor.startsWith('rgb')) {
    // Extract values from rgb/rgba format
    const rgbMatch = processedColor.match(
      /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/,
    );
    if (rgbMatch) {
      const r = Math.min(
        255,
        (parseInt(rgbMatch[1], 10) * (100 + percent)) / 100,
      );
      const g = Math.min(
        255,
        (parseInt(rgbMatch[2], 10) * (100 + percent)) / 100,
      );
      const b = Math.min(
        255,
        (parseInt(rgbMatch[3], 10) * (100 + percent)) / 100,
      );
      return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    }
    return processedColor; // Return original if format not recognized
  }

  // Convert to RGB
  const r = parseInt(processedColor.substr(0, 2), 16);
  const g = parseInt(processedColor.substr(2, 2), 16);
  const b = parseInt(processedColor.substr(4, 2), 16);

  // Lighten
  const lightenR = Math.min(255, Math.round((r * (100 + percent)) / 100));
  const lightenG = Math.min(255, Math.round((g * (100 + percent)) / 100));
  const lightenB = Math.min(255, Math.round((b * (100 + percent)) / 100));

  // Convert back to hex
  return `#${lightenR.toString(16).padStart(2, '0')}${lightenG
    .toString(16)
    .padStart(2, '0')}${lightenB.toString(16).padStart(2, '0')}`;
}

/**
 * Creates a marker icon for a region
 */
export function createRegionIcon(color = COLORS.gogo_blue, name = '') {
  // Get the first letter of the region name, default to 'R' if empty
  const firstLetter = name && name.length > 0 ? name.charAt(0) : 'R';

  return L.divIcon({
    className: 'custom-region-marker',
    html: `
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Outer glow/shadow -->
        <circle cx="22" cy="22" r="20" fill="${color}" fill-opacity="0.2" />
        
        <!-- Main circle with gradient -->
        <circle cx="22" cy="22" r="16" fill="url(#regionGradient)" stroke="${color}" stroke-width="2"/>
        
        <!-- Inner highlight -->
        <circle cx="22" cy="22" r="14" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1"/>
        
        <!-- Center circle with gradient -->
        <circle cx="22" cy="22" r="8" fill="white"/>
        
        <!-- Pulse animation (subtle expanding circle) -->
        <circle cx="22" cy="22" r="20" fill="${color}" fill-opacity="0.2">
          <animate attributeName="r" values="16;20;16" dur="2s" repeatCount="indefinite" />
          <animate attributeName="fill-opacity" values="0.2;0.1;0.2" dur="2s" repeatCount="indefinite" />
        </circle>
        
        <!-- Text with slight shadow -->
        <text x="22" y="26" font-family="Arial" font-size="11" fill="${color}" text-anchor="middle" font-weight="bold" filter="url(#textShadow)">${firstLetter}</text>
        
        <!-- Definitions for gradients and filters -->
        <defs>
          <linearGradient id="regionGradient" x1="6" y1="6" x2="38" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="${color}" />
            <stop offset="100%" stop-color="${darkenColor(color, 30)}" />
          </linearGradient>
          
          <filter id="textShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1" stdDeviation="0.5" flood-opacity="0.3" />
          </filter>
        </defs>
      </svg>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22],
  });
}

/**
 * Creates a marker icon for a specific location type
 */
export function createMarkerIcon(
  type: LocationType = 'default',
  color: string = COLORS.gogo_blue,
) {
  const getIconPath = () => {
    switch (type) {
      case 'school':
      case 'academy':
        return `
          <path d="M5,13.18v4L12,21l7-3.82v-4L12,17L5,13.18z M12,3L1,9l11,6l9-4.91V17h2V9L12,3z" fill="url(#iconGradient)"/>
        `;
      case 'community-center':
        return `
          <path d="M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9S16.97,3,12,3z M15.5,8c0.83,0,1.5,0.67,1.5,1.5S16.33,11,15.5,11S14,10.33,14,9.5S14.67,8,15.5,8z M8.5,8C9.33,8,10,8.67,10,9.5S9.33,11,8.5,11S7,10.33,7,9.5S7.67,8,8.5,8z M12,17.5c-2.33,0-4.31-1.46-5.11-3.5h10.22C16.31,16.04,14.33,17.5,12,17.5z" fill="url(#iconGradient)"/>
        `;
      case 'studio':
        return `
          <path d="M12,3v10.55c-0.59-0.34-1.27-0.55-2-0.55c-2.21,0-4,1.79-4,4s1.79,4,4,4s4-1.79,4-4V7h4V3H12z M10,19c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S11.1,19,10,19z" fill="url(#iconGradient)"/>
        `;
      case 'hub':
        return `
          <path d="M16,11c1.66,0,2.99-1.34,2.99-3S17.66,5,16,5c-1.66,0-3,1.34-3,3s1.34,3,3,3z M8,11c1.66,0,2.99-1.34,2.99-3S9.66,5,8,5C6.34,5,5,6.34,5,8s1.34,3,3,3z M8,13c-2.33,0-7,1.17-7,3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z M16,13c-0.29,0-0.62,0.02-0.97,0.05c1.16,0.84,1.97,1.97,1.97,3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="url(#iconGradient)"/>
        `;
      case 'program':
        return `
          <path d="M19,3h-4.18C14.4,1.84,13.3,1,12,1c-1.3,0-2.4,0.84-2.82,2H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M12,3c0.55,0,1,0.45,1,1s-0.45,1-1,1s-1-0.45-1-1S11.45,3,12,3z M16,15H8v-2h8V15z M16,11H8V9h8V11z M16,7H8V5h8V7z" fill="url(#iconGradient)"/>
        `;
      case 'summer-program':
        return `
          <path d="M6.76,4.84l-1.8-1.79l-1.41,1.41l1.79,1.79L6.76,4.84z M1,10.5h3v2H1V10.5z M11,0.55h2V3.5h-2V0.55z M19.04,3.045l1.408,1.407l-1.79,1.79l-1.407-1.408L19.04,3.045z M17.24,18.16l1.79,1.8l1.41-1.41l-1.8-1.79L17.24,18.16z M20,10.5h3v2h-3V10.5z M12,5.5c-3.31,0-6,2.69-6,6s2.69,6,6,6s6-2.69,6-6S15.31,5.5,12,5.5z M11,22.45h2v-2.95h-2V22.45z M3.55,4.46l1.41,1.41l1.79-1.8l-1.41-1.41L3.55,4.46z" fill="url(#iconGradient)"/>
        `;
      case 'office':
        return `
          <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" fill="url(#iconGradient)"/>
        `;
      case 'performance-venue':
        return `
          <path d="M22 10V6c0-1.1-.9-2-2-2H4c-1.1 0-1.99.9-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2zm-9 7.5h-2v-2h2v2zm0-4.5h-2v-2h2v2zm0-4.5h-2v-2h2v2z" fill="url(#iconGradient)"/>
        `;
      default:
        return `
          <path d="M12,2C8.13,2,5,5.13,5,9c0,5.25,7,13,7,13s7-7.75,7-13C19,5.13,15.87,2,12,2z M12,11.5c-1.38,0-2.5-1.12-2.5-2.5s1.12-2.5,2.5-2.5s2.5,1.12,2.5,2.5S13.38,11.5,12,11.5z" fill="url(#iconGradient)"/>
        `;
    }
  };

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="marker-container">
        <svg width="44" height="44" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <!-- Main circular background with shadow -->
          <circle cx="12" cy="12" r="11" fill="white" filter="url(#dropShadow)" />
          
          <!-- Highlight ring -->
          <circle cx="12" cy="12" r="10" fill="none" stroke="${color}" stroke-width="0.5" stroke-opacity="0.7" />
          
          <!-- The icon itself -->
          ${getIconPath()}
          
          <!-- Definitions for effects -->
          <defs>
            <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-color="#000" flood-opacity="0.3" />
            </filter>
            
            <linearGradient id="iconGradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="${lightenColor(color, 15)}" />
              <stop offset="100%" stop-color="${darkenColor(color, 15)}" />
            </linearGradient>
          </defs>
          
          <!-- Subtle pulse effect for hover (CSS will handle showing/hiding) -->
          <circle class="marker-pulse" cx="12" cy="12" r="14" fill="${color}" fill-opacity="0" stroke="${color}" stroke-width="1" stroke-opacity="0">
            <animate attributeName="r" values="10;14;10" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="0.7;0;0.7" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22],
  });
}
