import { useEffect, useState } from "react";
import { getCorrelation } from "../services/api";

const getColor = (val) => {
  if (val === 1) return "bg-green-500 text-black";
  if (val > 0.7) return "bg-green-700 text-white";
  if (val > 0.3) return "bg-green-900 text-green-300";
  if (val > -0.3) return "bg-gray-700 text-gray-300";
  if (val > -0.7) return "bg-red-900 text-red-300";
  return "bg-red-700 text-white";
};

export default function CorrelationMatrix() {
  const [corr, setCorr] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCorrelation().then(data => {
      setCorr(data);
    }).finally(() => setLoading(false));
  }, []);

  const pairs = Object.keys(corr);

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Correlation Matrix</h2>
        <p className="text-sm text-gray-400">Cross-asset correlation of daily returns — FX pairs & Commodities</p>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center text-gray-500">Loading...</div>
      ) : (
        <>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="p-2 text-gray-400 text-left text-xs w-24"></th>
                  {pairs.map(p => (
                    <th key={p} className="p-2 text-gray-400 text-xs font-medium text-center">
                      {p.replace("=X", "").replace("=F", "")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pairs.map(row => (
                  <tr key={row}>
                    <td className="p-2 text-gray-400 text-xs font-medium">
                      {row.replace("=X", "").replace("=F", "")}
                    </td>
                    {pairs.map(col => {
                      const val = corr[row]?.[col];
                      return (
                        <td key={col} className="p-1">
                          <div className={`rounded text-center py-2 text-xs font-bold ${getColor(val)}`}>
                            {val?.toFixed(2)}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-6 flex-wrap">
            <p className="text-xs text-gray-400">Correlation:</p>
            {[
              { label: "Strong Positive (>0.7)", color: "bg-green-700" },
              { label: "Moderate (0.3–0.7)", color: "bg-green-900" },
              { label: "Neutral", color: "bg-gray-700" },
              { label: "Moderate Negative", color: "bg-red-900" },
              { label: "Strong Negative (<-0.7)", color: "bg-red-700" },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded ${item.color}`}></div>
                <span className="text-xs text-gray-400">{item.label}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}