import { redirect } from 'next/navigation';

export default async function ContentPage({
  params,
}: {
  params: { content_id: string } | Promise<{ content_id: string }>;
}) {
  // If params is a promise, await it; otherwise, use it directly.
  const resolvedParams = params instanceof Promise ? await params : params;
  redirect(`/item/${resolvedParams.content_id}`);
}
