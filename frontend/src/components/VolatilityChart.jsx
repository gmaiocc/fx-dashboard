import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { getVolatility } from "../services/api";

const REGIME_COLOR = { Low: "text-green-400", Medium: "text-yellow-400", High: "text-red-400" };

export default function VolatilityChart({ pair }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentRegime, setCurrentRegime] = useState("");
  const [currentVol, setCurrentVol] = useState(null);

  useEffect(() => {
    setLoading(true);
    getVolatility(pair).then(d => {
      const formatted = d.map(row => ({
        date: new Date(row.Date).toLocaleDateString("en-GB"),
        vol_7d: parseFloat(row.vol_7d?.toFixed(2)),
        vol_30d: parseFloat(row.vol_30d?.toFixed(2)),
        vol_90d: parseFloat(row.vol_90d?.toFixed(2)),
      }));
      setData(formatted);

      const last = formatted[formatted.length - 1];
      const vol = last?.vol_30d;
      setCurrentVol(vol);
      setCurrentRegime(vol < 5 ? "Low" : vol < 10 ? "Medium" : "High");
    }).finally(() => setLoading(false));
  }, [pair]);

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">{pair} — Historical Volatility</h2>
          <p className="text-sm text-gray-400">Annualised volatility across multiple windows</p>
        </div>
        {currentVol && (
          <div className="text-right">
            <p className="text-xs text-gray-400">Current Regime (30d)</p>
            <p className={`text-lg font-bold ${REGIME_COLOR[currentRegime]}`}>
              {currentRegime} — {currentVol}%
            </p>
          </div>
        )}
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center text-gray-500">Loading...</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 11 }} tickLine={false} interval={30} />
            <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} tickLine={false} unit="%" />
            <Tooltip
              contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "8px" }}
              labelStyle={{ color: "#9ca3af" }}
              formatter={(val) => `${val}%`}
            />
            <Legend wrapperStyle={{ color: "#9ca3af", fontSize: 12 }} />
            <Line type="monotone" dataKey="vol_7d" stroke="#22c55e" dot={false} strokeWidth={1.5} name="7d Vol" />
            <Line type="monotone" dataKey="vol_30d" stroke="#3b82f6" dot={false} strokeWidth={2} name="30d Vol" />
            <Line type="monotone" dataKey="vol_90d" stroke="#f59e0b" dot={false} strokeWidth={1.5} name="90d Vol" />
          </LineChart>
        </ResponsiveContainer>
      )}

      {/* Regime Cards */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {["vol_7d", "vol_30d", "vol_90d"].map((key, i) => {
          const last = data[data.length - 1];
          const val = last?.[key];
          const label = ["7 Day", "30 Day", "90 Day"][i];
          const regime = val < 5 ? "Low" : val < 10 ? "Medium" : "High";
          return (
            <div key={key} className="bg-gray-800 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">{label} Volatility</p>
              <p className="text-2xl font-bold text-white">{val}%</p>
              <p className={`text-xs mt-1 ${REGIME_COLOR[regime]}`}>{regime} Regime</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}