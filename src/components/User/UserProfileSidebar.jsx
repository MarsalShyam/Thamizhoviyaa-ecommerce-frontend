// frontend/src/components/User/UserProfileSidebar.jsx (NEW)
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiUser, FiShoppingBag, FiHeart, FiMapPin, FiLogOut, FiEdit } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const navItems = [
    { name: 'Profile Overview', path: '/profile', icon: FiUser },
    { name: 'My Orders', path: '/profile/orders', icon: FiShoppingBag },
    { name: 'Manage Addresses', path: '/profile/addresses', icon: FiMapPin }, // NEW Route
    { name: 'Edit Profile', path: '/profile/edit', icon: FiEdit }, // NEW Route
    { name: 'Wishlist', path: '/wishlist', icon: FiHeart },
];

const UserProfileSidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    return (
        <div className="w-72 bg-white flex flex-col p-6 shadow-xl border-r border-gray-100">
            {/* User Info */}
            <div className="flex flex-col items-center border-b pb-6 mb-6">
                <img 
                    src={user?.profileImage || '/images/default_user.png'} 
                    alt={user?.name || 'User'} 
                    className="w-24 h-24 rounded-full object-cover mb-3 border-4 border-primary-100 shadow-md" 
                />
                <h3 className="text-xl font-bold text-gray-900">{user?.name}</h3>
                <p className="text-sm text-gray-500">{user?.email || user?.phone}</p>
            </div>
            
            {/* Navigation */}
            <nav className="flex-grow space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                            location.pathname === item.path 
                                ? 'bg-primary-100 text-primary-700 font-semibold border-l-4 border-primary-600' 
                                : 'hover:bg-gray-50 text-gray-700'
                        }`}
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                    </Link>
                ))}
            </nav>
            
            {/* Logout */}
            <button
                onClick={logout}
                className="w-full mt-6 flex items-center justify-center space-x-3 p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-semibold"
            >
                <FiLogOut className="w-5 h-5" />
                <span>Sign Out</span>
            </button>
        </div>
    );
};

export default UserProfileSidebar;