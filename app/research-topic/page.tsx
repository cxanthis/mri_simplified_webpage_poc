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

// Helper function to remove HTML tags from a string
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

export default async function ResearchTopicsPage() {
  // Query all researchTopics documents ordered by createdAt descending
  const query = `*[_type == "researchTopics"] | order(createdAt desc){
    title,
    category,
    researchType,
    slug,
    teaser
  }`;
  const researchItems: ResearchItem[] = await client.fetch(query);

  return (
    <main className="w-full mt-16 px-4" >
      <h1 className="text-3xl font-bold mb-8">Research Topics</h1>
      <div className="flex flex-col gap-8">
        {researchItems.map((item, index) => (
          <div
            key={index}
            className={styles.tile}
          >
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
              <p className="text-gray-700">{stripHtml(item.teaser)}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
