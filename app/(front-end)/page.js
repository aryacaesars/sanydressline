import HeroSection from "@/components/frontend/HeroSection";
import AboutSection from "@/components/frontend/AboutSection";
import ProductShowcase from "@/components/frontend/ProductShowcase";


export default function Home() {
  return (
    <div>
      <HeroSection/>
      <ProductShowcase/>
      <AboutSection/>
    </div>
  );
}
