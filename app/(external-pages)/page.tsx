import TradingViewTimeline from "@/components/dashboard/TradingViewNews";
import FeaturedSection from "@/components/external-pages/FeaturedSection";
import HeroSection from "@/components/external-pages/HeroSection";
import PageContainer from "@/components/external-pages/PageContainer";
import PricingSection from "@/components/external-pages/PricingSection";
import TestimonialSection from "@/components/external-pages/TestimonialSection";
import VideoSection from "@/components/external-pages/VideoSection";
import WhyUsSection from "@/components/external-pages/WhyUsSection";

export default function Home() {
  return (
    <PageContainer>
      <HeroSection />
      <VideoSection />
      <WhyUsSection />
      <FeaturedSection />
      <PricingSection />
      <TestimonialSection />
      <TradingViewTimeline />
    </PageContainer>
  );
}
