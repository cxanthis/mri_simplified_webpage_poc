import ThreeColumnSection from '../components/threePartBanner';
import ResearchSection from '../components/ResearchSection';
import PodcastsSection from '../components/PodcastsSection';
import NewsSection from '../components/NewsSection';
import Banner from '../components/EbookBanner';

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

        {/* Content sections */}
        <div className="grid grid-cols-4 lg:grid-cols-1 gap-8">
          <NewsSection />
        </div>

        {/* Clickable Banner */}
        {/* Banner with extra margin */}
        <div className="mt-20">
          <Banner />
        </div>

      </div>
      
      <footer className="mt-20 flex gap-6 flex-wrap items-center justify-center">
        {/* Footer content here */}
      </footer>
    </div>
  );
}
