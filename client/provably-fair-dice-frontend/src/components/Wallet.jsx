import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function Wallet() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [message, setMessage] = useState(""); // New state for the success message

  const generateFakeWalletAddress = () => {
    const hexChars = "0123456789abcdef";
    let fakeAddress = "0x";
    for (let i = 0; i < 40; i++) {
      fakeAddress += hexChars[Math.floor(Math.random() * hexChars.length)];
    }
    return fakeAddress;
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    setMessage(""); // Clear any previous message

    try {
      // Generate a valid fake Ethereum address
      const fakeWalletAddress = generateFakeWalletAddress();

      // Send the fake address to the backend
      const res = await axios.post("https://dice-game-virid-three.vercel.app/connect-wallet", {
        address: fakeWalletAddress,
      });

      setWalletAddress(fakeWalletAddress); // Only store the wallet address locally
      setMessage(res.data.message); // Store the success message

      // Fetch balance separately from the new endpoint
      fetchWalletBalance();
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const fetchWalletBalance = async () => {
    try {
      const res = await axios.get("https://dice-game-virid-three.vercel.app/wallet-balance");
      setWalletBalance(res.data.cryptoBalance);
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {!walletAddress ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-lg font-bold text-white shadow-lg hover:shadow-green-500/20 transition-all duration-300"
          onClick={connectWallet}
          disabled={isConnecting}
        >
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </motion.button>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full space-y-3"
        >
          <div className="bg-zinc-700 p-3 rounded-lg">
            <p className="text-zinc-400 text-xs mb-1">Wallet Address</p>
            <p className="font-mono text-xs text-zinc-300 truncate">{walletAddress}</p>
          </div>

          {message && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-green-400 bg-green-800/20 p-3 rounded-lg"
            >
              {message} ✅
            </motion.div>
          )}
          
          <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 p-4 rounded-lg border border-green-800/50">
            <p className="text-zinc-400 text-sm">Crypto Balance</p>
            <div className="flex items-center">
              <p className="text-2xl font-bold text-green-400">{walletBalance}</p>
              <p className="ml-2 text-green-500">ETH</p>
            </div>
          </div>
          
          <button 
            className="w-full py-2 px-4 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm text-zinc-300 transition-colors duration-300"
            onClick={() => setWalletAddress(null)}
          >
            Disconnect
          </button>
        </motion.div>
      )}
    </div>
  );
}
