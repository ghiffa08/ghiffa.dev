import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function PinnedMarquee({ text }) {
  const targetRef = useRef(null);
  
  // The target section is very tall (300vh) to give the user plenty of scrolling duration
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Move the text from off-screen right to off-screen left based on scroll progress
  const x = useTransform(scrollYProgress, [0, 1], ["50%", "-100%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-white z-10">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden bg-gray-100">
        <motion.div style={{ x }} className="flex whitespace-nowrap font-bold uppercase text-[15vw] md:text-[10vw] text-black">
          <span className="pr-10">{text}</span>
          <span className="pr-10">{text}</span>
          <span className="pr-10">{text}</span>
        </motion.div>
      </div>
    </section>
  );
}
