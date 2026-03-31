// src/components/instagram/InstagramGenerator.jsx
import { useState, useEffect } from 'react'
import { useApiKeys } from '@/hooks/useApiKeys'
import { useCMS } from '@/context/CMSContext'
import InstagramIcon from '@/components/icons/InstagramIcon'
import { brl } from '@/lib/utils'

const STEPS = ['Produtos', 'Tema', 'Resultado']

function StepIndicator({ current }) {
  return (
    <div className="flex border-b border-gray-100 flex-shrink-0">
      {STEPS.map((label, i) => (
        <div
          key={label}
          className={`flex-1 py-3 text-center text-xs font-black transition-colors ${
            i + 1 < current
              ? 'text-green-600'
              : i + 1 === current
              ? 'text-red-600 border-b-2 border-red-600'
              : 'text-gray-400'
          }`}
        >
          <span className={`inline-flex w-5 h-5 rounded-full text-[10px] font-black items-center justify-center mr-1 ${
            i + 1 < current  ? 'bg-green-100 text-green-700' :
            i + 1 === current ? 'bg-red-100 text-red-600' :
            'bg-gray-100 text-gray-400'
          }`}>
            {i + 1 < current ? '✓' : i + 1}
          </span>
          {label}
        </div>
      ))}
    </div>
  )
}

async function callGemini(prompt, apiKey) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.85 },
      }),
    }
  )
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || 'Gemini API error')
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  return JSON.parse(text.replace(/```json|```/g, '').trim())
}

async function callGroq(prompt, apiKey) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em marketing digital para supermercados brasileiros. Responda APENAS com JSON válido, sem texto adicional ou blocos de código markdown.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.85,
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || 'Groq API error')
  const text = data.choices?.[0]?.message?.content ?? ''
  return JSON.parse(text.replace(/```json|```/g, '').trim())
}

function buildPrompt(products, theme, storeName) {
  const list = products
    .map(p => `• ${p.name} — ${brl(p.price)}${p.oldPrice ? ` (era ${brl(p.oldPrice)})` : ''} (${p.category})`)
    .join('\n')

  return `Crie um post incrível para o Instagram do mercado "${storeName}".

PRODUTOS EM DESTAQUE:
${list}

TEMA / PONTO PRINCIPAL: ${theme}

IDENTIDADE VISUAL: cores vermelho #DC2626 e laranja #EA580C como cores primárias. Estilo moderno, fresco e apetitoso.

Responda APENAS com JSON válido neste formato exato:
{
  "legenda": "legenda completa com emojis e call-to-action (máx 300 palavras)",
  "hashtags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8"],
  "conceito_imagem": "descrição detalhada para geração de imagem por IA: composição, iluminação, ângulo, cores, props, estilo fotográfico, fundo",
  "stories": [
    "Descrição do Frame 1 do story (gancho/curiosidade)",
    "Descrição do Frame 2 do story (conteúdo/produto em foco)",
    "Descrição do Frame 3 do story (CTA/encerramento)"
  ],
  "melhor_horario": "horário e dia ideal para postar com justificativa curta",
  "tipo_conteudo": "Tipo de post (ex: Promoção relâmpago, Apresentação de produto, Conteúdo educativo)"
}`
}

