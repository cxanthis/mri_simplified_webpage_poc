// app/mri-fundamentals/[content_id]/page.tsx
import { redirect } from 'next/navigation';

export default async function ContentPage({ params }: { params: { content_id: string } }) {
  // This page will redirect to the main page with a query parameter
  redirect(`/item/${params.content_id}`);
}
