import React, { useEffect, useState } from "react";
import axios from 'axios';
import { holdings } from '../../data/data'
import { VerticalGraph } from "../ui/VerticalGraph";
import StockPriceChart from "../charts/StockPriceChart";


const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    axios.get(backendUrl + "/api/getdata/holdings", { withCredentials: true } ).then((res) => {
      if (res.data.success === false) {
        console.error("Failed to fetch holdings:", res.data.message);
        return;
      }
      console.log("API Response:", res.data.data);
      setAllHoldings(res.data.data);
    }).catch((error) => {
      console.error("Error fetching holdings:", error);
    });
  }, []);

  const labels = allHoldings.map((subArray) => subArray["name"] || subArray["symbol"]);

  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((stock) => stock.price || stock.avg || 0),
        backgroundColor: "rgba(247, 103, 51, 1)",
      },
    ],
  };

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>

      <div className="order-table">
        <table>
          <tr>
            <th>Instrument</th>
            <th>Qty.</th>
            <th>Avg. cost</th>
            <th>LTP</th>
            <th>Cur. val</th>
            <th>P&L</th>
            <th>Net chg.</th>
            <th>Day chg.</th>
          </tr>

          {allHoldings.map((stock, index) => {
            const price = stock.price || stock.avg || 0;
            const qty = stock.qty || stock.quantity || 0;
            let curValue = price * qty;
            let isProfit = curValue - stock.avg * qty > 0.0;
            let profitClass = (isProfit) ? "profit" : "loss";
            let dayClass = (stock.isLoss) ? "loss" : "profit";

            return (
              <tr key={index}>
                <td>{stock.name || stock.symbol}</td>
                <td>{qty}</td>
                <td>{stock.avg?.toFixed(2) || '0.00'}</td>
                <td>{price?.toFixed(2) || '0.00'}</td>
                <td>{curValue?.toFixed(2) || '0.00'}</td>
                <td className={profitClass}>{(curValue - stock.avg * qty)?.toFixed(2) || '0.00'}</td>
                <td className={profitClass}>{stock.net || '0.00%'}</td>
                <td className={dayClass}>{stock.day || '0.00%'}</td>
              </tr>
            );
          })}
        </table>
      </div>

      <div className="row">
        <div className="col">
          <h5>
            29,875.<span>55</span>{" "}
          </h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>
            31,428.<span>95</span>{" "}
          </h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5>1,553.40 (+5.20%)</h5>
          <p>P&L</p>
        </div>
      </div>
      {allHoldings.length > 0 && <VerticalGraph data={data} />}

    </>
  );
};

export default Holdings;
