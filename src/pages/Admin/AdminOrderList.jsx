// frontend/src/pages/Admin/AdminOrderList.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiTruck, FiX, FiCheckCircle, FiRefreshCw } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminOrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            // Assume Admin route to get all orders is: /api/orders
            const { data } = await axios.get('/api/orders'); 
            setOrders(data);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch all orders.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const markAsDeliveredHandler = async (id) => {
        if (window.confirm('Are you sure you want to mark this order as Delivered?')) {
            try {
                await axios.put(`/api/orders/${id}/deliver`); // Route defined in backend
                toast.success('Order marked as Delivered!');
                fetchOrders(); // Refresh list
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Failed to update delivery status.';
                toast.error(errorMessage);
            }
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const getDeliveryStatus = (order) => {
        if (order.isDelivered) {
            return <FiCheckCircle className="w-5 h-5 text-green-600" title={`Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}`} />;
        }
        return <FiTruck className="w-5 h-5 text-yellow-600" title="Processing/Shipped" />;
    };

    if (loading) return <LoadingSpinner />;

    return (
        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Order Management ({orders.length})</h2>
                <button onClick={fetchOrders} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center space-x-2">
                    <FiRefreshCw className={loading ? 'animate-spin' : ''} />
                    <span>Refresh</span>
                </button>
            </div>

            <div className="bg-white shadow-md rounded-xl overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">USER</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATE</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TOTAL</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PAID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DELIVERED</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order._id.substring(18)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.user.name || 'Guest'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{order.totalPrice.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    {order.isPaid ? <FiCheckCircle className="w-5 h-5 text-green-600 mx-auto" /> : <FiX className="w-5 h-5 text-red-600 mx-auto" />}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    {getDeliveryStatus(order)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <Link to={`/admin/orders/${order._id}`} className="text-primary-600 hover:text-primary-900 mr-3">
                                        View
                                    </Link>
                                    {!order.isDelivered && (
                                        <button onClick={() => markAsDeliveredHandler(order._id)} className="text-blue-600 hover:text-blue-900">
                                            Deliver
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default AdminOrderList;