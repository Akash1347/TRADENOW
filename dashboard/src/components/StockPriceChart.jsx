import { useEffect, useState, useMemo, useContext } from "react";
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
import "./StockPriceChart.css";
import GeneralContext from "./GeneralContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const API_KEY = import.meta.env.STOCKPRICE_API_KEY;

const options = {
  responsive: true,
  plugins: {
    legend: { position: "top" },
    title: { display: true, text: "Monthly Price Chart" },
  },
};

function StockPriceChart({ symbol = "INFY" }) {
  const [dataPoints, setDataPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {closeChart} = useContext(GeneralContext);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchData = async () => {
      try {
        if (API_KEY) {
          const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1month&outputsize=20&apikey=${API_KEY}`;
          const res = await fetch(url);
          const data = await res.json();

          if (data?.values?.length) {
            const formatted = data.values
              .map(d => ({
                label: d.datetime,   // YYYY-MM
                price: Number(d.close),
              }))
              .reverse(); // oldest → newest

            setDataPoints(formatted);
            setError(null);
            setLoading(false);
            return;
          }
        }
        // Fallback to mock data
        console.log("Using mock data for", symbol);
        const mockData = [
          { label: "2023-01", price: 100 + Math.random() * 50 },
          { label: "2023-02", price: 105 + Math.random() * 50 },
          { label: "2023-03", price: 110 + Math.random() * 50 },
          { label: "2023-04", price: 115 + Math.random() * 50 },
          { label: "2023-05", price: 120 + Math.random() * 50 },
          { label: "2023-06", price: 125 + Math.random() * 50 },
          { label: "2023-07", price: 130 + Math.random() * 50 },
          { label: "2023-08", price: 135 + Math.random() * 50 },
          { label: "2023-09", price: 140 + Math.random() * 50 },
          { label: "2023-10", price: 145 + Math.random() * 50 },
          { label: "2023-11", price: 150 + Math.random() * 50 },
          { label: "2023-12", price: 155 + Math.random() * 50 },
        ];
        setDataPoints(mockData);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data");
        setDataPoints([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  const chartData = useMemo(() => ({
    labels: dataPoints.map(d => d.label),
    datasets: [
      {
        label: `${symbol} Price`,
        data: dataPoints.map(d => d.price),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
      },
    ],
  }), [dataPoints, symbol]);

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error: {error}</p>;

  if (!dataPoints.length) return <p>No data available</p>;
  const handleClose = ()=> {
    closeChart();
  }
  return (
    <div className="  lineChart">
      <div className="d-flex justify-content-between">
        <h3>{symbol} – Monthly Price Trend</h3>
        <button type="button" class="btn-close" aria-label="Close" onClick={handleClose}></button>
      </div>
      <Line options={options} data={chartData} />
    </div>
  );
}

export default StockPriceChart;
