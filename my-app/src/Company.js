import React, { useState } from "react";
import ApexChartComponent from "./ApexChartComponent";
import "./Company.css";
import Converter from "./Converter";
import StockTable from "./StockTable";
import CompanySelector from "./CompanySelector"; 
import ExchangeChartContainer from "./ExchangeChartContainer";

const companies = [
  { name: "Apple", symbol: "AAPL", currency: "USD", country: "USA" },
  { name: "Tesla", symbol: "TSLA", currency: "USD", country: "USA" },
  { name: "SAP", symbol: "SAP.DE", currency: "EUR", country: "Germany" },
  { name: "Amazon", symbol: "AMZN", currency: "USD", country: "USA" },
  { name: "Google", symbol: "GOOGL", currency: "USD", country: "USA" },
  { name: "Reliance Industries", symbol: "RELIANCE.NS", currency: "INR", country: "India" },
  { name: "Tata Motors", symbol: "TATAMOTORS.NS", currency: "INR", country: "India" },
  { name: "Microsoft", symbol: "MSFT", currency: "USD", country: "USA" },
  { name: "Facebook (Meta)", symbol: "META", currency: "USD", country: "USA" },
  { name: "Alibaba", symbol: "BABA", currency: "HKD", country: "China" },
  { name: "Samsung", symbol: "005930.KQ", currency: "KRW", country: "South Korea" },
  { name: "Sony", symbol: "6758.T", currency: "JPY", country: "Japan" },
  { name: "HSBC Holdings", symbol: "HSBA.L", currency: "GBP", country: "United Kingdom" },
  { name: "Nestle", symbol: "NESN.S", currency: "CHF", country: "Switzerland" },
  { name: "Toyota", symbol: "7203.T", currency: "JPY", country: "Japan" },
  { name: "Siemens", symbol: "SIE.DE", currency: "EUR", country: "Germany" },
  { name: "HDFC Bank", symbol: "HDFCBANK.NS", currency: "INR", country: "India" },
  { name: "ICICI Bank", symbol: "ICICIBANK.NS", currency: "INR", country: "India" },
  { name: "Adidas", symbol: "ADS.DE", currency: "EUR", country: "Germany" },
  { name: "Volkswagen", symbol: "VOW3.DE", currency: "EUR", country: "Germany" },
  { name: "BMW", symbol: "BMW.DE", currency: "EUR", country: "Germany" },
  { name: "Berkshire Hathaway", symbol: "BRK.A", currency: "USD", country: "USA" },
  { name: "LVMH", symbol: "MC.PA", currency: "EUR", country: "France" },
  { name: "Tencent", symbol: "0700.HK", currency: "HKD", country: "China" },
  { name: "Vodafone", symbol: "VOD.L", currency: "GBP", country: "United Kingdom" },
  { name: "ICICI Bank", symbol: "ICICIBANK.NS", currency: "INR", country: "India" },
  { name: "Adidas", symbol: "ADS.DE", currency: "EUR", country: "Germany" },
  { name: "Volkswagen", symbol: "VOW3.DE", currency: "EUR", country: "Germany" },
  { name: "BMW", symbol: "BMW.DE", currency: "EUR", country: "Germany" },
  { name: "Berkshire Hathaway", symbol: "BRK.A", currency: "USD", country: "USA" },
  { name: "LVMH", symbol: "MC.PA", currency: "EUR", country: "France" },
  { name: "Tencent", symbol: "0700.HK", currency: "HKD", country: "China" },
  { name: "Vodafone", symbol: "VOD.L", currency: "GBP", country: "United Kingdom" },

];


const Company = ({ 
  sourceCurrency, 
  setSourceCurrency, 
  targetCurrency, 
  setTargetCurrency, 
  conversionRate, 
  setConversionRate,

}) => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [stockData, setStockData] = useState([]);

  const handleChange = (event) => {
    const company = companies.find((c) => c.symbol === event.target.value);
    setSelectedCompany(company);
    if (company) {
      setSourceCurrency(company.currency);
    }
  };

  return (

        <div className="container">
          {/* <div className="comapnyselect"> */}
          <CompanySelector 
          selectedCompany={selectedCompany} 
          handleChange={handleChange} 
          companies={companies} 
         />
    
          {/* </div> */}
          
         {selectedCompany && (
          <div  className="companystyle">
              <div className="section">
                <Converter 
                  sourceCurrency={sourceCurrency} 
                  setSourceCurrency={setSourceCurrency} 
                  targetCurrency={targetCurrency} 
                  setTargetCurrency={setTargetCurrency} 
                  conversionRate={conversionRate} 
                  setConversionRate={setConversionRate} 
                />
              </div>
    
              <div className="section graph">
              <div className="stockgraph">
    <ApexChartComponent company={selectedCompany.symbol} />
  </div>
  <div className="exchnge-graph">
    <ExchangeChartContainer currency={sourceCurrency} />
  </div>

              </div>
    
            <div className='stock_table'>
              <StockTable 
               selectedCompany={selectedCompany}
                sourceCurrency={sourceCurrency} 
                targetCurrency={targetCurrency} 
                rows={stockData} 
                setRows={setStockData} 
              />
            </div>
          </div>
        )}
        </div>
        
      
    );
    };

export default Company;