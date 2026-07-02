import pandas as pd

def calculate_correlation_matrix(data: dict) -> pd.DataFrame:
    prices = pd.DataFrame({
        pair: df["price"] for pair, df in data.items()
    })
    return prices.pct_change().corr().round(3)

def rolling_correlation(df1: pd.DataFrame, df2: pd.DataFrame, window: int = 30) -> pd.Series:
    r1 = df1["price"].pct_change()
    r2 = df2["price"].pct_change()
    return r1.rolling(window).corr(r2)