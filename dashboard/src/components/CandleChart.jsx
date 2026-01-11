import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { CandlestickController, CandlestickElement } from "chartjs-chart-financial";
import { Chart } from "react-chartjs-2";
import "chartjs-adapter-date-fns";

// Register components
ChartJS.register(
  TimeScale,
  LinearScale,
  CandlestickController,
  CandlestickElement,
  Tooltip,
  Legend
);

function CandleChart({ symbol }) {
  const [candles, setCandles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/chart/${symbol}`
        );

        const result = res.data.chart?.result?.[0];
        if (!result) {
          throw new Error("Invalid chart data");
        }

        const timestamps = result.timestamp;
        const quote = result.indicators.quote[0];

        const formatted = timestamps.map((t, i) => ({
          x: t * 1000, // allowed
          o: quote.open[i],
          h: quote.high[i],
          l: quote.low[i],
          c: quote.close[i],
        }));

        setCandles(formatted);
      } catch (err) {
        setError(err.message);
      }
    }

    load();
  }, [symbol]);

  if (error) return <p>Error: {error}</p>;
  if (!candles.length) return <p>Loading chart...</p>;

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <Chart
        type="candlestick"
        data={{
          datasets: [
            {
              label: `${symbol} Candles`,
              data: candles,
              borderColor: "black",
              color: {
                up: "green",
                down: "red",
                unchanged: "gray",
              },
            },
          ],
        }}
        options={{
          responsive: true,
          scales: {
            x: {
              type: "time",
              time: {
                unit: "day",
              },
            },
            y: {
              beginAtZero: false,
            },
          },
        }}
      />
    </div>
  );
}

export default CandleChart;
