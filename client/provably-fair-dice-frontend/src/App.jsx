import { useState, useEffect } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import Dice from "./components/Dice"
import Wallet from "./components/Wallet"
import GameSlider from "./components/GameSlider"
import "./index.css"

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
  const [betMode, setBetMode] = useState("Manual")
  const [sliderValue, setSliderValue] = useState(68.71)
  const [profitOnWin, setProfitOnWin] = useState(0)
  const [multiplier, setMultiplier] = useState("2.0000")
  const [rollOver, setRollOver] = useState("50.50")
  const [winChance, setWinChance] = useState("49.5000")

  useEffect(() => {
    fetchBalance()
  }, [])

  useEffect(() => {
    // Calculate profit on win based on bet amount and multiplier
    const profit = (
      Number.parseFloat(betAmount) * Number.parseFloat(multiplier) -
      Number.parseFloat(betAmount)
    ).toFixed(2)
    setProfitOnWin(isNaN(profit) ? 0 : profit)
  }, [betAmount, multiplier])

  const fetchBalance = async () => {
    try {
      const res = await axios.get("https://dice-game-virid-three.vercel.app/balance")
      setBalance(res.data.balance)
    } catch (error) {
      console.error("Error fetching balance:", error)
    }
  }

  const handleSliderChange = (value) => {
    setSliderValue(value)
    // Calculate multiplier, roll over, and win chance based on slider value
    const newMultiplier = (100 / (100 - value)).toFixed(4)
    const newRollOver = (100 - value).toFixed(2)
    const newWinChance = value.toFixed(4)

    setMultiplier(newMultiplier)
    setRollOver(newRollOver)
    setWinChance(newWinChance)
  }

  const handleHalfBet = () => {
    setBetAmount(Math.max(1, Math.floor(betAmount / 2)))
  }

  const handleDoubleBet = () => {
    setBetAmount(Math.min(balance, betAmount * 2))
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
      const res = await axios.post("https://dice-game-virid-three.vercel.app/roll-dice", {
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
    <div className="min-h-screen bg-slate-900 text-zinc-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
            🎲 Provably Fair Dice Game 🎲
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Bet Controls */}
          <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
            {/* Mode Toggle */}
            <div className="bg-slate-900 rounded-full p-1 flex mb-6">
              <button
                className={`flex-1 py-2 px-4 rounded-full text-center transition-colors ${
                  betMode === "Manual" ? "bg-slate-700" : ""
                }`}
                onClick={() => setBetMode("Manual")}
              >
                Manual
              </button>
              <button
                className={`flex-1 py-2 px-4 rounded-full text-center transition-colors ${
                  betMode === "Auto" ? "bg-slate-700" : ""
                }`}
                onClick={() => setBetMode("Auto")}
              >
                Auto
              </button>
              <button className="ml-2 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* Bet Amount */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-slate-400">Bet Amount</span>
                <span className="text-slate-400">${balance.toFixed(2)}</span>
              </div>
              <div className="flex">
                <div className="relative flex-1">
                  <input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-l-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843-.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
                <button className="bg-slate-700 hover:bg-slate-600 py-2 px-3 text-white" onClick={handleHalfBet}>
                  ½
                </button>
                <button
                  className="bg-slate-700 hover:bg-slate-600 py-2 px-3 rounded-r-md text-white"
                  onClick={handleDoubleBet}
                >
                  2×
                </button>
              </div>
            </div>

            {/* Profit on Win */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-slate-400">Profit on Win</span>
                <span className="text-slate-400">$0.00</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={profitOnWin}
                  readOnly
                  className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 text-white focus:outline-none"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843-.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </div>
            </div>

            {/* Dice Display */}
            <div className="flex justify-center mb-6">
              <Dice diceNumber={diceNumber} isRolling={isRolling} />
            </div>

            {/* Bet Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-md transition-colors"
              onClick={rollDice}
              disabled={isRolling}
            >
              {isRolling ? "Rolling..." : "Bet"}
            </motion.button>

            {rollResult && showResults && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`mt-4 py-2 px-4 rounded-lg font-bold text-center ${
                  rollResult === "win" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                }`}
              >
                {rollResult === "win" ? "You Win! 🎉" : "You Lose 😞"}
              </motion.div>
            )}
          </div>

          {/* Right Panel - Game Display */}
          <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 lg:col-span-2">
            {/* Quick Bet Amounts */}
            <div className="flex justify-end mb-6 space-x-3">
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-full transition-colors"
                onClick={() => setBetAmount(88.02)}
              >
                88.02
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-full transition-colors"
                onClick={() => setBetAmount(58.35)}
              >
                58.35
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-full transition-colors"
                onClick={() => setBetAmount(68.71)}
              >
                68.71
              </button>
            </div>

            {/* Slider */}
            <div className="my-12">
              <GameSlider min={0} max={100} value={sliderValue} onChange={handleSliderChange} />
            </div>

            {/* Game Stats */}
            <div className="mt-24 grid grid-cols-3 gap-4 bg-slate-900 rounded-lg p-4">
              <div className="text-center">
                <h3 className="text-slate-400 mb-2">Multiplier</h3>
                <div className="bg-slate-800 rounded-md p-3 flex items-center justify-between">
                  <span className="text-white font-bold">{multiplier}</span>
                  <span className="text-slate-400">×</span>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-slate-400 mb-2">Roll Over</h3>
                <div className="bg-slate-800 rounded-md p-3 flex items-center justify-between">
                  <span className="text-white font-bold">{rollOver}</span>
                  <button className="text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-slate-400 mb-2">Win Chance</h3>
                <div className="bg-slate-800 rounded-md p-3 flex items-center justify-between">
                  <span className="text-white font-bold">{winChance}</span>
                  <span className="text-slate-400">%</span>
                </div>
              </div>
            </div>

            {/* Wallet Section */}
            <div className="mt-6">
              <Wallet />
            </div>

            {/* Verification Info */}
            {diceNumber && showResults && (
              <div className="mt-6 space-y-2">
                <h3 className="text-lg font-semibold text-green-400">Verification</h3>
                <div className="bg-slate-900 p-3 rounded-lg text-xs">
                  <p className="text-slate-400 mb-1">Server Hash:</p>
                  <p className="font-mono text-slate-300 break-all">{serverHash}</p>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg text-xs">
                  <p className="text-slate-400 mb-1">Server Seed:</p>
                  <p className="font-mono text-slate-300 break-all">{serverSeed}</p>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg text-xs">
                  <p className="text-slate-400 mb-1">Client Seed:</p>
                  <p className="font-mono text-slate-300 break-all">{clientSeed}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

