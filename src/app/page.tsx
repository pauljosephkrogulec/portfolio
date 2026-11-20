import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import RoomExperience from "@/components/room/RoomExperience";

const grotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-grotesk" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-jb" });

export default function Home() {
  return <RoomExperience className={`${grotesk.variable} ${mono.variable}`} font={grotesk.style.fontFamily} monoFont={mono.style.fontFamily} />;
}
