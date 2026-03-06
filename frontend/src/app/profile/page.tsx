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
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
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
        headers: { Authorization: 'Bearer ' + token }
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
          yearsOfExperience: data.data.yearsOfExperience ? data.data.yearsOfExperience.toString() : '',
          expectedSalary: data.data.expectedSalary ? data.data.expectedSalary.toString() : '',
          skills: data.data.skills ? data.data.skills.join(', ') : ''
        })
      }
    } catch (err) {
      showMessage('Failed to load profile', true)
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (msg: string, error: boolean = false) => {
    setMessage(msg)
    setIsError(error)
    setTimeout(() => setMessage(''), 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      const res = await fetch('http://localhost:5000/api/v1/candidates/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          headline: formData.headline,
          currentLocation: formData.currentLocation,
          industry: formData.industry,
          yearsOfExperience: formData.yearsOfExperience ? Number(formData.yearsOfExperience) : 0,
          expectedSalary: formData.expectedSalary ? Number(formData.expectedSalary) : 0,
          skills: formData.skills.split(',').map(s => s.trim()).filter(s => s !== '')
        })
      })
      const data = await res.json()
      if (data.success) {
        setProfile(data.data)
        showMessage('Profile updated successfully!')
      } else {
        showMessage(data.message || 'Update failed', true)
      }
    } catch (err) {
      showMessage('Something went wrong', true)
    } finally {
      setSaving(false)
    }
  }

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      showMessage('File must be smaller than 5MB', true)
      return
    }
    setUploading(true)
    const token = localStorage.getItem('token')
    if (!token) return
    const form = new FormData()
    form.append('resume', file)
    try {
      const res = await fetch('http://localhost:5000/api/v1/candidates/resume', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token },
        body: form
      })
      const data = await res.json()
      if (data.success) {
        showMessage('Resume uploaded successfully!')
        fetchProfile(token)
      } else {
        showMessage(data.message, true)
      }
    } catch (err) {
      showMessage('Upload failed', true)
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <p className="text-gray-400">Loading profile...</p>
      </main>
    )
  }

  const resumeHref = profile && profile.resumeUrl ? 'http://localhost:5000' + profile.resumeUrl : ''

  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-3xl mx-auto px-6 py-10">

        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-500 mb-8">Keep your profile updated to get better job matches</p>

        {message ? (
          <div className={isError ? 'px-4 py-3 rounded-xl mb-6 font-medium bg-red-50 text-red-600' : 'px-4 py-3 rounded-xl mb-6 font-medium bg-green-50 text-green-700'}>
            {message}
          </div>
        ) : null}

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h2 className="font-bold text-gray-900 mb-4">Resume</h2>

          {profile && profile.resumeUrl ? (
            <div className="flex items-center justify-between bg-green-50 rounded-xl p-4 mb-4">
              <div>
                <p className="font-medium text-green-700">Resume Uploaded</p>
                <p className="text-sm text-gray-500">Visible to employers</p>
              </div>
              <a
                href={resumeHref}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition-colors"
              >
                View Resume
              </a>
            </div>
          ) : null}

          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
              <p className="text-gray-500 mb-2">{uploading ? 'Uploading...' : 'Click to upload resume'}</p>
              <p className="text-xs text-gray-400">PDF, DOC, DOCX - Max 5MB</p>
            </div>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-6">

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-4">Personal Information</h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Headline</label>
              <input
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                placeholder="e.g. Senior React Developer"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Location</label>
              <input
                name="currentLocation"
                value={formData.currentLocation}
                onChange={handleChange}
                placeholder="e.g. Mumbai, India"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all"
                >
                  <option value="">Select Industry</option>
                  <option value="IT">IT</option>
                  <option value="Finance">Finance</option>
                  <option value="Banking">Banking</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Pharma">Pharma</option>
                  <option value="Civil">Civil</option>
                  <option value="Automation">Automation</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  placeholder="e.g. 3"
                  min="0"
                  max="50"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-4">Skills and Salary</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma separated)</label>
              <input
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Node.js, PostgreSQL"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expected Salary (per month in rupees)</label>
              <input
                type="number"
                name="expectedSalary"
                value={formData.expectedSalary}
                onChange={handleChange}
                placeholder="e.g. 80000"
                min="0"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 text-lg"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>

        </form>
      </div>
    </main>
  )
}