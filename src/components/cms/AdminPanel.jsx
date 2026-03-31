// src/components/cms/AdminPanel.jsx
import { useState, useEffect } from 'react'
import { useCMS } from '@/context/CMSContext'
import { useApiKeys } from '@/hooks/useApiKeys'
import Toggle from '@/components/ui/Toggle'
import Badge from '@/components/ui/Badge'
import { brl } from '@/lib/utils'

const EMPTY_PRODUCT = {
  name: '', category: '', price: '', oldPrice: '',
  img: '', tag: 'DESTAQUE', featured: false,
  newProduct: true, stock: 10, rating: 4.5, reviews: 0,
  description: '',
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 px-4 py-3 text-xs font-black transition-colors border-b-2 ${
        active
          ? 'border-red-600 text-red-600'
          : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      {children}
    </button>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-black text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  )
}

const inputClass = 'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none transition-all'

export default function AdminPanel({ onClose }) {
  const {
    cms, activeCategories,
    addProduct, updateProduct, deleteProduct,
    toggleBanner, toggleCategory, updateSettings, setDealOfDay,
  } = useCMS()
  const { keys, save: saveKeys } = useApiKeys()

  const [tab, setTab]           = useState('produtos')
  const [form, setForm]         = useState(EMPTY_PRODUCT)
  const [editing, setEditing]   = useState(null) // product id being edited
  const [tempKeys, setTempKeys] = useState({ gemini: keys.gemini, groq: keys.groq })
  const [savedKeys, setSavedKeys] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const resetForm = () => { setForm(EMPTY_PRODUCT); setEditing(null) }

  const handleEditProduct = (p) => {
    setForm({ ...p, price: String(p.price), oldPrice: p.oldPrice ? String(p.oldPrice) : '' })
    setEditing(p.id)
    setTab('produtos')
  }

  const handleSaveProduct = () => {
    if (!form.name.trim() || !form.price) return
    const payload = {
      ...form,
      price:    parseFloat(form.price),
      oldPrice: form.oldPrice ? parseFloat(form.oldPrice) : null,
    }
    if (editing) {
      updateProduct(editing, payload)
    } else {
      addProduct(payload)
    }
    resetForm()
  }

  const handleSaveKeys = () => {
    saveKeys(tempKeys)
    setSavedKeys(true)
    setTimeout(() => setSavedKeys(false), 2000)
  }

  const tabs = [
    { id: 'produtos',   label: `Produtos (${cms.products.length})` },
    { id: 'banners',    label: `Banners (${cms.banners.length})` },
    { id: 'categorias', label: `Categorias (${cms.categories.length})` },
    { id: 'oferta',     label: 'Oferta do Dia' },
    { id: 'config',     label: 'Configurações' },
  ]

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-4xl max-h-[95vh] flex flex-col overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-700 px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-white font-black text-lg">⚙️ Painel CMS</h2>
            <p className="text-gray-400 text-xs">Gerenciamento de conteúdo — {cms.settings.storeName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white text-2xl font-bold leading-none hover:bg-white/10 rounded-lg p-1 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide flex-shrink-0 bg-gray-50">
          {tabs.map(t => (
            <TabButton key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}>
              {t.label}
            </TabButton>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">

          {/* ── PRODUTOS ── */}
          {tab === 'produtos' && (
            <div className="space-y-5">
              {/* Form */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <h3 className="font-black text-gray-700 mb-4 text-sm flex items-center gap-2">
                  {editing ? '✏️ Editar Produto' : '➕ Novo Produto'}
                  {editing && (
                    <button onClick={resetForm} className="text-xs text-gray-400 hover:text-red-500 font-normal ml-auto">
                      Cancelar edição ×
                    </button>
                  )}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Nome do Produto *">
                    <input className={inputClass} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Ex: Frango Caipira 1kg" />
                  </Field>
                  <Field label="Categoria *">
                    <select className={inputClass} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                      <option value="">Selecione...</option>
                      {cms.categories.map(c => <option key={c.id}>{c.name}</option>)}
                    </select>
                  </Field>
                  <Field label="Preço (R$) *">
                    <input type="number" step="0.01" min="0" className={inputClass} value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="0,00" />
                  </Field>
                  <Field label="Preço Antigo (R$)">
                    <input type="number" step="0.01" min="0" className={inputClass} value={form.oldPrice} onChange={e => setForm(p => ({ ...p, oldPrice: e.target.value }))} placeholder="Deixe vazio para sem desconto" />
                  </Field>
                  <Field label="URL da Imagem">
                    <input className={inputClass} value={form.img} onChange={e => setForm(p => ({ ...p, img: e.target.value }))} placeholder="https://images.unsplash.com/..." />
                  </Field>
                  <Field label="Estoque">
                    <input type="number" min="0" className={inputClass} value={form.stock} onChange={e => setForm(p => ({ ...p, stock: Number(e.target.value) }))} />
                  </Field>
                  <Field label="Tag">
                    <select className={inputClass} value={form.tag} onChange={e => setForm(p => ({ ...p, tag: e.target.value }))}>
                      {['OFERTA', 'ORGÂNICO', 'DESTAQUE', 'NOVO'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Descrição">
                      <textarea className={inputClass} rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Breve descrição do produto..." />
                    </Field>
                  </div>
                  <div className="flex gap-6 items-center">
                    {[['featured', '⭐ Destaque'], ['newProduct', '🆕 Novidade']].map(([k, label]) => (
                      <label key={k} className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={form[k]}
                          onChange={e => setForm(p => ({ ...p, [k]: e.target.checked }))}
                          className="w-4 h-4 accent-red-600 rounded"
                        />
                        <span className="text-xs font-bold text-gray-600">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {/* Preview */}
                {form.img && (
                  <div className="mt-3 flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100">
                    <img src={form.img} alt="preview" className="w-14 h-14 object-cover rounded-lg" onError={e => { e.target.style.display='none' }} />
                    <div>
                      <p className="text-xs font-bold text-gray-700">{form.name || 'Sem nome'}</p>
                      <p className="text-xs text-red-600 font-black">{form.price ? `R$ ${parseFloat(form.price).toFixed(2).replace('.',',')}` : '—'}</p>
                    </div>
                  </div>
                )}
                <button
                  onClick={handleSaveProduct}
                  disabled={!form.name || !form.price}
                  className="mt-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-black px-5 py-2.5 rounded-xl text-sm transition-colors"
                >
                  {editing ? 'Salvar alterações' : '+ Adicionar produto'}
                </button>
              </div>

              {/* Product list */}
              <div className="space-y-2">
                {cms.products.map(p => (
                  <div key={p.id} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3 hover:border-red-100 transition-colors">
                    <img
                      src={p.img}
                      alt={p.name}
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0 bg-gray-100"
                      onError={e => { e.target.src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&q=60' }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">{p.name}</p>
                      <p className="text-xs text-gray-500">
                        {p.category} · <span className="text-red-600 font-bold">{brl(p.price)}</span> · Estoque: {p.stock}
                      </p>
                    </div>
                    <Badge tag={p.tag} />
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleEditProduct(p)}
                        className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors text-sm"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors text-sm"
                        title="Excluir"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── BANNERS ── */}
          {tab === 'banners' && (
            <div className="space-y-3">
              {cms.banners.map(b => (
                <div key={b.id} className="flex gap-4 items-center bg-white border border-gray-100 rounded-2xl p-4 hover:border-red-100 transition-colors">
                  <img src={b.img} alt={b.title} className="w-24 h-16 object-cover rounded-xl flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-gray-800 truncate">{b.title}</p>
                    <p className="text-xs text-gray-500 truncate">{b.subtitle}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full">{b.badge}</span>
                      <span className="text-[10px] text-red-600 font-bold">{b.price}</span>
                    </div>
                  </div>
                  <Toggle checked={b.active} onChange={() => toggleBanner(b.id)} label={`Ativar banner ${b.id}`} />
                </div>
              ))}
            </div>
          )}

          {/* ── CATEGORIAS ── */}
          {tab === 'categorias' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cms.categories.map(c => (
                <div key={c.id} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-4">
                  <span className="text-3xl flex-shrink-0">{c.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-gray-800">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.count} produtos</p>
                  </div>
                  <Toggle checked={c.active} onChange={() => toggleCategory(c.id)} label={`Ativar ${c.name}`} />
                </div>
              ))}
            </div>
          )}

          {/* ── OFERTA DO DIA ── */}
          {tab === 'oferta' && (
            <div className="space-y-4 max-w-lg">
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-sm text-orange-800">
                🔥 Escolha o produto e a duração da oferta do dia
              </div>
              <Field label="Produto da Oferta">
                <select
                  className={inputClass}
                  value={cms.dealOfDay.productId}
                  onChange={e => setDealOfDay(Number(e.target.value))}
                >
                  {cms.products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} — {brl(p.price)}</option>
                  ))}
                </select>
              </Field>
              <div className="flex gap-3">
                {[24, 48, 72].map(h => (
                  <button
                    key={h}
                    onClick={() => setDealOfDay(cms.dealOfDay.productId, h)}
                    className="flex-1 border-2 border-gray-200 hover:border-red-400 hover:bg-red-50 text-gray-700 hover:text-red-600 font-bold py-2.5 rounded-xl text-sm transition-all"
                  >
                    {h}h
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400">
                Termina em: {new Date(cms.dealOfDay.endsAt).toLocaleString('pt-BR')}
              </p>
            </div>
          )}

          {/* ── CONFIG ── */}
          {tab === 'config' && (
            <div className="space-y-6 max-w-lg">
              <div>
                <h3 className="font-black text-gray-800 mb-3 text-sm">🏪 Dados da Loja</h3>
                <div className="space-y-3">
                  {[
                    ['storeName', 'Nome da loja'],
                    ['tagline',   'Slogan'],
                    ['phone',     'Telefone'],
                    ['email',     'E-mail'],
                    ['address',   'Endereço/Cidade'],
                    ['instagram', 'Instagram'],
                  ].map(([k, label]) => (
                    <Field key={k} label={label}>
                      <input
                        className={inputClass}
                        value={cms.settings[k]}
                        onChange={e => updateSettings({ [k]: e.target.value })}
                      />
                    </Field>
                  ))}
                </div>
              </div>

              <hr />

              <div>
                <h3 className="font-black text-gray-800 mb-1 text-sm">🔑 Chaves de API — Gerador Instagram</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-800 mb-3">
                  ⚠️ As chaves ficam salvas apenas no seu navegador (localStorage) e nunca são enviadas para terceiros.
                </div>
                <div className="space-y-3">
                  <Field label="Gemini API Key (Google AI Studio)">
                    <input
                      type="password"
                      className={`${inputClass} font-mono`}
                      value={tempKeys.gemini}
                      onChange={e => setTempKeys(k => ({ ...k, gemini: e.target.value }))}
                      placeholder="AIza..."
                      autoComplete="off"
                    />
                  </Field>
                  <Field label="Groq API Key (fallback)">
                    <input
                      type="password"
                      className={`${inputClass} font-mono`}
                      value={tempKeys.groq}
                      onChange={e => setTempKeys(k => ({ ...k, groq: e.target.value }))}
                      placeholder="gsk_..."
                      autoComplete="off"
                    />
                  </Field>
                  <button
                    onClick={handleSaveKeys}
                    className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all ${
                      savedKeys
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}
                  >
                    {savedKeys ? '✓ Chaves salvas!' : 'Salvar chaves'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
