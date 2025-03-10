// app/item/[content_id]/page.tsx
import { notFound } from 'next/navigation';
import client from '../../../sanityClient';
import styles from './page.module.css';

interface Item {
  title: string;
  body: string;
  advanced: string;
  clinical: string;
}

export default async function ItemPage({ params }: { params: Promise<{ content_id: string }> }) {
  if (!params) {
    throw new Error("Missing params in dynamic route.");
  }

  // ✅ FIX: Await params before accessing content_id
  const resolvedParams = await params;
  const { content_id } = resolvedParams;
  const contentIdNumber = Number(content_id);

  const query = `*[content_id == $content_id][0]{
    title,
    body,
    advanced,
    clinical
  }`;

  const item: Item | null = await client.fetch(query, { content_id: contentIdNumber });

  if (!item) {
    notFound();
  }

  return (
    <main className={styles.container}>
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
            <div dangerouslySetInnerHTML={{ __html: item.clinical }} />
          </div>
      </article>
    </main>
  );
}
