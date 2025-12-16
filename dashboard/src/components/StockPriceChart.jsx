import { useEffect, useState } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import './StockPriceChart'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const API_KEY = "37cbb721b9574d808b38cea04a9a18ad"; // put in .env in real projects

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Yearly Price Chart",
    },
  },
};

function StockPriceChart({ symbol = "INFY" }) {
  const [yearlyData, setYearlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&outputsize=5000&apikey=${API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        if (!data.values) return;

        // Convert daily → yearly
        const yearlyMap = {};

        data.values
          .map(d => ({
            date: new Date(d.datetime),
            close: parseFloat(d.close),
          }))
          .sort((a, b) => a.date - b.date)
          .forEach(item => {
            const year = item.date.getFullYear();
            yearlyMap[year] = item.close; // last close of year
          });

        const formatted = Object.keys(yearlyMap).map(year => ({
          year,
          price: yearlyMap[year],
        }));

        setYearlyData(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  if (loading) return <p>Loading...</p>;

  const chartData = {
    labels: yearlyData.map(item => item.year),
    datasets: [
      {
        label: `${symbol} Price (USD)`,
        data: yearlyData.map(item => item.price),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  return (
    <div className="container lineChart">
      <h3>{symbol} – Yearly Price Comparison</h3>
      <Line options={options} data={chartData} />
    </div>
  );
}

export default StockPriceChart;
