// src/components/ui/SectionHeader.jsx
export default function SectionHeader({ title, subtitle, onViewAll }) {
  return (
    <div className="flex items-end justify-between mb-4 sm:mb-5">
      <div>
        <h2 className="text-lg sm:text-xl font-black text-gray-900">{title}</h2>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {onViewAll && (
        <button
          onClick={onViewAll}
          className="text-red-600 text-xs font-bold hover:underline flex items-center gap-1 whitespace-nowrap"
        >
          Ver todos <span aria-hidden>→</span>
        </button>
      )}
    </div>
  )
}
