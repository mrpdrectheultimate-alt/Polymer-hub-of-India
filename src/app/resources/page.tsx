'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LegacyResourcesRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/library')
  }, [router])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-slate-500 font-medium">Redirecting to the Digital Library...</p>
    </div>
  )
}
