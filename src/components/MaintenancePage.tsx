import { motion } from "framer-motion"
import { BookOpen } from "lucide-react"

interface Props {
  nextOpen: string
  currentTime: string
}

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
              J.A.Q edu hub - Pre-Registration
            </h1>
            <p className="text-blue-200 text-sm mt-1">
              Portal is currently offline
            </p>
          </div>

          {/* Body */}
          <div className="px-8 py-6 space-y-6">

            {/* Message */}
            <div className="bg-slate-50 rounded-xl px-4 py-4">
              <p className="text-slate-600 text-sm leading-relaxed">
                The enrollment portal is temporarily unavailable. Please try again later.
              </p>
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