import { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"

const Slider = ({ min, max, value, onChange }) => {
  const sliderRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const calculatePercentage = (value) => {
    return ((value - min) / (max - min)) * 100
  }

  const percentage = calculatePercentage(value)

  const handleSliderClick = (e) => {
    if (!sliderRef.current) return

    const rect = sliderRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = (x / rect.width) * 100
    const newValue = min + (percentage / 100) * (max - min)

    onChange(Math.min(Math.max(newValue, min), max))
  }

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging || !sliderRef.current) return

      const rect = sliderRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percentage = (x / rect.width) * 100
      const newValue = min + (percentage / 100) * (max - min)

      onChange(Math.min(Math.max(newValue, min), max))
    },
    [isDragging, min, max, onChange],
  )

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  return (
    <div className="relative">
      {/* Slider Labels */}
      <div className="flex justify-between mb-2 text-slate-400">
        <span>0</span>
        <span>25</span>
        <span>50</span>
        <span>75</span>
        <span>100</span>
      </div>

      {/* Slider Track */}
      <div
        ref={sliderRef}
        className="h-12 bg-slate-700 rounded-full relative cursor-pointer"
        onClick={handleSliderClick}
      >
        {/* Red Section */}
        <div
          className="absolute top-0 left-0 h-full bg-red-500 rounded-l-full"
          style={{ width: `${percentage > 50 ? 50 : percentage}%` }}
        />

        {/* Green Section */}
        <div
          className="absolute top-0 right-0 h-full bg-green-500 rounded-r-full"
          style={{ width: `${percentage > 50 ? percentage - 50 : 0}%` }}
        />

        {/* Slider Handle */}
        <motion.div
          className="absolute top-0 h-full w-6 bg-blue-400 rounded-md flex items-center justify-center cursor-grab active:cursor-grabbing"
          style={{ left: `calc(${percentage}% - 12px)` }}
          onMouseDown={handleMouseDown}
          animate={{ x: 0 }}
          whileTap={{ scale: 1.1 }}
        >
          <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
        </motion.div>

        {/* Value Indicator */}
        <div
          className="absolute -top-16 transform -translate-x-1/2 bg-green-500 text-white font-bold p-2 rounded-md hexagon"
          style={{ left: `${percentage}%` }}
        >
          {value.toFixed(2)}
        </div>
      </div>
    </div>
  )
}

export default Slider

