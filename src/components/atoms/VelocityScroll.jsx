import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, useVelocity, useAnimationFrame } from "framer-motion";

const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export function VelocityScroll({ text, baseVelocity = 5 }) {
  const baseX = useRef(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);
  const directionFactor = useRef(1);

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.current += moveBy;
  });

  return (
    <div className="overflow-hidden whitespace-nowrap flex flex-nowrap m-0 border-y-4 border-black bg-gray-100 py-4">
      <motion.div className="font-bold uppercase text-6xl md:text-9xl text-black flex whitespace-nowrap flex-nowrap" style={{ x }}>
        <span className="block mr-10">{text}</span>
        <span className="block mr-10">{text}</span>
        <span className="block mr-10">{text}</span>
        <span className="block mr-10">{text}</span>
      </motion.div>
    </div>
  );
}
