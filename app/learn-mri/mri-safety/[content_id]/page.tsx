import { redirect } from 'next/navigation';

export default async function ContentPage({ params }: { params: unknown }) {
  const { content_id } = params as { content_id: string };
  redirect(`/item/${content_id}`);
}
