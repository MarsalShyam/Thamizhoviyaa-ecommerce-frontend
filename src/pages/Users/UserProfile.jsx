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
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Optional New Components (modular expansion)
import UserProfileSidebar from '../../components/User/UserProfileSidebar';
import EditProfileForm from '../../components/User/EditProfileForm';
import AddressManagement from '../../components/User/AddressManagement';

const UserProfile = () => {
    const { user, logout } = useAuth();

    if (!user) return <div>Loading User Data...</div>;

    // Get default address
    const defaultAddress = user.addresses?.find(addr => addr.isDefault) || user.addresses?.[0];

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* --- LEFT SIDEBAR --- */}
            <div className="hidden lg:block w-80 bg-white shadow-md border-r">
                {UserProfileSidebar ? (
                    <UserProfileSidebar user={user} logout={logout} />
                ) : (
                    <div className="p-6 space-y-6">
                        <div className="flex items-center space-x-3">
                            <FiUser className="w-6 h-6 text-primary-600" />
                            <div>
                                <p className="text-lg font-semibold text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                        </div>

                        <div className="border-t pt-4 space-y-3">
                            <Link to="/profile/orders" className="flex items-center space-x-3 text-gray-700 hover:text-primary-600">
                                <FiShoppingBag />
                                <span>My Orders</span>
                            </Link>
                            <Link to="/wishlist" className="flex items-center space-x-3 text-gray-700 hover:text-primary-600">
                                <FiHeart />
                                <span>Wishlist</span>
                            </Link>
                            <Link to="/profile/edit" className="flex items-center space-x-3 text-gray-700 hover:text-primary-600">
                                <FiEdit3 />
                                <span>Edit Profile</span>
                            </Link>
                            <Link to="/profile/addresses" className="flex items-center space-x-3 text-gray-700 hover:text-primary-600">
                                <FiMapPin />
                                <span>Manage Addresses</span>
                            </Link>
                            <button
                                onClick={logout}
                                className="flex items-center space-x-3 text-red-600 hover:text-red-700 w-full pt-2"
                            >
                                <FiLogOut />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="flex-1 p-8 overflow-y-auto">
                <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                    {/* If nested routes (Outlet) not used, show default profile overview */}
                    <Outlet />
                    {!window.location.pathname.includes('/profile/') && (
                        <div className="space-y-8">
                            {/* Header */}
                            <h1 className="text-4xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                                <FiUser className="w-8 h-8 text-primary-600" />
                                <span>My Account</span>
                            </h1>

                            {/* --- Profile Details --- */}
                            <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                                <h2 className="text-2xl font-semibold text-gray-900 border-b pb-4">Personal Details</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <FiUser className="w-5 h-5 text-primary-600" />
                                        <div>
                                            <p className="text-sm text-gray-500">Full Name</p>
                                            <p className="font-medium text-gray-900">{user.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <FiMail className="w-5 h-5 text-primary-600" />
                                        <div>
                                            <p className="text-sm text-gray-500">Email Address</p>
                                            <p className="font-medium text-gray-900">{user.email || 'Not Provided'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <FiPhone className="w-5 h-5 text-primary-600" />
                                        <div>
                                            <p className="text-sm text-gray-500">Phone Number</p>
                                            <p className="font-medium text-gray-900">{user.phone}</p>
                                        </div>
                                    </div>

                                    <Link to="/profile/edit" className="btn-secondary flex items-center justify-center space-x-2">
                                        <FiEdit3 />
                                        <span>Edit Profile</span>
                                    </Link>
                                </div>

                                {/* --- Default Address --- */}
                                <h2 className="text-2xl font-semibold text-gray-900 border-b pb-4 pt-4">Default Shipping Address</h2>
                                {defaultAddress ? (
                                    <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
                                        <p className="font-semibold">
                                            {defaultAddress.name}, {defaultAddress.phone}
                                        </p>
                                        <p className="text-gray-700">
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
                                        <Link to="/profile/addresses" className="text-primary-600">
                                            Add now
                                        </Link>.
                                    </p>
                                )}
                            </div>

                            {/* --- Quick Actions --- */}
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                                <Link
                                    to="/profile/orders"
                                    className="w-full p-6 bg-primary-600 text-white rounded-xl shadow-lg flex items-center justify-between hover:bg-primary-700 transition-colors duration-300 group"
                                >
                                    <div>
                                        <h3 className="text-2xl font-bold">My Orders</h3>
                                        <p className="text-primary-200">Track, view history & returns</p>
                                    </div>
                                    <FiShoppingBag className="w-8 h-8 opacity-75 group-hover:opacity-100" />
                                </Link>

                                <Link
                                    to="/wishlist"
                                    className="w-full p-6 bg-white border border-gray-200 rounded-xl shadow-md flex items-center justify-between hover:shadow-lg transition-shadow duration-300 group"
                                >
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">Wishlist</h3>
                                        <p className="text-gray-600">Saved products for later</p>
                                    </div>
                                    <FiHeart className="w-8 h-8 text-red-500" />
                                </Link>

                                <button
                                    onClick={logout}
                                    className="w-full p-6 bg-red-100 text-red-700 rounded-xl shadow-md flex items-center justify-center space-x-3 hover:bg-red-200 transition-colors duration-300"
                                >
                                    <FiLogOut className="w-6 h-6" />
                                    <span className="text-lg font-semibold">Sign Out</span>
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default UserProfile;
