import {  Input, FormFeedback } from "reactstrap";
import React, {useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Table, Button, Form, InputGroup, Dropdown } from "react-bootstrap";


import axios from "axios";
import "./StockTable.css";
import StockCharts from "./StockCharts";
import ApexChartComponent from "./ApexChartComponent";






const StockTable  = ({ selectedCompany,
  sourceCurrency,
  targetCurrency,
  rows,
  setRows,
  currentPage,
  setCurrentPage,
  totalRows,
  rowsPerPage,
  paginatedRows}) =>{
    const [activeTab, setActiveTab] = useState("table");
    const [sortOrder, setSortOrder] = useState("asc");
    const [totalProfit, setTotalProfit] = useState(null);
    const [sortField, setSortField] = useState("");
  
  const recalculateProfit = (rowsData) => {
    const profitSum = rowsData.reduce((acc, row) => acc + (Number(row.profitLoss) || 0), 0);
    setTotalProfit(profitSum);
  };
  

  const formatAmount = (amount) => {
    return amount ? amount.toFixed(2) : "0.00";

  };
  
  const getCurrentDate = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split("T")[0];
  };
  const GOOGLE_SCRIPT_ID = "AKfycbwA7wTQtTxR085_S6pQYmrwPQS7rtgFjEwU-VbzC5tnX2-cruNzPxzZa494KzXJGxA";
  const API_URL = `https://script.google.com/macros/s/${GOOGLE_SCRIPT_ID}/exec`;
  const API_EXCHANGE_URL=`http://localhost:8080/api/exchange`;
  
  useEffect(() => {
    if (rows.length === 0) {
      setRows([
        {
          purchaseDate: "",
          purchaseRate: "",
          sellingDate: getCurrentDate(),
          sellingQuantity: "1",
          sellingPrice: "",
          profitLoss: "",
          loading_pr:false,
          loading_sr:false,
          errors: {},
        },
      ]);
    }
  }, [rows, setRows]);

  // const sortedStocks = [...rows].sort((a, b) => {
  //   if (!sortConfig.key) return 0;
  //   const aValue = a[sortConfig.key];
  //   const bValue = b[sortConfig.key];
    
  //   if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
  //   if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
  //   return 0;
  // });
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  const addRow = () => {
    const lastRow = rows[rows.length - 1];

    if (!lastRow.purchaseDate || !lastRow.sellingDate || !lastRow.sellingQuantity) {
      const updatedRows = [...rows];
      updatedRows[rows.length - 1].errors = validateRow(lastRow);
      setRows(updatedRows);
      return;
    }

   
    const newRow = {
      purchaseDate: "",
        purchaseRate: "",
        sellingDate: getCurrentDate(),
        sellingQuantity: "1",
        sellingPrice: "",
        profitLoss: "",
        errors: {},
    };
  
    const updatedRows = [...rows, newRow];
    const newTotalPages = Math.ceil(updatedRows.length / rowsPerPage);
      
      setCurrentPage(newTotalPages); 
      setRows(updatedRows);
      recalculateProfit(updatedRows);

  };

  const validateRow = (row) => {
    const errors = {};

    if (!row.purchaseDate) errors.purchaseDate = "Purchase date is required.";
    if (!row.sellingDate) errors.sellingDate = "Selling date is required.";
    if (!row.sellingQuantity || row.sellingQuantity <= 0) errors.sellingQuantity = "Enter a valid quantity.";

    if (row.purchaseDate && row.sellingDate) {
      const purchaseDate = new Date(row.purchaseDate);
      const sellingDate = new Date(row.sellingDate);
      if (sellingDate < purchaseDate) {
        errors.sellingDate = "Selling date cannot be before purchase date.";
      }
    }

    return errors;
  };

  const handleInputChange = async (index, field, value) => {
    const selectedDate = new Date(value);
    const day = selectedDate.getDay(); // 0 = Sunday, 6 = Saturday

    if (day === 0 || day === 6) {
        alert("Weekends are not allowed. Please select a weekday.");
        return; // Prevent setting the value
    }
    const globalIndex = (currentPage - 1) * rowsPerPage + index; // ✅ Fix index

    const updatedRows = [...rows];
    if (!updatedRows[globalIndex]) {
      console.error("Invalid row index:", globalIndex);
      return;
  }

    updatedRows[globalIndex][field] = value;
    

    // Validate input
    const errors = validateRow(updatedRows[globalIndex]);
    updatedRows[globalIndex].errors = errors;

    if (errors.sellingDate) {
        updatedRows[globalIndex].loading_pr = false; // Hide loading if validation fails
        updatedRows[globalIndex].loading_sr=false;
        setRows([...updatedRows]);
        return;
    }
    field==="purchaseDate"? updatedRows[globalIndex].loading_pr = true:updatedRows[globalIndex].loading_sr = true

    setRows([...updatedRows]); // Update state to show the spinner
   

    if (field === "purchaseDate" || field === "sellingDate") {
        const stockRate = await fetchStockRate(value);
        
        const exchangeRateres = await fetchExchangeRate(value,stockRate.currency);
 
        if(exchangeRateres.exchangeRate_source!==exchangeRateres.exchangeRate_table)
        {
          exchangeRateres.exchangeRate_table= exchangeRateres.exchangeRate_table / exchangeRateres.exchangeRate_source;

        }
        else{
          exchangeRateres.exchangeRate_table=1;
        }
        if (stockRate.open !== null) {
         
           if (field === "purchaseDate") {
    updatedRows[globalIndex].purchaseRate = parseFloat((stockRate.open * updatedRows[globalIndex].sellingQuantity * exchangeRateres.exchangeRate_table).toFixed(2));
    updatedRows[globalIndex].purchaseRate_str = parseFloat((stockRate.open * exchangeRateres.exchangeRate_table * exchangeRateres.exchangeRate_source).toFixed(2));
    updatedRows[globalIndex].originalPurchasePrice = parseFloat((stockRate.open * exchangeRateres.exchangeRate_table).toFixed(2));
} else {
    if (updatedRows[globalIndex].purchaseRate) {
        updatedRows[globalIndex].sellingPrice = parseFloat((stockRate.open * updatedRows[globalIndex].sellingQuantity * exchangeRateres.exchangeRate_table).toFixed(2));
        updatedRows[globalIndex].sellingPrice_str = parseFloat((stockRate.open * exchangeRateres.exchangeRate_table * exchangeRateres.exchangeRate_source).toFixed(2));
        updatedRows[globalIndex].originalSellingPrice = parseFloat((stockRate.open * exchangeRateres.exchangeRate_table).toFixed(2));
    }


            }
        }
    }

    if (updatedRows[globalIndex].purchaseRate && updatedRows[globalIndex].sellingPrice && updatedRows[globalIndex].sellingQuantity) {
        updatedRows[globalIndex].profitLoss = calculateProfitLoss(
            updatedRows[globalIndex].sellingPrice_str * updatedRows[globalIndex].sellingQuantity,
            updatedRows[globalIndex].purchaseRate_str * updatedRows[globalIndex].sellingQuantity
        );
    }

    updatedRows[globalIndex].loading_pr = false; // Hide loading after data is fetched
    updatedRows[globalIndex].loading_sr=false;

    setRows([...updatedRows]);
};


  const calculateProfitLoss = (sellingPrice, purchasePrice) => {

    return formatAmount(sellingPrice - purchasePrice) ;
  };

  const updateSellingPriceAndRecalculate = (rows, index, newSellingPrice, setRows) => {
    const updatedRows = [...rows];
    updatedRows[index].sellingPrice_str = newSellingPrice;
  
    const quantity = parseFloat(updatedRows[index].sellingQuantity) || 0;
    const selling = parseFloat(newSellingPrice) || 0;
    const purchase = parseFloat(updatedRows[index].purchaseRate_str) || 0;
  
    updatedRows[index].profitLoss = calculateProfitLoss(
      selling * quantity,
      purchase * quantity
    );
  
    setRows(updatedRows);
    recalculateProfit(updatedRows);

  };
  


  const handleQuantityChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].sellingQuantity = value;
    
    // Validate input
  const errors = validateRow(updatedRows[index]);
  updatedRows[index].errors = errors;  

  if (errors.sellingQuantity) { // Only return if there is an error for sellingQuantity
    setRows(updatedRows);
    return;
  }

    if (!updatedRows[index].originalSellingPrice) {
      updatedRows[index].originalSellingPrice = updatedRows[index].sellingPrice || 0;
    }
    if (!updatedRows[index].originalPurchasePrice) {
      updatedRows[index].originalSellingPrice = updatedRows[index].purchaseRate || 0;
    }

    updatedRows[index].sellingPrice = updatedRows[index].originalSellingPrice * value;
    updatedRows[index].purchaseRate = updatedRows[index].originalPurchasePrice * value;
  

    if (updatedRows[index].purchaseRate && updatedRows[index].sellingPrice) {
      updatedRows[index].profitLoss = calculateProfitLoss(
        updatedRows[index].sellingPrice_str*value,
        updatedRows[index].purchaseRate_str*value,
        
      );
    }

    setRows(updatedRows);
    recalculateProfit(updatedRows);

  };

  const fetchExchangeRate = async (date,table_currency) => {
    try {
      const response = await axios.get(`${API_EXCHANGE_URL}/${date}`);
      table_currency=table_currency.toLowerCase();
      sourceCurrency=sourceCurrency.toLowerCase();

      if (response.data) {
        const exchangeRatesres = {
          exchangeRate_table: response.data[table_currency],
          exchangeRate_source: response.data[sourceCurrency]
        };
        
        return exchangeRatesres;
      }
    } catch (error) {
      console.error("Error fetching Exchange rate:", error);
    }
    // try {

      
    //   const rate_source_toINR = response.data[sourceCurrency.toLowerCase()];
    //   let sourceTotable= rate_source_toINR ;
    //   if(table_currency!==sourceCurrency)
    //     {
    //       const rate_table_toINR = response.data[table_currency.toLowerCase()];
    //        sourceTotable= rate_table_toINR / rate_source_toINR;

    //     }

  
    //   if (sourceTotable) {
    //     return sourceTotable; 
    //   }
     
    // } catch (error) {
    //   console.error("Error fetching exchange rate:", error);
    // }
    return null;
  };
  const fetchStockRate = async (date) => {
    try {
      const response = await axios.get(`${API_URL}?company=${selectedCompany.name.toUpperCase()}&date=${date}`);
      
      if (response.data) {
        const ans = {
          currency: response.data[0].currency,
          open: response.data[0].open
        };
        
        return ans;
      }
    } catch (error) {
      console.error("Error fetching stock rate:", error);
    }
  
    return null;
  };
  
  
  
  const sortByDate = (field) => {
    const sortedRows = [...rows].sort((a, b) => {
      const dateA = new Date(a[field]);
      const dateB = new Date(b[field]);
  
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  
    setRows(sortedRows);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc"); // Toggle sorting order
    setSortField(field); // set the field being sorted
  };

  const removeRow = (indexToRemove) => {
    const updatedRows = rows.filter((_, i) => i !== indexToRemove);
    setRows(updatedRows);
    recalculateProfit(updatedRows);
  };
  
  const sortByField = (field) => {
    const sortedRows = [...rows].sort((a, b) => {
      const fieldA = a[field];
      const fieldB = b[field];
  
      return sortOrder === "asc" ? fieldA - fieldB : fieldB - fieldA;
      
    });
  
    setRows(sortedRows);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc"); // Toggle sorting order
    setSortField(field); // set the field being sorted

  };
  
  const getProfitLossClass = (profitLoss) => {
    if (profitLoss === "") return "profit-loss grey"; 
    return profitLoss < 0 ? "profit-loss loss" : "profit-loss profit";
  };



  
  return (
    <div className="stock-table-container">
      {/* Tabs */}
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "table" ? "active" : ""}`}
            onClick={() => handleTabChange("table")}
          >
            Table View
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "graph" ? "active" : ""}`}
            onClick={() => handleTabChange("graph")}
          >
            Graph View
          </button>
        </li>
  
        <Button className="calculate-btn me-1 mb-1 p-2">
          Calculate Profitable Income
        </Button>
      </ul>
  
      {/* Conditional Rendering */}
      {activeTab === "table" ? (
        <div></div>
      ) : (
        <div>
          <br />
          <StockCharts stockData={rows} />
        </div>
      )}
  
      <div className="belowNav">
        <div className="d-flex justify-content-between align-items-center p-3">
          <div className="profit-container">
            <div className="profit-title">
              <p className="label">Total P&L</p>
              <h2 className={`amount ${totalProfit < 0 ? "negative" : "positive"}`}>
                {Math.abs(formatAmount(totalProfit).split(".")[0] || 0)}
                <span className="decimal">.{formatAmount(totalProfit).split(".")[1]}</span>
              </h2>
            </div>
  
            <div className="download-buttons">
              <button className="down_butt">Download CSV</button>
              <button className="down_butt">Upload PDF</button>
            </div>
          </div>
        </div>
  
        <Table bordered className="custom-table">
          <thead>
            <tr>
              {rows.length > 1 && <th></th>}
              <th
                onClick={() => sortByDate("purchaseDate")}
                className={sortField === "purchaseDate" ? "active-header" : ""}
              >
                <div className="header-cell">
                  <span>Purchase Date</span>
                  {sortField === "purchaseDate" && (
                    <span className="sort-icon">{sortOrder === "asc" ? "▲" : "▼"}</span>
                  )}
                </div>
              </th>
              <th
                onClick={() => sortByField("purchaseRate")}
                className={sortField === "purchaseRate" ? "active-header" : ""}
              >
                <div className="header-cell">
                  <span>Purchase Price ({sourceCurrency})</span>
                  {sortField === "purchaseRate" && (
                    <span className="sort-icon">{sortOrder === "asc" ? "▲" : "▼"}</span>
                  )}
                </div>
              </th>
              <th
                onClick={() => sortByDate("sellingDate")}
                className={sortField === "sellingDate" ? "active-header" : ""}
              >
                <div className="header-cell">
                  <span>Selling Date</span>
                  {sortField === "sellingDate" && (
                    <span className="sort-icon">{sortOrder === "asc" ? "▲" : "▼"}</span>
                  )}
                </div>
              </th>
              <th>Selling Quantity</th>
              <th>Selling Price ({targetCurrency})</th>
              <th>P&L ({targetCurrency})</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              
            paginatedRows.map((row, index) => (
              <tr key={index}>
                {rows.length > 1 && (
                  <td>
                    <Button className="remove-btn" onClick={() => removeRow(index)}>
                      ×
                    </Button>
                  </td>
                )}
  
                <td>
                  <Input
                    type="date"
                    value={row.purchaseDate}
                    onChange={(e) => handleInputChange(index, "purchaseDate", e.target.value)}
                    className="disable-weekends"
                    invalid={!!row.errors.purchaseDate}
                  />
                  {row.errors.purchaseDate && (
                    <FormFeedback>{row.errors.purchaseDate}</FormFeedback>
                  )}
                </td>
  
                <td>
                  {row.loading_pr ? (
                    <span className="spinner-border spinner-border-sm text-primary"></span>
                  ) : (
                    <Input type="number" value={row.purchaseRate} placeholder="Auto-filled" disabled />
                  )}
                </td>
  
                <td>
                  <Input
                    type="date"
                    value={row.sellingDate}
                    onChange={(e) => handleInputChange(index, "sellingDate", e.target.value)}
                    min={row.purchaseDate}
                    invalid={!!row.errors.sellingDate}
                  />
                  {row.errors.sellingDate && (
                    <FormFeedback>{row.errors.sellingDate}</FormFeedback>
                  )}
                </td>
  
                <td>
                  <Input
                    type="number"
                    value={row.sellingQuantity}
                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                    placeholder="Enter quantity"
                    invalid={!!row.errors.sellingQuantity}
                  />
                  {row.errors.sellingQuantity && (
                    <FormFeedback>{row.errors.sellingQuantity}</FormFeedback>
                  )}
                </td>
  
                <td>
  {row.loading_sr ? (
    <span className="spinner-border spinner-border-sm text-primary"></span>
  ) : (

    <Input
  type="number"
  value={row.sellingPrice_str}
  onChange={(e) =>
    updateSellingPriceAndRecalculate(rows, index, e.target.value, setRows)
  }
/>

  
  )}
</td>

  
                <td>
                  <Input
                    type="number"
                    value={row.profitLoss < 0 ? Math.abs(row.profitLoss) : row.profitLoss}
                    disabled
                    placeholder="Auto-filled"
                    className={getProfitLossClass(row.profitLoss)}
                  />
                </td>
  
                <td>
                  {(currentPage === Math.ceil(rows.length / rowsPerPage)) &&
                  index === paginatedRows.length - 1 && (
                    <Button className="add-more-btn p-2" onClick={addRow}>
                      Add More
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
  
    
    </div>
  );
  
};

export default StockTable;
