import pandas as pd
import numpy as np

def moving_average_crossover(df: pd.DataFrame, short: int = 10, long: int = 50) -> pd.DataFrame:
    df = df.copy()
    df["ma_short"] = df["price"].rolling(short).mean()
    df["ma_long"] = df["price"].rolling(long).mean()
    df["signal"] = (df["ma_short"] > df["ma_long"]).astype(int)
    df["position"] = df["signal"].diff()
    df["returns"] = df["price"].pct_change()
    df["strategy_returns"] = df["returns"] * df["signal"].shift(1)
    return df.dropna()

def calculate_metrics(df: pd.DataFrame) -> dict:
    returns = df["strategy_returns"]
    return {
        "sharpe_ratio": round((returns.mean() / returns.std()) * np.sqrt(252), 2),
        "max_drawdown": round((df["strategy_returns"].cumsum().cummax() - df["strategy_returns"].cumsum()).max() * 100, 2),
        "win_rate": round((returns > 0).sum() / len(returns) * 100, 2),
        "total_return": round(df["strategy_returns"].cumsum().iloc[-1] * 100, 2)
    }