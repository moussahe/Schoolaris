import {
  Header,
  Hero,
  Categories,
  FeaturedCourses,
  HowItWorks,
  Testimonials,
  TeacherCta,
  Footer,
} from "@/components/landing";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Header />
      <main>
        <Hero />
        <Categories />
        <FeaturedCourses />
        <HowItWorks />
        <Testimonials />
        <TeacherCta />
      </main>
      <Footer />
    </div>
  );
}
