import ThreeColumnSection from '../components/threePartBanner';
import Image from 'next/image';
import Link from 'next/link';

interface Part {
  title: string;
  date: string;
  imageUrl: string;
  authors?: string[];
  isPro?: boolean;
  description?: string;
}

const bookParts: Part[] = [
  {
    title: 'MRI Fundamentals',
    date: 'March 10, 2025',
    description: 'Learn the basics on MRI',
    imageUrl: '/mri_fundamentals.jpg',
  },
  {
    title: 'MRI Procedures',
    date: 'March 3, 2025',
    description: 'Learn how to use MRI with patients',
    imageUrl: '/brain_image.jpg',
  },
  {
    title: 'MRI Safety',
    date: 'March 3, 2025',
    description: 'Learn everything about MRI safety',
    imageUrl: '/brain_image.jpg',
  },
];

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-4 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-4 row-start-2 items-center sm:items-start mt-[-20px]">
        <div>
          {/* Other components and content */}
          <ThreeColumnSection />
          {/* More content */}
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        {/* Footer content here */}
      </footer>
    </div>
  );
}
