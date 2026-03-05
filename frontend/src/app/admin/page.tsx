'use client'
import { useState, useEffect } from 'react'

interface Job {
  id: string
  title: string
  location: string
  industry: string
  jobType: string
  status: string
  createdAt: string
}

interface Stats {
  totalJobs: number
  totalUsers: number
  totalApplications: number
  revenue: number
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    const user = localStorage.getItem('user')
    const token = localStorage.getItem('token')

    if (!user || !token) {
      window.location.href = '/login'
      return
    }

    const parsedUser = JSON.parse(user)

    // 🔐 Check admin role
    if (parsedUser.role !== 'admin') {
      window.location.href = '/dashboard'
      return
    }

    fetchData(token)
  }, [])

  const fetchData = async (token: string) => {
    try {
      const jobsRes = await fetch('http://localhost:5000/api/v1/jobs', {
        headers: { Authorization: `Bearer ${token}` }
      })

      const jobsData = await jobsRes.json()

      if (!jobsData.success) {
        throw new Error('Failed to fetch jobs')
      }

      const jobList: Job[] = jobsData.data
      setJobs(jobList)

      // ✅ Dynamic Stats
      setStats({
        totalJobs: jobList.length,
        totalUsers: 0, // replace when API ready
        totalApplications: 0, // replace later
        revenue: 0 // replace when payments API ready
      })

    } catch (err) {
      console.error(err)
      alert('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className='min-h-screen bg-gray-50 pt-24 flex items-center justify-center'>
        <p className='text-gray-400'>Loading admin panel...</p>
      </main>
    )
  }

  return (
    <main className='min-h-screen bg-gray-50 pt-16'>
      <div className='max-w-7xl mx-auto px-6 py-8'>

        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>Admin Panel</h1>
            <p className='text-gray-500'>Manage your InstaHire platform</p>
          </div>
          <span className='px-4 py-2 bg-red-100 text-red-700 font-medium rounded-xl text-sm'>
            Super Admin
          </span>
        </div>

        {/* Stats */}
        {stats && (
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mb-8'>
            {[
              { label: 'Total Jobs', value: stats.totalJobs, emoji: '💼' },
              { label: 'Total Users', value: stats.totalUsers, emoji: '👥' },
              { label: 'Applications', value: stats.totalApplications, emoji: '📋' },
              { label: 'Revenue', value: `₹${stats.revenue}`, emoji: '💰' }
            ].map(stat => (
              <div
                key={stat.label}
                className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'
              >
                <div className='text-3xl mb-2'>{stat.emoji}</div>
                <div className='text-2xl font-bold text-gray-900 mb-1'>
                  {stat.value}
                </div>
                <div className='text-gray-500 text-sm'>{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className='flex gap-2 mb-6'>
          {['dashboard', 'jobs', 'users'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl font-medium text-sm capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100'>
            <div className='p-6 border-b border-gray-100'>
              <h2 className='font-bold text-gray-900'>All Jobs</h2>
            </div>

            <div className='divide-y divide-gray-100'>
              {jobs.map(job => (
                <div
                  key={job.id}
                  className='p-6 flex items-center justify-between'
                >
                  <div>
                    <h3 className='font-medium text-gray-900'>
                      {job.title}
                    </h3>
                    <p className='text-sm text-gray-500'>
                      {job.location} • {job.industry} • {job.jobType}
                    </p>
                  </div>

                  <div className='flex items-center gap-3'>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        job.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {job.status}
                    </span>

                    <span className='text-xs text-gray-400'>
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  )
}