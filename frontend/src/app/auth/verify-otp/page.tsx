'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// OTP verification has been removed — redirect to login
export default function VerifyOTPPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/auth/login')
  }, [router])
  return null
}
