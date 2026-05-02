import { BookingDock } from "@/components/home/BookingDock";
import { FeaturedMasters } from "@/components/home/FeaturedMasters";
import { FeaturedServices } from "@/components/home/FeaturedServices";
import { HeroSection } from "@/components/home/HeroSection";
import { LiveSlots } from "@/components/home/LiveSlots";
import { TrustBlock } from "@/components/home/TrustBlock";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicHeader } from "@/components/layout/PublicHeader";

export default function Home() {
  return (
    <main className="min-h-screen bg-porcelain text-graphite">
      <PublicHeader />
      <HeroSection />
      <BookingDock />
      <FeaturedServices />
      <FeaturedMasters />
      <LiveSlots />
      <TrustBlock />
      <PublicFooter />
    </main>
  );
}
