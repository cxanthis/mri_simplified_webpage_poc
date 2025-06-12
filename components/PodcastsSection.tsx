import Image from 'next/image';
import Link from 'next/link';
import client from '../sanityClient';
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(client);

// Define a custom type for the Sanity image source
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

interface PodcastItem {
  title: string;
  createdAt: string;
  description: string;
  slug: { current: string };
  coverImage?: SanityImageSource;
}

export default async function PodcastsSection() {
  // Query the two latest podcasts
  const query = `*[_type == "podcast"] | order(createdAt desc)[0...2]{
    title,
    createdAt,
    description,
    slug,
    coverImage{
      asset->,
      alt
    }
  }`;
  const podcastData: PodcastItem[] = await client.fetch(query);

  return (
    <section className="w-full mt-16">
      {/* Horizontal divider */}
      <div className="w-full h-[1px] bg-black mb-6"></div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Podcasts</h2>
        <Link href="/podcasts" className="text-gray-600 hover:underline flex items-center">
          More Podcasts &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {podcastData.map((item, index) => (
          <Link href={`/podcasts/${item.slug.current}`} key={index} className="group">
            <div className="relative h-[360px] overflow-hidden rounded-lg">
              {item.coverImage && item.coverImage.asset && (
                <Image 
                  src={urlFor(item.coverImage).width(800).url()} 
                  alt={item.coverImage.alt || item.title}
                  fill
                  style={{objectFit:'cover'}}
                  className="transition-transform duration-300 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <div className="flex justify-between items-center w-full mb-2">
                  {/* Fallback category or you can remove it */}
                  <span className="text-sm">Podcast</span>
                  <span className="text-sm">
                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
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
