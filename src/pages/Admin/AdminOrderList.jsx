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
    const [activeTab, setActiveTab] = useState('All');

    const tabs = [
        { name: 'All Orders', status: 'All' },
        { name: 'New Orders', status: 'Ordered' },
        { name: 'Processing', status: 'Pending' },
        { name: 'Packed', status: 'Packed' },
        { name: 'Shipped', status: 'Shipped' },
        { name: 'Delivered', status: 'Delivered' },
        { name: 'Cancelled', status: 'Cancelled' }
    ];

    const fetchOrders = async () => {
        setLoading(true);
        try {
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
                await axios.put(`/api/orders/${id}/deliver`); 
                toast.success('Order marked as Delivered!');
                fetchOrders(); 
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Failed to update delivery status.';
                toast.error(errorMessage);
            }
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const getStatusBadge = (status) => {
        const styles = {
            Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            Ordered: 'bg-blue-100 text-blue-800 border-blue-200',
            Packed: 'bg-purple-100 text-purple-800 border-purple-200',
            Shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
            Delivered: 'bg-green-100 text-green-800 border-green-200',
            Cancelled: 'bg-red-100 text-red-800 border-red-200',
        };
        return (
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
                {status}
            </span>
        );
    };

    const filteredOrders = activeTab === 'All'
        ? orders
        : orders.filter(order => order.status === activeTab);

    if (loading) return <LoadingSpinner />;

    return (
        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Order Management</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage and update status of all customer orders</p>
                </div>
                <button onClick={fetchOrders} className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium border shadow-sm transition-colors inline-flex items-center space-x-2">
                    <FiRefreshCw className={loading ? 'animate-spin' : ''} />
                    <span>Refresh Data</span>
                </button>
            </div>

            {/* Status Tabs */}
            <div className="flex overflow-x-auto whitespace-nowrap gap-2 pb-4 mb-6 border-b border-gray-200">
                {tabs.map((tab) => {
                    const count = tab.status === 'All' 
                        ? orders.length 
                        : orders.filter(o => o.status === tab.status).length;
                    return (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.status)}
                            className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                activeTab === tab.status
                                    ? 'bg-primary-600 text-white shadow-sm'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                        >
                            {tab.name}
                            <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                                activeTab === tab.status ? 'bg-primary-700 text-white' : 'bg-gray-100 text-gray-500'
                            }`}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Orders Table */}
            <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <FiShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                            <p className="text-lg font-medium">No orders found in this category.</p>
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">USER</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">PRODUCT(S)</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">QTY</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">DATE & TIME</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">AMOUNT</th>
                                    {activeTab === 'All' && (
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">STATUS</th>
                                    )}
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredOrders.map((order) => {
                                    const totalQty = order.orderItems?.reduce((sum, item) => sum + item.qty, 0) || 0;
                                    return (
                                        <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                                                #{order._id.substring(18)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                {order.user?.name || order.shippingAddress?.fullName || 'Guest'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 max-w-[240px] truncate" title={order.orderItems?.map(i => i.name).join(', ')}>
                                                {order.orderItems?.map(i => `${i.name} (${i.qty})`).join(', ')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                                                {totalQty}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(order.createdAt).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                                                ₹{order.totalPrice.toFixed(2)}
                                            </td>
                                            {activeTab === 'All' && (
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getStatusBadge(order.status)}
                                                </td>
                                            )}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                                                <Link to={`/admin/orders/${order._id}`} className="text-primary-600 hover:text-primary-900 mr-4 inline-block">
                                                    View
                                                </Link>
                                                {!order.isDelivered && order.status !== 'Cancelled' && (
                                                    <button onClick={() => markAsDeliveredHandler(order._id)} className="text-blue-600 hover:text-blue-900">
                                                        Deliver
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default AdminOrderList;