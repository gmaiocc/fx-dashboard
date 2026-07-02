from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from data.fetcher import fetch_all_pairs, fetch_fx_data
from analytics.volatility import calculate_historical_volatility
from analytics.anomaly import detect_anomalies_zscore, detect_bollinger_bands
from analytics.correlation import calculate_correlation_matrix
from analytics.backtest import moving_average_crossover, calculate_metrics

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/fx/{pair}")
def get_fx_data(pair: str, period: str = "1y"):
    df = fetch_fx_data(f"{pair}=X", period)
    return df.reset_index().to_dict(orient="records")

@app.get("/volatility/{pair}")
def get_volatility(pair: str):
    df = fetch_fx_data(f"{pair}=X")
    vol_df = calculate_historical_volatility(df)
    return vol_df.reset_index().to_dict(orient="records")

@app.get("/anomalies/{pair}")
def get_anomalies(pair: str):
    df = fetch_fx_data(f"{pair}=X")
    anomaly_df = detect_anomalies_zscore(df)
    return anomaly_df[anomaly_df["is_anomaly"]].reset_index().to_dict(orient="records")

@app.get("/correlation")
def get_correlation():
    data = fetch_all_pairs()
    corr = calculate_correlation_matrix(data)
    return corr.to_dict()

@app.get("/backtest/{pair}")
def get_backtest(pair: str, short: int = 10, long: int = 50):
    df = fetch_fx_data(f"{pair}=X")
    result = moving_average_crossover(df, short, long)
    metrics = calculate_metrics(result)
    return {
        "metrics": metrics,
        "equity_curve": result[["strategy_returns"]].cumsum().reset_index().to_dict(orient="records")
    }