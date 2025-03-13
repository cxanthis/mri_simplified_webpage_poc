'use client';

import { Suspense } from 'react';
import MRISafetyContent from './MRISafetyContent';

export default function MRISafetyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MRISafetyContent />
    </Suspense>
  );
}
