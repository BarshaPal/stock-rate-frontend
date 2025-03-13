import React from "react";
import { PieChart, Pie, Tooltip, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { Container, Card } from "react-bootstrap";
import "./StockCharts.css"; // Import the CSS file

const COLORS = { Profit: "#28a745", Loss: "#dc3545" }; // Green for profit, red for loss
const DEFAULT_COLOR = "#d3d3d3"; // Grey for no data

const StockCharts = ({ stockData }) => {
  // Default dummy data for testing if no stockData is passed
  const dataToUse = stockData && stockData.length ? stockData : [];

  // Calculate total Profit & Loss
  const totalProfit = dataToUse.reduce((acc, row) => (row.profitLoss > 0 ? acc + row.profitLoss : acc), 0);
  const totalLoss = dataToUse.reduce((acc, row) => (row.profitLoss < 0 ? acc + Math.abs(row.profitLoss) : acc), 0);

  // Pie chart data
  const pieData =
    totalProfit || totalLoss
      ? [
          { name: "Profit", value: totalProfit },
          { name: "Loss", value: totalLoss },
        ]
      : [{ name: "No Data", value: 1 }];

  return (
    <div className="chart-wrapper">
      <Container className="charts-container">
        {/* Pie Chart */}
        <Card className="chart-card">
          <Card.Body>
            <h6 className="chart-title">Profit/Loss Distribution</h6>
            <PieChart width={200} height={200} className="pie-chart">
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={45} // Adjusted for a slim shape
                outerRadius={55}
                paddingAngle={5}
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={COLORS[entry.name] || DEFAULT_COLOR} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </Card.Body>
        </Card>

        {/* Line Chart - Render only if there is valid data */}
        {dataToUse.length > 0 && (totalProfit !== 0 || totalLoss !== 0) && (
          <Card className="chart-card">
            <Card.Body>
              <h6 className="chart-title">Stock Trend Analysis</h6>
              <LineChart width={360} height={200} data={dataToUse} className="line-chart">
                <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                <XAxis dataKey="sellingDate" tick={{ fill: "#555" }} />
                <YAxis tick={{ fill: "#555" }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="profitLoss" stroke="#007bff" strokeWidth={2} dot={{ fill: "#007bff" }} />
              </LineChart>
            </Card.Body>
          </Card>
        )}
      </Container>
    </div>
  );
};

export default StockCharts;
