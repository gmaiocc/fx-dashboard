import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { getFXData } from "../services/api";

export default function FXChart({ pair }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("1y");

  useEffect(() => {
    setLoading(true);
    getFXData(pair, period)
      .then(d => {
        const formatted = d.map(row => ({
          date: new Date(row.Date).toLocaleDateString("en-GB"),
          price: parseFloat(row.price?.toFixed(4))
        }));
        setData(formatted);
      })
      .finally(() => setLoading(false));
  }, [pair, period]);

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">{pair} — Price History</h2>
          <p className="text-sm text-gray-400">Live market data via Yahoo Finance</p>
        </div>
        <div className="flex gap-2">
          {["1mo", "3mo", "6mo", "1y", "2y"].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded text-xs font-medium ${
                period === p ? "bg-green-500 text-black" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center text-gray-500">Loading...</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 11 }} tickLine={false} interval={30} />
            <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} tickLine={false} domain={["auto", "auto"]} />
            <Tooltip
              contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "8px" }}
              labelStyle={{ color: "#9ca3af" }}
              itemStyle={{ color: "#22c55e" }}
            />
            <Line type="monotone" dataKey="price" stroke="#22c55e" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}