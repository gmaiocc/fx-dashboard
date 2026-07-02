import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { getBacktest } from "../services/api";

export default function BacktestResults({ pair }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [short, setShort] = useState(10);
  const [long, setLong] = useState(50);

  const runBacktest = () => {
    setLoading(true);
    getBacktest(pair, short, long).then(d => {
      const curve = d.equity_curve.map((row, i) => ({
        index: i,
        return: parseFloat((row.strategy_returns * 100).toFixed(3))
      }));
      setData({ metrics: d.metrics, curve });
    }).finally(() => setLoading(false));
  };

  useEffect(() => { runBacktest(); }, [pair]);

  const metrics = data?.metrics;

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">{pair} — Strategy Backtesting</h2>
          <p className="text-sm text-gray-400">Moving Average Crossover strategy on 1 year of data</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">Short MA</p>
            <input
              type="number"
              value={short}
              onChange={e => setShort(Number(e.target.value))}
              className="w-16 bg-gray-800 text-white text-center text-sm rounded px-2 py-1 border border-gray-700"
            />
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">Long MA</p>
            <input
              type="number"
              value={long}
              onChange={e => setLong(Number(e.target.value))}
              className="w-16 bg-gray-800 text-white text-center text-sm rounded px-2 py-1 border border-gray-700"
            />
          </div>
          <div className="pt-4">
            <button
              onClick={runBacktest}
              className="bg-green-500 text-black px-4 py-1.5 rounded text-sm font-medium hover:bg-green-400 transition-colors"
            >
              Run
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center text-gray-500">Running backtest...</div>
      ) : (
        <>
          {/* Metrics */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Return", value: `${metrics?.total_return}%`, color: metrics?.total_return > 0 ? "text-green-400" : "text-red-400" },
              { label: "Sharpe Ratio", value: metrics?.sharpe_ratio, color: metrics?.sharpe_ratio > 1 ? "text-green-400" : "text-yellow-400" },
              { label: "Max Drawdown", value: `${metrics?.max_drawdown}%`, color: "text-red-400" },
              { label: "Win Rate", value: `${metrics?.win_rate}%`, color: metrics?.win_rate > 50 ? "text-green-400" : "text-red-400" },
            ].map(m => (
              <div key={m.label} className="bg-gray-800 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-400 mb-1">{m.label}</p>
                <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
              </div>
            ))}
          </div>

          {/* Equity Curve */}
          <div>
            <p className="text-xs text-gray-400 mb-3">Cumulative Returns</p>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data.curve}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="index" tick={false} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} tickLine={false} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "8px" }}
                  labelStyle={{ color: "#9ca3af" }}
                  formatter={(val) => `${val}%`}
                />
                <Line type="monotone" dataKey="return" stroke="#22c55e" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}