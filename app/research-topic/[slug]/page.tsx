import { notFound } from 'next/navigation';
import client from '../../../sanityClient';
import styles from './page.module.css';
import imageUrlBuilder from '@sanity/image-url';

// Create a URL builder using your Sanity client
const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

interface ImageItem {
  image: {
    asset: any;
    caption?: string;
  };
  position: number;
}

interface Article {
  content_id: number;
  title: string;
}

interface ResearchTopic {
  title: string;
  slug: { current: string };
  teaser: string;
  simplified?: string; // The one-minute summary field
  body: string; // HTML content
  images?: ImageItem[];
  relatedTopics?: Article[];
}

export default async function ResearchTopicPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  if (!slug) {
    throw new Error('Missing slug parameter in dynamic route.');
  }

  // Query
  const query = `*[_type == "researchTopics" && slug.current == $slug][0]{
    title,
    teaser,
    simplified,
    body,
    images[]{
      image{
        asset->,
        caption
      },
      position
    },
    relatedTopics[]->{
      content_id,
      title
    }
  }`;

  const topic: ResearchTopic | null = await client.fetch(query, { slug });
  if (!topic) {
    notFound();
  }

  let modifiedBody = topic.body;
  if (topic.images && topic.images.length > 0) {
    // Sort images by their position value (ascending)
    const sortedImages = [...topic.images].sort((a, b) => a.position - b.position);
    let h2Counter = 0;
    modifiedBody = modifiedBody.replace(/<h2([^>]*)>/g, (match) => {
      h2Counter++;
      let insertedHtml = '';
      // Insert every image whose position equals the current h2 count
      while (sortedImages.length && sortedImages[0].position === h2Counter) {
        const imgItem = sortedImages.shift();
        insertedHtml += `<div class="${styles.imageWrapper}">
          <img src="${urlFor(imgItem!.image).width(800).url()}" alt="${topic.title}" class="${styles.image}" />
          ${
            imgItem!.image.caption
              ? `<p class="${styles.imageCaption}">${imgItem!.image.caption}</p>`
              : ''
          }
        </div>`;
      }
      return insertedHtml + match;
    });
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>{topic.title}</h1>
      <div
        className={styles.subtitle}
        dangerouslySetInnerHTML={{ __html: topic.teaser }}
      />
      {/* Digest Callout Box */}
      {topic.simplified && (
        <div className={styles.digestBox}>
        <h3 className={styles.digestTitle}>1-min digest</h3>
          <div
            className={styles.digestText}
            dangerouslySetInnerHTML={{ __html: topic.simplified }}
          />
        </div>
      )}
      <hr className={styles.divider} />

      <div className={styles.bodyWrapper}>
        {topic.relatedTopics && topic.relatedTopics.length > 0 && (
          <aside className={styles.sidebar}>
            <section className={styles.relatedArticlesSection}>
              <h2 className={styles.relatedArticlesHeading}>Related MR topics</h2>
              <ul className={styles.relatedArticlesList}>
                {topic.relatedTopics.map((article) => (
                  <li key={article.content_id} className={styles.relatedArticleItem}>
                    <a
                      href={`/item/${article.content_id}`}
                      className={styles.relatedArticleLink}
                    >
                      {article.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        )}
        <div className={styles.body} dangerouslySetInnerHTML={{ __html: modifiedBody }} />
      </div>
    </main>
  );
}
