import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import "./Converter.css"; // Ensure your styles match the design

const Converter = ({ sourceCurrency, setSourceCurrency, targetCurrency, setTargetCurrency }) => {
  // const [amount1, setAmount1] = useState("");
  // const [amount2, setAmount2] = useState("");
  const [conversionRate, setConversionRate] = useState(null);
  const [exchangeRates, setExchangeRates] = useState({});
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const todayDate = new Date().toISOString().split("T")[0];
  // const [selectedDate, setSelectedDate] = useState(todayDate);

  // Fetch exchange rates
  const selectedDate = "2025-02-18";
useEffect(() => {
  fetchExchangeRates(selectedDate);
}, []);


  const fetchExchangeRates = async (date) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`http://localhost:8080/api/exchange/${date}`);
      const data = response.data;

      if (data) {
        setExchangeRates(data);
        setExchangeRateForCurrencies(data);
      } else {
        setExchangeRates({});
        setError("Exchange rate data unavailable.");
      }
    } catch (err) {
      console.error("Error fetching exchange rates:", err);
      setError("Failed to fetch exchange rates.");
    }

    setLoading(false);
  };

  // Set exchange rate based on selected currencies
  const setExchangeRateForCurrencies = (data) => {
    const inrPerSource = data[sourceCurrency.toLowerCase()];
    const inrPerTarget = data[targetCurrency.toLowerCase()];
    
    if (targetCurrency === "INR") {
      setConversionRate(inrPerSource);
    } else if (sourceCurrency === "INR") {
      setConversionRate((1 / inrPerTarget).toFixed(4));
    } else if (inrPerSource && inrPerTarget) {
      setConversionRate((inrPerSource / inrPerTarget).toFixed(4));
    } else {
      setConversionRate(null);
    }
  };

  // Fetch historical exchange rate data
  // const fetchHistoricalData = async () => {
  //   try {
  //     const fakeData = [
  //       { date: "2020", rate: 75 },
  //       { date: "2021", rate: 80 },
  //       { date: "2022", rate: 85 },
  //       { date: "2023", rate: 88 },
  //       { date: "2024", rate: 90 },
  //     ];
  //     setHistoricalData(fakeData);
  //   } catch (err) {
  //     console.error("Error fetching historical data:", err);
  //   }
  // };

  // Swap currencies
  const handleSwap = () => {
    setSourceCurrency(targetCurrency);
    setTargetCurrency(sourceCurrency);
    // setAmount1(amount2);
    // setAmount2(amount1);

    if (conversionRate) {
      setConversionRate((1 / conversionRate).toFixed(4));
    }
  };

  // Handle input changes
  // const handleAmount1Change = (value) => {
  //   setAmount1(value);
  //   setAmount2(value && conversionRate ? (parseFloat(value) * conversionRate).toFixed(2) : "");
  // };

  // const handleAmount2Change = (value) => {
  //   setAmount2(value);
  //   setAmount1(value && conversionRate ? (parseFloat(value) / conversionRate).toFixed(2) : "");
  // };

  return (
    <div className="converter-container">

      <p className="conversion-text">1 {sourceCurrency} equals</p>
      <h3 className="conversion-rate">{conversionRate} {targetCurrency}</h3>

      <div className="currency-box">
        <button className="currency-button">{sourceCurrency}</button>
        <span className="swap-btn" onClick={handleSwap}>→</span>

        <button className="currency-button">{targetCurrency}</button>
      </div>

      {/* <input 
        className="date-picker" 
        type="date" 
        value={selectedDate} 
        onChange={(e) => setSelectedDate(e.target.value)} 
        max={todayDate}
      /> */}

    </div>
  );
};
export default Converter;
