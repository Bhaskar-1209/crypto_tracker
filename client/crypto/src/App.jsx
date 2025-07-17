import { useEffect, useState } from 'react';
import axios from 'axios';
import CoinChart from './Components/coinChart';
import './index.css';

function App() {
  const [coins, setCoins] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selected, setSelected] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCoins = async () => {
    try {
      const res = await axios.get('https://crypto-tracker-5z2d.onrender.com/api/coins');
      setCoins(res.data?.data || []);
      setLastUpdated(res.data?.lastUpdated || null);
    } catch (err) {
      console.error('Error fetching coins:', err);
      setCoins([]); // fallback to empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoins();
    const interval = setInterval(fetchCoins, 30 * 60 * 1000); // every 30 minutes
    return () => clearInterval(interval);
  }, []);

  const handleChartToggle = (coinId) => {
    if (selected === coinId) {
      setShowChart(!showChart);
    } else {
      setSelected(coinId);
      setShowChart(true);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('https://gregfreeman.me/projects/random/crypto-bg2.jpg')" }}
    >
      <div className="bg-black bg-opacity-60 min-h-screen px-4 py-8">
        <h1 className="text-white text-3xl font-light text-center uppercase mb-4">
          Crypto Price Tracker
        </h1>

        {lastUpdated && (
          <p className="text-center text-white text-sm mb-6">
            Last Updated:{" "}
            {new Date(lastUpdated).toLocaleString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}

        {loading ? (
          <p className="text-white text-center mt-10 text-lg">Loading coin data...</p>
        ) : (
          <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl p-6 overflow-x-auto">
            <table className="table-auto w-full text-sm">
              <thead>
                <tr className="bg-gray-300 text-gray-900">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2">Symbol</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Market Cap</th>
                  <th className="px-4 py-2">24h %</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {coins.map((coin) => (
                  <tr
                    key={coin.coinId}
                    onClick={() => handleChartToggle(coin.coinId)}
                    className={`cursor-pointer border-b hover:bg-gray-100 transition ${
                      selected === coin.coinId ? 'bg-gray-200' : ''
                    }`}
                  >
                    <td className="px-4 py-2 text-left">{coin.name}</td>
                    <td className="px-4 py-2 uppercase">{coin.symbol}</td>
                    <td className="px-4 py-2">${coin.price.toFixed(2)}</td>
                    <td className="px-4 py-2">${coin.marketCap.toLocaleString()}</td>
                    <td
                      className={`px-4 py-2 font-semibold ${
                        coin.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {coin.change24h.toFixed(2)}%
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChartToggle(coin.coinId);
                        }}
                        className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                      >
                        {showChart && selected === coin.coinId ? 'Hide Chart' : 'View Chart'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showChart && selected && (
          <div className="mt-10 bg-white bg-opacity-90 backdrop-blur-md rounded-xl p-6">
            <CoinChart coinId={selected} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
