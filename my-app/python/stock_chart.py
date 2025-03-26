# Raw Package
import numpy as np
import pandas as pd
import yfinance as yf
from flask_cors import CORS
from flask import Flask, request, jsonify


# Graphing/Visualization
import datetime as dt
import plotly.graph_objs as go
import plotly.io as pio  

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests


@app.route("/get-stock", methods=["GET"])
def get_stock():

# Create input field for our desired stock
    stock = request.args.get("symbol", default="AAPL", type=str)  # Get stock symbol from request
    try:
        # Retrieve stock data frame (df) from yfinance API at an interval of 1m
        df = yf.download(tickers=stock, period='15y', interval='1d')

         # Optional: Debug DataFrame structure
         # print("DataFrame columns:", df.columns)
         # print("DataFrame head:", df.head())

          # Declare plotly figure (go)
        fig = go.Figure()


         # Create candlestick chart with correct column access
        fig.add_trace(  go.Scatter(
        x=df.index,
        y=df['Close', stock],
        mode="lines",
        line=go.scatter.Line(color="green"),
        showlegend=False)
        )
        
        #   fig.add_trace(go.Scatter(
        #     x=df.index,
        #     y=df['Close'],
        #     mode="lines",
        #     line=go.scatter.Line(color="green"),
        #     showlegend=False
        # ))

        # If the range is small (like 1D), adjust y-axis to avoid starting from 0
        if df.index[-1] - df.index[0] <= pd.Timedelta(days=1):
            y_min = df['Close'].min()
            y_max = df['Close'].max()
            padding = (y_max - y_min) * 0.05  # 5% padding for visual comfort
            fig.update_yaxes(range=[y_min - padding, y_max + padding])

        # Update layout with title and axis labels
        fig.update_layout(
        # title=f"Stock Rate Over Time for {stock.upper()}",
        yaxis_title='Stock Price',
        xaxis_title='Year',
        plot_bgcolor="white",  # Background color

       
         )

        # Configure x-axis with range slider and selectors
        fig.update_xaxes(
        zeroline=True,  # Show X-axis at y=0
        zerolinecolor='black',  # X-axis line color
        showline=True,  # Show main axis line
        linecolor='black',  # X-axis main line color
        showgrid=False,  # Show grid
        rangeslider_visible=False,
        gridcolor='lightgrey',  # Set x-axis grid color to light grey
        rangeselector=dict(
        buttons=list([
            dict(count=1, label="1M", step="month", stepmode="backward"),
            dict(count=6, label="6M", step="month", stepmode="backward"),
            dict(count=1, label="1Y", step="year", stepmode="backward"),
            dict(count=5, label="5Y", step="year", stepmode="backward"),
            dict(count=10, label="MAX", step="year", stepmode="backward"),
        ])
        )
        )
        fig.update_yaxes(
        showgrid=True,  # Ensure grid is visible
        gridcolor='lightgrey'  # Set y-axis grid color to light grey
        )

        # Display the interactive plot
        # fig.show()
        graph_json = pio.to_json(fig)
        return jsonify({"graph": graph_json})  # Send JSON response to React
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5001)
