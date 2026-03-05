'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/jobs')
      .then(res => res.json())
      .then(data => {
        if (data.success) setJobs(data.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <main className='min-h-screen bg-gray-50 pt-16'>

      {/* Header */}
      <div className='bg-gradient-to-r from-blue-600 to-purple-600 py-12 px-6'>
        <div className='max-w-6xl mx-auto text-center'>
          <h1 className='text-3xl font-bold text-white mb-2'>Find Your Perfect Job</h1>
          <p className='text-blue-100'>Browse thousands of jobs across all industries</p>
        </div>
      </div>

      {/* Jobs List */}
      <div className='max-w-4xl mx-auto px-6 py-8'>
        {loading ? (
          <div className='text-center py-20 text-gray-400 text-lg'>Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className='text-center py-20 text-gray-400 text-lg'>No jobs found</div>
        ) : (
          <div className='space-y-4'>
            {jobs.map((job) => (
              <Link
                href={`/jobs/${job.id}`}
                key={job.id}
                className='block bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all'
              >
                <h3 className='text-lg font-bold text-gray-900 mb-1'>{job.title}</h3>
                <p className='text-gray-500 text-sm mb-3'>{job.location}</p>
                <p className='text-gray-600 text-sm mb-4'>{job.description?.substring(0, 150)}...</p>
                <div className='flex items-center justify-between'>
                  <div className='flex gap-2'>
                    <span className='px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full'>{job.industry}</span>
                    <span className='px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full'>{job.jobType}</span>
                  </div>
                  <span className='text-green-600 font-medium text-sm'>
                    ₹{Number(job.salaryMin).toLocaleString()} - ₹{Number(job.salaryMax).toLocaleString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}