'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) setUser(JSON.parse(userData))
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  return (
    <nav className='fixed top-0 inset-x-0 z-50 bg-white shadow-sm border-b border-gray-100'>
      <div className='max-w-7xl mx-auto px-6 flex items-center justify-between h-16'>

        {/* Logo */}
        <Link href='/' className='flex items-center gap-2'>
          <div className='w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg' />
          <span className='text-xl font-bold text-gray-900'>InstaHire</span>
        </Link>

        {/* Desktop Links */}
        <div className='hidden md:flex items-center gap-8 text-sm font-medium text-gray-600'>
          <Link href='/jobs' className='hover:text-blue-600 transition-colors'>Find Jobs</Link>
          <Link href='/training' className='hover:text-blue-600 transition-colors'>Training</Link>
          <Link href='/employers' className='hover:text-blue-600 transition-colors'>For Employers</Link>
        </div>

        {/* Auth Buttons */}
        <div className='hidden md:flex items-center gap-3'>
          {user ? (
            <>
              <Link href='/dashboard'
                className='px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors'>
                Dashboard
              </Link>
              <button
                onClick={logout}
                className='px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors'>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href='/login'
                className='px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors'>
                Login
              </Link>
              <Link href='/register'
                className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors'>
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className='md:hidden p-2'>
          <div className='w-5 h-0.5 bg-gray-600 mb-1' />
          <div className='w-5 h-0.5 bg-gray-600 mb-1' />
          <div className='w-5 h-0.5 bg-gray-600' />
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className='md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4'>
          <Link href='/jobs' className='text-gray-700 font-medium'>Find Jobs</Link>
          <Link href='/training' className='text-gray-700 font-medium'>Training</Link>
          <Link href='/employers' className='text-gray-700 font-medium'>For Employers</Link>
          {user ? (
            <>
              <Link href='/dashboard' className='text-gray-700 font-medium'>Dashboard</Link>
              <button onClick={logout} className='text-left text-red-500 font-medium'>Logout</button>
            </>
          ) : (
            <>
              <Link href='/login' className='text-gray-700 font-medium'>Login</Link>
              <Link href='/register' className='text-center px-4 py-2 text-white bg-blue-600 rounded-lg font-medium'>
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}