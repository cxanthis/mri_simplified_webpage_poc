'use client';

import { useUser } from '@clerk/nextjs';
import Chatbox from './Chatbox';

export default function ChatboxWrapper() {
  const { isSignedIn } = useUser();

  if (!isSignedIn) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full">
      <Chatbox />
    </div>
  );
}
