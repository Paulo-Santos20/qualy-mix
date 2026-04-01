// src/components/instagram/InstagramGenerator.jsx
// Lives inside the CMS panel (operator/admin only) — no longer on product cards
import { useState, useEffect } from 'react'
import { useApiKeys } from '@/hooks/useApiKeys'
import { useCMS }     from '@/context/CMSContext'
import InstagramIcon  from '@/components/icons/InstagramIcon'
import { brl }        from '@/lib/utils'

const STEPS = ['Produtos', 'Tema', 'Resultado']

function StepIndicator({ current }) {
  return (
    <div className="flex border-b border-gray-100 flex-shrink-0">
      {STEPS.map((label, i) => (
        <div
          key={label}
          className={`flex-1 py-3 text-center text-xs font-black transition-colors ${
            i + 1 < current  ? 'text-green-600' :
            i + 1 === current ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-400'
          }`}
        >
          <span className={`inline-flex w-5 h-5 rounded-full text-[10px] font-black items-center justify-center mr-1 ${
            i + 1 < current  ? 'bg-green-100 text-green-700' :
            i + 1 === current ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'
          }`}>
            {i + 1 < current ? '✓' : i + 1}
          </span>
          {label}
        </div>
      ))}
    </div>
  )
}

// ── AI providers ──────────────────────────────────────────────────────────────
async function callGemini(prompt, apiKey) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.85, responseMimeType: 'application/json' },
      }),
    }
  )
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || 'Gemini error')
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  return JSON.parse(text.replace(/```json|```/gi, '').trim())
}

async function callGroq(prompt, apiKey) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'Você é especialista em marketing digital para supermercados. Responda APENAS com JSON.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.85,
      response_format: { type: 'json_object' },
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || 'Groq error')
  const text = data.choices?.[0]?.message?.content ?? ''
  return JSON.parse(text.replace(/```json|```/gi, '').trim())
}

function buildPrompt(products, theme, storeName) {
  const list = products.map(p =>
    `• ${p.name} — ${brl(p.price)}${p.oldPrice ? ` (era ${brl(p.oldPrice)})` : ''} (${p.category})`
  ).join('\n')

  return `Crie um post incrível para o Instagram do mercado "${storeName}".

PRODUTOS EM DESTAQUE:
${list}

TEMA / PONTO PRINCIPAL: ${theme}

IDENTIDADE VISUAL: vermelho #DC2626 e laranja #EA580C como cores primárias. Estilo moderno, fresco e apetitoso.

Responda APENAS com JSON válido neste formato:
{
  "legenda": "legenda completa com emojis e call-to-action (máx 300 palavras)",
  "hashtags": ["tag1","tag2","tag3","tag4","tag5","tag6","tag7","tag8"],
  "conceito_imagem": "descrição detalhada EM INGLÊS para geração de imagem por IA: composição, iluminação, ângulo, cores vibrantes, estilo food photography, fundo, sem texto na imagem",
  "stories": [
    "Frame 1: gancho/curiosidade",
    "Frame 2: produto em foco",
    "Frame 3: CTA/encerramento"
  ],
  "melhor_horario": "horário e dia ideal com justificativa curta",
  "tipo_conteudo": "tipo do post (ex: Promoção relâmpago)"
}`
}

// ── Image generation via Pollinations.ai (free, no key needed) ────────────────
function generateImageURLs(conceptPrompt) {
  const base = encodeURIComponent(
    conceptPrompt + ', photorealistic, vivid colors, 8k resolution, food photography, professional advertising'
  )
  return Array.from({ length: 3 }, () =>
    `https://image.pollinations.ai/prompt/${base}?width=1080&height=1080&nologo=true&seed=${Math.floor(Math.random() * 99999)}`
  )
}

