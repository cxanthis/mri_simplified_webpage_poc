import ThreeColumnSection from '../components/threePartBanner';
import ResearchSection from '../components/ResearchSection';
import PodcastsSection from '../components/PodcastsSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Pad the top to accommodate the negative margin */}
      <div className="pt-40"></div>
      
      {/* Three Part Banner */}
      <ThreeColumnSection />
      
      {/* Content sections */}
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ResearchSection />
          <PodcastsSection />
        </div>
      </div>
      
      <footer className="mt-20 flex gap-6 flex-wrap items-center justify-center">
        {/* Footer content here */}
      </footer>
    </div>
  );
}
