import Image from 'next/image';
import Link from 'next/link';

interface PodcastItem {
  category: string;
  title: string;
  date: string;
  imageUrl: string;
  link: string;
  description?: string;
}

const podcastData: PodcastItem[] = [
  {
    category: 'MRI community',
    title: 'Erik Hedstrom, MD',
    date: '10.03.2025',
    imageUrl: '/erik_hedstrom.jpg',
    link: '/podcasts/cardiac-mr-lund',
    description: 'From research to clinical practice'
  },
  {
    category: 'Conferences',
    title: 'ISMRM (2024)',
    date: '03.03.2025',
    imageUrl: '/ismrm_singapore.jpg',
    link: '/podcasts/ismrm_2024',
    description: 'Latest trends in MRI'
  }
];

export default function PodcastsSection() {
  return (
    <section className="w-full mt-16">
    {/* Black horizontal divider line */}
      <div className="w-full h-[1px] bg-black mb-6"></div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Podcasts</h2>
        <Link href="/podcasts" className="text-gray-600 hover:underline flex items-center">
          More Podcasts &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {podcastData.map((item, index) => (
          <Link href={item.link} key={index} className="group">
            <div className="relative h-[360px] overflow-hidden rounded-lg">
              <Image 
                src={item.imageUrl} 
                alt={item.title}
                fill
                style={{objectFit:'cover'}}
                className="transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <div className="flex justify-between items-center w-full mb-2">
                  <span className="text-sm">{item.category}</span>
                  <span className="text-sm">{item.date}</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                {item.description && <p className="text-sm">{item.description}</p>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}