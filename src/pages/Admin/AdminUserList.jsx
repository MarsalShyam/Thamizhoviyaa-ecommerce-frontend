// frontend/src/pages/Admin/AdminUserList.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiTrash2, FiCheckCircle, FiX, FiRefreshCw } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminUserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Assume Admin route to get all users is: /api/users
            const { data } = await axios.get('/api/users'); 
            setUsers(data);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch user list.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const deleteUserHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                // Assume Admin route to delete a user is: DELETE /api/users/:id
                await axios.delete(`/api/users/${id}`); 
                toast.success('User deleted successfully!');
                fetchUsers(); // Refresh list
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Failed to delete user.';
                toast.error(errorMessage);
            }
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">User Management ({users.length})</h2>
                <button onClick={fetchUsers} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center space-x-2">
                    <FiRefreshCw className={loading ? 'animate-spin' : ''} />
                    <span>Refresh</span>
                </button>
            </div>

            <div className="bg-white shadow-md rounded-xl overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAME</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMAIL/PHONE</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ADMIN</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user._id.substring(18)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.email || user.phone}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    {user.isAdmin ? <FiCheckCircle className="w-5 h-5 text-green-600 mx-auto" /> : <FiX className="w-5 h-5 text-red-600 mx-auto" />}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button onClick={() => deleteUserHandler(user._id)} className="text-red-600 hover:text-red-900">
                                        <FiTrash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default AdminUserList;