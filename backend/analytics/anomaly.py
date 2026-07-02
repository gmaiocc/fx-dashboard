import pandas as pd
import numpy as np

def detect_anomalies_zscore(df: pd.DataFrame, threshold: float = 2.5) -> pd.DataFrame:
    df = df.copy()
    df["returns"] = df["price"].pct_change()
    df["zscore"] = (df["returns"] - df["returns"].mean()) / df["returns"].std()
    df["is_anomaly"] = df["zscore"].abs() > threshold
    df["anomaly_type"] = df.apply(
        lambda row: "spike_up" if row["zscore"] > threshold
        else ("spike_down" if row["zscore"] < -threshold else "normal"), axis=1
    )
    return df

def detect_bollinger_bands(df: pd.DataFrame, window: int = 20, std_dev: float = 2.0) -> pd.DataFrame:
    df = df.copy()
    df["ma"] = df["price"].rolling(window).mean()
    df["std"] = df["price"].rolling(window).std()
    df["upper_band"] = df["ma"] + std_dev * df["std"]
    df["lower_band"] = df["ma"] - std_dev * df["std"]
    df["outside_bands"] = (df["price"] > df["upper_band"]) | (df["price"] < df["lower_band"])
    return df.dropna()