'use client'
import { useState, useEffect } from 'react'

export default function TrainingPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/training')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCourses(data.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleEnroll = async (courseId: string) => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/login'
      return
    }

    setEnrolling(courseId)
    try {
      const res = await fetch(`http://localhost:5000/api/v1/training/${courseId}/enroll`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setMessage('Enrolled successfully!')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (err) {
      setMessage('Something went wrong')
    }
    setEnrolling(null)
  }

  return (
    <main className='min-h-screen bg-gray-50 pt-16'>

      {/* Header */}
      <div className='bg-gradient-to-r from-blue-600 to-purple-600 py-12 px-6'>
        <div className='max-w-6xl mx-auto text-center'>
          <h1 className='text-3xl font-bold text-white mb-2'>Training & Certification</h1>
          <p className='text-blue-100'>Learn new skills and get certified to boost your career</p>
        </div>
      </div>

      <div className='max-w-6xl mx-auto px-6 py-8'>

        {message && (
          <div className='bg-green-50 text-green-700 px-4 py-3 rounded-xl mb-6 font-medium'>
            {message}
          </div>
        )}

        {loading ? (
          <div className='text-center py-20 text-gray-400'>Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className='text-center py-20'>
            <p className='text-gray-400 text-lg mb-4'>No courses available yet</p>
            <p className='text-gray-400'>Check back soon!</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {courses.map((course) => (
              <div key={course.id} className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow'>

                {/* Thumbnail */}
                <div className='h-40 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center'>
                  <span className='text-5xl'>📚</span>
                </div>

                <div className='p-6'>
                  <div className='flex items-center justify-between mb-2'>
                    <span className='px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full'>
                      {course.category}
                    </span>
                    {course.isFree ? (
                      <span className='px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full'>
                        FREE
                      </span>
                    ) : (
                      <span className='text-gray-900 font-bold text-sm'>
                        ₹{Number(course.price).toLocaleString()}
                      </span>
                    )}
                  </div>

                  <h3 className='text-lg font-bold text-gray-900 mb-2'>{course.title}</h3>
                  <p className='text-gray-500 text-sm mb-4 line-clamp-2'>{course.description}</p>

                  <div className='flex items-center gap-4 text-xs text-gray-400 mb-4'>
                    <span>⏱ {course.duration}</span>
                    <span>👥 {course.enrollmentCount} enrolled</span>
                    {course.rating > 0 && <span>⭐ {course.rating}</span>}
                  </div>

                  <div className='flex flex-wrap gap-1 mb-4'>
                    {course.skills?.slice(0, 3).map((skill: string) => (
                      <span key={skill} className='px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full'>
                        {skill}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => handleEnroll(course.id)}
                    disabled={enrolling === course.id}
                    className='w-full py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50'
                  >
                    {enrolling === course.id ? 'Enrolling...' : 'Enroll Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
