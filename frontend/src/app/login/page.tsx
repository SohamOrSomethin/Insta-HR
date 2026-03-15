'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import API_URL from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (data.success) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        if (data.user.role === 'employer') router.push('/employer')
        else if (data.user.role === 'admin') router.push('/admin')
        else router.push('/dashboard')
      } else if (data.userId) {
        // Not verified yet — redirect to OTP
        router.push(`/auth/verify-otp?userId=${data.userId}&email=${email}`)
      } else {
        setError(data.message || 'Invalid credentials')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  return (
    <main className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 pt-16'>
      <div className='w-full max-w-md'>
        <div className='bg-white rounded-2xl shadow-xl p-8'>
          <div className='flex items-center justify-center gap-2 mb-8'>
            <div className='w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg' />
            <span className='text-xl font-bold text-gray-900'>InstaHire</span>
          </div>
          <h1 className='text-2xl font-bold text-gray-900 text-center mb-2'>Welcome back</h1>
          <p className='text-gray-500 text-center mb-8'>Sign in to your account</p>
          {error && (
            <div className='bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm'>{error}</div>
          )}
          <form onSubmit={handleSubmit} className='space-y-5'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Email Address</label>
              <input type='email' value={email} onChange={e => setEmail(e.target.value)}
                placeholder='you@example.com' required
                className='w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all' />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Password</label>
              <input type='password' value={password} onChange={e => setPassword(e.target.value)}
                placeholder='Your password' required
                className='w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all' />
            </div>
            <button type='submit' disabled={loading}
              className='w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50'>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className='text-center text-gray-500 text-sm mt-6'>
            Don&apos;t have an account?{' '}
            <Link href='/auth/register' className='text-blue-600 font-medium hover:underline'>Register here</Link>
          </p>
        </div>
      </div>
    </main>
  )
}
