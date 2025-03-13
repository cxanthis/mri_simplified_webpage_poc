'use client';

import { Suspense } from 'react';
import MRIFundamentalsContent from './MRIFundamentalsContent';

export default function MRIFundamentalsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MRIFundamentalsContent />
    </Suspense>
  );
}
