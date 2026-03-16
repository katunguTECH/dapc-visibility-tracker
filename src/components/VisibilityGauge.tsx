"use client"

import { useEffect, useState } from "react"

interface GaugeProps {
  score: number
}

export default function VisibilityGauge({ score }: GaugeProps) {

  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {

    let start = 0

    const interval = setInterval(() => {

      start += 1

      if (start >= score) {
        start = score
        clearInterval(interval)
      }

      setDisplayScore(start)

    }, 20)

    return () => clearInterval(interval)

  }, [score])

  const radius = 90
  const circumference = 2 * Math.PI * radius
  const progress = circumference - (displayScore / 100) * circumference

  let color = "#ef4444"

  if (displayScore > 40) color = "#f59e0b"
  if (displayScore > 70) color = "#10b981"

  return (

    <div className="flex justify-center items-center">

      <svg width="220" height="220">

        <circle
          cx="110"
          cy="110"
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="14"
          fill="none"
        />

        <circle
          cx="110"
          cy="110"
          r={radius}
          stroke={color}
          strokeWidth="14"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
          transform="rotate(-90 110 110)"
        />

        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="text-3xl font-bold fill-gray-800"
        >
          {displayScore}%
        </text>

      </svg>

    </div>

  )

}