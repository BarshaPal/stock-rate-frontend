import React, { useState, useEffect } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import "./ApexChartContainer.css"; 

const ApexChartComponent = ({ company }) => {
  const [graphData, setGraphData] = useState(null);
  useEffect(() => {
    if (!company) return;

    const fetchStockData = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/get-stock?symbol=${company}`);
        setGraphData(JSON.parse(response.data.graph));  // Parse JSON for Plotly
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchStockData();
  }, [company]);

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
          t: 60, // Increase top margin for more space above the plot
          b: 20,
      },
      title: {
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

export default ApexChartComponent;
