'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface User {
  email: string
  role: 'candidate' | 'employer' | 'admin'
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')

    if (!userData) {
      router.replace('/login')
      return
    }

    const parsedUser: User = JSON.parse(userData)

    if (parsedUser.role === 'admin') {
      router.replace('/admin')
      return
    }

    setUser(parsedUser)
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.replace('/')
  }

  if (loading) {
    return (
      <main className='min-h-screen bg-gray-50 pt-24 flex items-center justify-center'>
        <p className='text-gray-400'>Loading dashboard...</p>
      </main>
    )
  }

  if (!user) return null

  return (
    <main className='min-h-screen bg-gray-50 pt-16'>
      <div className='max-w-7xl mx-auto px-6 py-10'>

        {/* Welcome Header */}
        <div className='bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8'>
          <h1 className='text-3xl font-bold mb-2'>
            Welcome back! 👋
          </h1>
          <p className='text-blue-100'>
            {user.email} — {
              user.role === 'candidate'
                ? 'Job Seeker'
                : 'Employer'
            }
          </p>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
          {user.role === 'candidate' ? (
            <>
              <StatCard value="0" label="Jobs Applied" color="blue" />
              <StatCard value="0" label="Interviews" color="purple" />
              <StatCard value="0" label="Saved Jobs" color="green" />
              <StatCard value="0%" label="Profile Complete" color="orange" />
            </>
          ) : (
            <>
              <StatCard value="0" label="Jobs Posted" color="blue" />
              <StatCard value="0" label="Applications" color="purple" />
              <StatCard value="0" label="Shortlisted" color="green" />
              <StatCard value="0" label="Hired" color="orange" />
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className='bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8'>
          <h2 className='text-xl font-bold text-gray-900 mb-6'>
            Quick Actions
          </h2>

          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {user.role === 'candidate' ? (
              <>
                <ActionLink href="/jobs" emoji="🔍" label="Find Jobs" />
                <ActionLink href="/profile" emoji="👤" label="My Profile" />
                <ActionLink href="/applications" emoji="📋" label="Applications" />
                <ActionLink href="/training" emoji="📚" label="Training" />
              </>
            ) : (
              <>
                <ActionLink href="/post-job" emoji="➕" label="Post a Job" />
                <ActionLink href="/candidates" emoji="👥" label="Find Candidates" />
                <ActionLink href="/applications" emoji="📋" label="Applications" />
                <ActionLink href="/subscription" emoji="⭐" label="Upgrade Plan" />
              </>
            )}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className='px-6 py-3 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition-colors'
        >
          Logout
        </button>

      </div>
    </main>
  )
}

/* Reusable Components */

function StatCard({
  value,
  label,
}: {
  value: string
  label: string
  color: string
}) {
  return (
    <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
      <div className='text-3xl font-bold text-blue-600 mb-1'>
        {value}
      </div>
      <div className='text-gray-500 text-sm'>{label}</div>
    </div>
  )
}

function ActionLink({
  href,
  emoji,
  label
}: {
  href: string
  emoji: string
  label: string
}) {
  return (
    <Link
      href={href}
      className='flex flex-col items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors'
    >
      <span className='text-3xl mb-2'>{emoji}</span>
      <span className='text-sm font-medium text-gray-700'>
        {label}
      </span>
    </Link>
  )
}