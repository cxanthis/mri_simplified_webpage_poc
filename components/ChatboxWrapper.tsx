'use client';

import Chatbox from './Chatbox';

export default function ChatboxWrapper() {

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full">
      <Chatbox />
    </div>
  );
}
