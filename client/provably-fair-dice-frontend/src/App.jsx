import { useState, useEffect } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import Dice from "./components/Dice"
import Wallet from "./components/Wallet"

export default function App() {
  const [betAmount, setBetAmount] = useState(10)
  const [balance, setBalance] = useState(1000)
  const [rollResult, setRollResult] = useState(null)
  const [diceNumber, setDiceNumber] = useState(null)
  const [serverHash, setServerHash] = useState("")
  const [serverSeed, setServerSeed] = useState("")
  const [clientSeed, setClientSeed] = useState("")
  const [isRolling, setIsRolling] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    fetchBalance()
  }, [])

  const fetchBalance = async () => {
    try {
      const res = await axios.get("http://localhost:5000/balance")
      setBalance(res.data.balance)
    } catch (error) {
      console.error("Error fetching balance:", error)
    }
  }

  const rollDice = async () => {
    if (betAmount <= 0 || betAmount > balance) {
      alert("Invalid bet amount!")
      return
    }
    setIsRolling(true)
    setShowResults(false) // Hide results when starting a new roll

    try {
      const generatedClientSeed = Math.random().toString(36).substring(2, 15)
      setClientSeed(generatedClientSeed)
      const res = await axios.post("http://localhost:5000/roll-dice", {
        betAmount,
        clientSeed: generatedClientSeed,
      })

      setDiceNumber(res.data.roll)
      setRollResult(res.data.result)
      setServerHash(res.data.serverHash)
      setServerSeed(res.data.serverSeed)
      setBalance(res.data.newBalance)

      // Wait for animation to complete before showing results
      setTimeout(() => {
        setIsRolling(false)
        // Add a small delay after animation stops before showing results
        setTimeout(() => {
          setShowResults(true)
        }, 300)
      }, 2000)
    } catch (error) {
      console.error("Error rolling dice:", error)
      setIsRolling(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            🎲 Provably Fair Dice Game 🎲
          </h1>
          <p className="mt-2 text-xl text-zinc-400">Test your luck with our provably fair system</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Game Stats Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-zinc-800 p-6 rounded-xl shadow-lg border border-zinc-700"
          >
            <h2 className="text-2xl font-bold mb-4 text-center text-purple-400">Game Stats</h2>
            <div className="flex flex-col space-y-4">
              <div className="bg-zinc-700 p-4 rounded-lg">
                <p className="text-zinc-400 text-sm">Your Balance</p>
                <p className="text-3xl font-bold text-green-400">${balance.toLocaleString()}</p>
              </div>

              <div className="space-y-2">
                <label className="text-zinc-400 text-sm block">Bet Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400">$</span>
                  <input
                    type="number"
                    className="w-full p-3 pl-8 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={betAmount}
                    onChange={(e) => setBetAmount(Number.parseInt(e.target.value) || 0)}
                    placeholder="Enter bet amount"
                  />
                </div>
              </div>

              <button
                className={`w-full py-3 px-6 rounded-lg font-bold text-white transition-all duration-300 ${
                  isRolling
                    ? "bg-zinc-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-lg hover:shadow-purple-500/20"
                }`}
                onClick={rollDice}
                disabled={isRolling}
              >
                {isRolling ? "Rolling..." : "Roll Dice"}
              </button>
            </div>
          </motion.div>

          {/* Dice Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-zinc-800 p-6 rounded-xl shadow-lg border border-zinc-700 flex flex-col items-center justify-center"
          >
            <h2 className="text-2xl font-bold mb-4 text-center text-blue-400">Roll Result</h2>
            <Dice diceNumber={diceNumber} isRolling={isRolling} />

            {rollResult && showResults && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`mt-4 py-2 px-4 rounded-lg font-bold ${
                  rollResult === "win" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                }`}
              >
                {rollResult === "win" ? "You Win! 🎉" : "You Lose 😞"}
              </motion.div>
            )}
          </motion.div>

          {/* Wallet Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-zinc-800 p-6 rounded-xl shadow-lg border border-zinc-700"
          >
            <h2 className="text-2xl font-bold mb-4 text-center text-green-400">Wallet</h2>
            <Wallet />

            {diceNumber && showResults && (
              <div className="mt-6 space-y-2">
                <h3 className="text-lg font-semibold text-purple-400">Verification</h3>
                <div className="bg-zinc-700 p-3 rounded-lg text-xs">
                  <p className="text-zinc-400 mb-1">Server Hash:</p>
                  <p className="font-mono text-zinc-300 break-all">{serverHash}</p>
                </div>
                <div className="bg-zinc-700 p-3 rounded-lg text-xs">
                  <p className="text-zinc-400 mb-1">Server Seed:</p>
                  <p className="font-mono text-zinc-300 break-all">{serverSeed}</p>
                </div>
                <div className="bg-zinc-700 p-3 rounded-lg text-xs">
                  <p className="text-zinc-400 mb-1">Client Seed:</p>
                  <p className="font-mono text-zinc-300 break-all">{clientSeed}</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

