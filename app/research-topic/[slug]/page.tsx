import { notFound } from 'next/navigation';
import Head from 'next/head';
import { Metadata } from 'next';
import client from '../../../sanityClient';
import styles from './page.module.css';
import imageUrlBuilder from '@sanity/image-url';

// Create a URL builder using your Sanity client
const builder = imageUrlBuilder(client);
type SanityImageSource = Parameters<typeof builder.image>[0];

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

interface ImageItem {
  image: {
    asset: SanityImageSource;
    caption?: string;
  };
  position: number;
}

interface Article {
  slug: { current: string };
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
  seo?: {
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
    canonicalUrl?: string;
    structuredData?: string;
    metaRobots?: string;
    og?: {
      ogTitle?: string;
      ogDescription?: string;
      ogImage?: {
        asset?: {
          url: string;
        };
      };
    };
    twitter?: {
      twitterTitle?: string;
      twitterDescription?: string;
      twitterImage?: {
        asset?: {
          url: string;
        };
      };
    };
  };
}

// -----------------
// SEO Metadata
// -----------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const query = `*[_type == "researchTopics" && slug.current == $slug][0]{
    title,
    seo {
      seoTitle,
      seoDescription,
      seoKeywords,
      canonicalUrl,
      structuredData,
      metaRobots,
      og {
        ogTitle,
        ogDescription,
        ogImage{
          asset->{
            url
          }
        }
      },
      twitter {
        twitterTitle,
        twitterDescription,
        twitterImage{
          asset->{
            url
          }
        }
      }
    }
  }`;
  const topicSEO = await client.fetch(query, { slug });
  if (!topicSEO) {
    return {
      title: "Research Topic Not Found",
      description: "The requested research topic was not found.",
    };
  }
  const seo = topicSEO.seo || {};
  return {
    title: seo.seoTitle || topicSEO.title,
    description: seo.seoDescription || "",
    keywords: seo.seoKeywords,
    alternates: { canonical: seo.canonicalUrl },
    robots: seo.metaRobots,
    openGraph: {
      title: seo.og?.ogTitle || seo.seoTitle || topicSEO.title,
      description: seo.og?.ogDescription || seo.seoDescription || "",
      images: seo.og?.ogImage?.asset?.url
        ? [{ url: seo.og.ogImage.asset.url }]
        : undefined,
    },
    twitter: {
      title: seo.twitter?.twitterTitle || seo.seoTitle || topicSEO.title,
      description: seo.twitter?.twitterDescription || seo.seoDescription || "",
      images: seo.twitter?.twitterImage?.asset?.url
        ? [{ url: seo.twitter.twitterImage.asset.url }]
        : undefined,
    },
  };
}

// -----------------
// Main Component
// -----------------

export default async function ResearchTopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slug) {
    throw new Error('Missing slug parameter in dynamic route.');
  }

  // Updated query to include SEO fields
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
      slug,
      title
    },
    seo {
      seoTitle,
      seoDescription,
      seoKeywords,
      canonicalUrl,
      structuredData,
      metaRobots,
      og {
        ogTitle,
        ogDescription,
        ogImage{
          asset->{
            url
          }
        }
      },
      twitter {
        twitterTitle,
        twitterDescription,
        twitterImage{
          asset->{
            url
          }
        }
      }
    }
  }`;

  const topic: ResearchTopic | null = await client.fetch(query, { slug });
  if (!topic) {
    notFound();
  }

  // Modify the body to insert images before <h2> elements based on their position
  let modifiedBody = topic.body;
  if (topic.images && topic.images.length > 0) {
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
    <>
      {/* Inject JSON-LD structured data if provided */}
      {topic.seo?.structuredData && (
        <Head>
          <script type="application/ld+json">{topic.seo.structuredData}</script>
        </Head>
      )}
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
                <h2 className={styles.relatedArticlesHeading}>Related Topics</h2>
                <ul className={styles.relatedArticlesList}>
                  {topic.relatedTopics.map((article) => (
                    <li key={article.slug.current} className={styles.relatedArticleItem}>
                      <a
                        href={`/learn-mri/topic/${article.slug.current}`}
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
    </>
  );
}
