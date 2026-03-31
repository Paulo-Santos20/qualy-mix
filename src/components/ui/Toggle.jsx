// src/components/ui/Toggle.jsx
export default function Toggle({ checked, onChange, label }) {
  return (
    <label className="relative inline-flex items-center gap-2 cursor-pointer select-none">
      <span className="sr-only">{label}</span>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
        />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-red-600 transition-colors" />
        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
      </div>
    </label>
  )
}
