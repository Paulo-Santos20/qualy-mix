// src/components/layout/Footer.jsx
import { useCMS } from '@/context/CMSContext'
import InstagramIcon from '@/components/icons/InstagramIcon'

export default function Footer() {
  const { cms } = useCMS()
  const { settings } = cms

  const columns = [
    {
      title: 'Empresa',
      links: ['Sobre nós', 'Blog', 'Trabalhe conosco', 'Imprensa', 'Sustentabilidade'],
    },
    {
      title: 'Ajuda',
      links: ['Minha conta', 'Rastrear pedido', 'Perguntas frequentes', 'Política de devolução', 'Fale conosco'],
    },
    {
      title: 'Categorias',
      links: ['Frutas e Vegetais', 'Carnes e Pescados', 'Padaria', 'Laticínios', 'Bebidas'],
    },
  ]

  const payMethods = ['Visa', 'Mastercard', 'Pix', 'Boleto', 'Vale']

  return (
    <footer className="bg-gray-900 text-white mt-8">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-10 sm:py-14">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-red-600 rounded-xl p-2">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <span className="font-black text-xl">{settings.storeName}</span>
            </div>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">{settings.tagline}</p>
            <div className="space-y-1.5 text-sm text-gray-400">
              <p>📞 {settings.phone}</p>
              <p>✉️ {settings.email}</p>
              <p>📍 {settings.address}</p>
            </div>

            {/* Social */}
            <div className="flex gap-2 mt-4">
              <a
                href="#"
                className="bg-gray-800 hover:bg-gradient-to-br hover:from-orange-500 hover:to-red-600 w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-blue-600 w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-green-600 w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                aria-label="WhatsApp"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {columns.map(col => (
            <div key={col.title}>
              <h4 className="font-black text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-xs text-center sm:text-left">
            © 2024 {settings.storeName}. Todos os direitos reservados. CNPJ: 00.000.000/0001-00
          </p>
          <div className="flex gap-1.5 flex-wrap justify-center">
            {payMethods.map(m => (
              <span
                key={m}
                className="bg-gray-800 text-gray-300 text-[10px] font-bold px-2.5 py-1 rounded-lg"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
