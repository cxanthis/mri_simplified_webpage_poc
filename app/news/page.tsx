import Link from 'next/link';
import Image from 'next/image';
import client from '../../sanityClient';
import styles from './page.module.css';
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Custom types for Sanity image source
interface SanityAsset {
  _id?: string;
  _ref?: string;
  _type: string;
  [key: string]: unknown;
}

interface SanityImageSource {
  asset: SanityAsset;
  alt?: string;
}

interface NewsItem {
  title: string;
  category: string;
  createdAt: string;
  teaser: string;
  slug: { current: string };
  headerImage?: SanityImageSource;
}

interface NewsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Function to strip HTML tags from a string
const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>?/gm, '');
};

// Mapping category values to their display titles.
const categoryMapping: Record<string, string> = {
  technology: "MRI Technology & Innovations",
  clinical: "Clinical Applications & Case Studies",
  rnd: "Research & Development",
  equipment: "Equipment & Devices",
  industry: "Industry & Market News",
  safety: "Safety & Regulations",
  events: "Conferences & Events",
  education: "Educational Resources & Training",
  experts: "Expert Opinions & Interviews",
};

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const params = await searchParams;
  const itemsPerPage = 10;
  const page = parseInt(
    Array.isArray(params.page) ? params.page[0] : (params.page as string) || "1",
    10
  );
  const offset = (page - 1) * itemsPerPage;

  // Updated query to fetch headerImage along with the other fields.
  const query = `*[_type == "news"] | order(createdAt desc)[${offset}...${offset + itemsPerPage}]{
    title,
    category,
    createdAt,
    slug,
    teaser,
    headerImage{
      asset->,
      alt
    }
  }`;
  const newsItems: NewsItem[] = await client.fetch(query);

  // Query the total count of news items.
  const countQuery = `count(*[_type == "news"])`;
  const totalCount: number = await client.fetch(countQuery);
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <main className="w-full mt-16 px-4">
      <h1 className={styles.title}>News</h1>
      <div className="flex flex-col gap-8">
        {newsItems.map((item, index) => {
          const mappedCategory = categoryMapping[item.category] || item.category;
          const formattedDate = new Date(item.createdAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          });
          return (
            <div key={index} className={styles.tile}>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* Left side: Text content */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-red-600 font-medium">{mappedCategory}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-500">{formattedDate}</span>
                  </div>
                  <Link href={`/news/${item.slug.current}`} className="group">
                    <h3 className="text-2xl font-bold mb-0 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-gray-700">{stripHtmlTags(item.teaser)}</p>
                </div>
                {/* Right side: Thumbnail of header image */}
                {item.headerImage && item.headerImage.asset && (
                  <div className={styles.thumbnailWrapper}>
                    <Image
                      src={urlFor(item.headerImage).width(150).height(100).url()}
                      alt={item.headerImage.alt || item.title}
                      width={150}
                      height={100}
                      className={styles.thumbnail}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {totalPages > 1 && (
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, index) => (
            <Link key={index} href={`?page=${index + 1}`}>
              <button
                className={`${styles.paginationButton} ${
                  page === index + 1 ? styles.activeButton : ''
                }`}
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
