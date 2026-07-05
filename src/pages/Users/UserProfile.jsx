// frontend/src/pages/User/UserProfile.jsx
import React from 'react';
import { motion } from 'framer-motion';
import {
    FiUser,
    FiMail,
    FiPhone,
    FiMapPin,
    FiShoppingBag,
    FiLogOut,
    FiHeart,
    FiEdit3
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserProfile = () => {
    const { user, logout } = useAuth();

    if (!user) return <div>Loading User Data...</div>;

    const defaultAddress = user.addresses?.find(addr => addr.isDefault) || user.addresses?.[0];

    return (
        // 🔑 w-full min-w-0 = respect parent width, allow shrinking
        <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full min-w-0 space-y-6 sm:space-y-8"
        >
            {/* Header */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-3 flex-wrap">
                <FiUser className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 flex-shrink-0" />
                <span>My Account</span>
            </h1>

            {/* --- Profile Details --- */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 space-y-6 w-full min-w-0 overflow-hidden">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 border-b pb-4">
                    Personal Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full min-w-0">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg min-w-0 overflow-hidden">
                        <FiUser className="w-5 h-5 text-primary-600 flex-shrink-0" />
                        <div className="min-w-0 flex-1 overflow-hidden">
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="font-medium text-gray-900 truncate">{user.name}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg min-w-0 overflow-hidden">
                        <FiMail className="w-5 h-5 text-primary-600 flex-shrink-0" />
                        <div className="min-w-0 flex-1 overflow-hidden">
                            <p className="text-sm text-gray-500">Email Address</p>
                            <p className="font-medium text-gray-900 truncate" title={user.email}>
                                {user.email || 'Not Provided'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg min-w-0 overflow-hidden">
                        <FiPhone className="w-5 h-5 text-primary-600 flex-shrink-0" />
                        <div className="min-w-0 flex-1 overflow-hidden">
                            <p className="text-sm text-gray-500">Phone Number</p>
                            <p className="font-medium text-gray-900 truncate">{user.phone}</p>
                        </div>
                    </div>

                    <Link
                        to="/profile/edit"
                        className="btn-secondary flex items-center justify-center gap-2"
                    >
                        <FiEdit3 />
                        <span>Edit Profile</span>
                    </Link>
                </div>

                {/* Default Address */}
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 border-b pb-4 pt-4">
                    Default Shipping Address
                </h2>

                {defaultAddress ? (
                    <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg w-full min-w-0 overflow-hidden">
                        <p className="font-semibold truncate">
                            {defaultAddress.name}, {defaultAddress.phone}
                        </p>
                        <p className="text-gray-700 break-words">
                            {defaultAddress.address}, {defaultAddress.city} - {defaultAddress.pincode}
                        </p>
                        <Link
                            to="/profile/addresses"
                            className="text-sm text-accent-500 hover:text-accent-600 mt-2 inline-block"
                        >
                            Manage Addresses ({user.addresses.length})
                        </Link>
                    </div>
                ) : (
                    <p className="text-gray-500">
                        No default address saved.{' '}
                        <Link to="/profile/addresses" className="text-primary-600">Add now</Link>.
                    </p>
                )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pt-2 w-full min-w-0">
                <Link
                    to="/profile/orders"
                    className="w-full p-6 bg-primary-600 text-white rounded-xl shadow-lg flex items-center justify-between hover:bg-primary-700 transition-colors duration-300 group min-w-0"
                >
                    <div className="min-w-0 flex-1 overflow-hidden">
                        <h3 className="text-xl sm:text-2xl font-bold truncate">My Orders</h3>
                        <p className="text-primary-200 text-sm truncate">Track, view history</p>
                    </div>
                    <FiShoppingBag className="w-8 h-8 opacity-75 group-hover:opacity-100 flex-shrink-0 ml-3" />
                </Link>

                <Link
                    to="/wishlist"
                    className="w-full p-6 bg-white border border-gray-200 rounded-xl shadow-md flex items-center justify-between hover:shadow-lg transition-shadow duration-300 group min-w-0"
                >
                    <div className="min-w-0 flex-1 overflow-hidden">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Wishlist</h3>
                        <p className="text-gray-600 text-sm truncate">Saved for later</p>
                    </div>
                    <FiHeart className="w-8 h-8 text-red-500 flex-shrink-0 ml-3" />
                </Link>

                <button
                    onClick={logout}
                    className="w-full p-6 bg-red-100 text-red-700 rounded-xl shadow-md flex items-center justify-center gap-3 hover:bg-red-200 transition-colors duration-300"
                >
                    <FiLogOut className="w-6 h-6" />
                    <span className="text-lg font-semibold">Sign Out</span>
                </button>
            </div>
        </motion.div>
    );
};

export default UserProfile;