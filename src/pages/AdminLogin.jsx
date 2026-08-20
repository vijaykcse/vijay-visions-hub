import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import BackgroundMesh from '../components/BackgroundMesh'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState(1)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSendCode = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setStep(2)
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else if (data.session) {
      navigate('/admin')
    }
  }

  return (
    <div className="relative flex-1 min-h-screen flex items-center justify-center p-6 bg-[#f4f7fb] text-slate-900 overflow-hidden">
      <BackgroundMesh />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md p-8 sm:p-10 rounded-[2.5rem] bg-white/90 border border-slate-200 shadow-2xl backdrop-blur-2xl"
      >
        <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center shadow-md">
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Admin Gateway
          </h2>
          <p className="text-xs uppercase tracking-widest font-bold text-orange-600 mt-2">
            {step === 1 ? 'Authorized Access Only' : 'Enter One-Time Security Passcode'}
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold text-center"
          >
            {error}
          </motion.div>
        )}

        {step === 1 && (
          <form onSubmit={handleSendCode} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 pl-1">
                Admin Email Address
              </label>
              <input
                type="email"
                placeholder="admin@vijayvisions.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-medium text-center text-base shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold shadow-lg shadow-orange-500/25 transition-all transform active:scale-95 disabled:opacity-40"
            >
              {loading ? 'Sending Code...' : 'Send Access OTP'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="space-y-5">
            <div>
              <p className="text-center text-xs text-slate-500 mb-4">
                Enter passcode sent to <br />
                <span className="text-orange-600 font-bold">{email}</span>
              </p>

              <input
                type="text"
                maxLength="8"
                placeholder="00000000"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-mono tracking-widest text-center text-xl font-bold shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={loading || code.length < 8}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold shadow-lg shadow-orange-500/25 transition-all transform active:scale-95 disabled:opacity-40"
            >
              {loading ? 'Verifying...' : 'Authenticate & Unlock'}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors pt-2"
            >
              ← Use a different email
            </button>
          </form>
        )}
      </motion.div>
    </div>
  )
}