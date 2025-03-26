import {  Input, FormFeedback } from "reactstrap";
import React, {useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Table, Button, Form, InputGroup, Dropdown } from "react-bootstrap";
import axios from "axios";
import "./StockTable.css";
import StockCharts from "./StockCharts";
import ApexChartComponent from "./ApexChartComponent";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa"; // Import calendar icon







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
    const [totalPurchasePrice, setTotalPurchasePrice] = useState(null);
    const [totalSellingPrice, setTotalSellingPrice] = useState(null);
    const [totalPurchasePriceTarget, setTotalPurchasePriceTarget] = useState(null);
    const [totalSellingPriceTarget, setTotalSellingPriceTarget] = useState(null);
    const [newSellingPrice, setnewSellingPrice] = useState(null);
    const [sortField, setSortField] = useState("");
  
  const recalculateProfit = (rowsData) => {
    const profitSum = rowsData.reduce((acc, row) => acc + (Number(row.profitLoss) || 0), 0);
    setTotalProfit(profitSum);
    const purchaseSum = rowsData.reduce((acc, row) => acc + (Number(row.purchaseRate) || 0), 0);
    setTotalPurchasePrice(purchaseSum);
    const sellingSum = rowsData.reduce((acc, row) => acc + (Number(row.sellingPrice) || 0), 0);
    setTotalSellingPrice(sellingSum);
    const purchaseSumTaret = rowsData.reduce((acc, row) => acc + (Number(row.purchaseRate_str) || 0), 0);
    setTotalPurchasePriceTarget(purchaseSumTaret);
    const sellingSumTarget = rowsData.reduce((acc, row) => acc + (Number(row.sellingPrice_str) || 0), 0);
    setTotalSellingPriceTarget(sellingSumTarget);
  };
 

  const formatAmount = (amount) => {
    return amount ? amount.toFixed(2) : "0.00";

  };
  
  const getCurrentDate = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split("T")[0];
  };
  const GOOGLE_SCRIPT_ID = "AKfycby76TF8y_NkNTXb8TBHcvXmIYRFxzgNYEGh_3R4i7LWgk8F2lsXbMedMOZjJrJz1EF8";
  const API_URL = `https://script.google.com/macros/s/${GOOGLE_SCRIPT_ID}/exec`;
  const API_EXCHANGE_URL=`http://localhost:8080/api/exchange`;
  const API_STOCK_URL=`http://localhost:8080/api/stock/stock_perdate&company`;

  useEffect(() => {
    if (rows.length === 0) {
      setRows([
        {
          purchaseDate: "",
          purchaseRate: "",
          sellingDate: getCurrentDate(),
          sellingQuantity: "1",
          sellingPrice: "0",
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
      setRows(updatedRows);
      return;
    }

   
    const newRow = {
      purchaseDate: "",
        purchaseRate: "",
        sellingDate: getCurrentDate(),
        sellingQuantity: "1",
        sellingPrice: "0",
        profitLoss: "",
        errors: {},
    };
  
    const updatedRows = [...rows, newRow];
    const newTotalPages = Math.ceil(updatedRows.length / rowsPerPage);
      
      setCurrentPage(newTotalPages); 
      setRows(updatedRows);
      recalculateProfit(updatedRows);
  
  };

  const validateRow = (row,newSellingPrice) => {
    const errors = {};

    // if (!row.purchaseRate) errors.purchaseRate = "Purchase price is required.";
    if (!row.sellingQuantity || row.sellingQuantity <= 0) errors.sellingQuantity = "Enter a valid quantity.";
    if (row.sellingPrice && newSellingPrice!=""){
    const openPrice = row.originalSellingPrice;  // Assuming open price is stored here
    const closePrice = row.sellingPrice_close;  // Assuming close price is stored here
    const max_pr = Math.max(openPrice, closePrice);
    const min_pr = Math.min(openPrice, closePrice);

    // Validate if newSellingPrice is within range
    if (newSellingPrice > max_pr || newSellingPrice < min_pr) {

      errors.sellingPrice = `Selling price must be between ${openPrice} and ${closePrice}`;
      console.warn(`Skipping row ${row}: Selling price must be between ${openPrice} and ${closePrice}`);
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
    const globalIndex = (currentPage - 1) * rowsPerPage + index;

    const updatedRows = [...rows];
    if (!updatedRows[globalIndex]) {
      console.error("Invalid row index:", globalIndex);
      return;
  }

  const errors = validateRow(updatedRows[globalIndex]);
    updatedRows[globalIndex].errors = errors;
     if (field === "sellingDate" && !updatedRows[globalIndex].purchaseRate) {
        updatedRows[globalIndex].errors.purchaseRate = "Please enter a purchase rate first.";
        setRows([...updatedRows]);
        return; // Stop execution
    
    }
    else{
      if (errors.sellingQuantity|| errors.sellingPrice) {
        updatedRows[globalIndex].loading_pr = false; // Hide loading if validation fails
        updatedRows[globalIndex].loading_sr=false;
        setRows([...updatedRows]);
        return;
    }
    }
    
   
    updatedRows[globalIndex][field] = value;
    

    // Validate input
  
    field==="purchaseDate"? updatedRows[globalIndex].loading_pr = true:updatedRows[globalIndex].loading_sr = true

    setRows([...updatedRows]); // Update state to show the spinner
   

    if (field === "purchaseDate" || field === "sellingDate") {
        const stockRate = await fetchStockRate(value);
        
        const exchangeRateres = await fetchExchangeRate(value,stockRate.currency);
 
        if(exchangeRateres.exchangeRate_source!==exchangeRateres.exchangeRate_table)
        {
          exchangeRateres.exchangeRate_table= parseFloat((exchangeRateres.exchangeRate_table / exchangeRateres.exchangeRate_source).toFixed(2));

        }
        else{
          exchangeRateres.exchangeRate_table=1;
        }
        if (stockRate.open !== null) {
         
           if (field === "purchaseDate") {
    updatedRows[globalIndex].purchaseRate = parseFloat((stockRate.open *  exchangeRateres.exchangeRate_table).toFixed(2));
    updatedRows[globalIndex].purchaseRate_str = parseFloat((stockRate.open * exchangeRateres.exchangeRate_table * exchangeRateres.exchangeRate_source).toFixed(2));//SOURCE-TARGET
    updatedRows[globalIndex].originalPurchasePrice = parseFloat((stockRate.open * exchangeRateres.exchangeRate_table).toFixed(2));
    } else {
    if (updatedRows[globalIndex].purchaseRate) {
        updatedRows[globalIndex].sellingPrice_close = parseFloat((stockRate.close * exchangeRateres.exchangeRate_table).toFixed(2));
        updatedRows[globalIndex].sellingPrice = parseFloat((stockRate.open * exchangeRateres.exchangeRate_table).toFixed(2));
        updatedRows[globalIndex].sellingPrice_str = parseFloat((stockRate.open * exchangeRateres.exchangeRate_table * exchangeRateres.exchangeRate_source).toFixed(2));//SOURCE-TARGET
        updatedRows[globalIndex].originalSellingPrice = parseFloat((stockRate.open * exchangeRateres.exchangeRate_table).toFixed(2));
      }  }

        }
    }

    if (updatedRows[globalIndex].purchaseRate && updatedRows[globalIndex].sellingPrice && updatedRows[globalIndex].sellingQuantity) {
        updatedRows[globalIndex].profitLoss = calculateProfitLoss(
            updatedRows[globalIndex].sellingPrice_str ,updatedRows[globalIndex].sellingQuantity,
            updatedRows[globalIndex].purchaseRate_str 
        );
    }

    updatedRows[globalIndex].loading_pr = false; // Hide loading after data is fetched
    updatedRows[globalIndex].loading_sr=false;

    setRows([...updatedRows]);
};


  const calculateProfitLoss = (sellingPrice,quantity, purchasePrice) => {

    return formatAmount((sellingPrice - purchasePrice)*quantity);
  };

  const updateSellingPriceAndRecalculate = (rows, index, newSellingPrice, setRows) => {
    const updatedRows = [...rows];
    const globalIndex = (currentPage - 1) * rowsPerPage + index;

    const rate=parseFloat((updatedRows[globalIndex].sellingPrice_str/updatedRows[globalIndex].sellingPrice).toFixed(2));
    const errors = validateRow(updatedRows[globalIndex],newSellingPrice);
    updatedRows[globalIndex].errors = errors;  
  
    if (errors.sellingPrice) { 
      setRows(updatedRows);
      return;
    }
  

    updatedRows[globalIndex].sellingPrice_str = parseFloat((newSellingPrice*rate).toFixed(2));
    updatedRows[globalIndex].sellingPrice= newSellingPrice;

    const quantity = parseFloat(updatedRows[globalIndex].sellingQuantity) || 0;
    const selling = parseFloat((newSellingPrice) *rate)|| 0;
    const purchase = parseFloat(updatedRows[globalIndex].purchaseRate_str) || 0;
  
    updatedRows[globalIndex].profitLoss = calculateProfitLoss(
      selling , quantity,
      purchase 
    );
  
    setRows(updatedRows);
    recalculateProfit(updatedRows);
 
  };
  
  const downloadCSV = () => {
    if (!rows || rows.length === 0) return;

    const requiredFields = ["purchaseDate", "purchaseRate", "sellingDate", "sellingQuantity", "sellingPrice", "profitLoss"];

    const csvRows = [
        requiredFields.join(','), 
        ...rows.map(row =>
            requiredFields.map(field => `"${row[field] ?? ''}"`).join(',')
        )
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = (selectedCompany?.name || "selectedCompany") + ".csv"; 

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};


  const handleQuantityChange = (index, value) => {
    const globalIndex = (currentPage - 1) * rowsPerPage + index;

    const updatedRows = [...rows];
    updatedRows[globalIndex].sellingQuantity = value;
    
    // Validate input
  const errors = validateRow(updatedRows[globalIndex],"");
  updatedRows[globalIndex].errors = errors;  

  if (errors.sellingQuantity) { 
    return;
  }

    // if (!updatedRows[index].originalSellingPrice) {
    //   updatedRows[index].originalSellingPrice = updatedRows[index].sellingPrice || 0;
    // }
    // if (!updatedRows[index].originalPurchasePrice) {
    //   updatedRows[index].originalSellingPrice = updatedRows[index].purchaseRate || 0;
    // }

    // updatedRows[index].sellingPrice = updatedRows[index].originalSellingPrice * value;
    // updatedRows[index].purchaseRate = updatedRows[index].originalPurchasePrice * value;
  

    if (updatedRows[globalIndex].purchaseRate && updatedRows[globalIndex].sellingPrice) {
      updatedRows[globalIndex].profitLoss = calculateProfitLoss(
        updatedRows[globalIndex].sellingPrice_str,value,
        updatedRows[globalIndex].purchaseRate_str
        
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
   
    return null;
  };
  const fetchStockRate = async (date) => {
    try {
      const response = await axios.get(`${API_STOCK_URL}?company=${selectedCompany.name.toUpperCase()}&date=${date}`);
      
      if (response.data) {
        const ans = {
          currency: response.data[0].currency,
          open: response.data[0].open,
          close: response.data[0].close
        };
        
        return ans;
      }
    } catch (error) {
      console.error("Error fetching stock rate:", error);
    }
  
    return null;
  };
  
  
  
  const sortByDate = (field) => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
  
    const currentPageRows = rows.slice(startIndex, endIndex);
    const sortedPageRows = [...currentPageRows].sort((a, b) => {
      const dateA = new Date(a[field]);
      const dateB = new Date(b[field]);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  
    // Now insert the sorted rows back into the original array
    const newRows = [...rows];
    for (let i = 0; i < sortedPageRows.length; i++) {
      newRows[startIndex + i] = sortedPageRows[i];
    }
  
    setRows(newRows);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setSortField(field)
  };

  const removeRow = (indexToRemove) => {
    const updatedRows = rows.filter((_, i) => i !== indexToRemove);
    setRows(updatedRows);
    recalculateProfit(updatedRows);
  };

  const CustomDatePickerInput = ({ value, onClick }) => (
    <div className="datepicker-wrapper" onClick={onClick}>
      <FaCalendarAlt className="calendar-icon" />
      <input type="text" value={value} readOnly className="form-control" placeholder="Select date" />     
    </div>
  );
  
  const sortByField = (field) => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
  
    const currentPageRows = rows.slice(startIndex, endIndex);
    const sortedPageRows = [...currentPageRows].sort((a, b) => {
      const fieldA = a[field];
      const fieldB = b[field];
  
      // Smart comparison: works for numbers and strings
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return sortOrder === "asc"
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }
  
      return sortOrder === "asc" ? fieldA - fieldB : fieldB - fieldA;
    });
  
    const newRows = [...rows];
    for (let i = 0; i < sortedPageRows.length; i++) {
      newRows[startIndex + i] = sortedPageRows[i];
    }
  
    setRows(newRows);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setSortField(field);
  };
  
  const isAnyRowIncomplete = paginatedRows.some(row =>
    Object.values(row).some(value => value === '' || value === null || value === undefined)
  );
  

  const getProfitLossClass = (profitLoss) => {
    if (profitLoss === "") return "profit-loss grey"; 
    return profitLoss < 0 ? "profit-loss loss" : "profit-loss profit";
  };

  const handleSellingPriceTyping = (e, index) => {
    const value = e.target.value;
    const globalIndex = (currentPage - 1) * rowsPerPage + index;
    const updatedRows = [...rows];
    updatedRows[globalIndex].sellingPrice = value;
    setRows(updatedRows);
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


<div className="profit-container">
  {/* Header Row */}
  <div className="profit-header">
    <div className="profit-column currency"></div>
    <div className="profit-column">Total Purchase Price</div>
    <div className="profit-column">Total Selling Price</div>
    <div className="profit-column">Profit/Loss</div>
  </div>

  {/* INR Row */}
  <div className="profit-row">
    <div className="profit-column currency">INR</div>
    <div className="profit-column">
      <h2 className="amount black">
        {formatAmount(totalPurchasePriceTarget).split(".")[0] || 0}
        <span className="decimal">.{formatAmount(totalPurchasePriceTarget).split(".")[1]}</span>
      </h2>
    </div>
    <div className="profit-column">
      <h2 className="amount black">
        {formatAmount(totalSellingPriceTarget).split(".")[0] || 0}
        <span className="decimal">.{formatAmount(totalSellingPriceTarget).split(".")[1]}</span>
      </h2>
    </div>
    <div className="profit-column">
    <h2 className={`amount ${totalProfit < 0 ? "negative" : "positive"}`}>
        {formatAmount(Math.abs(totalProfit)).split(".")[0] || 0}
        <span className="decimal">.{formatAmount(Math.abs(totalProfit)).split(".")[1]}</span>
      </h2>
    </div>
  </div>

  {/* EUR Row */}
  <div className="profit-row">
    <div className="profit-column currency">EUR</div>
    <div className="profit-column">
      <h2 className="amount black">
        {formatAmount(totalPurchasePrice).split(".")[0] || 0}
        <span className="decimal">.{formatAmount(totalPurchasePrice).split(".")[1]}</span>
      </h2>
    </div>
    <div className="profit-column">
      <h2 className="amount black">
        {formatAmount(totalSellingPrice).split(".")[0] || 0}
        <span className="decimal">.{formatAmount(totalSellingPrice).split(".")[1]}</span>
      </h2>
    </div>
    <div className="profit-column">
      <h2 className={`amount ${(totalSellingPrice-totalPurchasePrice) < 0 ? "negative" : "positive"}`}>
        {formatAmount(Math.abs(totalSellingPrice-totalPurchasePrice)).split(".")[0] || 0}
        <span className="decimal">.{formatAmount(Math.abs(totalSellingPrice-totalPurchasePrice)).split(".")[1]}</span>
      </h2>
    </div>
  </div>
</div>

<div className="download-buttons">
              <button className="down_butt"  onClick={downloadCSV}>Download CSV</button>
              <button className="down_butt">Upload Data</button>
            </div>
  
      <div className="belowNav">
        <div className="d-flex justify-content-between align-items-center p-3">
          <div className="profit-container">
          <div className="profit-table">
     

  {/* Profit Section */}


  


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
                <span>Purchase Price</span>
                <span className="currency-label">({sourceCurrency})</span>
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
              <th>Selling Price ({sourceCurrency})</th>
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
  <DatePicker
  selected={row.purchaseDate ? new Date(row.purchaseDate) : null}
  onChange={(date) => {
    const datestr = new Date(date);
    const formattedDate = datestr.toLocaleDateString("en-CA");
    handleInputChange(index, "purchaseDate", formattedDate);
  }}
  filterDate={(date) => date.getDay() !== 0 && date.getDay() !== 6} // Disable Sundays (0) and Saturdays (6)
  dateFormat="yyyy-MM-dd"
  showYearDropdown
  showMonthDropdown
  dropdownMode="select"
  customInput={<CustomDatePickerInput />} // Custom input field with icon

/>

</td>
              
  
                <td>
                  {row.loading_pr ? (
                    <span className="spinner-border spinner-border-sm text-primary"></span>
                  ) : (
                    <Input type="number" value={row.purchaseRate} placeholder="Auto-filled" disabled
                    invalid={!!row.errors.purchaseRate}
                    />
                  )}
                   {row.errors.purchaseRate && (
                    <FormFeedback className="feedback">{row.errors.purchaseRate}</FormFeedback>
                  )}
                  
                </td>
  
                <td>
  <DatePicker
  
    selected={row.sellingDate ? new Date(row.sellingDate) : null}
    onChange={(date) => {
      const formattedDate = date?.toISOString().split("T")[0]; // "yyyy-MM-dd"
      handleInputChange(index, "sellingDate", formattedDate);
    }}
    minDate={row.purchaseDate ? new Date(row.purchaseDate) : null}
    filterDate={(date) => date.getDay() !== 0 && date.getDay() !== 6} // Disable Sundays (0) and Saturdays (6)
    dateFormat="yyyy-MM-dd"
    showYearDropdown
    showMonthDropdown
    dropdownMode="select"

    customInput={<CustomDatePickerInput />} // Custom input field with icon
    // placeholderText="Select date"
      />
  {row.errors.sellingDate && (
    <div className="invalid-feedback">{row.errors.sellingDate}</div>
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
                    <FormFeedback className="feedback">{row.errors.sellingQuantity}</FormFeedback>
                  )}
                </td>
  
                <td>
  {row.loading_sr ? (
    <span className="spinner-border spinner-border-sm text-primary"></span>
  ) : (

    <Input
    type="number"
    value={row.sellingPrice}
    onChange={(e) => handleSellingPriceTyping(e, index)} // updates raw value in state
    invalid={!!row.errors.sellingPrice}
    onBlur={(e) =>
      updateSellingPriceAndRecalculate(rows, index, e.target.value, setRows)
    }    
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        updateSellingPriceAndRecalculate(rows, index, e.target.value, setRows);
      }
    }}
  />  
  )}
  {row.errors.sellingPrice && (
                    <FormFeedback className="feedback">{row.errors.sellingPrice}</FormFeedback>
                  )}
</td>


  
                <td>
                  <Input
                    type="number"
                    value={row.profitLoss < 0 ? Math.abs(row.profitLoss) : row.profitLoss}
                    disabled
                    placeholder="Auto-filled"
                    className={`form-control${getProfitLossClass(row.profitLoss)}`}
                  />
                </td>
  
                <td>
                  {(currentPage === Math.ceil(rows.length / rowsPerPage)) &&
                  index === paginatedRows.length - 1 && (
                    <Button className="add-more-btn p-2" onClick={addRow}  disabled={isAnyRowIncomplete}>
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
