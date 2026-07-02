import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta

FX_PAIRS = ["EURUSD=X", "GBPUSD=X", "USDJPY=X", "USDCHF=X", "EURGBP=X"]
COMMODITIES = ["GC=F", "CL=F"]  # Gold, Oil

def fetch_fx_data(pair: str, period: str = "1y", interval: str = "1d") -> pd.DataFrame:
    ticker = yf.Ticker(pair)
    df = ticker.history(period=period, interval=interval)
    df = df[["Close", "Volume"]].rename(columns={"Close": "price"})
    df.index = pd.to_datetime(df.index)
    return df

def fetch_all_pairs(period: str = "1y") -> dict:
    data = {}
    for pair in FX_PAIRS + COMMODITIES:
        try:
            data[pair] = fetch_fx_data(pair, period)
        except Exception as e:
            print(f"Error fetching {pair}: {e}")
    return data