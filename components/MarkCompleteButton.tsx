'use client'

import { useState, useEffect } from 'react'

export default function MarkCompleteButton({ slug }: { slug: string }) {
  const [completed, setCompleted] = useState(false)
  const [dbAvailable, setDbAvailable] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAvailability = async () => {
      try {
        const res = await fetch('/api/progress/available', { method: 'GET' })
        setDbAvailable(res.status === 200)
      } catch {
        setDbAvailable(false)
      }
    }
    checkAvailability()
  }, [])

  const handleClick = async () => {
    const res = await fetch('/api/progress/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    })

    if (res.ok) setCompleted(true)
  }

  if (dbAvailable === false) return null

  return completed ? (
    <p className="mt-6 text-green-600 font-medium">Marked as completed</p>
  ) : (
    dbAvailable && (
      <button
        onClick={handleClick}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Mark as Completed
      </button>
    )
  )
}
