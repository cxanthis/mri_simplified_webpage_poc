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

interface ExternalLink {
  title: string;
  url: string;
}

interface NewsTopic {
  title: string;
  teaser: string;
  simplified?: string; // The one-minute summary field
  body: string; // HTML content
  category?: string;
  createdAt?: string;
  headerImage?: {
    asset: SanityImageSource;
    alt?: string;
  };
  externalLinks?: ExternalLink[];
  images?: ImageItem[];
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

// Map category values to their display titles.
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

// -----------------
// SEO Metadata
// -----------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const query = `*[_type == "news" && slug.current == $slug][0]{
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
  const newsSEO = await client.fetch(query, { slug });
  if (!newsSEO) {
    return {
      title: "News Not Found",
      description: "The requested news article was not found.",
    };
  }
  const seo = newsSEO.seo || {};
  return {
    title: seo.seoTitle || newsSEO.title,
    description: seo.seoDescription || "",
    keywords: seo.seoKeywords,
    alternates: { canonical: seo.canonicalUrl },
    robots: seo.metaRobots,
    openGraph: {
      title: seo.og?.ogTitle || seo.seoTitle || newsSEO.title,
      description: seo.og?.ogDescription || seo.seoDescription || "",
      images: seo.og?.ogImage?.asset?.url
        ? [{ url: seo.og.ogImage.asset.url }]
        : undefined,
    },
    twitter: {
      title: seo.twitter?.twitterTitle || seo.seoTitle || newsSEO.title,
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

export default async function NewsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slug) {
    throw new Error('Missing slug parameter in dynamic route.');
  }

  const query = `*[_type == "news" && slug.current == $slug][0]{
    title,
    teaser,
    simplified,
    body,
    category,
    createdAt,
    headerImage{
      asset->,
      alt
    },
    externalLinks[]{
      title,
      url
    },
    images[]{
      image{
        asset->,
        caption
      },
      position
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

  const topic: NewsTopic | null = await client.fetch(query, { slug });
  if (!topic) {
    notFound();
  }

  // Format the createdAt date to "Month Date, Year"
  const formattedDate = topic.createdAt
    ? new Date(topic.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  // Look up the display title from the mapping.
  const categoryTitle = topic.category
    ? categoryMapping[topic.category] || topic.category
    : '';

  // Modify the body to insert images before <p> elements based on their position
  let modifiedBody = topic.body;
  if (topic.images && topic.images.length > 0) {
    // Sort images by their position value (ascending)
    const sortedImages = [...topic.images].sort((a, b) => a.position - b.position);
    let pCounter = 0;
    modifiedBody = modifiedBody.replace(/<p([^>]*)>/g, (match) => {
      pCounter++;
      let insertedHtml = '';
      // Insert every image whose position equals the current paragraph count
      while (sortedImages.length && sortedImages[0].position === pCounter) {
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
        {/* Metadata: Category Title and Created At Date */}
        {(categoryTitle || topic.createdAt) && (
          <div className={styles.metaData}>
            {categoryTitle && <span className={styles.category}>{categoryTitle}</span>}
            {topic.createdAt && <span className={styles.date}>{formattedDate}</span>}
          </div>
        )}

        {/* Header Image */}
        {topic.headerImage && topic.headerImage.asset && (
          <div className={styles.headerImageWrapper}>
            <img
              src={urlFor(topic.headerImage).url()}
              alt={topic.headerImage.alt || topic.title}
              className={styles.headerImage}
            />
          </div>
        )}

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
          <div className={styles.body} dangerouslySetInnerHTML={{ __html: modifiedBody }} />
        </div>

        {/* External Links Box */}
        {topic.externalLinks && topic.externalLinks.length > 0 && (
          <div className={styles.relatedArticlesSection}>
            <h2 className={styles.relatedArticlesHeading}>Continue Reading</h2>
            <ul>
              {topic.externalLinks.map((link, index) => (
                <li key={index} className={styles.relatedArticleItem}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.relatedArticleLink}
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </>
  );
}
