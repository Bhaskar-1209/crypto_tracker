import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const CoinChart = ({ coinId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await axios.get(`https://crypto-tracker-5z2d.onrender.com/api/history/${coinId}`);

        const formatted = data.map((d) => ({
          price: d.price,
          date: new Date(d.lastUpdated).getTime(), // use timestamp number for recharts
        }));

        setHistory(formatted);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching chart history:', error);
        setLoading(false);
      }
    };

    fetchHistory();
  }, [coinId]);

  return (
    <div className="w-full h-64 mt-8">
      <h2 className="text-xl font-semibold mb-2 uppercase">{coinId} Price History</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading chart...</p>
      ) : history.length === 0 ? (
        <p className="text-center text-red-500">No history data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <XAxis
              dataKey="date"
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
              }
              angle={-25}
              textAnchor="end"
              height={70}
            />
            <YAxis dataKey="price" domain={['auto', 'auto']} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip
              labelFormatter={(value) =>
                new Date(value).toLocaleString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              }
              formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
            />
            <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CoinChart;
