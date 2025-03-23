import { Region } from '../types';
import COLORS from '../../../assets/colors.ts';

// Major cities as regions with their coordinates and bounds
const regions: Region[] = [
  {
    id: 'chicago',
    name: 'Chicago',
    centerCoordinates: [41.8781, -87.6298],
    defaultZoom: 11,
    minZoom: 9,
    maxZoom: 18,
    color: COLORS.gogo_blue,
    maxBounds: [
      [41.6447, -87.9402], // Southwest corner
      [42.0230, -87.3241]  // Northeast corner
    ],
    sublocations: [
      {
        id: 'mosaic-hub-chicago',
        name: 'Mosaic Hub Chicago',
        coordinates: [41.8826, -87.6322],
        type: 'hub',
        programs: ['Music Education', 'Recording Studio'],
      },
      {
        id: 'walter-payton-college-prep',
        name: 'Walter Payton College Prep',
        coordinates: [41.9106, -87.6382],
        type: 'school',
        programs: ['After School Music Program', 'Youth Development'],
      },
      {
        id: 'sound-studio-chicago',
        name: 'Sound Studio Chicago',
        coordinates: [41.8916, -87.6446],
        type: 'studio',
        programs: ['Music Production', 'Artist Development'],
      },
      {
        id: 'whitney-young-magnet',
        name: 'Whitney M. Young Magnet High School',
        coordinates: [41.8783, -87.6728],
        type: 'school',
        programs: ['Music Classes', 'Performance Arts'],
      },
      {
        id: 'chicago-youth-center',
        name: 'Chicago Youth Center',
        coordinates: [41.8513, -87.6516],
        type: 'community-center',
        programs: ['After School Activities', 'Music Training'],
        supportedBy: ['City of Chicago', 'GOGO Foundation']
      }
    ]
  },
  {
    id: 'new-york',
    name: 'New York City',
    centerCoordinates: [40.7128, -74.0060],
    defaultZoom: 11,
    minZoom: 9,
    maxZoom: 18,
    color: COLORS.gogo_green,
    maxBounds: [
      [40.4774, -74.2590], // Southwest corner
      [40.9176, -73.7004]  // Northeast corner
    ],
    sublocations: [
      {
        id: 'bronx-school-music',
        name: 'Bronx School of Music',
        coordinates: [40.8448, -73.8648],
        type: 'academy',
        programs: ['Classical Training', 'Jazz Studies'],
      },
      {
        id: 'brooklyn-arts-center',
        name: 'Brooklyn Arts Center',
        coordinates: [40.6782, -73.9442],
        type: 'community-center',
        programs: ['Urban Music', 'Hip Hop Production'],
        supportedBy: ['NYC Arts Council', 'GOGO Foundation']
      },
      {
        id: 'juilliard-outreach',
        name: 'Juilliard Community Outreach',
        coordinates: [40.7738, -73.9837],
        type: 'program',
        programs: ['Classical Music Education', 'Performance Training'],
      },
      {
        id: 'harlem-studio-museum',
        name: 'Harlem Studio Museum',
        coordinates: [40.8054, -73.9430],
        type: 'studio',
        programs: ['Recording Sessions', 'Music History'],
        supportedBy: ['NYC Cultural Affairs']
      },
      {
        id: 'laguardia-high-school',
        name: 'LaGuardia High School of Music & Art',
        coordinates: [40.7744, -73.9816],
        type: 'school',
        programs: ['Music & Arts Education', 'Performance'],
        supportedBy: ['NYC Department of Education']
      }
    ]
  },
  {
    id: 'los-angeles',
    name: 'Los Angeles',
    centerCoordinates: [34.0522, -118.2437],
    defaultZoom: 10,
    minZoom: 9,
    maxZoom: 18,
    color: COLORS.gogo_purple,
    maxBounds: [
      [33.7037, -118.6682], // Southwest corner
      [34.3373, -118.1553]  // Northeast corner
    ],
    sublocations: [
      {
        id: 'la-music-academy',
        name: 'LA Music Academy',
        coordinates: [34.0922, -118.3278],
        type: 'academy',
        programs: ['Music Industry', 'Production'],
        supportedBy: ['LA Arts Commission']
      },
      {
        id: 'hollywood-high',
        name: 'Hollywood High School of Performing Arts',
        coordinates: [34.1016, -118.3391],
        type: 'school',
        programs: ['Performance Arts', 'Music Theory'],
      },
      {
        id: 'echo-park-community',
        name: 'Echo Park Community Music Center',
        coordinates: [34.0781, -118.2593],
        type: 'community-center',
        programs: ['Youth Music Program', 'Instrument Lessons'],
        supportedBy: ['LA County', 'GOGO Foundation']
      },
      {
        id: 'downtown-recording',
        name: 'Downtown Recording Studio',
        coordinates: [34.0407, -118.2468],
        type: 'studio',
        programs: ['Professional Recording', 'Production Classes'],
      },
      {
        id: 'compton-youth-ensemble',
        name: 'Compton Youth Ensemble',
        coordinates: [33.8958, -118.2201],
        type: 'program',
        programs: ['Orchestra', 'Music Education'],
        supportedBy: ['LA Philharmonic Outreach']
      }
    ]
  },
  {
    id: 'miami',
    name: 'Miami',
    centerCoordinates: [25.7617, -80.1918],
    defaultZoom: 11,
    minZoom: 9,
    maxZoom: 18,
    color: COLORS.gogo_yellow,
    maxBounds: [
      [25.5644, -80.4502], // Southwest corner
      [25.9717, -80.0867]  // Northeast corner
    ],
    sublocations: [
      {
        id: 'miami-beach-conservatory',
        name: 'Miami Beach Conservatory',
        coordinates: [25.7903, -80.1342],
        type: 'academy',
        programs: ['Classical Music', 'Latin Jazz'],
        supportedBy: ['Miami Cultural Affairs']
      },
      {
        id: 'little-havana-arts',
        name: 'Little Havana Arts Center',
        coordinates: [25.7659, -80.2196],
        type: 'community-center',
        programs: ['Latin Music', 'Cultural Education'],
        supportedBy: ['Miami-Dade County', 'GOGO Foundation']
      },
      {
        id: 'wynwood-sound-labs',
        name: 'Wynwood Sound Labs',
        coordinates: [25.8049, -80.1985],
        type: 'studio',
        programs: ['Electronic Music', 'Beat Production'],
      },
      {
        id: 'new-world-school',
        name: 'New World School of the Arts',
        coordinates: [25.7741, -80.1906],
        type: 'school',
        programs: ['Performing Arts', 'Music Theory'],
        supportedBy: ['Florida Department of Education']
      },
      {
        id: 'overtown-youth-center',
        name: 'Overtown Youth Center',
        coordinates: [25.7867, -80.2031],
        type: 'program',
        programs: ['After School Music', 'Instrument Training'],
        supportedBy: ['Miami Heat Foundation', 'GOGO Foundation']
      }
    ]
  },
  {
    id: 'summer-programs',
    name: 'Summer Programs Nationwide',
    centerCoordinates: [39.8283, -98.5795], // Center of US
    defaultZoom: 4,
    minZoom: 3,
    maxZoom: 18,
    color: COLORS.gogo_pink,
    sublocations: [
      {
        id: 'camp-gogo-wisconsin',
        name: 'Camp GOGO @ Lake Geneva, WI',
        coordinates: [42.5916, -88.4334],
        type: 'summer-program',
        programs: ['Summer Music Camp', 'Instrument Instruction'],
      },
      {
        id: 'berklee-summer-boston',
        name: 'Berklee Summer Program Boston',
        coordinates: [42.3467, -71.0972],
        type: 'summer-program',
        programs: ['College Prep Music', 'Performance Workshops'],
        supportedBy: ['Berklee College of Music', 'GOGO Foundation']
      },
      {
        id: 'aspen-music-festival',
        name: 'Aspen Music Festival Colorado',
        coordinates: [39.1911, -106.8175],
        type: 'summer-program',
        programs: ['Classical Training', 'Orchestra Experience'],
        supportedBy: ['Aspen Music Festival']
      },
      {
        id: 'interlochen-arts-camp',
        name: 'Interlochen Arts Camp Michigan',
        coordinates: [44.6367, -85.7694],
        type: 'summer-program',
        programs: ['Intensive Music Training', 'Performance Arts'],
        supportedBy: ['Interlochen Center for the Arts']
      },
      {
        id: 'new-orleans-jazz-camp',
        name: 'New Orleans Jazz & Heritage Camp',
        coordinates: [29.9511, -90.0715],
        type: 'summer-program',
        programs: ['Jazz Education', 'Louisiana Music History'],
        supportedBy: ['Jazz & Heritage Foundation', 'GOGO Foundation']
      }
    ]
  }
];

export default regions; 