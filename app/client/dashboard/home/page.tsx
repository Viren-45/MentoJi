// app/client/dashboard/home/page.tsx
import HeroSection from '@/components/pages/client/dashboard/home/hero-section';
import RecommendedExperts from '@/components/pages/client/dashboard/home/recommended-experts';
import FAQSection from '@/components/pages/client/dashboard/home/faq-section';

const ClientDashboardHomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Welcome Message */}
      <HeroSection />
      
      {/* Recommended Experts Carousel */}
      <RecommendedExperts />
      
      {/* FAQ Section */}
      <FAQSection />
    </div>
  );
};

export default ClientDashboardHomePage;