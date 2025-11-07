// frontend/src/pages/User/UserOrderList.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiTruck, FiCreditCard, FiCheckCircle } from 'react-icons/fi';
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
                // Assume the backend route for user orders is: /api/orders/myorders
                const { data } = await axios.get('/api/orders/myorders');
                setOrders(data);
                setLoading(false);
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Failed to fetch order history.';
                toast.error(errorMessage);
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusBadge = (order) => {
        if (order.isDelivered)
            return (
                <span className="bg-green-100 text-green-800 px-3 py-1 text-xs font-medium rounded-full">
                    Delivered
                </span>
            );

        if (order.isPaid)
            return (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 text-xs font-medium rounded-full">
                    Paid
                </span>
            );

        if (order.paymentMethod === 'COD')
            return (
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 text-xs font-medium rounded-full">
                    Processing
                </span>
            );

        return (
            <span className="bg-red-100 text-red-800 px-3 py-1 text-xs font-medium rounded-full">
                Pending Payment
            </span>
        );
    };


    if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;

    return (
        <div className="min-h-screen bg-gray-50 section-padding">
            <div className="container-custom">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <h1 className="text-4xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
                        <FiShoppingBag className="w-8 h-8 text-primary-600" />
                        <span>My Orders ({orders.length})</span>
                    </h1>

                    {orders.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-xl shadow-lg">
                            <p className="text-xl text-gray-600 mb-4">You haven't placed any orders yet.</p>
                            <Link to="/products" className="btn-primary">Start Shopping</Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order, index) => (
                                <motion.div
                                    key={order._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                                >
                                    <div className="flex justify-between items-start border-b pb-4 mb-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Order ID: <span className="font-mono text-gray-700">{order._id.substring(18)}</span></p>
                                            <p className="text-lg font-semibold text-gray-900">Total: ₹{order.totalPrice.toFixed(2)}</p>
                                            <p className="text-sm text-gray-500">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex flex-col items-end space-y-2">
                                            {getStatusBadge(order)}
                                            <Link to={`/profile/orders/${order._id}`} className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                                                View Details
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Display first few items */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {order.orderItems.slice(0, 3).map(item => (
                                            <div key={item.product} className="flex items-center space-x-3">
                                                <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                                                    <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {order.orderItems.length > 3 && (
                                            <p className="text-sm text-gray-500">+{order.orderItems.length - 3} more items</p>
                                        )}
                                    </div>

                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default UserOrderList;