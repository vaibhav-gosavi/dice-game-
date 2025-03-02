import { motion } from "framer-motion"

export default function Dice({ diceNumber, isRolling }) {
  // Dice faces using Unicode dice characters
  const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"]

  // Get the correct dice face or use a placeholder
  const diceFace = diceNumber ? diceFaces[diceNumber - 1] : "🎲"

  return (
    <motion.div
      className="relative"
      initial={{ scale: 1 }}
      animate={{
        rotate: isRolling ? [0, 360, 720, 1080] : 0,
        scale: isRolling ? [1, 1.2, 0.8, 1.1, 1] : 1,
      }}
      transition={{
        duration: isRolling ? 2 : 0.5,
        ease: "easeInOut",
      }}
    >
      <div className="w-32 h-32 flex items-center justify-center">
        <motion.div
          className={`text-8xl transition-all duration-300`}
          animate={{
            opacity: isRolling ? [1, 0.7, 1, 0.5, 1] : 1,
            scale: !isRolling && diceNumber ? [0.8, 1.3, 1] : 1,
            filter: isRolling ? "blur(4px)" : "blur(0px)",
          }}
          transition={{
            duration: isRolling ? 2 : 0.5,
            scale: { duration: 0.5, delay: isRolling ? 0 : 0.1 },
          }}
        >
          {diceFace}
        </motion.div>
      </div>

      {/* Glow effect - enhanced to be more dramatic when result is shown */}
      {diceNumber && !isRolling && (
        <motion.div
          className="absolute inset-0 rounded-full bg-purple-500/30 blur-xl -z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0, 0.7, 1],
            scale: [0.8, 1.5, 1.2],
          }}
          transition={{
            duration: 1,
            times: [0, 0.6, 1],
          }}
        />
      )}
    </motion.div>
  )
}

