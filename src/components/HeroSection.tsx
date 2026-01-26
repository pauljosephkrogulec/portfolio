import { motion } from "framer-motion";

interface HeroSectionProps {
  customVideoUrl?: string | null;
}

const HeroSection = ({ customVideoUrl }: HeroSectionProps) => {
  const videoSrc = customVideoUrl || "/hero-video.mp4";

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          key={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover brightness-100 contrast-105 saturate-110"
          src={videoSrc}
          style={{ 
            objectPosition: 'center center',
            filter: 'brightness(1.05) contrast(1.05)'
          }}
        />
        {/* Subtle vignette overlay for cinematic look */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
        {/* Bottom gradient fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-4 font-body text-sm uppercase tracking-[0.3em] text-muted-foreground"
          >
            Bienvenue dans mon univers
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-display text-5xl font-light leading-tight tracking-wide md:text-7xl lg:text-8xl"
          >
            <span className="text-foreground">Développeur</span>
            <span className="text-gradient-sakura"> Back-End</span>
            <br />
            <span className="text-foreground">Passionné par </span>
            <span className="text-gradient-moon">le Code</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mx-auto mt-8 max-w-md font-body text-base text-muted-foreground md:text-lg"
          >
            Développeur spécialisé en Symfony, API Platform et les bonnes pratiques de développement.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <a
              href="#about"
              className="glass-card glow-sakura px-8 py-3 font-body text-sm uppercase tracking-widest text-foreground transition-all duration-300 hover:scale-105"
            >
              Découvrir
            </a>
            <a
              href="#contact"
              className="border border-border/50 bg-transparent px-8 py-3 font-body text-sm uppercase tracking-widest text-muted-foreground transition-all duration-300 hover:border-primary hover:text-primary"
            >
              Contact
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="font-body text-xs uppercase tracking-widest text-muted-foreground">
              Défiler
            </span>
            <div className="h-12 w-px bg-gradient-to-b from-primary/50 to-transparent" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
