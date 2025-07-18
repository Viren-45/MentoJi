import HeroSection from "@/components/home/sections/hero-section";
import EasyStartSection from "@/components/home/sections/easy-start-section";
import ForClientsSection from "@/components/home/sections//for-clients-section";
import ExpertsByCategorySection from "@/components/home/sections/experts-by-category-section";
import ForExpertsSection from "@/components/home/sections/for-experts-section";
import ExpertOpportunitiesSection from "@/components/home/sections/expert-opportunities-section";

export default function Home() {
  return (
    <div className="space-y-10">
      <HeroSection />
      <EasyStartSection />
      <ForClientsSection />
      <ExpertsByCategorySection />
      <ForExpertsSection />
      <ExpertOpportunitiesSection />
    </div>
  );
}
