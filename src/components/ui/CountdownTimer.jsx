// src/components/ui/CountdownTimer.jsx
import { useCountdown } from '@/hooks/useCountdown'

function Segment({ value, label }) {
  const pad = String(value).padStart(2, '0')
  return (
    <div className="flex flex-col items-center">
      <span className="bg-red-600 text-white font-black text-sm sm:text-base tabular-nums px-2 py-1 rounded-lg min-w-[38px] text-center leading-tight">
        {pad}
      </span>
      <span className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wider">{label}</span>
    </div>
  )
}

export default function CountdownTimer({ endsAt }) {
  const { hours, minutes, seconds, isExpired } = useCountdown(endsAt)

  if (isExpired) {
    return <span className="text-xs text-gray-400 font-bold">Oferta encerrada</span>
  }

  return (
    <div className="flex items-end gap-1.5">
      <Segment value={hours}   label="horas" />
      <span className="text-red-600 font-black text-lg pb-3">:</span>
      <Segment value={minutes} label="min" />
      <span className="text-red-600 font-black text-lg pb-3">:</span>
      <Segment value={seconds} label="seg" />
    </div>
  )
}
