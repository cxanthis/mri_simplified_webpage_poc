// components/UserflowProvider.tsx
'use client'

import { useEffect } from 'react'
import userflow from 'userflow.js'
import { useUser } from '@clerk/nextjs'

const USERFLOW_TOKEN = 'ct_odaypmutknempgbpx2n2g2id2i'

export default function UserflowProvider() {
  const { isSignedIn, user } = useUser()

  useEffect(() => {
    if (!isSignedIn || !user) return

    userflow.init(USERFLOW_TOKEN)
    userflow.identify(user.id, {
      name: user.fullName || '',
      email: user.emailAddresses?.[0]?.emailAddress || '',
      signed_up_at: user.createdAt?.toISOString?.() || new Date().toISOString(),
    })
  }, [isSignedIn, user])

  return null
}
