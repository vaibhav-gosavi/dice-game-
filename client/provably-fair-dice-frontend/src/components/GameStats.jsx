const GameStats = ({ multiplier, rollOver, winChance }) => {
    return (
      <div className="grid grid-cols-3 gap-4 bg-slate-800 rounded-lg p-4">
        <div className="text-center">
          <h3 className="text-slate-400 mb-2">Multiplier</h3>
          <div className="bg-slate-900 rounded-md p-3 flex items-center justify-between">
            <span className="text-white font-bold">{multiplier}</span>
            <span className="text-slate-400">×</span>
          </div>
        </div>
  
        <div className="text-center">
          <h3 className="text-slate-400 mb-2">Roll Over</h3>
          <div className="bg-slate-900 rounded-md p-3 flex items-center justify-between">
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
          <div className="bg-slate-900 rounded-md p-3 flex items-center justify-between">
            <span className="text-white font-bold">{winChance}</span>
            <span className="text-slate-400">%</span>
          </div>
        </div>
      </div>
    )
  }
  
  export default GameStats
  
  