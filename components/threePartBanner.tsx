import Image from 'next/image';
import Link from 'next/link';

interface CardItem {
  title: string;
  topics: string;
  description: string;
  imageUrl: string;
  link: string;
}

const cardData: CardItem[] = [
  {
    title: 'MRI Fundamentals',
    topics: '6 chapters/154 topics',
    description: 'Learn the basics on MRI',
    imageUrl: '/mri_fundamentals.jpg',
    link: '/learn-mri/mri-fundamentals',
  },
  {
    title: 'MRI Procedures',
    topics: '4 chapters/72 topics',
    description: 'Learn how to use MRI with patients',
    imageUrl: '/mri_procedures.jpg',
    link: '/learn-mri/mri-procedures',
  },
  {
    title: 'MRI Safety',
    topics: '4 chapters/138 topics',
    description: 'Learn everything about MRI safety',
    imageUrl: '/mri_safety.jpg',
    link: '/learn-mri/mri-safety',
  },
];

export default function ThreeColumnSection() {
  return (
    <section className="w-full px-2 sm:px-6 lg:px-12 py-8 relative -mt-40">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cardData.map((item, index) => (
            <Link href={item.link} key={index} className="relative group block transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
            {/* Background Image */}
            <div className="relative h-[700px] w-full overflow-hidden">
              <Image 
                src={item.imageUrl} 
                alt={item.title} 
                width={700} height={500}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Overlay White Box */}
            <div className="absolute bottom-6 left-6 right-6 bg-white p-5 shadow-lg transition-all duration-300 group-hover:shadow-xl">
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="text-gray-700 text-base">{item.description}</p>
              <span className="text-sm text-gray-500">{item.topics}</span>
            </div>
            </Link>
        ))}
      </div>
    </section>
  );
}
