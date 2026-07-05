// frontend/src/pages/User/UserOrderList.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiShoppingBag } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';

const UserOrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get('/api/orders/myorders');
                setOrders(data);
                setLoading(false);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to fetch order history.');
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusBadge = (order) => {
        const baseClasses = "px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap";
        if (order.isDelivered) return <span className={`bg-green-100 text-green-800 ${baseClasses}`}>Delivered</span>;
        if (order.isPaid) return <span className={`bg-blue-100 text-blue-800 ${baseClasses}`}>Paid</span>;
        if (order.paymentMethod === 'COD') return <span className={`bg-yellow-100 text-yellow-800 ${baseClasses}`}>Processing</span>;
        return <span className={`bg-red-100 text-red-800 ${baseClasses}`}>Pending</span>;
    };

    if (loading)
        return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;

    return (
        // 🔑 w-full min-w-0 — critical for staying in bounds
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full min-w-0"
        >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 flex items-center gap-3 flex-wrap">
                <FiShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 flex-shrink-0" />
                <span>My Orders ({orders.length})</span>
            </h1>

            {orders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-lg">
                    <p className="text-xl text-gray-600 mb-4">You haven't placed any orders yet.</p>
                    <Link to="/products" className="btn-primary">Start Shopping</Link>
                </div>
            ) : (
                <div className="space-y-4 sm:space-y-6 w-full min-w-0">
                    {orders.map((order, index) => (
                        <motion.div
                            key={order._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            // 🔑 All the width safety classes
                            className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 w-full min-w-0 max-w-full overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start border-b pb-4 mb-4 gap-3 w-full min-w-0">
                                <div className="min-w-0 flex-1 overflow-hidden">
                                    <p className="text-xs sm:text-sm text-gray-500 truncate">
                                        Order ID: <span className="font-mono text-gray-700">{order._id.substring(18)}</span>
                                    </p>
                                    <p className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                                        Total: ₹{order.totalPrice.toFixed(2)}
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-500 truncate">
                                        Placed on: {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 flex-shrink-0">
                                    {getStatusBadge(order)}
                                    <Link
                                        to={`/profile/orders/${order._id}`}
                                        className="text-primary-600 hover:text-primary-700 font-medium text-sm whitespace-nowrap"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="flex flex-col gap-3 w-full min-w-0">
                                {order.orderItems.slice(0, 3).map((item) => (
                                    <div
                                        key={item.product}
                                        className="flex items-center gap-3 w-full min-w-0 overflow-hidden"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-12 h-12 sm:w-14 sm:h-14 object-contain rounded-lg flex-shrink-0 border border-gray-200"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/64x64?text=No+Img';
                                            }}
                                        />
                                        <div className="min-w-0 flex-1 overflow-hidden">
                                            <p
                                                className="text-sm font-medium text-gray-800 truncate"
                                                title={item.name}
                                            >
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                                        </div>
                                    </div>
                                ))}
                                {order.orderItems.length > 3 && (
                                    <p className="text-sm text-gray-500 italic">
                                        +{order.orderItems.length - 3} more items
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default UserOrderList;