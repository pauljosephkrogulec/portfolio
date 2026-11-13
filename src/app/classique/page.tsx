import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Paul-Joseph Krogulec — Version classique",
};

export default function ClassicHome() {
  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <NavBar />
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}
