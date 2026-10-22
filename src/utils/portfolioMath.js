// Harmonic cosine easing for silky, organic acceleration and deceleration without jerk
export function smoothCosine(t) {
  const clampT = Math.min(1, Math.max(0, t));
  return 0.5 * (1 - Math.cos(Math.PI * clampT));
}

// Quadratic Bézier interpolation for curved mouse trajectories
export function quadBezier(t, p0, p1, p2) {
  const inv = 1 - t;
  return inv * inv * p0 + 2 * inv * t * p1 + t * t * p2;
}

export const cursorConfigs = [
  // 1. Ghiffa Tech Lead (Emerald Green) - Roams open upper-center corridor above ghiffa.dev
  {
    id: 'cursor-director',
    containerId: 'hero-canvas',
    waypoints: [
      { x: 0.32, y: 0.18 },
      { x: 0.45, y: 0.14 },
      { x: 0.38, y: 0.26 },
      { x: 0.26, y: 0.21 }
    ]
  },
  // 2. Project Manager Luffy (Forest Emerald) - Roams open corridor left of GitHub card & below React
  {
    id: 'cursor-pm',
    containerId: 'hero-canvas',
    waypoints: [
      { x: 0.66, y: 0.18 },
      { x: 0.74, y: 0.27 },
      { x: 0.65, y: 0.33 },
      { x: 0.60, y: 0.22 }
    ]
  },
  // 3. CI/CD Bot (Emerald Green) - Roams open mid-left corridor between Figma and LinkedIn
  {
    id: 'cursor-dev-cyan',
    containerId: 'hero-canvas',
    waypoints: [
      { x: 0.15, y: 0.44 },
      { x: 0.25, y: 0.52 },
      { x: 0.20, y: 0.60 },
      { x: 0.13, y: 0.54 }
    ]
  },
  // 4. Code Reviewer (Amber Yellow) - Roams lower-right channel below ghiffa.dev and left of skillstreak
  {
    id: 'cursor-dev-yellow',
    containerId: 'hero-canvas',
    waypoints: [
      { x: 0.62, y: 0.62 },
      { x: 0.72, y: 0.72 },
      { x: 0.67, y: 0.80 },
      { x: 0.57, y: 0.66 }
    ]
  },
  // 5. Design QA (Pink) - Roams upper-left channel between Email, VS Code, and Figma
  {
    id: 'cursor-ux',
    containerId: 'hero-canvas',
    waypoints: [
      { x: 0.08, y: 0.26 },
      { x: 0.15, y: 0.36 },
      { x: 0.07, y: 0.41 },
      { x: 0.14, y: 0.22 }
    ]
  },
  // 6. Client Review (Orange) - Roams mid-right channel between Instagram and skillstreak
  {
    id: 'cursor-client',
    containerId: 'hero-canvas',
    waypoints: [
      { x: 0.72, y: 0.46 },
      { x: 0.79, y: 0.54 },
      { x: 0.73, y: 0.60 },
      { x: 0.68, y: 0.50 }
    ]
  },
  // 7. UI & Motion (Dark Charcoal) - Roams lower-left channel below LinkedIn around Next.js icon
  {
    id: 'cursor-ui',
    containerId: 'hero-canvas',
    waypoints: [
      { x: 0.07, y: 0.80 },
      { x: 0.16, y: 0.88 },
      { x: 0.25, y: 0.82 },
      { x: 0.12, y: 0.75 }
    ]
  }
];
