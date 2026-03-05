'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function JobDetailPage() {
  const { id } = useParams()
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch(`http://localhost:5000/api/v1/jobs/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setJob(data.data)
        setLoading(false)
      })
  }, [id])

  const handleApply = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/login'
      return
    }

    setApplying(true)
    try {
      const res = await fetch(`http://localhost:5000/api/v1/applications/apply/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ coverLetter: '' })
      })
      const data = await res.json()
      if (data.success) {
        setMessage('✅ Applied successfully!')
      } else {
        setMessage(data.message)
      }
    } catch (err) {
      setMessage('Something went wrong')
    }
    setApplying(false)
  }

  if (loading) return (
    <main className='min-h-screen bg-gray-50 pt-24 flex items-center justify-center'>
      <p className='text-gray-400 text-lg'>Loading job...</p>
    </main>
  )

  if (!job) return (
    <main className='min-h-screen bg-gray-50 pt-24 flex items-center justify-center'>
      <p className='text-gray-400 text-lg'>Job not found</p>
    </main>
  )

  return (
    <main className='min-h-screen bg-gray-50 pt-16'>
      <div className='max-w-4xl mx-auto px-6 py-10'>

        <Link href='/jobs' className='text-blue-600 text-sm font-medium mb-6 inline-block hover:underline'>
          ← Back to Jobs
        </Link>

        {/* Job Header */}
        <div className='bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6'>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>{job.title}</h1>
          <p className='text-gray-500 mb-4'>{job.location}</p>

          <div className='flex flex-wrap gap-2 mb-6'>
            <span className='px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full'>{job.industry}</span>
            <span className='px-3 py-1 bg-purple-50 text-purple-700 text-sm font-medium rounded-full'>{job.jobType}</span>
            <span className='px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full'>
              {job.experienceMin} - {job.experienceMax} years exp
            </span>
          </div>

          <div className='bg-green-50 rounded-xl p-4 mb-6'>
            <p className='text-sm text-gray-500 mb-1'>Salary Range</p>
            <p className='text-2xl font-bold text-green-600'>
              ₹{Number(job.salaryMin).toLocaleString()} - ₹{Number(job.salaryMax).toLocaleString()}
            </p>
          </div>

          <div className='mb-6'>
            <h3 className='font-bold text-gray-900 mb-3'>Required Skills</h3>
            <div className='flex flex-wrap gap-2'>
              {job.skills?.map((skill: string) => (
                <span key={skill} className='px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full'>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {message ? (
            <div className='bg-green-50 text-green-700 px-4 py-3 rounded-xl font-medium'>
              {message}
            </div>
          ) : (
            <button
              onClick={handleApply}
              disabled={applying}
              className='w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 text-lg'
            >
              {applying ? 'Applying...' : '🚀 Apply Now'}
            </button>
          )}
        </div>

        <div className='bg-white rounded-2xl p-8 shadow-sm border border-gray-100'>
          <h2 className='text-xl font-bold text-gray-900 mb-4'>Job Description</h2>
          <p className='text-gray-600 leading-relaxed'>{job.description}</p>
        </div>

      </div>
    </main>
  )
}
