'use client'
import { useState } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function SubscriptionPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [rzpLoaded, setRzpLoaded] = useState(false)

  const plans = [
    {
      id: 'standard',
      name: 'Standard',
      price: '₹2,999',
      period: '/month',
      popular: false,
      features: [
        'Unlimited Job Postings',
        'Resume Search Access',
        'Basic AI Matching',
        'Email Support',
        'Up to 50 Applications/month'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '₹7,999',
      period: '/month',
      popular: true,
      features: [
        'Everything in Standard',
        'Featured Job Listings',
        'Advanced AI Ranking',
        'Priority Support',
        'Social Media Promotion',
        'Unlimited Applications',
        'Analytics Dashboard'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '₹19,999',
      period: '/month',
      popular: false,
      features: [
        'Everything in Premium',
        'Dedicated Account Manager',
        'Custom AI Reports',
        'API Access',
        'Outsourcing Support',
        'Custom Branding',
        'SLA Guarantee'
      ]
    }
  ]

  const handleSubscribe = async (planId: string) => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/login'
      return
    }

    if (!rzpLoaded) {
      alert('Payment system loading. Please try again.')
      return
    }

    setLoading(planId)

    try {
      const res = await fetch(
        'http://localhost:5000/api/v1/payments/create-order',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ plan: planId })
        }
      )

      const data = await res.json()

      if (!data.success) {
        alert(data.message)
        setLoading(null)
        return
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'InstaHire',
        description: data.plan,
        order_id: data.orderId,
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch(
              'http://localhost:5000/api/v1/payments/verify',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  plan: planId
                })
              }
            )

            const verifyData = await verifyRes.json()

            if (verifyData.success) {
              alert('Payment successful! Subscription activated!')
              window.location.href = '/dashboard'
            } else {
              alert('Payment verification failed.')
            }
          } catch {
            alert('Verification failed.')
          } finally {
            setLoading(null)
          }
        },
        theme: { color: '#2563EB' }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()

      rzp.on('payment.failed', function () {
        alert('Payment failed. Please try again.')
        setLoading(null)
      })
    } catch (err) {
      alert('Something went wrong')
      setLoading(null)
    }
  }

  return (
    <>
      {/* Razorpay Script (Correct Way) */}
      <Script
        src='https://checkout.razorpay.com/v1/checkout.js'
        strategy='afterInteractive'
        onLoad={() => setRzpLoaded(true)}
      />

      <main className='min-h-screen bg-gray-50 pt-16'>
        <div className='bg-gradient-to-r from-blue-600 to-purple-600 py-12 px-6'>
          <div className='max-w-6xl mx-auto text-center'>
            <h1 className='text-3xl font-bold text-white mb-2'>
              Choose Your Plan
            </h1>
            <p className='text-blue-100'>
              Unlock powerful features to hire better and faster
            </p>
          </div>
        </div>

        <div className='max-w-6xl mx-auto px-6 py-12'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-2xl shadow-sm border-2 p-8 relative ${
                  plan.popular
                    ? 'border-purple-500'
                    : 'border-gray-100'
                }`}
              >
                {plan.popular && (
                  <div className='absolute -top-4 left-1/2 -translate-x-1/2'>
                    <span className='bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium'>
                      Most Popular
                    </span>
                  </div>
                )}

                <h2 className='text-xl font-bold text-gray-900 mb-2'>
                  {plan.name}
                </h2>

                <div className='flex items-end gap-1 mb-6'>
                  <span className='text-4xl font-bold text-gray-900'>
                    {plan.price}
                  </span>
                  <span className='text-gray-400 mb-1'>
                    {plan.period}
                  </span>
                </div>

                <ul className='space-y-3 mb-8'>
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className='flex items-center gap-2 text-gray-600 text-sm'
                    >
                      <span className='text-green-500 font-bold'>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading === plan.id}
                  className={`w-full py-3 font-bold rounded-xl transition-colors disabled:opacity-50 ${
                    plan.popular
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {loading === plan.id
                    ? 'Processing...'
                    : `Get ${plan.name}`}
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}