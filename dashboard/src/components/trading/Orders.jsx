import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../../contexts/userContext";

const Orders = () => {
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const { userData } = useContext(UserContext);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const loadOrders = async () => {
    if (!userData?.userId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    console.log("Loading orders for userId:", userData.userId);
    try{
      const res = await axios.get(`${backend_url}/api/getdata/orders`, {
        withCredentials: true
      });
      console.log("Orders API response:", res);
      if(res.data && res.data.success){
        setOrderHistory(res.data.data);
        console.log("Orders loaded successfully:", res.data.data);
      } else {
        console.error("Failed to load orders:", res.data?.message);
      }
    }catch(error){
      console.error("Error loading orders:", error);
      console.error("Error details:", error.response?.data || error.message || error);
      // Handle different error types
      if (error.response) {
        // Server responded with error status
        console.error("Server error:", error.response.status, error.response.data);
      } else if (error.request) {
        // Request was made but no response received
        console.error("Network error:", error.request);
      } else {
        // Something else happened
        console.error("Request error:", error.message);
      }
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    loadOrders();
  }, [userData?.userId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed': return 'profit';
      case 'pending': return 'loss';
      case 'cancelled': return 'loss';
      default: return '';
    }
  };

  return (
    <>
      <h3 className="title">Orders ({orderHistory.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orderHistory.map((order, index) => {
              const statusClass = getStatusColor(order.status);

              return (
                <tr key={index}>
                  <td className="align-left">{order.symbol || 'N/A'}</td>
                  <td>{order.orderType || 'N/A'}</td>
                  <td>{order.quantity || 0}</td>
                  <td>₹{order.price?.toFixed(2) || '0.00'}</td>
                  <td className={statusClass}>
                    {order.status || 'Pending'}
                  </td>
                  <td>{formatDate(order.date || order.createdAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="row">
        <div className="col">
          <h5>
            {orderHistory.length}
          </h5>
          <p>Total orders</p>
        </div>
        <div className="col">
          <h5>
            {orderHistory.filter(o => o.status === 'completed').length}
          </h5>
          <p>Completed</p>
        </div>
        <div className="col">
          <h5>
            {orderHistory.filter(o => o.status === 'pending').length}
          </h5>
          <p>Pending</p>
        </div>
      </div>
    </>
  );
};

export default Orders;