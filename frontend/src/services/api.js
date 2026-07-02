const BASE_URL = "http://localhost:8000";

export const getFXData = async (pair, period = "1y") => {
  const res = await fetch(`${BASE_URL}/fx/${pair}?period=${period}`);
  return res.json();
};

export const getVolatility = async (pair) => {
  const res = await fetch(`${BASE_URL}/volatility/${pair}`);
  return res.json();
};

export const getAnomalies = async (pair) => {
  const res = await fetch(`${BASE_URL}/anomalies/${pair}`);
  return res.json();
};

export const getCorrelation = async () => {
  const res = await fetch(`${BASE_URL}/correlation`);
  return res.json();
};

export const getBacktest = async (pair, short = 10, long = 50) => {
  const res = await fetch(`${BASE_URL}/backtest/${pair}?short=${short}&long=${long}`);
  return res.json();
};