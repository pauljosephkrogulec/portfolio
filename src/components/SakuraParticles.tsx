import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Petal {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
}

const SakuraParticles = () => {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const generatePetals = () => {
      const newPetals: Petal[] = [];
      for (let i = 0; i < 30; i++) {
        newPetals.push({
          id: i,
          x: Math.random() * 100,
          delay: Math.random() * 10,
          duration: 8 + Math.random() * 8,
          size: 10 + Math.random() * 15,
          rotation: Math.random() * 360,
        });
      }
      setPetals(newPetals);
    };

    generatePetals();
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute"
          initial={{
            x: `${petal.x}vw`,
            y: "-5vh",
            rotate: petal.rotation,
            opacity: 0,
          }}
          animate={{
            y: "105vh",
            x: [`${petal.x}vw`, `${petal.x + (Math.random() - 0.5) * 20}vw`, `${petal.x}vw`],
            rotate: petal.rotation + 360,
            opacity: [0, 0.8, 0.8, 0],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            width: petal.size,
            height: petal.size,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-full w-full"
          >
            <path
              d="M12 2C12 2 8 6 8 10C8 14 12 18 12 18C12 18 16 14 16 10C16 6 12 2 12 2Z"
              fill="hsl(350, 80%, 75%)"
              fillOpacity="0.7"
            />
            <path
              d="M12 2C12 2 8 6 8 10C8 14 12 18 12 18C12 18 16 14 16 10C16 6 12 2 12 2Z"
              fill="url(#petalGradient)"
              fillOpacity="0.5"
            />
            <defs>
              <linearGradient id="petalGradient" x1="8" y1="2" x2="16" y2="18">
                <stop stopColor="hsl(350, 90%, 85%)" />
                <stop offset="1" stopColor="hsl(340, 70%, 65%)" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export default SakuraParticles;
