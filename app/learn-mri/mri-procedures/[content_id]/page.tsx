import { redirect } from 'next/navigation';

export default function ContentPage({ params }: { params: { content_id: string } }) {
  redirect(`/item/${params.content_id}`);
  return null;
}
