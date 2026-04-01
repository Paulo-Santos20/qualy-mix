// src/pages/Profile.jsx
import { useState } from 'react'
import { useAuth, ROLE_LABELS, ROLE_COLORS } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { brl } from '@/lib/utils'
import { Navigate } from 'react-router-dom'

function Avatar({ user, size = 'lg' }) {
  const sz = { lg: 'w-24 h-24 text-3xl', md: 'w-16 h-16 text-xl' }[size]
  if (user?.photoURL) {
    return (
      <img
        src={user.photoURL}
        alt={user.displayName || 'Usuário'}
        referrerPolicy="no-referrer"
        className={`${sz} rounded-full object-cover ring-4 ring-white shadow-lg`}
      />
    )
  }
  const initials = (user?.displayName || user?.email || 'U')
    .split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  return (
    <div className={`${sz} rounded-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center text-white font-black ring-4 ring-white shadow-lg`}>
      {initials}
    </div>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center hover:shadow-md transition-shadow">
      <p className="text-3xl mb-1">{icon}</p>
      <p className="text-2xl font-black text-gray-900">{value}</p>
      <p className="text-xs font-bold text-gray-500">{label}</p>
      {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
        <h3 className="font-black text-gray-800 text-sm">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

// ── Empty order state ─────────────────────────────────────────────────────────
function EmptyOrders() {
  return (
    <div className="text-center py-10">
      <p className="text-5xl mb-3">📦</p>
      <p className="font-bold text-gray-700">Nenhum pedido ainda</p>
      <p className="text-sm text-gray-400 mt-1">Seus pedidos aparecerão aqui.</p>
      <a href="/loja" className="inline-block mt-4 bg-red-600 hover:bg-red-700 text-white font-black px-6 py-2.5 rounded-xl transition-colors text-sm">
        Fazer meu primeiro pedido →
      </a>
    </div>
  )
}

// ── Placeholder orders (replace with Firestore data later) ───────────────────
const MOCK_ORDERS = [
  { id: '#FM-00128', date: '28/05/2025', status: 'Entregue',    total: 187.40, items: 7 },
  { id: '#FM-00094', date: '10/04/2025', status: 'Entregue',    total: 312.80, items: 12 },
  { id: '#FM-00071', date: '02/03/2025', status: 'Cancelado',   total:  89.90, items: 3 },
]

const statusColors = {
  'Entregue':     'bg-green-100 text-green-700',
  'Em trânsito':  'bg-blue-100 text-blue-700',
  'Processando':  'bg-yellow-100 text-yellow-700',
  'Cancelado':    'bg-red-100 text-red-700',
}

export default function Profile() {
  const { user, userRole, isAdmin, isOperator, logout } = useAuth()
  const { items, total } = useCart()
  const [activeTab, setActiveTab] = useState('pedidos')

  // Redirect if not logged in
  if (!user) return <Navigate to="/" replace />

  const tabs = [
    { id: 'pedidos',  label: '📦 Pedidos' },
    { id: 'carrinho', label: '🛒 Carrinho' },
    { id: 'conta',    label: '👤 Minha Conta' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">

      {/* ── Hero card ── */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-orange-500 rounded-3xl p-6 sm:p-8 mb-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative flex-shrink-0">
            <Avatar user={user} size="lg" />
            {isAdmin && (
              <span className="absolute -bottom-1 -right-1 bg-red-800 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border border-white">
                ADMIN
              </span>
            )}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-white font-black text-2xl sm:text-3xl leading-tight">
              {user.displayName || 'Olá!'}
            </h1>
            <p className="text-red-200 text-sm mt-0.5">{user.email}</p>
            {userRole && (
              <span className={`inline-block mt-2 text-xs font-black px-3 py-1 rounded-full ${ROLE_COLORS[userRole] ?? 'bg-white/20 text-white'}`}>
                {ROLE_LABELS[userRole] ?? userRole}
              </span>
            )}
            <p className="text-red-200 text-xs mt-2">
              Membro desde {user.metadata?.creationTime
                ? new Date(user.metadata.creationTime).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
                : '—'}
            </p>
          </div>
          <button
            onClick={logout}
            className="flex-shrink-0 bg-white/20 hover:bg-white/30 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
          >
            🚪 Sair
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard icon="📦" label="Pedidos" value={MOCK_ORDERS.length} />
        <StatCard icon="🛒" label="No carrinho" value={items.length} sub={items.length ? brl(total) : undefined} />
        <StatCard icon="⭐" label="Avaliações" value="4" />
        <StatCard icon="❤️" label="Favoritos" value="12" />
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 border-b border-gray-200 mb-5 overflow-x-auto scrollbar-hide">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex-shrink-0 px-4 py-2.5 text-sm font-black transition-colors ${
              activeTab === t.id
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Pedidos ── */}
      {activeTab === 'pedidos' && (
        <Section title="Histórico de Pedidos">
          {MOCK_ORDERS.length === 0 ? <EmptyOrders /> : (
            <div className="space-y-3">
              {MOCK_ORDERS.map(order => (
                <div key={order.id} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-red-100 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-gray-800 text-sm">{order.id}</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${statusColors[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{order.date} · {order.items} {order.items === 1 ? 'item' : 'itens'}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-black text-gray-900 text-base">{brl(order.total)}</p>
                    <button className="text-xs text-red-600 hover:underline font-bold mt-0.5">Detalhar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>
      )}

      {/* ── Tab: Carrinho ── */}
      {activeTab === 'carrinho' && (
        <Section title={`Carrinho Atual (${items.length} ${items.length === 1 ? 'item' : 'itens'})`}>
          {items.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-5xl mb-3">🛒</p>
              <p className="font-bold text-gray-700">Carrinho vazio</p>
              <a href="/loja" className="inline-block mt-4 bg-red-600 hover:bg-red-700 text-white font-black px-6 py-2.5 rounded-xl transition-colors text-sm">
                Ver produtos →
              </a>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100">
                    <img src={item.img} alt={item.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.qty}x {brl(item.price)}</p>
                    </div>
                    <p className="font-black text-gray-900 text-sm flex-shrink-0">{brl(item.price * item.qty)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="font-black text-gray-900">Total</span>
                <span className="font-black text-2xl text-red-600">{brl(total)}</span>
              </div>
              <button className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-black py-3.5 rounded-xl transition-all shadow-lg shadow-red-100">
                Finalizar Pedido →
              </button>
            </>
          )}
        </Section>
      )}

      {/* ── Tab: Conta ── */}
      {activeTab === 'conta' && (
        <div className="space-y-4">
          <Section title="Dados Pessoais">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ['Nome', user.displayName || '—'],
                ['E-mail', user.email || '—'],
                ['Telefone', '—'],
                ['CPF', '—'],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
                  <p className="text-sm font-bold text-gray-800">{value}</p>
                </div>
              ))}
            </div>
            <button className="mt-5 border-2 border-gray-200 hover:border-red-400 hover:text-red-600 text-gray-600 font-bold text-sm px-5 py-2.5 rounded-xl transition-all">
              ✏️ Editar dados
            </button>
          </Section>

          <Section title="Endereços">
            <div className="text-center py-6">
              <p className="text-3xl mb-2">📍</p>
              <p className="text-sm font-bold text-gray-600">Nenhum endereço cadastrado</p>
              <button className="mt-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors">
                + Adicionar endereço
              </button>
            </div>
          </Section>

          <Section title="Segurança">
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-bold text-gray-800">Senha</p>
                  <p className="text-xs text-gray-400">Última alteração: —</p>
                </div>
                <button className="text-xs text-red-600 hover:underline font-bold">Alterar</button>
              </div>
              <div className="flex items-center justify-between py-2 border-t border-gray-100">
                <div>
                  <p className="text-sm font-bold text-gray-800">Conta Google</p>
                  <p className="text-xs text-gray-400">
                    {user.providerData?.some(p => p.providerId === 'google.com') ? '✅ Vinculada' : 'Não vinculada'}
                  </p>
                </div>
              </div>
            </div>
          </Section>

          {/* Danger zone */}
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
            <h3 className="font-black text-red-800 text-sm mb-1">⚠️ Zona de Perigo</h3>
            <p className="text-xs text-red-600 mb-3">Estas ações são irreversíveis.</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={logout} className="border border-red-300 text-red-600 hover:bg-red-100 font-bold text-xs px-4 py-2 rounded-xl transition-colors">
                🚪 Sair de todas as sessões
              </button>
              <button className="border border-red-300 text-red-600 hover:bg-red-100 font-bold text-xs px-4 py-2 rounded-xl transition-colors">
                🗑️ Excluir minha conta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
