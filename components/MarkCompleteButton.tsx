'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

export default function MarkCompleteButton({
  slug,
  isLeaf,
}: {
  slug: string
  isLeaf: boolean
}) {
  const { user } = useUser()
  const [completed, setCompleted] = useState(false)
  const [ready, setReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!user || !isLeaf) return

    let active = true

    const checkStatus = async () => {
      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 3000)

        const res = await fetch(`/api/progress/status?slug=${slug}`, {
          method: 'GET',
          signal: controller.signal,
        })

        clearTimeout(timeout)

        if (active && res.ok) {
          const data = await res.json()
          setCompleted(data.completed)
        }
      } catch {
        // ignore
      } finally {
        if (active) setReady(true)
      }
    }

    checkStatus()
    return () => {
      active = false
    }
  }, [slug, user, isLeaf])

  const handleClick = async () => {
    const res = await fetch('/api/progress/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    })

    if (res.ok) {
      setCompleted(true)
      router.refresh()
    }
  }

  if (!user || !ready || !isLeaf) return null

  return completed ? (
    <p className="mt-6 text-green-600 font-medium">Marked as completed</p>
  ) : (
    <button
      onClick={handleClick}
      className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Mark as Completed
    </button>
  )
}
