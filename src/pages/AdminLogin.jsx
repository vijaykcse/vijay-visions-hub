import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState(1) // Step 1: Ask for Email, Step 2: Ask for Code
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  // --- STEP 1: Send the 6-digit code to the email ---
  const handleSendCode = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOtp({ 
      email: email 
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setStep(2) // Successfully sent! Move to the code entry screen
      setLoading(false)
    }
  }

  // --- STEP 2: Verify the code and log the admin in ---
  const handleVerifyCode = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error } = await supabase.auth.verifyOtp({
      email: email,
      token: code,
      type: 'email'
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else if (data.session) {
      navigate('/admin') // Code is correct, let them in!
    }
  }

  const inputClass = "w-full p-3 rounded-xl bg-black/[0.04] border border-black/10 focus:outline-none focus:ring-1 focus:ring-black/20 text-black placeholder-black/30 transition-all font-bold tracking-widest text-center text-lg"

  return (
    <div className="flex-1 flex items-center justify-center p-6 w-full h-screen bg-white relative overflow-hidden">

      {/* Ambient blur blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-black/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-black/[0.02] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-black/[0.02] rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 bg-black/[0.02] backdrop-blur-2xl p-8 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.06)] w-full max-w-sm border border-black/10">

        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-black tracking-tight">Admin Access</h2>
          <p className="text-black/40 mt-2 text-xs tracking-[0.2em] uppercase font-black">
            {step === 1 ? 'Two-Step Verification' : 'Check Your Inbox'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm text-center font-bold">
            {error}
          </div>
        )}

        {/* --- RENDER STEP 1 (EMAIL FORM) --- */}
        {step === 1 && (
          <form onSubmit={handleSendCode} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="ADMIN EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-black py-4 rounded-xl hover:bg-black/80 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.10)] disabled:opacity-40 active:scale-95"
            >
              {loading ? 'Sending...' : 'Send Secure Code'}
            </button>
          </form>
        )}

        {/* --- RENDER STEP 2 (CODE FORM) --- */}
        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div>
              <p className="text-center text-sm font-bold text-black/50 mb-4">
                We sent a 6-digit code to<br/><span className="text-black">{email}</span>
              </p>
              <input
                type="text"
                maxLength="6"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || code.length < 6}
              className="w-full bg-black text-white font-black py-4 rounded-xl hover:bg-black/80 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.10)] disabled:opacity-40 active:scale-95"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
            
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-black/40 hover:text-black font-bold text-xs uppercase tracking-widest mt-4 transition-colors"
            >
              ← Use a different email
            </button>
          </form>
        )}

      </div>
    </div>
  )
}