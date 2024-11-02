import React, { useEffect, useState } from 'react';
import axios from 'axios';

const symbols = ['AAPL'];

type StockData = {
  symbol: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
};

const StockCard: React.FC = () => {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true);
      setError(null);

      try {
        const results: StockData[] = [];

        for (const symbol of symbols) {
          const response = await axios.get('http://localhost:8000/api/stock/', {
            params: { symbol },
            withCredentials: true,
          });

          const latestData = response.data["Time Series (5min)"];
          const latestTime = Object.keys(latestData)[0];
          const stockInfo = latestData[latestTime];

          results.push({
            symbol,
            open: stockInfo["1. open"],
            high: stockInfo["2. high"],
            low: stockInfo["3. low"],
            close: stockInfo["4. close"],
            volume: stockInfo["5. volume"],
          });
        }

        setStockData(results);
      } catch (err) {
        console.error("Error fetching stock data:", err);
        setError("Unable to fetch stock data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow text-center">
      <h3 className="text-lg font-semibold mb-4">Stock Information</h3>
      {loading && <p>Loading stock data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && stockData.length > 0 && (
        <ul className="divide-y divide-gray-300">
          {stockData.map((data) => (
            <li
              key={data.symbol}
              className="py-2">
              <h4 className="font-bold">{data.symbol}</h4>
              <p>Open: {data.open}</p>
              <p>High: {data.high}</p>
              <p>Low: {data.low}</p>
              <p>Close: {data.close}</p>
              <p>Volume: {data.volume}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StockCard;
