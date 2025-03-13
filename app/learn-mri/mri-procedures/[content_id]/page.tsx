import { redirect } from 'next/navigation';

export default async function ContentPage({
  params: _params,
}: {
  params: { content_id: string };
}) {
  // Cast _params to a Promise<{ content_id: string }> to satisfy Next.js’s PageProps type.
  const params = _params as unknown as Promise<{ content_id: string }>;
  const { content_id } = await params;
  redirect(`/item/${content_id}`);
}
