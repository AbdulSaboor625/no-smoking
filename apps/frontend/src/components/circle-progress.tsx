interface CircularProgressBarProps {
  percentage: number
  size?: number
  strokeWidth?: number
  backgroundColor?: string
  progressColor?: string
}

export function CircularProgressBar({
  percentage,
  size = 180,
  strokeWidth = 4,
  backgroundColor = "#E5E5E5",
  progressColor = "#F5B600",
}: CircularProgressBarProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={backgroundColor} strokeWidth={strokeWidth} />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={progressColor}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        className="transition-all duration-500 ease-out"
      />
    </svg>
  )
}
