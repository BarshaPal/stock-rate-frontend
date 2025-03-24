import requests
import pandas as pd
import plotly.graph_objs as go
import plotly.io as pio
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/currency-graph/<currency>", methods=["GET"])
def currency_graph(currency):
    try:
        # Fetch data from Spring Boot API
        spring_api_url = f"http://localhost:8080/api/exchange/currency/{currency}"
        response = requests.get(spring_api_url)
        response.raise_for_status()
        data = response.json()

        # Convert to DataFrame
        df = pd.DataFrame(data)
        df['date'] = pd.to_datetime(df['date'])
        df.sort_values('date', inplace=True)

        # Calculate dynamic y-axis range
        min_rate = df['rate'].min()
        max_rate = df['rate'].max()

        if max_rate == min_rate:
            # If all values are the same, use small padding
            y_min = min_rate - 1
            y_max = max_rate + 1
        else:
            # Use tight padding (2%) and cap it
            padding = (max_rate - min_rate) * 0.02
            y_min = max(min_rate - padding, min_rate * 0.95)
            y_max = min(max_rate + padding, max_rate * 1.05)

        last_date = df['date'].max()
        
        time_ranges = {
            "1D": last_date - pd.Timedelta(days=1),
            "5D": last_date - pd.Timedelta(days=5),
            "1M": last_date - pd.DateOffset(months=1),
            "6M": last_date - pd.DateOffset(months=6),
            "1Y": last_date - pd.DateOffset(years=1),
            "MAX": df['date'].min()
        }
        # Plot with Plotly
        fig = go.Figure()
        fig.add_trace(go.Scatter(
            x=df['date'],
            y=df['rate'],
            mode='lines',
            name=f"{currency.upper()} Rate",
            line=dict(color='blue')
        ))

        fig.update_layout(
            title=f"{currency.upper()} Exchange Rate Over Time",
            xaxis_title="Date",
            yaxis_title="Rate",
            plot_bgcolor="white",
            xaxis=dict(
                rangeselector=dict(
                    buttons=list([
                        dict(count=1, label="1M", step="month", stepmode="backward"),
                        dict(count=6, label="6M", step="month", stepmode="backward"),
                        dict(count=1, label="1Y", step="year", stepmode="backward"),
                        dict(count=5, label="5Y", step="year", stepmode="backward"),
                        dict(count=10, label="MAX", step="year", stepmode="backward"),

                    ])
                ),
                rangeslider=dict(visible=False),
                type="date"
            ),
            yaxis=dict(
                gridcolor='lightgrey',
                range=[y_min, y_max]
            ),
        )

        # Convert Plotly figure to JSON
        graph_json = pio.to_json(fig)
        return jsonify({"graph": graph_json})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
