// app/learn-mri/topic/[slug]/page.tsx
import { notFound } from 'next/navigation';
import client from '../../../../sanityClient';
import styles from './page.module.css';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import SanityArticlesMenuServer from '../../../../components/SanityArticlesMenuServer';

interface Item {
  title: string;
  body: string;
  advanced: string;
  clinical: string;
}

export default async function ItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const query = `*[slug.current == $slug][0]{
    title,
    body,
    advanced,
    clinical
  }`;

  const item: Item | null = await client.fetch(query, { slug });

  if (!item) {
    notFound();
  }

  return (
    <div className="flex">
      {/* Left-side vertical menu */}
      <aside className="w-1/4 border-r border-gray-200">
        <SanityArticlesMenuServer activeSlug={slug} />
      </aside>

      {/* Main content */}
      <main className="w-3/4 p-4">
        <h1 className={styles.title}>{item.title}</h1>
        <article className={styles.tiles}>
          <div className={styles.tile}>
            <div dangerouslySetInnerHTML={{ __html: item.body }} />
          </div>
          <div className={styles.tile}>
            <h2>Advanced Concepts for the Enthusiast</h2>
            <div dangerouslySetInnerHTML={{ __html: item.advanced }} />
          </div>
          <div className={styles.tile}>
            <h2>Clinical Relevance</h2>
            <SignedIn>
              <div dangerouslySetInnerHTML={{ __html: item.clinical }} />
            </SignedIn>
            <SignedOut>
              <p>
                This section is available for free to registered users. Sign up using the options that appear at the top of this page.
              </p>
            </SignedOut>
          </div>
        </article>
      </main>
    </div>
  );
}
