import Image from "next/image";
import HeroSection from './components/ui/HeroSection'
import HowItWorks from './components/ui/HowItWorks'
import RecentlyAnalyzed from './components/ui/RecentlyAnalyzed'

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <HeroSection />
      <div className="flex-grow">
        <HowItWorks />
        <RecentlyAnalyzed />
      </div>
    </main>
  );
}
