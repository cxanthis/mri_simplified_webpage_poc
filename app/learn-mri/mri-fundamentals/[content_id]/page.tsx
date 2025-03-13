import { redirect } from 'next/navigation';

export default async function ContentPage({ params }: any) {
  redirect(`/item/${params.content_id}`);
}
