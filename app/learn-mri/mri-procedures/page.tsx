'use client';

import { Suspense } from 'react';
import MRIProceduresContent from './MRIProceduresContent';

export default function MRIProceduresPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MRIProceduresContent />
    </Suspense>
  );
}
