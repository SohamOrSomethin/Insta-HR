'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')

  const industries = [
    'IT', 'Finance', 'Banking', 'Healthcare',
    'Manufacturing', 'Pharma', 'Civil', 'Automation',
    'Mechanical', 'Logistics'
  ]

  const stats = [
    { value: '50,000+', label: 'Active Jobs' },
    { value: '2M+', label: 'Candidates' },
    { value: '10,000+', label: 'Companies' },
    { value: '95%', label: 'Placement Rate' },
  ]

  return (
    <main className='pt-16'>

      {/* Hero Section */}
      <section className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center'>
        <div className='max-w-6xl mx-auto px-6 py-20 text-center'>
          
          <div className='inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8'>
            <span className='w-2 h-2 bg-blue-500 rounded-full'></span>
            AI-Powered Job Matching
          </div>

          <h1 className='text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight'>
            Find Your{' '}
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'>
              Dream Job
            </span>
            {' '}with AI
          </h1>

          <p className='text-xl text-gray-500 mb-10 max-w-2xl mx-auto'>
            InstaHire uses cutting-edge AI to match your skills with perfect opportunities. Train, certify, and get hired faster.
          </p>

          {/* Search Box */}
          <div className='bg-white rounded-2xl shadow-2xl p-3 flex flex-col md:flex-row gap-3 max-w-3xl mx-auto mb-6'>
            <input
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder='Job title, skills, company...'
              className='flex-1 px-4 py-3 outline-none text-gray-700 rounded-xl'
            />
            <input
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder='Location...'
              className='flex-1 px-4 py-3 outline-none text-gray-700 border-l border-gray-100 rounded-xl'
            />
            <Link
              href={`/jobs?keyword=${keyword}&location=${location}`}
              className='px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors'
            >
              Search Jobs
            </Link>
          </div>

          <p className='text-gray-400 text-sm'>
            Popular: React Developer, Data Analyst, Civil Engineer, Finance Manager
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className='py-16 bg-white'>
        <div className='max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8'>
          {stats.map(({ value, label }) => (
            <div key={label} className='text-center'>
              <div className='text-4xl font-bold text-blue-600 mb-2'>{value}</div>
              <div className='text-gray-500'>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Industries Section */}
      <section className='py-16 bg-gray-50'>
        <div className='max-w-6xl mx-auto px-6'>
          <h2 className='text-3xl font-bold text-gray-900 text-center mb-3'>
            Explore by Industry
          </h2>
          <p className='text-gray-500 text-center mb-10'>
            Find jobs across all major sectors
          </p>
          <div className='flex flex-wrap justify-center gap-3'>
            {industries.map(industry => (
              <Link
                key={industry}
                href={`/jobs?industry=${industry}`}
                className='px-6 py-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:shadow-md transition-all'
              >
                {industry}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-16 bg-white'>
        <div className='max-w-6xl mx-auto px-6'>
          <h2 className='text-3xl font-bold text-gray-900 text-center mb-3'>
            Why Choose InstaHire?
          </h2>
          <p className='text-gray-500 text-center mb-12'>
            We are better than the rest
          </p>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {[
              { title: 'AI Resume Matching', desc: 'Our AI engine matches your resume with jobs automatically and gives you a match score.', emoji: '🤖' },
              { title: 'Training & Certification', desc: 'Learn new skills, get certified and increase your chances of getting hired.', emoji: '📚' },
              { title: 'Outsourcing Services', desc: 'Companies can hire outsourced teams and manage them directly on our platform.', emoji: '🏭' },
            ].map(({ title, desc, emoji }) => (
              <div key={title} className='p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow'>
                <div className='text-4xl mb-4'>{emoji}</div>
                <h3 className='text-xl font-bold text-gray-900 mb-3'>{title}</h3>
                <p className='text-gray-500'>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 bg-gradient-to-r from-blue-600 to-purple-600'>
        <div className='max-w-4xl mx-auto px-6 text-center'>
          <h2 className='text-4xl font-bold text-white mb-4'>
            Ready to Find Your Dream Job?
          </h2>
          <p className='text-blue-100 mb-8 text-lg'>
            Join 2 million candidates already using InstaHire
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link href='/register'
              className='px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors'>
              Create Free Account
            </Link>
            <Link href='/jobs'
              className='px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors'>
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-gray-900 text-gray-400 py-12'>
        <div className='max-w-6xl mx-auto px-6 text-center'>
          <div className='flex items-center justify-center gap-2 mb-4'>
            <div className='w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg' />
            <span className='text-xl font-bold text-white'>InstaHire</span>
          </div>
          <p className='text-sm'>© 2026 InstaHire. All rights reserved.</p>
        </div>
      </footer>

    </main>
  )
}