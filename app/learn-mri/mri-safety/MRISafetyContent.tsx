'use client';

import { useState, useEffect } from 'react';
import { createClient } from 'next-sanity';
import { useRouter, useSearchParams } from 'next/navigation';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import articleStyles from '../page.module.css';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: "2023-01-01",
});

interface Article {
  chapter_id: string;
  content_id: string;
  title: string;
  slug: string;
}

interface Item {
  title: string;
  body: string;
  advanced: string;
  clinical: string;
}

const parseChapterId = (id: string) => id.split('.').map(num => parseInt(num, 10));

export default function MRIFundamentalsContent() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract the selectedSlug directly from the query parameters
  const selectedSlug = searchParams?.get('slug');

  useEffect(() => {
    console.log('Selected slug:', selectedSlug);
    if (selectedSlug) {
      fetchItemContent(selectedSlug);
    }
  }, [selectedSlug]);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const query = `*[_type == "articles" && chapter_id match "3*"] {
          chapter_id,
          content_id,
          title,
          "slug": slug.current
        }`;
        const data: Article[] = await client.fetch(query);
        console.log("Fetched articles:", data);  // Log fetched data
  
        if (!data.length) {
          console.warn("No articles were returned from the query. Check your dataset and query.");
        }
  
        const sortedData = data.sort((a, b) => {
          const numA = parseChapterId(a.chapter_id);
          const numB = parseChapterId(b.chapter_id);
          for (let i = 0; i < Math.max(numA.length, numB.length); i++) {
            const partA = numA[i] || 0;
            const partB = numB[i] || 0;
            if (partA !== partB) return partA - partB;
          }
          return 0;
        });
        console.log("Sorted articles:", sortedData); // Log sorted data
        setArticles(sortedData);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setArticles([]);
      }
    }
    fetchArticles();
  }, []);  

  async function fetchItemContent(slug: string) {
    setLoading(true);
    try {
      const query = `*[slug.current == $slug][0]{
        title,
        body,
        advanced,
        clinical
      }`;
      const item: Item | null = await client.fetch(query, { slug });
      setSelectedItem(item);
    } catch (error) {
      console.error("Error fetching item content:", error);
      setSelectedItem(null);
    } finally {
      setLoading(false);
    }
  }

  const handleArticleClick = async (slug: string) => {
    const slugString = slug;
    router.push(`/learn-mri/mri-safety?slug=${slugString}`, { scroll: false });
    await fetchItemContent(slugString);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-1 overflow-hidden">
        <div className="w-2/6 overflow-y-auto bg-gray-100 border-r border-gray-300">
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Part 3: MRI Safety</h2>
            <nav>
              <ul className="flex flex-col gap-1">
                {articles.map((article) => {
                  const parts = article.chapter_id.split(".");
                  const indent = { marginLeft: `${(parts.length - 1) * 20}px` };
                  const isClickable = parts.length > 2;
                  const isActive = selectedSlug === article.slug;
                  return (
                    <li 
                      key={article.content_id} 
                      style={indent}
                      className={`py-0.5 ${isActive ? 'bg-black-100 rounded px-2' : 'px-2'}`}
                    >
                      {isClickable ? (
                        <a
                          onClick={() => handleArticleClick(article.slug)}
                          className={`hover:underline cursor-pointer ${isActive ? 'font-medium text-blue-600' : ''}`}
                        >
                          <span className="font-mono mr-1">{article.chapter_id}</span>
                          {article.title}
                        </a>
                      ) : (
                        <span className="font-bold">
                          <span className="font-mono mr-1">{article.chapter_id}</span>
                          {article.title}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>

        <div className="w-4/6 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : selectedItem ? (
            <main className={articleStyles.container}>
              <article className={articleStyles.tiles}>
                <div className={articleStyles.tile}>
                  <div dangerouslySetInnerHTML={{ __html: selectedItem.body }} />
                </div>
                <div className={articleStyles.tile}>
                  <h2>Advanced Concepts for the Enthusiast</h2>
                  <div dangerouslySetInnerHTML={{ __html: selectedItem.advanced }} />
                </div>
                <div className={articleStyles.tile}>
                  <h2>Clinical Relevance</h2>
                  <SignedIn>
                    <div dangerouslySetInnerHTML={{ __html: selectedItem.clinical }} />
                  </SignedIn>
                  <SignedOut>
                    <p className={articleStyles.warning}>
                      This section is available for free to registered users. Sign up using the options that appear at the top of this page.
                    </p>
                  </SignedOut>
                </div>
              </article>
            </main>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xl">Select a topic from the sidebar to view its content</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
