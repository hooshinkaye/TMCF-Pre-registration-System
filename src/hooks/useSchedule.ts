import { useState, useEffect } from "react"

interface ScheduleStatus {
  isOpen: boolean
  nextOpen: string
  currentTime: string
}

const SCHEDULE = [
  { day: [1, 2, 3, 4, 5, 6], start: 8 * 60, end: 11 * 60 },   // 8–11 AM
  { day: [1, 2, 3, 4, 5, 6], start: 13 * 60, end: 16 * 60 },  // 1–4 PM
]

function getStatus(): ScheduleStatus {
  // Get current Philippine Standard Time (UTC+8)
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" })
  )
  const day = now.getDay()        // 0=Sun, 1=Mon … 6=Sat
  const minutes = now.getHours() * 60 + now.getMinutes()
  const timeStr = now.toLocaleTimeString("en-PH", {
    hour: "2-digit", minute: "2-digit", hour12: true
  })

  const isOpen = SCHEDULE.some(
    (slot) => slot.day.includes(day) && minutes >= slot.start && minutes < slot.end
  )

  // Find next opening
  let nextOpen = "Monday, 8:00 AM"
  const slots = [
    { label: "8:00 AM", minutes: 8 * 60, days: [1,2,3,4,5,6] },
    { label: "1:00 PM", minutes: 13 * 60, days: [1,2,3,4,5,6] },
  ]
  for (const slot of slots) {
    if (slot.days.includes(day) && minutes < slot.minutes) {
      nextOpen = `Today at ${slot.label}`
      break
    }
  }

  return { isOpen, nextOpen, currentTime: timeStr }
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