import Hero from "./_components/Hero";
import { Popularcitylist } from "./_components/Popluarcitylist";
import HowItWorks from "./_components/HowItWorks";
import Footer from "./_components/Footer";

export default function Home() {
  return (
    <div className="space-y-0 pb-0">
      <Hero />

      <div className="mt-10">
        <Popularcitylist />
      </div>

      <HowItWorks />

      <Footer />
    </div>
  );
}