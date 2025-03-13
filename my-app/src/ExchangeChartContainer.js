import React, { useState, useEffect } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import "./ExchangeChartContainer.css"; 

const ExchangeChartContainer = ({ currency }) => {
  const [graphData, setGraphData] = useState(null);
  useEffect(() => {
    if (!currency) return;

    const fetchStockData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/currency-graph/${currency}`);
        setGraphData(JSON.parse(response.data.graph));  // Parse JSON for Plotly
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchStockData();
  }, [currency]);

  if (!graphData) return <p>Loading...</p>;
  return (
    <Plot
    className="custom-plot"
    style={{ width: "100%" }} // Remove height: 100%
    data={graphData.data}
    layout={{
        ...graphData.layout,
        autosize: true,
        width: null, 
        height: 280,  // Set a fixed height
        margin: {
            l: 40,  
            r: 20,  
            t: 60,  
            b: 20  
        },
        title: {
          text: "Stock Rate Over Time for "+currency,
          pad: { t: 40 }, // Increase top padding of title
      },
        paper_bgcolor: "white", // Ensures white background
        plot_bgcolor: "white",  // Removes unwanted colors
    }}
    useResizeHandler={true}
    config={{ displayModeBar: false }}
/>

  );
  
  

  
  
};

export default ExchangeChartContainer;
