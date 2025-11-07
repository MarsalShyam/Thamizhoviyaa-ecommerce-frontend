// frontend/src/pages/User/UserProfile/Overview.jsx (NEW)
import React from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit3, FiShoppingBag, FiHeart, FiLogOut } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
// import { FiShoppingBag } from 'react-icons/fi';


const Overview = () => {
    const { user, logout } = useAuth();
    if (!user) return null;

    const defaultAddress = user.addresses?.find(addr => addr.isDefault) || user.addresses?.[0];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile Overview</h1>

            {/* Personal Details Card */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <h2 className="text-2xl font-semibold text-gray-900">Personal Information</h2>
                    <Link to="/profile/edit" className="text-primary-600 hover:text-primary-700 flex items-center space-x-1 font-medium">
                        <FiEdit3 className="w-4 h-4" />
                        <span>Edit</span>
                    </Link>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <p><span className="text-sm font-medium text-gray-500 block">Full Name:</span> <span className="font-semibold">{user.name}</span></p>
                    <p><span className="text-sm font-medium text-gray-500 block">Email:</span> <span className="font-semibold">{user.email || 'N/A'}</span></p>
                    <p><span className="text-sm font-medium text-gray-500 block">Phone:</span> <span className="font-semibold">{user.phone}</span></p>
                    {user.isAdmin && <p><span className="text-sm font-medium text-red-500 block">Role:</span> <span className="font-bold text-red-600">Administrator</span></p>}
                </div>
            </div>

            {/* Address Card */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <h2 className="text-2xl font-semibold text-gray-900">Shipping Address</h2>
                    <Link to="/profile/addresses" className="text-primary-600 hover:text-primary-700 flex items-center space-x-1 font-medium">
                        <FiMapPin className="w-4 h-4" />
                        <span>Manage Addresses</span>
                    </Link>
                </div>
                {defaultAddress ? (
                    <div className="p-4 bg-primary-50 rounded-lg">
                        <p className="font-semibold">{defaultAddress.name}, {defaultAddress.phone}</p>
                        <p className="text-gray-700">{defaultAddress.address}, {defaultAddress.city} - {defaultAddress.pincode}</p>
                    </div>
                ) : (
                    <p className="text-gray-500">No default address saved. <Link to="/profile/addresses" className="text-primary-600">Add now</Link>.</p>
                )}
            </div>

            {/* Orders Quick View (Optional) */}
            {/* Add a quick view of recent orders here */}

            {/* --- Quick Actions --- */}
            <div className='lg:hidden'>
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
        </div>
    );
};

export default Overview;