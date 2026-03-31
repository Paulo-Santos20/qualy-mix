// src/components/ui/Badge.jsx
const map = {
  OFERTA:   'bg-red-600 text-white',
  ORGÂNICO: 'bg-green-600 text-white',
  DESTAQUE: 'bg-orange-500 text-white',
  NOVO:     'bg-blue-600 text-white',
  DEFAULT:  'bg-gray-500 text-white',
}

export default function Badge({ tag, className = '' }) {
  const style = map[tag] ?? map.DEFAULT
  return (
    <span
      className={`inline-block text-[10px] font-black px-2.5 py-0.5 rounded-full tracking-wide ${style} ${className}`}
    >
      {tag}
    </span>
  )
}
