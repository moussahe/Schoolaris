import {
  MainNav,
  HeroSection,
  FeaturesSection,
  SubjectsSection,
  TestimonialsSection,
  TeacherCtaSection,
  FinalCtaSection,
  Footer,
} from "@/components/landing";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <MainNav />
      <main>
        <HeroSection />
        <FeaturesSection />
        <SubjectsSection />
        <TestimonialsSection />
        <TeacherCtaSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  );
}
