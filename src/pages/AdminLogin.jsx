import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/admin')
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center p-6 w-full h-screen bg-white relative overflow-hidden">

      {/* Ambient blur blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-black/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-black/[0.02] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-black/[0.02] rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 bg-black/[0.03] backdrop-blur-2xl p-8 rounded-3xl shadow-[0_40px_80px_rgba(0,0,0,0.08)] w-full max-w-md border border-black/10">

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-black tracking-tight">Admin Access</h2>
          <p className="text-black/30 mt-2 text-sm tracking-widest uppercase font-black">Vijay Visions Hub</p>
        </div>

        {error && (
          <div className="bg-black/5 border border-black/10 text-black/60 px-4 py-3 rounded-xl mb-4 text-sm text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-black/40 mb-2 uppercase tracking-wider">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-black/[0.04] border border-black/10 focus:outline-none focus:ring-1 focus:ring-black/20 text-black placeholder-black/20 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-black/40 mb-2 uppercase tracking-wider">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-black/[0.04] border border-black/10 focus:outline-none focus:ring-1 focus:ring-black/20 text-black placeholder-black/20 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white font-black py-3 rounded-xl hover:bg-black/80 transition-all shadow-[0_0_40px_rgba(0,0,0,0.10)] disabled:opacity-40 active:scale-95"
          >
            {loading ? 'Authenticating...' : 'Login to Dashboard'}
          </button>
        </form>

      </div>
    </div>
  )
}