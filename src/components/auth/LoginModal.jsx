// src/components/auth/LoginModal.jsx
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'

const inputClass =
  'w-full border-2 border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 rounded-xl px-4 py-3 text-sm outline-none transition-all'

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

export default function LoginModal({ onClose, onSuccess }) {
  const { loginWithGoogle, loginWithEmail, register, resetPassword, error, clearError } = useAuth()

  const [tab,         setTab]        = useState('login')   // 'login' | 'register' | 'reset'
  const [name,        setName]       = useState('')
  const [email,       setEmail]      = useState('')
  const [password,    setPassword]   = useState('')
  const [confirmPass, setConfirmPass]= useState('')
  const [showPass,    setShowPass]   = useState(false)
  const [localError,  setLocalError] = useState('')
  const [loading,     setLoading]    = useState(false)
  const [resetSent,   setResetSent]  = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => { clearError(); setLocalError('') }, [tab, clearError])

  const displayError = localError || error

  const handleGoogle = async () => {
    setLoading(true)
    try {
      const u = await loginWithGoogle()
      onSuccess?.(u)
      onClose()
    } catch { /* error shown via context */ }
    finally { setLoading(false) }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) { setLocalError('Preencha e-mail e senha.'); return }
    setLoading(true)
    try {
      const u = await loginWithEmail(email, password)
      onSuccess?.(u)
      onClose()
    } catch { /* error shown via context */ }
    finally { setLoading(false) }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!name.trim())        { setLocalError('Informe seu nome.');           return }
    if (!email)              { setLocalError('Informe o e-mail.');            return }
    if (password.length < 6) { setLocalError('Senha mínima: 6 caracteres.');  return }
    if (password !== confirmPass) { setLocalError('As senhas não coincidem.'); return }
    setLoading(true)
    try {
      const u = await register(name.trim(), email, password)
      onSuccess?.(u)
      onClose()
    } catch { /* error shown via context */ }
    finally { setLoading(false) }
  }

  const handleReset = async (e) => {
    e.preventDefault()
    if (!email) { setLocalError('Informe seu e-mail.'); return }
    setLoading(true)
    try {
      await resetPassword(email)
      setResetSent(true)
    } catch { /* error shown via context */ }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-red-700 to-red-600 px-6 py-5 relative">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-xl p-2">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-white font-black text-lg leading-none">
                {tab === 'reset' ? 'Recuperar senha' : tab === 'login' ? 'Entrar na conta' : 'Criar conta'}
              </h2>
              <p className="text-red-200 text-xs mt-0.5">FrescaMart</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl font-bold leading-none"
          >×</button>
        </div>

        {/* Tab switcher */}
        {tab !== 'reset' && (
          <div className="flex border-b border-gray-100">
            {[['login','Entrar'], ['register','Cadastrar']].map(([t, label]) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-3 text-sm font-black transition-colors ${
                  tab === t
                    ? 'text-red-600 border-b-2 border-red-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <div className="p-6">
          {/* Google button */}
          {tab !== 'reset' && (
            <>
              <button
                onClick={handleGoogle}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl py-3 text-sm font-bold text-gray-700 transition-all disabled:opacity-50"
              >
                <GoogleIcon />
                Continuar com Google
              </button>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-bold">ou</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
            </>
          )}

          {/* Error */}
          {displayError && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4 text-xs text-red-700 font-medium flex items-start gap-2">
              <span className="flex-shrink-0 mt-0.5">⚠️</span>
              {displayError}
            </div>
          )}

          {/* ── LOGIN FORM ── */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-black text-gray-600 mb-1">E-mail</label>
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-600 mb-1">Senha</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={inputClass + ' pr-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(p => !p)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 text-xs font-bold"
                  >
                    {showPass ? '🙈' : '👁'}
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTab('reset')}
                className="text-xs text-red-600 hover:underline font-bold block ml-auto"
              >
                Esqueci minha senha
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-black py-3.5 rounded-xl transition-all mt-1"
              >
                {loading ? 'Entrando...' : 'Entrar →'}
              </button>
            </form>
          )}

          {/* ── REGISTER FORM ── */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-black text-gray-600 mb-1">Seu nome</label>
                <input
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Nome completo"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-600 mb-1">E-mail</label>
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-600 mb-1">Senha</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className={inputClass + ' pr-10'}
                  />
                  <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-3.5 text-gray-400 text-xs">
                    {showPass ? '🙈' : '👁'}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-600 mb-1">Confirmar senha</label>
                <input
                  type={showPass ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmPass}
                  onChange={e => setConfirmPass(e.target.value)}
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-black py-3.5 rounded-xl transition-all mt-1"
              >
                {loading ? 'Criando conta...' : 'Criar conta →'}
              </button>
              <p className="text-[10px] text-gray-400 text-center">
                Ao se cadastrar, você concorda com nossos Termos de Uso e Política de Privacidade.
              </p>
            </form>
          )}

          {/* ── RESET FORM ── */}
          {tab === 'reset' && (
            <div>
              {resetSent ? (
                <div className="text-center py-4">
                  <div className="text-5xl mb-3">📧</div>
                  <h3 className="font-black text-gray-900 mb-2">E-mail enviado!</h3>
                  <p className="text-sm text-gray-500 mb-5">
                    Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                  </p>
                  <button
                    onClick={() => { setTab('login'); setResetSent(false) }}
                    className="text-red-600 font-black text-sm hover:underline"
                  >
                    ← Voltar ao login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReset} className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Informe seu e-mail e enviaremos um link para redefinir sua senha.
                  </p>
                  <div>
                    <label className="block text-xs font-black text-gray-600 mb-1">E-mail</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className={inputClass}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-black py-3.5 rounded-xl transition-all"
                  >
                    {loading ? 'Enviando...' : 'Enviar link de recuperação'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab('login')}
                    className="w-full text-gray-500 hover:text-gray-700 font-bold py-2 text-sm"
                  >
                    ← Voltar ao login
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
