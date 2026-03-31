# 🛒 QualyMix — Marketplace de Supermercado

> React 18 · Vite · Tailwind CSS 3 · React Router v6 · Context API

---

## ✨ Features

- **Mobile-first & responsivo** — layout em grid adaptativo, drawer de menu, pills de categoria no mobile
- **Carousel de banners** com autoplay, indicadores e setas de navegação
- **Oferta do Dia** com cronômetro regressivo em tempo real
- **Carrinho de compras** com drawer lateral, gestão de quantidades e cálculo de frete automático
- **Painel CMS completo** — CRUD de produtos, banners, categorias, oferta do dia e configurações da loja
- **Gerador de Post Instagram com IA**
  - Selecione até 5 produtos + escreva o tema
  - Recebe: legenda completa, hashtags, conceito visual, 3 frames de Stories, melhor horário
  - Provider principal: **Gemini 1.5 Flash**
  - Fallback automático: **Groq (Llama 3.3 70B)**
- **Busca** em tempo real com filtro por nome/categoria/descrição
- **Página de Loja** com filtros por tag e ordenação múltipla
- **React Router v6** com rotas `/` e `/loja`

---

## 🗂 Estrutura do Projeto

```
QualyMix/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── src/
    ├── main.jsx
    ├── App.jsx               # Root: providers + routing + estado modal global
    ├── index.css
    │
    ├── data/
    │   └── initialCMS.js     # Todo o conteúdo inicial (banners, produtos, categorias)
    │
    ├── context/
    │   ├── CartContext.jsx   # useReducer — carrinho global
    │   └── CMSContext.jsx    # useState — conteúdo editável
    │
    ├── hooks/
    │   ├── useCountdown.js   # Cronômetro regressivo
    │   └── useApiKeys.js     # Persiste chaves Gemini/Groq no localStorage
    │
    ├── lib/
    │   └── utils.js          # cn(), brl(), discountPct()
    │
    ├── pages/
    │   ├── Home.jsx
    │   ├── Shop.jsx
    │   └── NotFound.jsx
    │
    └── components/
        ├── ui/               # Badge, Button, CountdownTimer, StarRating, Toggle, SectionHeader
        ├── layout/           # Header, Footer, Sidebar, MobileMenu
        ├── product/          # ProductCard, ProductGrid
        ├── home/             # HeroBanner, CategoryIcons, DealOfDay, PromoBanners, InstagramCTA
        ├── cart/             # CartDrawer
        ├── cms/              # AdminPanel
        ├── instagram/        # InstagramGenerator
        └── icons/            # InstagramIcon
```

---

## 🚀 Instalação

```bash
npm install
npm run dev
# Acesse http://localhost:5173
```

---

## 🔑 Configurar APIs de IA

1. Clique em **CMS** no header → aba **Configurações**
2. Cole sua chave **Gemini** (https://aistudio.google.com) e/ou **Groq** (https://console.groq.com)
3. Clique em **Salvar chaves**

As chaves ficam somente no `localStorage` do seu navegador.

---

## 🎨 Identidade Visual

| Token      | Cor       |
|------------|-----------|
| Vermelho   | `#DC2626` |
| Laranja    | `#EA580C` |
| Preto      | `#111827` |
| Fonte      | Nunito    |

---

## 📦 Stack

`react` · `react-dom` · `react-router-dom` · `vite` · `tailwindcss` · `@vitejs/plugin-react`

MIT License
