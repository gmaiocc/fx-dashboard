# FX Analytics Dashboard

An interactive market analytics dashboard for FX and commodity markets, built with Python (FastAPI) and React.

## Features
- **Price History** - Live FX data across 5 currency pairs via Yahoo Finance
- **Volatility Analysis** — Historical volatility across 7, 30 and 90-day windows with regime detection
- **Anomaly Detection** — Z-score based price feed anomaly detection (2.5σ threshold)
- **Correlation Matrix** — Cross-asset correlation between FX pairs and commodities (Gold, Oil)
- **Strategy Backtesting** — Moving Average Crossover with Sharpe Ratio, Max Drawdown and Win Rate

## Tech Stack
- **Backend:** Python, FastAPI, yFinance, Pandas, NumPy
- **Frontend:** React, Tailwind CSS, Recharts

## Run Locally

### Backend
```bash
pip install fastapi uvicorn yfinance pandas numpy
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Markets Covered
EUR/USD · GBP/USD · USD/JPY · USD/CHF · EUR/GBP