// page.tsx
import Link from 'next/link';
import client from '../../sanityClient';
import styles from './page.module.css';

interface ResearchItem {
  title: string;
  category: string;
  researchType: string;
  teaser: string;
  slug: { current: string };
}

interface ResearchTopicsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Function to strip HTML tags from a string
const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>?/gm, '');
};

export default async function ResearchTopicsPage({ searchParams }: ResearchTopicsPageProps) {
  const params = await searchParams;
  const itemsPerPage = 10;
  // Get current page from query parameter, defaulting to 1 if not provided.
  const page = parseInt(
    Array.isArray(params.page) ? params.page[0] : (params.page as string) || "1",
    10
  );
  const offset = (page - 1) * itemsPerPage;

  // Fetch only the current page items using GROQ slice syntax.
  const query = `*[_type == "researchTopics"] | order(createdAt desc)[${offset}...${offset + itemsPerPage}]{
    title,
    category,
    researchType,
    slug,
    teaser
  }`;
  const researchItems: ResearchItem[] = await client.fetch(query);

  // Query the total count to calculate the total number of pages.
  const countQuery = `count(*[_type == "researchTopics"])`;
  const totalCount: number = await client.fetch(countQuery);
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <main className="w-full mt-16 px-4">
      <h1 className={styles.title}>Research Topics</h1>
      <div className="flex flex-col gap-8">
        {researchItems.map((item, index) => (
          <div key={index} className={styles.tile}>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-red-600 font-medium">{item.category}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-500">{item.researchType}</span>
              </div>
              <Link href={`/research-topic/${item.slug.current}`} className="group">
                <h3 className="text-2xl font-bold mb-0 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
              </Link>
              <p className="text-gray-700">{stripHtmlTags(item.teaser)}</p>
            </div>
          </div>
        ))}
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
