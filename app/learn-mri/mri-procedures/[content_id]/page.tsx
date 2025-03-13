import { use } from 'react';
import { redirect } from 'next/navigation';

export default function ContentPage({
  params,
}: {
  params: Promise<{ content_id: string }>;
}) {
  const { content_id } = use(params);
  redirect(`/item/${content_id}`);
  return null;
}
