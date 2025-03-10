// sanityClient.ts
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET as string,
  apiVersion: '2024-03-07', // Updated to a newer API version
  useCdn: process.env.NODE_ENV === 'production', // `true` for production to utilize the CDN
});

export default client;
