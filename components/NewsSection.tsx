import Image from 'next/image';
import Link from 'next/link';
import client from '../sanityClient';
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(client);

interface SanityImageSource {
  asset: {
    _id: string;
    url?: string;
  };
  alt?: string;
}

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

interface NewsItem {
  title: string;
  createdAt: string;
  headerImage?: SanityImageSource;
  slug?: { current: string }; // If you have a slug field defined in your schema
}

export default async function NewsSection() {
  // Query the four latest news items from Sanity
  const query = `*[_type == "news"] | order(createdAt desc)[0...4]{
    title,
    createdAt,
    headerImage{
      asset->,
      alt
    },
    slug
  }`;
  const newsData: NewsItem[] = await client.fetch(query);

  return (
    <section className="w-full mt-16">
      {/* Horizontal divider */}
      <div className="w-full h-[1px] bg-black mb-6"></div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">News</h2>
        <Link href="/news" className="text-black-600 hover:underline flex items-center">
          More News &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {newsData.map((item, index) => (
          <Link href={item.slug ? `/news/${item.slug.current}` : "#"} key={index} className="group">
            <div className="relative h-[360px] overflow-hidden rounded-lg">
              {item.headerImage && item.headerImage.asset && (
                <Image
                  src={urlFor(item.headerImage).width(800).url()}
                  alt={item.headerImage.alt || item.title}
                  fill
                  style={{objectFit:'cover'}}
                  className="transition-transform duration-300 group-hover:scale-105"
                />
              )}
              {/* White box overlay containing title and createdAt */}
              <div className="absolute bottom-4 left-4 right-4 bg-white p-4 shadow">
                <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(item.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
