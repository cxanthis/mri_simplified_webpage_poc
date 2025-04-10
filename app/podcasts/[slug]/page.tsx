import { notFound } from 'next/navigation';
import Head from 'next/head';
import { Metadata } from 'next';
import client from '../../../sanityClient';
import styles from './page.module.css';

// Converts a YouTube URL to its embed URL format.
function getYouTubeEmbedUrl(url: string): string {
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return url; // fallback: return the original URL if no match
}

interface Podcast {
  title: string;
  slug: { current: string };
  description: string;
  publishedAt: string;
  audioUrl: string;
  duration: number;
  guests?: string[];
  tags?: string[];
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

/**
 * generateMetadata
 * Fetches SEO metadata for the dynamic podcast from Sanity.
 * Next.js will merge and override the defaults from app/layout.tsx.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const query = `*[_type == "podcast" && slug.current == $slug][0]{
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
  const podcastSEO = await client.fetch(query, { slug });
  if (!podcastSEO) {
    return {
      title: "Podcast Not Found",
      description: "The requested podcast was not found.",
    };
  }
  const seo = podcastSEO.seo || {};
  return {
    title: seo.seoTitle || podcastSEO.title,
    description: seo.seoDescription || "",
    keywords: seo.seoKeywords,
    alternates: { canonical: seo.canonicalUrl },
    robots: seo.metaRobots,
    openGraph: {
      title: seo.og?.ogTitle || seo.seoTitle || podcastSEO.title,
      description: seo.og?.ogDescription || seo.seoDescription || "",
      images: seo.og?.ogImage?.asset?.url
        ? [{ url: seo.og.ogImage.asset.url }]
        : undefined,
    },
    twitter: {
      title: seo.twitter?.twitterTitle || seo.seoTitle || podcastSEO.title,
      description: seo.twitter?.twitterDescription || seo.seoDescription || "",
      images: seo.twitter?.twitterImage?.asset?.url
        ? [{ url: seo.twitter.twitterImage.asset.url }]
        : undefined,
    },
  };
}

export default async function PodcastPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slug) {
    throw new Error('Missing slug parameter in dynamic route.');
  }

  const query = `*[_type == "podcast" && slug.current == $slug][0]{
    title,
    description,
    publishedAt,
    audioUrl,
    duration,
    guests,
    tags,
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

  const podcast: Podcast | null = await client.fetch(query, { slug });
  if (!podcast) {
    notFound();
  }

  const formattedDate = podcast.publishedAt
    ? new Date(podcast.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  // Get the YouTube embed URL from the provided URL.
  const videoEmbedUrl = getYouTubeEmbedUrl(podcast.audioUrl);

  return (
    <>
      {/* Inject JSON-LD structured data if provided */}
      {podcast.seo?.structuredData && (
        <Head>
          <script type="application/ld+json">{podcast.seo.structuredData}</script>
        </Head>
      )}
      <main className={styles.container}>
        {/* Published Date */}
        {formattedDate && (
          <div className={styles.metaData}>
            <span className={styles.date}>{formattedDate}</span>
          </div>
        )}

        {/* Title and Description */}
        <h1 className={styles.title}>{podcast.title}</h1>
        <p className={styles.description} style={{ marginBottom: '20px' }}>
          {podcast.description}
        </p>

        {/* Responsive Video Player */}
        <div className={styles.videoPlayerWrapper}>
          <iframe
            src={videoEmbedUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* Duration */}
        <p className={styles.duration}>Duration: {podcast.duration} minutes</p>

        {/* Guests in a separate box */}
        {podcast.guests && podcast.guests.length > 0 && (
          <div className={styles.guestsBox}>
            <h3>Guests</h3>
            <ul>
              {podcast.guests.map((guest, index) => (
                <li key={index}>{guest}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags */}
        {podcast.tags && podcast.tags.length > 0 && (
          <div className={styles.tags}>
            <h3>Tags</h3>
            <ul>
              {podcast.tags.map((tag, index) => (
                <li key={index}>{tag}</li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </>
  );
}
