// page.tsx
import Link from 'next/link';
import client from '../../sanityClient';
import styles from './page.module.css';
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

interface PodcastItem {
  title: string;
  publishedAt: string;
  description: string;
  slug: { current: string };
  coverImage?: {
    asset: any;
    alt?: string;
  };
}

interface PodcastsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Function to strip HTML tags from a string
const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>?/gm, '');
};

export default async function PodcastsPage({ searchParams }: PodcastsPageProps) {
  const params = await searchParams;
  const itemsPerPage = 10;
  // Get current page from query parameter, defaulting to 1 if not provided.
  const page = parseInt(
    Array.isArray(params.page) ? params.page[0] : (params.page as string) || "1",
    10
  );
  const offset = (page - 1) * itemsPerPage;

  // Fetch only the current page items using GROQ slice syntax.
  const query = `*[_type == "podcast"] | order(publishedAt desc)[${offset}...${offset + itemsPerPage}]{
    title,
    publishedAt,
    description,
    slug,
    coverImage{
      asset->,
      alt
    }
  }`;
  const podcastItems: PodcastItem[] = await client.fetch(query);

  // Query the total count to calculate the total number of pages.
  const countQuery = `count(*[_type == "podcast"])`;
  const totalCount: number = await client.fetch(countQuery);
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <main className="w-full mt-16 px-4">
      <h1 className={styles.title}>Podcasts</h1>
      <div className="flex flex-col gap-8">
        {podcastItems.map((item, index) => {
          const formattedDate = item.publishedAt
            ? new Date(item.publishedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })
            : '';
          return (
            <div key={index} className={`${styles.tile} flex items-center justify-between`}>
              <div className="flex flex-col gap-2">
                <Link href={`/podcasts/${item.slug.current}`} className="group">
                  <h3 className="text-2xl font-bold mb-0 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                </Link>
                <span className="text-gray-500">{formattedDate}</span>
                <p className="text-gray-700">
                  {stripHtmlTags(item.description).substring(0, 150)}...
                </p>
              </div>
              {item.coverImage && item.coverImage.asset && (
                <div className={styles.thumbnail}>
                  <img
                    src={urlFor(item.coverImage).width(150).url()}
                    alt={item.coverImage.alt || item.title}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {totalPages > 1 && (
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, index) => (
            <Link key={index} href={`?page=${index + 1}`}>
              <button
                className={`${styles.paginationButton} ${page === index + 1 ? styles.activeButton : ''}`}
              >
                {index + 1}
              </button>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
