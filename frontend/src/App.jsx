import { useState } from "react";
import FXChart from "./components/FXChart";
import VolatilityChart from "./components/VolatilityChart";
import AnomalyAlert from "./components/AnomalyAlert";
import CorrelationMatrix from "./components/CorrelationMatrix";
import BacktestResults from "./components/BacktestResults";

const PAIRS = ["EURUSD", "GBPUSD", "USDJPY", "USDCHF", "EURGBP"];

export default function App() {
  const [selectedPair, setSelectedPair] = useState("EURUSD");
  const [activePage, setActivePage] = useState("price");

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">FX Analytics Dashboard</h1>
            <p className="text-xs text-gray-400">BNP Paribas ECS — Market Monitor</p>
          </div>
          {/* Pair Selector */}
          <div className="flex gap-2">
            {PAIRS.map(pair => (
              <button
                key={pair}
                onClick={() => setSelectedPair(pair)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                  selectedPair === pair
                    ? "bg-green-500 text-black"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {pair}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Nav */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6">
        <div className="max-w-7xl mx-auto flex gap-6">
          {["price", "volatility", "anomalies", "correlation", "backtest"].map(page => (
            <button
              key={page}
              onClick={() => setActivePage(page)}
              className={`py-3 text-sm capitalize border-b-2 transition-all ${
                activePage === page
                  ? "border-green-500 text-green-400"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activePage === "price" && <FXChart pair={selectedPair} />}
        {activePage === "volatility" && <VolatilityChart pair={selectedPair} />}
        {activePage === "anomalies" && <AnomalyAlert pair={selectedPair} />}
        {activePage === "correlation" && <CorrelationMatrix />}
        {activePage === "backtest" && <BacktestResults pair={selectedPair} />}
      </main>
    </div>
  );
}