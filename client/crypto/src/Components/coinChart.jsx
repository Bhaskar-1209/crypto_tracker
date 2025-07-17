import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const CoinChart = ({ coinId }) => {
  const [history, setHistory] = useState([]);
  const [coinName, setCoinName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`https://crypto-tracker-5z2d.onrender.com/api/history/${coinId}`);
      setHistory(res.data);

      // Optional: set coin name from first data point, if available
      if (res.data.length > 0 && res.data[0].name) {
        setCoinName(res.data[0].name);
      } else {
        setCoinName(coinId); // fallback if name is not available
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [coinId]);

  return (
    <div className="w-full h-80 mt-6 bg-white/10 rounded-xl p-4 backdrop-blur-lg">
      {loading ? (
        <p className="text-white">Loading chart...</p>
      ) : (
        <>
          <h2 className="text-white text-xl font-semibold mb-4">
            {coinName} Price History
          </h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="timestamp" tickFormatter={(ts) => new Date(ts).toLocaleDateString()} />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip labelFormatter={(ts) => new Date(ts).toLocaleString()} />
              <Line type="monotone" dataKey="price" stroke="#00bcd4" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default CoinChart;
