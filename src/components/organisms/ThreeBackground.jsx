import { useThreeBackground } from '../../hooks/useThreeBackground';

export function ThreeBackground() {
  useThreeBackground('three-canvas');

  return (
    <canvas id="three-canvas" className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-60" />
  );
}
