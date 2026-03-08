import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

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
    const { error } = await supabase.auth.signInWithOtp({ email: email })
    if (error) { setError(error.message); setLoading(false) } 
    else { setStep(2); setLoading(false) }
  }

  const handleVerifyCode = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.auth.verifyOtp({ email: email, token: code, type: 'email' })
    if (error) { setError(error.message); setLoading(false) } 
    else if (data.session) { navigate('/admin') }
  }

  // Upgraded input styling
  const inputClass = "w-full p-4 rounded-2xl bg-white/50 border border-white/80 focus:outline-none focus:ring-2 focus:ring-slate-400/20 focus:border-slate-400 text-slate-800 placeholder-slate-400 transition-all font-bold tracking-widest text-center text-lg shadow-inner"

  return (
    <div className="flex-1 flex items-center justify-center p-6 w-full h-screen bg-[#faf9f8] relative overflow-hidden">

      {/* --- PREMIUM AURORA MESH BACKGROUND --- */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -left-20 w-[600px] h-[600px] bg-orange-200/40 rounded-full blur-[120px] mix-blend-multiply" />
        <div className="absolute top-1/3 -right-40 w-[700px] h-[700px] bg-blue-200/40 rounded-full blur-[150px] mix-blend-multiply" />
        <div className="absolute -bottom-40 left-1/4 w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-[120px] mix-blend-multiply" />
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[50px] z-10" />
      </div>

      {/* --- GLASS LOGIN PANEL --- */}
      <div className="relative z-20 bg-white/40 backdrop-blur-2xl p-8 sm:p-10 rounded-[2.5rem] shadow-[0_8px_40px_rgba(0,0,0,0.04)] w-full max-w-sm border border-white/60 group">
        
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2.5rem]" />

        <div className="text-center mb-8 relative z-10">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Admin Access</h2>
          <p className="text-slate-500 mt-2 text-xs tracking-[0.2em] uppercase font-black">
            {step === 1 ? 'Secure Gateway' : 'Check Your Inbox'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm text-center font-bold relative z-10">
            {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSendCode} className="space-y-6 relative z-10">
            <input type="email" placeholder="ADMIN EMAIL" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
            <button type="submit" disabled={loading} className="w-full bg-slate-800 text-white font-black py-4 rounded-2xl hover:bg-slate-700 transition-all shadow-lg shadow-slate-800/20 disabled:opacity-40 active:scale-95">
              {loading ? 'Sending...' : 'Send Secure Code'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="space-y-6 relative z-10">
            <div>
              <p className="text-center text-sm font-medium text-slate-500 mb-4">
                Sent 8-digit code to<br/><span className="text-slate-800 font-bold">{email}</span>
              </p>
              <input type="text" maxLength="8" placeholder="00000000" value={code} onChange={(e) => setCode(e.target.value)} className={inputClass} required />
            </div>
            <button type="submit" disabled={loading || code.length < 8} className="w-full bg-slate-800 text-white font-black py-4 rounded-2xl hover:bg-slate-700 transition-all shadow-lg shadow-slate-800/20 disabled:opacity-40 active:scale-95">
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button type="button" onClick={() => setStep(1)} className="w-full text-slate-400 hover:text-slate-800 font-bold text-xs uppercase tracking-widest mt-4 transition-colors">
              ← Use a different email
            </button>
          </form>
        )}

      </div>
    </div>
  )
}