export default function InstagramGenerator({ onClose, preSelectedProduct }) {
  const { cms } = useCMS()
  const { keys } = useApiKeys()

  const [step, setStep]                   = useState(1)
  const [selected, setSelected]           = useState(preSelectedProduct ? [preSelectedProduct] : [])
  const [theme, setTheme]                 = useState('')
  const [loading, setLoading]             = useState(false)
  const [result, setResult]               = useState(null)
  const [error, setError]                 = useState('')
  const [copied, setCopied]               = useState(false)
  const [providerUsed, setProviderUsed]   = useState('')

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const toggleProduct = (p) => {
    setSelected(prev =>
      prev.find(x => x.id === p.id)
        ? prev.filter(x => x.id !== p.id)
        : prev.length < 5
        ? [...prev, p]
        : prev
    )
  }

  const generate = async () => {
    if (!selected.length) { setError('Selecione pelo menos 1 produto.'); return }
    if (!theme.trim())    { setError('Escreva o tema/objetivo do post.'); return }
    if (!keys.gemini && !keys.groq) {
      setError('Configure ao menos uma chave de API no Painel CMS → Configurações.')
      return
    }

    setError('')
    setLoading(true)
    const prompt = buildPrompt(selected, theme, cms.settings.storeName)
    let parsed = null

    if (keys.gemini) {
      try {
        parsed = await callGemini(prompt, keys.gemini)
        setProviderUsed('Gemini')
      } catch (e) {
        console.warn('Gemini falhou, tentando Groq...', e.message)
      }
    }

    if (!parsed && keys.groq) {
      try {
        parsed = await callGroq(prompt, keys.groq)
        setProviderUsed('Groq')
      } catch (e) {
        setError('Erro: ' + e.message)
      }
    }

    if (parsed) {
      setResult(parsed)
      setStep(3)
    } else if (!error) {
      setError('Não foi possível gerar. Verifique suas chaves de API.')
    }
    setLoading(false)
  }

  const copyCaption = () => {
    if (!result) return
    const hashtags = result.hashtags.map(h => '#' + h.replace('#', '')).join(' ')
    navigator.clipboard.writeText(`${result.legenda}\n\n${hashtags}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const restart = () => {
    setStep(1); setSelected([]); setTheme('')
    setResult(null); setError(''); setProviderUsed('')
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl max-h-[93vh] flex flex-col overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-xl p-2">
              <InstagramIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-black text-base leading-none">Gerador de Post Instagram</h2>
              <p className="text-orange-100 text-[10px] mt-0.5">Gemini + Groq AI · {cms.settings.storeName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-2xl font-bold leading-none hover:bg-white/10 rounded-lg p-1"
          >
            ×
          </button>
        </div>

        <StepIndicator current={step} />

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">

          {/* Step 1 – Product selection */}
          {step === 1 && (
            <div>
              <p className="text-sm text-gray-600 mb-3">
                Selecione até <strong>5 produtos</strong> para o post{' '}
                <span className="text-orange-500 font-black">({selected.length}/5 selecionados)</span>
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {cms.products.map(p => {
                  const isSel = !!selected.find(x => x.id === p.id)
                  return (
                    <button
                      key={p.id}
                      onClick={() => toggleProduct(p)}
                      className={`rounded-2xl border-2 p-2 text-left transition-all duration-200 ${
                        isSel
                          ? 'border-red-600 bg-red-50 shadow-sm'
                          : 'border-gray-100 hover:border-orange-300 bg-white'
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={p.img}
                          alt={p.name}
                          className="w-full h-20 object-cover rounded-xl mb-2"
                          onError={e => { e.target.src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&q=60' }}
                        />
                        {isSel && (
                          <div className="absolute top-1.5 right-1.5 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black shadow">
                            ✓
                          </div>
                        )}
                      </div>
                      <p className="text-xs font-black text-gray-800 line-clamp-2 leading-tight">{p.name}</p>
                      <p className="text-xs text-red-600 font-black mt-0.5">{brl(p.price)}</p>
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!selected.length}
                className="mt-5 w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-black py-3 rounded-xl transition-colors"
              >
                Próximo: Definir tema →
              </button>
            </div>
          )}

          {/* Step 2 – Theme */}
          {step === 2 && (
            <div>
              {/* Selected products summary */}
              <div className="flex flex-wrap gap-2 mb-5">
                {selected.map(p => (
                  <div key={p.id} className="flex items-center gap-1.5 bg-red-50 border border-red-100 rounded-full px-2.5 py-1">
                    <img src={p.img} className="w-5 h-5 rounded-full object-cover flex-shrink-0" />
                    <span className="text-xs font-bold text-red-700 max-w-[100px] truncate">
                      {p.name.split(' ').slice(0, 2).join(' ')}
                    </span>
                    <button
                      onClick={() => setSelected(prev => prev.filter(x => x.id !== p.id))}
                      className="text-red-400 hover:text-red-700 font-bold text-sm leading-none"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <label className="block text-sm font-black text-gray-800 mb-1">
                Qual é o ponto principal / objetivo do post? *
              </label>
              <p className="text-xs text-gray-400 mb-2">
                Seja específico: mencione promoção, público, ocasião ou benefício principal.
              </p>
              <textarea
                value={theme}
                onChange={e => setTheme(e.target.value)}
                placeholder="Ex: Promoção de fim de semana com 30% de desconto, perfeito para quem vai fazer um churrasco de domingo com a família..."
                rows={5}
                className="w-full border-2 border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 rounded-xl p-3 text-sm resize-none outline-none transition-all"
              />

              {/* Quick suggestions */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {[
                  'Promoção relâmpago 30% OFF',
                  'Produtos orgânicos e saudáveis',
                  'Churrasco de fim de semana',
                  'Novidades da semana',
                  'Combo família econômico',
                ].map(s => (
                  <button
                    key={s}
                    onClick={() => setTheme(prev => prev ? `${prev}. ${s}` : s)}
                    className="text-[10px] font-bold bg-gray-100 hover:bg-orange-100 hover:text-orange-700 text-gray-600 px-2.5 py-1 rounded-full transition-colors"
                  >
                    + {s}
                  </button>
                ))}
              </div>

              {error && (
                <p className="text-red-500 text-xs mt-3 bg-red-50 border border-red-100 p-2.5 rounded-xl">
                  ⚠️ {error}
                </p>
              )}

              {(!keys.gemini && !keys.groq) && (
                <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-800">
                  ⚠️ Nenhuma chave de API configurada. Vá ao{' '}
                  <strong>CMS → Configurações</strong> para adicionar sua chave Gemini ou Groq.
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-bold py-3 rounded-xl transition-colors"
                >
                  ← Voltar
                </button>
                <button
                  onClick={generate}
                  disabled={loading || !theme.trim()}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:opacity-90 disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 text-white font-black py-3 rounded-xl transition-all"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Gerando com IA...
                    </span>
                  ) : '✨ Gerar Post com IA'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3 – Result */}
          {step === 3 && result && (
            <div className="space-y-4">
              {/* Provider badge */}
              <div className="flex items-center gap-2">
                <span className="bg-green-100 text-green-700 text-[10px] font-black px-2.5 py-1 rounded-full">
                  ✓ Gerado com {providerUsed}
                </span>
                {result.tipo_conteudo && (
                  <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {result.tipo_conteudo}
                  </span>
                )}
              </div>

              {/* Caption */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-100 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span>📝</span>
                    <h3 className="font-black text-gray-800 text-sm">Legenda do Post</h3>
                  </div>
                  <button
                    onClick={copyCaption}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
                      copied
                        ? 'bg-green-100 text-green-700'
                        : 'bg-white text-red-600 border border-red-200 hover:bg-red-50'
                    }`}
                  >
                    {copied ? '✓ Copiado!' : '📋 Copiar tudo'}
                  </button>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {result.legenda}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {result.hashtags?.map((h, i) => (
                    <span key={i} className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      #{h.replace('#', '')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Image concept */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span>🎨</span>
                  <h3 className="font-black text-gray-800 text-sm">Conceito Visual da Imagem</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{result.conceito_imagem}</p>
                {/* Products used */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {selected.map(p => (
                    <div key={p.id} className="relative rounded-xl overflow-hidden aspect-square">
                      <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <p className="absolute bottom-1 left-1 right-1 text-white text-[9px] font-bold line-clamp-1 leading-tight">
                        {p.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stories */}
              {result.stories?.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span>📱</span>
                    <h3 className="font-black text-gray-800 text-sm">Sequência de Stories (3 frames)</h3>
                  </div>
                  <div className="space-y-2.5">
                    {result.stories.map((s, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white mt-0.5 ${
                          ['bg-orange-500', 'bg-red-500', 'bg-red-700'][i]
                        }`}>
                          {i + 1}
                        </span>
                        <p className="text-sm text-gray-600 leading-relaxed">{s}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Best time */}
              {result.melhor_horario && (
                <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex items-start gap-2">
                  <span className="flex-shrink-0 mt-0.5">⏰</span>
                  <p className="text-sm text-green-800">
                    <strong>Melhor horário para postar:</strong> {result.melhor_horario}
                  </p>
                </div>
              )}

              <button
                onClick={restart}
                className="w-full border-2 border-gray-200 hover:border-red-300 text-gray-600 hover:text-red-600 font-bold py-3 rounded-xl transition-all text-sm"
              >
                🔄 Gerar novo post
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
