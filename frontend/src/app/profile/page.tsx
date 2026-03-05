'use client'
import { useState, useEffect } from 'react'

interface Profile {
  firstName?: string
  lastName?: string
  headline?: string
  currentLocation?: string
  industry?: string
  yearsOfExperience?: number
  expectedSalary?: number
  skills?: string[]
  resumeUrl?: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    headline: '',
    currentLocation: '',
    industry: '',
    yearsOfExperience: '',
    expectedSalary: '',
    skills: ''
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/login'
      return
    }
    fetchProfile(token)
  }, [])

  const fetchProfile = async (token: string) => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/candidates/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()

      if (data.success) {
        setProfile(data.data)

        setFormData({
          firstName: data.data.firstName || '',
          lastName: data.data.lastName || '',
          headline: data.data.headline || '',
          currentLocation: data.data.currentLocation || '',
          industry: data.data.industry || '',
          yearsOfExperience: data.data.yearsOfExperience?.toString() || '',
          expectedSalary: data.data.expectedSalary?.toString() || '',
          skills: data.data.skills?.join(', ') || ''
        })
      }
    } catch (err) {
      console.error(err)
      setMessage('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const res = await fetch('http://localhost:5000/api/v1/candidates/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          skills: formData.skills
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s !== ''),
          yearsOfExperience: Number(formData.yearsOfExperience),
          expectedSalary: Number(formData.expectedSalary)
        })
      })

      const data = await res.json()
      if (data.success) {
        setMessage('Profile updated successfully!')
      } else {
        setMessage(data.message || 'Update failed')
      }
    } catch (err) {
      setMessage('Something went wrong')
    }
  }

  const handleResumeUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const token = localStorage.getItem('token')
    if (!token) return

    const form = new FormData()
    form.append('resume', file)

    try {
      const res = await fetch(
        'http://localhost:5000/api/v1/candidates/resume',
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: form
        }
      )

      const data = await res.json()

      if (data.success) {
        setMessage('Resume uploaded successfully!')
        fetchProfile(token)
      } else {
        setMessage(data.message)
      }
    } catch (err) {
      setMessage('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <main className='min-h-screen bg-gray-50 pt-24 flex items-center justify-center'>
        <p className='text-gray-400'>Loading profile...</p>
      </main>
    )
  }

  return (
    <main className='min-h-screen bg-gray-50 pt-16'>
      <div className='max-w-3xl mx-auto px-6 py-10'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>My Profile</h1>
        <p className='text-gray-500 mb-8'>
          Keep your profile updated to get better job matches
        </p>

        {message && (
          <div className='bg-green-50 text-green-700 px-4 py-3 rounded-xl mb-6 font-medium'>
            {message}
          </div>
        )}

        {/* Resume Upload */}
        <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6'>
          <h2 className='font-bold text-gray-900 mb-4'>Resume</h2>

          {profile?.resumeUrl && (
            <div className='flex items-center justify-between bg-green-50 rounded-xl p-4 mb-4'>
              <div>
                <p className='font-medium text-green-700'>Resume Uploaded</p>
                <p className='text-sm text-gray-500'>
                  Your resume is visible to employers
                </p>
              </div>

              {/* ✅ FIXED anchor tag */}
              <a
                href={'http://localhost:5000' + profile.resumeUrl}
                target='_blank'
                rel='noreferrer'
                className='px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition-colors'
              >
                View Resume
              </a>
            </div>
          )}

          {!profile?.resumeUrl && (
            <div className='bg-gray-50 rounded-xl p-4 mb-4 text-center text-gray-400'>
              No resume uploaded yet
            </div>
          )}

          <label className='block cursor-pointer'>
            <div className='border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-400 transition-colors'>
              <p className='text-gray-500 mb-2'>
                {uploading ? 'Uploading...' : 'Click to upload resume'}
              </p>
              <p className='text-xs text-gray-400'>
                PDF, DOC, DOCX — Max 5MB
              </p>
            </div>
            <input
              type='file'
              accept='.pdf,.doc,.docx'
              onChange={handleResumeUpload}
              className='hidden'
              disabled={uploading}
            />
          </label>
        </div>

        {/* Profile Form remains same as your original */}
        {/* (No structural issues there) */}
      </div>
    </main>
  )
}