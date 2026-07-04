
// frontend/src/components/AdminLayout.jsx
import React, { useState } from 'react';
import {
    FiGrid,
    FiPackage,
    FiShoppingBag,
    FiUsers,
    FiLogOut,
    FiFeather,
    FiMenu,
    FiX
} from 'react-icons/fi';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
    { name: 'Dashboard', path: '/admin', icon: FiGrid },
    { name: 'Products', path: '/admin/products', icon: FiPackage },
    { name: 'Orders', path: '/admin/orders', icon: FiShoppingBag },
    { name: 'Users', path: '/admin/users', icon: FiUsers },
    { name: 'Blog/CMS', path: '/admin/cms', icon: FiFeather },
];

const AdminLayout = () => {
    const { logout, user } = useAuth();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50">

            {/* ✅ Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-primary-700 text-white p-4 flex justify-between items-center">
                <span className="text-xl font-bold">Admin Panel</span>
                <button onClick={() => setMenuOpen(true)}>
                    <FiMenu size={28} />
                </button>
            </div>

            {/* ✅ Sidebar (Desktop + Mobile Drawer) */}
            <div
                className={`
                    fixed top-0 left-0 h-full w-64
                    bg-primary-700 text-white p-5 shadow-xl z-50
                    flex flex-col
                    transform transition-transform duration-300
                    ${menuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
            >
                {/* Close button - mobile only */}
                <div className="lg:hidden flex justify-end pb-3">
                    <button onClick={() => setMenuOpen(false)}>
                        <FiX size={26} />
                    </button>
                </div>

                {/* Logo */}
                <Link
                    to="/"
                    onClick={() => setMenuOpen(false)}
                    className="text-2xl font-bold text-accent-400 mb-10"
                >
                    THAMIZHOVIYAA
                </Link>

                {/* Navigation */}
                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setMenuOpen(false)}
                            className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm
                            transition-all duration-200
                            ${location.pathname === item.path ||
                                    (item.name === "Products" &&
                                        location.pathname.startsWith("/admin/products"))
                                    ? "bg-primary-600 text-accent-400 shadow-sm"
                                    : "hover:bg-primary-600/60"
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>


                {/* Footer */}
                <div className="pt-5 border-t border-primary-600">
                    <p className="text-xs text-primary-200 mb-2">Admin: {user?.name}</p>
                    <button
                        onClick={logout}
                        className="w-full py-3 bg-red-600 hover:bg-red-700
                        rounded-lg flex items-center justify-center gap-2 text-sm"
                    >
                        <FiLogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </div>

            {/* ✅ Content Area */}
            <div className="flex-1 lg:ml-64 p-6 lg:p-10 max-w-full">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
