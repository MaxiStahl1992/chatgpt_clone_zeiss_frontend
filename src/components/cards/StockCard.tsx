import React, { useEffect, useState } from "react";
import axios from "axios";

const StockCard: React.FC = () => {
  const [stockInfo, setStockInfo] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call to backend
    const fetchStockInfo = async () => {
      try {
        const response = await axios.get("/api/stocks"); // Mock endpoint
        setStockInfo(`AAPL: ${response.data.price} USD`);
      } catch (error) {
        setStockInfo("Unable to fetch stock data");
      }
    };

    fetchStockInfo();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow text-center">
      <h3 className="text-primary font-bold mb-2">Stock Market</h3>
      <p>{stockInfo || "Loading..."}</p>
    </div>
  );
};

export default StockCard;