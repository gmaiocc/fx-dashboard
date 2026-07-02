import pandas as pd
import numpy as np

def calculate_historical_volatility(df: pd.DataFrame, windows: list = [7, 30, 90]) -> pd.DataFrame:
    df = df.copy()
    df["returns"] = df["price"].pct_change()
    
    for window in windows:
        df[f"vol_{window}d"] = (
            df["returns"].rolling(window).std() * np.sqrt(252) * 100
        )
    return df.dropna()

def get_volatility_regime(vol: float) -> str:
    if vol < 5:
        return "Low"
    elif vol < 10:
        return "Medium"
    else:
        return "High"