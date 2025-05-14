'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Intercom from '@intercom/messenger-js-sdk';

export default function IntercomProvider() {
  const { user } = useUser();

  useEffect(() => {
    if (!user || typeof window === 'undefined') return;

    const createdAt = user.createdAt ? Math.floor(new Date(user.createdAt).getTime() / 1000) : 0; // Convert to UNIX timestamp in seconds

    Intercom({
      app_id: 'bv02vqen',
      user_id: user.id,
      name: user.fullName || '',
      email: user.emailAddresses[0]?.emailAddress || '',
      created_at: createdAt,
    });

    return () => {
      window.Intercom?.('shutdown');
    };
  }, [user]);

  return null;
}
