// src/components/auth/AuthModal.jsx
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'

function GoogleIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

const inputCls = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:bg-white transition-all'

export default function AuthModal({ onClose }) {
  const { loginWithGoogle, loginWithEmail, registerWithEmail, resetPassword } = useAuth()

  const [tab,      setTab]      = useState('login')   // 'login' | 'register' | 'reset'
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [error,    setError]    = useState('')
  const [info,     setInfo]     = useState('')
  const [loading,  setLoading]  = useState(false)

  // lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const clearMsgs = () => { setError(''); setInfo('') }

  const friendlyMsg = (code) => ({
    'auth/invalid-credential':    'E-mail ou senha incorretos.',
    'auth/user-not-found':        'Usuário não encontrado.',
    'auth/wrong-password':        'Senha incorreta.',
    'auth/email-already-in-use':  'Este e-mail já está em uso.',
    'auth/weak-password':         'Senha deve ter ao menos 6 caracteres.',
    'auth/invalid-email':         'E-mail inválido.',
    'auth/popup-closed-by-user':  'Login com Google cancelado.',
    'auth/too-many-requests':     'Muitas tentativas. Aguarde e tente novamente.',
  }[code] || 'Ocorreu um erro. Tente novamente.')

  // ── Google ───────────────────────────────────────────────────────────────────
  const handleGoogle = async () => {
    clearMsgs(); setLoading(true)
    try {
      await loginWithGoogle()
      onClose()
    } catch (e) { setError(friendlyMsg(e.code)) }
    finally { setLoading(false) }
  }

  // ── Login ─────────────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault(); clearMsgs()
    if (!email || !password) { setError('Preencha e-mail e senha.'); return }
    setLoading(true)
    try {
      await loginWithEmail(email, password)
      onClose()
    } catch (e) { setError(friendlyMsg(e.code)) }
    finally { setLoading(false) }
  }

  // ── Register ──────────────────────────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault(); clearMsgs()
    if (!name.trim())         { setError('Informe seu nome.'); return }
    if (!email)               { setError('Informe o e-mail.'); return }
    if (password.length < 6)  { setError('Senha mínima: 6 caracteres.'); return }
    if (password !== confirm)  { setError('As senhas não coincidem.'); return }
    setLoading(true)
    try {
      await registerWithEmail(name.trim(), email, password)
      onClose()
    } catch (e) { setError(friendlyMsg(e.code)) }
    finally { setLoading(false) }
  }

  // ── Reset ─────────────────────────────────────────────────────────────────────
  const handleReset = async (e) => {
    e.preventDefault(); clearMsgs()
    if (!email) { setError('Informe seu e-mail.'); return }
    setLoading(true)
    try {
      await resetPassword(email)
      setInfo('Link de recuperação enviado! Verifique sua caixa de entrada.')
    } catch (e) { setError(friendlyMsg(e.code)) }
    finally { setLoading(false) }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-sm overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-red-700 to-red-600 px-6 py-5 relative">
          <h2 className="text-white font-black text-xl">
            {tab === 'reset' ? '🔑 Recuperar senha' : tab === 'login' ? '👋 Bem-vindo!' : '🎉 Criar conta'}
          </h2>
          <p className="text-red-200 text-xs mt-0.5">FrescaMart · Seu mercado online</p>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-all text-lg font-bold"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        {tab !== 'reset' && (
          <div className="flex border-b border-gray-100">
            {[['login','Entrar'],['register','Cadastrar']].map(([t, label]) => (
              <button
                key={t}
                onClick={() => { setTab(t); clearMsgs() }}
                className={`flex-1 py-3 text-sm font-black transition-colors ${tab === t ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <div className="p-6">
          {/* Google — only on login/register */}
          {tab !== 'reset' && (
            <>
              <button
                onClick={handleGoogle}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl py-3 text-sm font-bold text-gray-700 transition-all disabled:opacity-50"
              >
                <GoogleIcon />
                Continuar com Google
              </button>
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-bold uppercase">ou</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
            </>
          )}

          {/* Feedback */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-700 font-medium flex items-start gap-2">
              <span className="flex-shrink-0">⚠️</span> {error}
            </div>
          )}
          {info && (
            <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-xl text-xs text-green-700 font-medium flex items-start gap-2">
              <span className="flex-shrink-0">✅</span> {info}
            </div>
          )}

          {/* ── LOGIN ── */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-600 mb-1">E-mail</label>
                <input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-600 mb-1">Senha</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className={inputCls + ' pr-10'} />
                  <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 text-sm">{showPw ? '🙈' : '👁'}</button>
                </div>
              </div>
              <button type="button" onClick={() => { setTab('reset'); clearMsgs() }} className="text-xs text-red-600 hover:underline font-bold block text-right w-full">
                Esqueci minha senha
              </button>
              <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-black py-3 rounded-xl transition-all active:scale-95">
                {loading ? 'Entrando...' : 'Entrar →'}
              </button>
            </form>
          )}

          {/* ── REGISTER ── */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-black text-gray-600 mb-1">Nome completo</label>
                <input type="text" autoComplete="name" value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-600 mb-1">E-mail</label>
                <input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-600 mb-1">Senha</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" className={inputCls + ' pr-10'} />
                  <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3 top-3 text-gray-400 text-sm">{showPw ? '🙈' : '👁'}</button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-600 mb-1">Confirmar senha</label>
                <input type={showPw ? 'text' : 'password'} autoComplete="new-password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" className={inputCls} />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-black py-3 rounded-xl transition-all active:scale-95 mt-1">
                {loading ? 'Criando conta...' : 'Criar conta →'}
              </button>
              <p className="text-[10px] text-gray-400 text-center">
                Ao se cadastrar você concorda com nossos Termos de Uso.
              </p>
            </form>
          )}

          {/* ── RESET ── */}
          {tab === 'reset' && (
            <form onSubmit={handleReset} className="space-y-4">
              <p className="text-sm text-gray-500">
                Informe seu e-mail e enviaremos um link para redefinir sua senha.
              </p>
              <div>
                <label className="block text-xs font-black text-gray-600 mb-1">E-mail</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" className={inputCls} />
              </div>
              <button type="submit" disabled={loading || !!info} className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-black py-3 rounded-xl transition-all">
                {loading ? 'Enviando...' : 'Enviar link de recuperação'}
              </button>
              <button type="button" onClick={() => { setTab('login'); clearMsgs() }} className="w-full text-gray-500 hover:text-red-600 font-bold text-sm py-2 transition-colors">
                ← Voltar ao login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
