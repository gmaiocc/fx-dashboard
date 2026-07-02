import { useEffect, useState } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";
import { getAnomalies } from "../services/api";
import { getFXData } from "../services/api";

export default function AnomalyAlert({ pair }) {
  const [anomalies, setAnomalies] = useState([]);
  const [priceData, setPriceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getAnomalies(pair),
      getFXData(pair, "1y")
    ]).then(([anom, prices]) => {
      setAnomalies(anom);
      setPriceData(prices);

      const spikes_up = anom.filter(a => a.anomaly_type === "spike_up").length;
      const spikes_down = anom.filter(a => a.anomaly_type === "spike_down").length;
      setStats({ total: anom.length, spikes_up, spikes_down });
    }).finally(() => setLoading(false));
  }, [pair]);

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">{pair} — Anomaly Detection</h2>
          <p className="text-sm text-gray-400">Z-score based price feed anomaly detection (threshold: 2.5σ)</p>
        </div>
        {!loading && (
          <div className="flex gap-3">
            <div className="bg-gray-800 rounded-lg px-4 py-2 text-center">
              <p className="text-xs text-gray-400">Total Anomalies</p>
              <p className="text-xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="bg-gray-800 rounded-lg px-4 py-2 text-center">
              <p className="text-xs text-gray-400">Spike Up</p>
              <p className="text-xl font-bold text-green-400">{stats.spikes_up}</p>
            </div>
            <div className="bg-gray-800 rounded-lg px-4 py-2 text-center">
              <p className="text-xs text-gray-400">Spike Down</p>
              <p className="text-xl font-bold text-red-400">{stats.spikes_down}</p>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center text-gray-500">Loading...</div>
      ) : (
        <>
          {/* Z-Score Chart */}
          <div className="mb-6">
            <p className="text-xs text-gray-400 mb-3">Z-Score of Daily Returns</p>
            <ResponsiveContainer width="100%" height={200}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="index" tick={false} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "8px" }}
                  labelStyle={{ color: "#9ca3af" }}
                  formatter={(val) => val?.toFixed(3)}
                />
                <ReferenceLine y={2.5} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "+2.5σ", fill: "#ef4444", fontSize: 10 }} />
                <ReferenceLine y={-2.5} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "-2.5σ", fill: "#ef4444", fontSize: 10 }} />
                <Scatter
                  data={anomalies.map((a, i) => ({ index: i, zscore: a.zscore }))}
                  fill="#f59e0b"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Anomaly Table */}
          <div>
            <p className="text-xs text-gray-400 mb-3">Recent Anomaly Events</p>
            <div className="overflow-auto max-h-48">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 text-xs border-b border-gray-800">
                    <th className="text-left py-2">Date</th>
                    <th className="text-right py-2">Price</th>
                    <th className="text-right py-2">Return</th>
                    <th className="text-right py-2">Z-Score</th>
                    <th className="text-right py-2">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {anomalies.slice(-10).reverse().map((a, i) => (
                    <tr key={i} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                      <td className="py-2 text-gray-300">{new Date(a.Date).toLocaleDateString("en-GB")}</td>
                      <td className="py-2 text-right text-white">{a.price?.toFixed(4)}</td>
                      <td className={`py-2 text-right ${a.returns > 0 ? "text-green-400" : "text-red-400"}`}>
                        {(a.returns * 100)?.toFixed(3)}%
                      </td>
                      <td className="py-2 text-right text-yellow-400">{a.zscore?.toFixed(2)}σ</td>
                      <td className="py-2 text-right">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          a.anomaly_type === "spike_up" ? "bg-green-900 text-green-400" : "bg-red-900 text-red-400"
                        }`}>
                          {a.anomaly_type === "spike_up" ? "↑ Spike Up" : "↓ Spike Down"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}