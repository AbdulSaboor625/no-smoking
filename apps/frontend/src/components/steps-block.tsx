
import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Lock } from "lucide-react"

type Step = {
  title: string
  subtitle: string
  description: string
  image: string
  dayLabel: string
  locked?: boolean
}

const steps: Step[] = [
  {
    title: "The First Step",
    subtitle: "Day 1 | Identity Building",
    description:
      "Today is simple: Your sole commitment is to stay nicotine-free until bedtime tonight. This isn't about committing to forever or even to a full week; it's just about succeeding for one single, manageable day. You absolutely can handle the challenge of one day, and you should be proud because you've already accomplished the hardest, most crucial part—taking the courageous step of starting.",
    image:
      "/assets/images/step-2.png",
    dayLabel: "Day 1",
    locked: true,
  },
  {
    title: "The Second Step",
    subtitle: "Day 2 | Confidence",
    description:
      "Build on yesterday's win. Focus on confidence and celebrate that you're already stronger today than yesterday.",
    image:
      "/assets/images/step-3.png",
    dayLabel: "Day 2",
    locked: true,
  },
  {
    title: "The Third Step",
    subtitle: "Day 3 | Momentum",
    description:
      "Keep momentum going. Replace triggers with small, positive routines that make you feel good.",
    image:
      "/assets/images/step-4.png",
    dayLabel: "Day 2",
    locked: true,
  },
  {
    title: "The Fourth Step",
    subtitle: "Day 4 | Reinforcement",
    description:
      "Reinforce your new identity. Reflect on your wins and set a simple goal for tomorrow.",
    image:
      "/assets/images/step-1.png",
    dayLabel: "Day 2",
    locked: true,
  },
]

const StepsBlock = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [startIndex, setStartIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(3)
  const [itemWidth, setItemWidth] = useState(0)
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const activeStep = steps[activeIndex]

  // responsive visible count (1 / 2 / 3)
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth
      if (w < 640) return 1
      if (w < 1024) return 2
      return 3
    }
    const update = () => setVisibleCount(calc())
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  const maxStart = Math.max(steps.length - visibleCount, 0)

  const slidePrev = () =>
    setStartIndex((prev) => {
      const next = prev === 0 ? maxStart : prev - 1
      return next
    })

  const slideNext = () =>
    setStartIndex((prev) => {
      const next = prev >= maxStart ? 0 : prev + 1
      return next
    })

  const selectStep = (idx: number) => {
    setActiveIndex(idx)
    if (idx < startIndex) {
      setStartIndex(idx)
    } else if (idx > startIndex + visibleCount - 1) {
      setStartIndex(Math.min(idx, maxStart))
    }
  }

  // recalc item width based on container and gap
  useEffect(() => {
    const calcWidth = () => {
      if (!viewportRef.current) return
      const gapPx = 25 // gap-3 => 0.75rem -> 12px
      const containerWidth = viewportRef.current.clientWidth
      const width = (containerWidth - gapPx * (visibleCount - 1)) / visibleCount
      setItemWidth(width)
    }
    calcWidth()
    window.addEventListener("resize", calcWidth)
    return () => window.removeEventListener("resize", calcWidth)
  }, [visibleCount])

  const trackTranslate = -(startIndex * (itemWidth + 10))

  return (
    <div className="space-y-4 mt-8">
      <Card className="bg-white border-none shadow-sm rounded-lg p-6 sm:p-8 group">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4 sm:gap-6 items-start justify-between w-full">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#7a2e90]" />
              <h3 className="text-xl font-semibold text-[#561F7A]">{activeStep.title}</h3>
            </div>
            <Badge className="bg-[#F7B900] text-[#561F7A] px-5 py-1 rounded-none rounded-br-lg rounded-tr-lg w-fit h-[34px]">
              {activeStep.subtitle}
            </Badge>
            <p className="pt-2 lg:pl-8 pr-6 2xl:text-sm text-xs leading-relaxed text-[#000000]">
              {activeStep.description}
            </p>
          </div>

          <div className="relative h-[304px] w-full ml-auto">
            <img
              src={activeStep.image}
              alt={activeStep.title}
              className="w-full h-full object-cover rounded-none shadow-sm group-hover:scale-105 transition-all duration-300"
            />
            <div className="absolute inset-0 rounded-xl ring-1 ring-black/5" />
          </div>
        </div>
      </Card>

      <div className="flex items-start justify-between gap-10 lg:!mt-10 !mt-5">
        <div ref={viewportRef} className="flex-1 overflow-hidden">
          <div
            className="flex gap-3 2xl:gap-5 transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(${trackTranslate}px)` }}
          >
            {steps.map((step, idx) => {
              const isActive = idx === activeIndex
              return (
                <button
                  key={`${step.title}-${idx}`}
                  onClick={() => selectStep(idx)}
                  className={`text-left rounded-xl px-4 py-3 transition-all border ${
                    isActive
                      ? "bg-[#561F7A] text-white border-[#561F7A]"
                      : "bg-[#6c3e94] text-white/90 border-[#612F8D] hover:bg-[#561F7A] hover:text-white"
                  } shadow-sm flex-none`}
                  style={{ width: itemWidth ? `${itemWidth}px` : undefined }}
                >
                  <div className="flex items-end justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="2xl:text-xl text-base font-semibold text-white mb-4">{step.title}</span>
                      <span className="2xl:text-base text-sm font-[400] text-white">{step.dayLabel}</span>
                    </div>
                    {step.locked && <Lock className="w-4 h-4 text-white" />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-full border-[#612F8D] text-[#612F8D]" onClick={slidePrev}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full border-[#612F8D] text-[#612F8D]" onClick={slideNext}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Mobile nav buttons */}
      <div className="flex md:hidden justify-center gap-3">
        <Button variant="outline" size="icon" className="rounded-full border-[#612F8D] text-[#612F8D]" onClick={slidePrev}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full border-[#612F8D] text-[#612F8D]" onClick={slideNext}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

export default StepsBlock