import React, { useState } from 'react';
import StockTable from './StockTable';
import StockCharts from './StockCharts';
import Sidebar from './Sidebar'; 
import Company from './Company';
import "./BoxList.css"; 
import ApexChartComponent from './ApexChartComponent';

const BoxList = () => {
  const [sourceCurrency, setSourceCurrency] = useState("USD"); // Default
  const [targetCurrency, setTargetCurrency] = useState("INR");
  const [conversionRate, setConversionRate] = useState(null);
  const [stockData, setStockData] = useState([]);

  return (
    <div className="dashboard-container">
   
      <div className="content-area">
          <div className="converter-section">
            {/* Pass state setters to Company */}
            <Company 
              sourceCurrency={sourceCurrency}
              setSourceCurrency={setSourceCurrency}
              targetCurrency={targetCurrency}
              setTargetCurrency={setTargetCurrency}
              conversionRate={conversionRate}
              setConversionRate={setConversionRate}
            />
          </div>

        {/* Stock Table */}
          {/* <div className='stock_table'>
            <StockTable 
              sourceCurrency={sourceCurrency} 
              targetCurrency={targetCurrency} 
              rows={stockData} 
              setRows={setStockData} 
            />
          </div> */}
          
         
      </div>
    </div>
  );
};

export default BoxList;
