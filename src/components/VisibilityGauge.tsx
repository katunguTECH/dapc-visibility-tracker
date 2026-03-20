"use client"

import { useEffect, useState } from "react"

interface GaugeProps {
  score: number
}

export default function VisibilityGauge({ score = 0 }: GaugeProps) {
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    // Safety check: if score is not a valid number, don't run the animation
    const targetScore = isNaN(score) ? 0 : Math.min(100, Math.max(0, score))
    let start = 0
    
    const interval = setInterval(() => {
      start += 1
      if (start >= targetScore) {
        setDisplayScore(targetScore)
        clearInterval(interval)
      } else {
        setDisplayScore(start)
      }
    }, 15)

    return () => clearInterval(interval)
  }, [score])

  const radius = 90
  const circumference = 2 * Math.PI * radius
  const progress = circumference - (displayScore / 100) * circumference

  // Dynamic colors for that SaaS feel
  let color = "#ef4444" // Red (Low)
  if (displayScore > 40) color = "#f59e0b" // Orange (Medium)
  if (displayScore > 70) color = "#10b981" // Green (High)

  return (
    <div className="flex justify-center items-center py-4">
      <svg width="220" height="220" className="drop-shadow-sm">
        <circle
          cx="110"
          cy="110"
          r={radius}
          stroke="#f3f4f6"
          strokeWidth="16"
          fill="none"
        />
        <circle
          cx="110"
          cy="110"
          r={radius}
          stroke={color}
          strokeWidth="16"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.1s ease-out, stroke 0.3s ease" }}
          transform="rotate(-90 110 110)"
        />
        <text
          x="110"
          y="110"
          dominantBaseline="middle"
          textAnchor="middle"
          className="text-4xl font-black"
          style={{ fill: "#1f2937" }}
        >
          {Math.round(displayScore)}%
        </text>
      </svg>
    </div>
  )
}