import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/admin/panel/dashboard');
      }
    });
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else if (data.session) {
      navigate('/admin/panel/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] font-sans">
      <div className="bg-white p-8 md:p-12 border border-[#E5E5E5] rounded-lg shadow-sm w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-black tracking-tighter uppercase text-[#111111]">Admin Area</h1>
          <p className="font-mono text-xs text-gray-500 mt-2">[ RESTRICTED ACCESS ]</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 mb-6 rounded-md font-mono text-xs border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold font-mono tracking-wider text-gray-700 mb-2">EMAIL</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 border border-[#E5E5E5] bg-[#FAFAFA] focus:outline-none focus:border-[#666666] transition-colors rounded-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold font-mono tracking-wider text-gray-700 mb-2">PASSWORD</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 border border-[#E5E5E5] bg-[#FAFAFA] focus:outline-none focus:border-[#666666] transition-colors rounded-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#111111] text-[#FAFAFA] font-bold font-mono text-sm py-4 hover:bg-[#666666] transition-colors disabled:opacity-50"
          >
            {loading ? 'AUTHENTICATING...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
  );
}
