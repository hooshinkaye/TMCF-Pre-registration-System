import { useState, useEffect } from "react"

interface ScheduleStatus {
  isOpen: boolean
  nextOpen: string
  currentTime: string
}

function getStatus(): ScheduleStatus {
  // Get current Philippine Standard Time (UTC+8)
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" })
  )
  const timeStr = now.toLocaleTimeString("en-PH", {
    hour: "2-digit", minute: "2-digit", hour12: true
  })

  // System is always open
  return { isOpen: true, nextOpen: "", currentTime: timeStr }
}

export function useSchedule() {
  const [status, setStatus] = useState<ScheduleStatus>(getStatus)

  useEffect(() => {
    // Recheck every 30 seconds
    const id = setInterval(() => setStatus(getStatus()), 30_000)
    return () => clearInterval(id)
  }, [])

  return status
}