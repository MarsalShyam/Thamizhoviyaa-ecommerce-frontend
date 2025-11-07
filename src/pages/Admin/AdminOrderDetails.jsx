// frontend/src/pages/Admin/AdminOrderDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiArrowLeft } from 'react-icons/fi';

const STATUS_ORDER = ['Ordered', 'Packed', 'Shipped', 'Delivered'];

const AdminOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/orders/${id}`);
      setOrder(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line
  }, [id]);

  const setStatus = async (newStatus) => {
    try {
      setUpdating(true);
      const { data } = await axios.put(`/api/orders/${id}/status`, { status: newStatus, note });
      setOrder(data);
      setNote('');
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;
  if (!order) return <div className="min-h-screen flex items-center justify-center">Order not found</div>;

  const currentIndex = Math.max(0, STATUS_ORDER.indexOf(order.status));
  const nextStatus = STATUS_ORDER[Math.min(STATUS_ORDER.length - 1, currentIndex + 1)];
  const prevStatus = STATUS_ORDER[Math.max(0, currentIndex - 1)];

  return (
    <div className="min-h-screen bg-gray-50 section-padding">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-6">
          <Link to="/admin/orders" className="text-primary-600 flex items-center gap-2"><FiArrowLeft /> Back to Orders</Link>
          <h1 className="text-2xl font-bold">Admin — Order #{order._id}</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold mb-3">Items</h2>
            <div className="space-y-3">
              {order.orderItems.map((item) => (
                <div key={item.product} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded object-cover" />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                    </div>
                  </div>
                  <div className="text-sm font-medium">₹{(item.qty * item.price).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className="font-semibold mb-2">Current Status</h3>
              <p className="mb-2"><strong>{order.status}</strong></p>

              <textarea
                placeholder="Optional note (e.g. shipped via courier X, AWB: ...)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full p-2 border rounded mb-3"
                rows={3}
              />

              <div className="flex gap-2">
                {currentIndex > 0 && (
                  <button
                    className="btn-secondary"
                    onClick={() => setStatus(prevStatus)}
                    disabled={updating}
                  >
                    Move to: {prevStatus}
                  </button>
                )}
                {currentIndex < STATUS_ORDER.length - 1 && (
                  <button
                    className="btn-primary"
                    onClick={() => setStatus(nextStatus)}
                    disabled={updating}
                  >
                    Move to: {nextStatus}
                  </button>
                )}
                {order.status !== 'Delivered' && (
                  <button
                    className="btn-danger ml-auto"
                    onClick={() => setStatus('Delivered')}
                    disabled={updating}
                  >
                    Mark Delivered
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className="font-semibold mb-2">Status History</h3>
              <div className="space-y-2 max-h-48 overflow-auto text-sm text-gray-700">
                {(order.statusHistory || []).slice().reverse().map((h, idx) => (
                  <div key={idx} className="border-b pb-2">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium">{h.status}</div>
                        {h.note && <div className="text-xs text-gray-500">{h.note}</div>}
                      </div>
                      <div className="text-xs text-gray-500">{new Date(h.timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