async function downloadImage(url, index) {
  try {
    const res  = await fetch(url)
    const blob = await res.blob()
    const href = URL.createObjectURL(blob)
    const a    = Object.assign(document.createElement('a'), { href, download: `instagram-post-${index + 1}.jpg` })
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
    URL.revokeObjectURL(href)
  } catch {
    alert('Não foi possível baixar. Clique com botão direito → "Salvar imagem como".')
  }
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function InstagramGenerator({ onClose, preSelectedProduct }) {
  const { cms }  = useCMS()
  const { keys } = useApiKeys()

  const [step,             setStep]            = useState(1)
  const [selected,         setSelected]        = useState(preSelectedProduct ? [preSelectedProduct] : [])
  const [theme,            setTheme]           = useState('')
  const [loading,          setLoading]         = useState(false)
  const [result,           setResult]          = useState(null)
  const [error,            setError]           = useState('')
  const [copied,           setCopied]          = useState(false)
  const [providerUsed,     setProviderUsed]    = useState('')
  const [generatedImages,  setGeneratedImages] = useState([])
  const [generatingImages, setGeneratingImages]= useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const toggleProduct = (p) =>
    setSelected(prev =>
      prev.find(x => x.id === p.id)
        ? prev.filter(x => x.id !== p.id)
        : prev.length < 5 ? [...prev, p] : prev
    )

  const generate = async () => {
    if (!selected.length) { setError('Selecione pelo menos 1 produto.'); return }
    if (!theme.trim())    { setError('Escreva o tema/objetivo do post.'); return }

    const geminiKey = keys?.gemini || import.meta.env.VITE_GEMINI_API_KEY
    const groqKey   = keys?.groq   || import.meta.env.VITE_GROQ_API_KEY

    if (!geminiKey && !groqKey) {
      setError('Configure ao menos uma chave de API no CMS → Configurações.'); return
    }

    setError(''); setLoading(true)
    const prompt = buildPrompt(selected, theme, cms.settings.storeName)
    let parsed = null

    if (geminiKey) {
      try { parsed = await callGemini(prompt, geminiKey); setProviderUsed('Gemini') }
      catch (e) { console.warn('Gemini falhou, tentando Groq...', e.message) }
    }
    if (!parsed && groqKey) {
      try { parsed = await callGroq(prompt, groqKey); setProviderUsed('Groq') }
      catch (e) { setError('Groq: ' + e.message) }
    }

    if (parsed) { setResult(parsed); setStep(3) }
    else if (!error) setError('Não foi possível gerar. Verifique suas chaves de API.')
    setLoading(false)
  }

  const handleGenerateImages = () => {
    if (!result?.conceito_imagem) return
    setGeneratingImages(true)
    // Small delay for UX feedback
    setTimeout(() => {
      setGeneratedImages(generateImageURLs(result.conceito_imagem))
      setGeneratingImages(false)
    }, 800)
  }

  const copyCaption = () => {
    if (!result) return
    navigator.clipboard.writeText(`${result.legenda}\n\n${result.hashtags.map(h => '#' + h.replace('#', '')).join(' ')}`)
    setCopied(true); setTimeout(() => setCopied(false), 2500)
  }

  const restart = () => {
    setStep(1); setSelected([]); setTheme(''); setResult(null)
    setError(''); setProviderUsed(''); setGeneratedImages([])
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
              <p className="text-orange-100 text-[10px] mt-0.5">
                {providerUsed ? `✓ ${providerUsed}` : 'Gemini → Groq fallback'} · {cms.settings.storeName}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-2xl font-bold leading-none hover:bg-white/10 rounded-lg p-1 transition-all">×</button>
        </div>

        <StepIndicator current={step} />

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">

          {/* ── Step 1: Produtos ── */}
          {step === 1 && (
            <div>
              <p className="text-sm text-gray-600 mb-3">
                Selecione até <strong>5 produtos</strong>{' '}
                <span className="text-orange-500 font-black">({selected.length}/5)</span>
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {cms.products.map(p => {
                  const isSel = !!selected.find(x => x.id === p.id)
                  return (
                    <button
                      key={p.id}
                      onClick={() => toggleProduct(p)}
                      className={`rounded-2xl border-2 p-2 text-left transition-all ${isSel ? 'border-red-600 bg-red-50 shadow-sm' : 'border-gray-100 hover:border-orange-300 bg-white'}`}
                    >
                      <div className="relative mb-2">
                        <img src={p.img} alt={p.name} className="w-full h-20 object-cover rounded-xl"
                          onError={e => { e.target.src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&q=60' }} />
                        {isSel && (
                          <div className="absolute top-1.5 right-1.5 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black shadow">✓</div>
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

          {/* ── Step 2: Tema ── */}
          {step === 2 && (
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {selected.map(p => (
                  <div key={p.id} className="flex items-center gap-1.5 bg-red-50 border border-red-100 rounded-full px-2.5 py-1">
                    <img src={p.img} className="w-5 h-5 rounded-full object-cover" />
                    <span className="text-xs font-bold text-red-700 max-w-[100px] truncate">{p.name.split(' ').slice(0,2).join(' ')}</span>
                    <button onClick={() => setSelected(prev => prev.filter(x => x.id !== p.id))} className="text-red-400 hover:text-red-700 font-bold leading-none">×</button>
                  </div>
                ))}
              </div>

              <label className="block text-sm font-black text-gray-800 mb-1">Objetivo / tema do post *</label>
              <p className="text-xs text-gray-400 mb-2">Mencione promoção, público-alvo, ocasião ou benefício principal.</p>
              <textarea
                value={theme}
                onChange={e => setTheme(e.target.value)}
                placeholder="Ex: Promoção de fim de semana com 30% de desconto, ideal para churrasco de domingo em família..."
                rows={5}
                className="w-full border-2 border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 rounded-xl p-3 text-sm resize-none outline-none transition-all"
              />

              {/* Quick suggestions */}
              <div className="flex flex-wrap gap-1.5 mt-2 mb-4">
                {['Promoção 30% OFF','Produtos orgânicos','Churrasco de domingo','Novidades da semana','Combo econômico'].map(s => (
                  <button
                    key={s}
                    onClick={() => setTheme(prev => prev ? `${prev}. ${s}` : s)}
                    className="text-[10px] font-bold bg-gray-100 hover:bg-orange-100 hover:text-orange-700 text-gray-600 px-2.5 py-1 rounded-full transition-colors"
                  >
                    + {s}
                  </button>
                ))}
              </div>

              {error && <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-3 text-xs text-red-700">⚠️ {error}</div>}

              <div className="flex gap-2">
                <button onClick={() => setStep(1)} className="flex-1 border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-bold py-3 rounded-xl transition-colors">← Voltar</button>
                <button
                  onClick={generate}
                  disabled={loading || !theme.trim()}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:opacity-90 disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 text-white font-black py-3 rounded-xl transition-all"
                >
                  {loading
                    ? <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                        Gerando com IA...
                      </span>
                    : '✨ Gerar Post'}
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Resultado ── */}
          {step === 3 && result && (
            <div className="space-y-4">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {providerUsed && <span className="bg-green-100 text-green-700 text-[10px] font-black px-2.5 py-1 rounded-full">✓ Gerado com {providerUsed}</span>}
                {result.tipo_conteudo && <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2.5 py-1 rounded-full">{result.tipo_conteudo}</span>}
                {result.melhor_horario && <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-full">⏰ {result.melhor_horario}</span>}
              </div>

              {/* Legenda */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-100 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-black text-gray-800 text-sm flex items-center gap-2">📝 Legenda do Post</h3>
                  <button
                    onClick={copyCaption}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${copied ? 'bg-green-100 text-green-700' : 'bg-white text-red-600 border border-red-200 hover:bg-red-50'}`}
                  >
                    {copied ? '✓ Copiado!' : '📋 Copiar tudo'}
                  </button>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{result.legenda}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {result.hashtags?.map((h, i) => (
                    <span key={i} className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      #{h.replace('#', '')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Gerador de imagens */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-black text-gray-800 text-sm flex items-center gap-2">🎨 Imagens para o Post</h3>
                  {!generatedImages.length && (
                    <button
                      onClick={handleGenerateImages}
                      disabled={generatingImages}
                      className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      {generatingImages
                        ? <><svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Criando...</>
                        : '✨ Gerar 3 Opções'}
                    </button>
                  )}
                  {generatedImages.length > 0 && (
                    <button onClick={() => { setGeneratedImages([]); handleGenerateImages() }} className="text-xs text-gray-400 hover:text-red-600 font-bold transition-colors">🔄 Novas opções</button>
                  )}
                </div>
                <p className="text-xs text-gray-400 italic mb-3 line-clamp-2">{result.conceito_imagem}</p>

                {generatedImages.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {generatedImages.map((url, i) => (
                      <div key={i} className="group relative rounded-xl overflow-hidden border border-gray-100 bg-gray-50 aspect-square">
                        <img
                          src={url}
                          alt={`Opção ${i + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4 backdrop-blur-[2px]">
                          <button
                            onClick={() => downloadImage(url, i)}
                            className="bg-white text-gray-900 font-bold text-xs px-4 py-2 rounded-full translate-y-4 group-hover:translate-y-0 transition-all hover:bg-red-50 hover:text-red-600 flex items-center gap-1.5 shadow"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                            </svg>
                            Baixar
                          </button>
                        </div>
                        <span className="absolute top-2 left-2 bg-black/50 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">Opção {i+1}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Stories */}
              {result.stories?.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-2xl p-4">
                  <h3 className="font-black text-gray-800 text-sm flex items-center gap-2 mb-3">📱 Sequência de Stories</h3>
                  <div className="space-y-2.5">
                    {result.stories.map((s, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white mt-0.5 ${['bg-orange-500','bg-red-500','bg-red-700'][i]}`}>{i+1}</span>
                        <p className="text-sm text-gray-600 leading-relaxed">{s}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={restart} className="w-full border-2 border-gray-200 hover:border-red-300 text-gray-600 hover:text-red-600 font-bold py-3 rounded-xl transition-all text-sm">
                🔄 Começar do zero
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
