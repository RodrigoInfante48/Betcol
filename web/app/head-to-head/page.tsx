'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HeadToHeadRedirect() {
  const router = useRouter()
  useEffect(() => { router.replace('/comparar') }, [router])
  return null
}
