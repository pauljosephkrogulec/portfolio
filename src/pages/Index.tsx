import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import SakuraParticles from "@/components/SakuraParticles";
import AdminVideoButton from "@/components/AdminVideoButton";
import { getVideo } from "@/lib/videoStorage";

const Index = () => {
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
      <ContactSection />
      <AdminVideoButton 
        onVideoChange={setCustomVideo} 
        currentVideo={customVideo} 
      />
    </main>
  );
};

export default Index;
