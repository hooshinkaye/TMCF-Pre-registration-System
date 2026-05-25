import { motion } from "framer-motion"
import { Clock, CalendarDays, BookOpen } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface Props {
  nextOpen: string
  currentTime: string
}

const schedule = [
  { days: "Monday – Saturday", slots: ["8:00 AM – 11:00 AM", "1:00 PM – 4:00 PM"] },
  { days: "Sunday", slots: ["Closed"] },
]

export function MaintenancePage({ nextOpen, currentTime }: Props) {
  return (
    <div className="min-h-screen bg-[#0d2b5e] flex items-center justify-center p-6">
      {/* subtle grid bg */}
      <div
        className="fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="bg-[#0d2b5e] px-8 py-6 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#c9a227] mb-4"
            >
              <BookOpen className="w-8 h-8 text-[#0d2b5e]" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              TMCFI Enrollment Hub
            </h1>
            <p className="text-blue-200 text-sm mt-1">
              Portal is currently offline
            </p>
          </div>

          {/* Body */}
          <div className="px-8 py-6 space-y-6">

            {/* Current time */}
            <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Clock className="w-4 h-4" />
                <span>Current time (PHT)</span>
              </div>
              <span className="font-semibold text-slate-700 text-sm">
                {currentTime}
              </span>
            </div>

            {/* Next opening */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-4 py-3"
            >
              <span className="text-amber-700 text-sm font-medium">
                Next opening
              </span>
              <Badge className="bg-[#c9a227] text-[#0d2b5e] hover:bg-[#c9a227]">
                {nextOpen}
              </Badge>
            </motion.div>

            <Separator />

            {/* Schedule */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CalendarDays className="w-4 h-4 text-[#1251a3]" />
                <span className="text-sm font-semibold text-slate-700">
                  Operating Schedule
                </span>
              </div>
              <div className="space-y-2">
                {schedule.map((row, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-start justify-between py-2 border-b border-slate-100 last:border-0"
                  >
                    <span className="text-sm font-medium text-slate-600">
                      {row.days}
                    </span>
                    <div className="text-right space-y-0.5">
                      {row.slots.map((s, j) => (
                        <p key={j} className="text-sm text-slate-500">{s}</p>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Tip */}
            <p className="text-xs text-slate-400 text-center leading-relaxed">
              Prepare your <span className="font-medium text-slate-500">2×2 photo</span>,{" "}
              <span className="font-medium text-slate-500">Form 138</span>, and school records
              so you can submit quickly when the portal opens.
            </p>
          </div>
        </div>

        <p className="text-center text-blue-200/40 text-xs mt-6 tracking-wider uppercase">
          Powered by PBH IT-Solutions © 2026
        </p>
      </motion.div>
    </div>
  )
}