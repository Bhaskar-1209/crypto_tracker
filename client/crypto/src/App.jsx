import { useEffect, useState } from 'react';
import axios from 'axios';
import CoinChart from './Components/coinChart';

function App() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoinId, setSelectedCoinId] = useState(null);

  const fetchCoins = async () => {
    try {
      const res = await axios.get('http://localhost:7070/api/coins');
      setCoins(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };``

  useEffect(() => {
    fetchCoins();
    const interval = setInterval(fetchCoins, 1800000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed font-[Montserrat] text-sm"
      style={{
        backgroundImage:
          "url(https://png.pngtree.com/background/20230622/original/pngtree-fluctuations-in-cryptocurrency-concept-3d-bitcoin-with-red-and-green-arrow-picture-image_3950177.jpg)",
      }}
    >
      <h1 className="text-white text-center text-3xl font-light uppercase py-6">
        Crypto Price Tracker
      </h1>

      <div className="overflow-x-auto px-4">
        {loading ? (
          <p className="text-white text-center">Loading...</p>
        ) : (
          <table className="w-full max-w-6xl mx-auto backdrop-blur-lg bg-white/10 text-right border-collapse rounded-xl shadow-lg border border-white/20">
            <thead>
              <tr className="bg-gray-300">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Symbol</th>
                <th className="p-3">Price (USD)</th>
                <th className="p-3">Market Cap</th>
                <th className="p-3">24h % Change</th>
                <th className="p-3">Last Updated</th>
                <th className="p-3">Chart</th>
              </tr>
            </thead>
            <tbody>
              {coins.map((coin) => (
                <tr
                  key={coin.coinId}
                  className="border-b border-gray-300 last:border-none"
                >
                  <td className="p-3 text-left font-semibold text-white">{coin.name}</td>
                  <td className="p-3 text-left uppercase text-white">{coin.symbol}</td>
                  <td className="p-3 text-white">${coin.price.toLocaleString()}</td>
                  <td className="p-3 text-white">${coin.marketCap.toLocaleString()}</td>
                  <td
                    className={`p-3 font-semibold ${
                      coin.change24h > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {coin.change24h?.toFixed(2)}%
                  </td>
                  <td className="p-3 text-white">
                    {new Date(coin.lastUpdated).toLocaleString()}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => setSelectedCoinId(coin.coinId)}
                      className="text-cyan-400 underline"
                    >
                      View Chart
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-white text-center py-4">
        Updated:{" "}
        {coins[0] ? new Date(coins[0].lastUpdated).toLocaleString() : '...'}
      </p>

      {selectedCoinId && (
        <div className="max-w-6xl mx-auto px-4">
          <CoinChart coinId={selectedCoinId} />
        </div>
      )}
    </div>
  );
}

export default App;
