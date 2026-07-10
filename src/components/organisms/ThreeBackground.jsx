import { useThreeBackground } from '../../hooks/useThreeBackground';

export function ThreeBackground() {
  const supported = useThreeBackground('three-canvas');

  // If WebGL is not supported, render a subtle CSS gradient fallback instead of a blank canvas
  if (!supported) {
    return (
      <div
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(59,130,246,0.06) 0%, transparent 70%)'
        }}
      />
    );
  }

  return (
    <canvas id="three-canvas" className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-60" />
  );
}
