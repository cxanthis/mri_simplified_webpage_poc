import { notFound } from 'next/navigation';
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
    tags
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
  );
}
