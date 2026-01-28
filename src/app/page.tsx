"use client";

import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import SakuraParticles from "@/components/SakuraParticles";
import { getVideo } from "@/lib/videoStorage";

export default function Home() {
  const [customVideo, setCustomVideo] = useState<string | null>(null);

  useEffect(() => {
    const loadSavedVideo = async () => {
      const savedVideo = await getVideo();
      if (savedVideo) {
        setCustomVideo(savedVideo);
      }
    };
    loadSavedVideo();
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <SakuraParticles />
      <HeroSection customVideoUrl={customVideo} />
      <AboutSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}
