

import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiShoppingCart, FiUser, FiHeart } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const location = useLocation()
    const { cartCount, wishlist } = useCart()
    const { isAuthenticated, logout, user, isAdmin } = useAuth()

    const navigation = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Products', href: '/products' },
        { name: 'Blog', href: '/blog' },
        { name: 'Contact', href: '/contact' },
    ]

    const isActive = (path) => location.pathname === path
    const profileLink = isAuthenticated ? '/profile' : '/login'
    return (
        <motion.header
            className="bg-white shadow-sm sticky top-0 z-50"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <nav className="container-custom">
                <div className="flex justify-between items-center py-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center overflow-hidden">
                            <img
                                src="/thamizhoviyaa-logo.png"
                                alt="Thamizhoviyaa Logo"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-primary-700">THAMIZHOVIYAA</h1>
                            <p className="text-xs text-gray-600">Herbal Products ◦ Home Goodies</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`font-medium transition-colors duration-200 ${isActive(item.href)
                                    ? 'text-primary-600 border-b-2 border-primary-600'
                                    : 'text-gray-600 hover:text-primary-600'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link to="/wishlist" className="p-2 text-gray-600 hover:text-primary-600 transition-colors relative">
                            <FiHeart className="w-5 h-5" />
                            {wishlist.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-accent-400 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                                    {wishlist.length}
                                </span>
                            )}
                        </Link>
                        <Link to="/cart" className="p-2 text-gray-600 hover:text-primary-600 transition-colors relative">
                            <FiShoppingCart className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-accent-400 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        {/* <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
                            <FiUser className="w-5 h-5" />
                        </button> */}
                        <div className="relative group">
                            <Link
                                to={profileLink}
                                className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                            >
                                <FiUser className="w-5 h-5" />
                            </Link>

                            {isAuthenticated && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                    <span className="block px-4 py-2 text-sm text-gray-500 truncate border-b mb-1">
                                        Hi, {user?.name || 'User'}
                                    </span>
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        My Profile
                                    </Link>
                                    <Link
                                        to="/profile/orders"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        My Orders
                                    </Link>
                                    {isAdmin && (
                                        <Link
                                            to="/admin"
                                            className="block px-4 py-2 text-sm font-semibold text-primary-600 hover:bg-primary-50"
                                        >
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <button
                                        onClick={logout}
                                        className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 text-gray-600"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {/* Mobile Navigation (Professional Overlay) */}
                {/* Mobile Navigation (Dropdown Below Header - NO PUSHING) */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            className="md:hidden absolute left-0 right-0 top-full bg-white shadow-xl z-40"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25 }}
                        >
                            <div className="py-3 max-h-[75vh] overflow-y-auto">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`block px-5 py-3 font-medium border-b ${isActive(item.href)
                                            ? 'text-primary-600 bg-primary-50'
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}

                                {/* User Actions */}
                                <div className="mt-2 border-t">
                                    <Link
                                        to="/wishlist"
                                        className="flex items-center px-5 py-3 space-x-3 text-gray-700 hover:bg-gray-100"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <FiHeart className="w-5 h-5" />
                                        <span>Wishlist ({wishlist.length})</span>
                                    </Link>

                                    <Link
                                        to="/cart"
                                        className="flex items-center px-5 py-3 space-x-3 text-gray-700 hover:bg-gray-100"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <FiShoppingCart className="w-5 h-5" />
                                        <span>Cart ({cartCount})</span>
                                    </Link>

                                    <Link
                                        to={profileLink}
                                        className="flex items-center px-5 py-3 space-x-3 text-gray-700 hover:bg-gray-100"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <FiUser className="w-5 h-5" />
                                        <span>{isAuthenticated ? 'My Profile' : 'Sign In'}</span>
                                    </Link>
                                    {isAuthenticated && isAdmin && (
                                        <Link
                                            to="/admin"
                                            className="flex items-center px-5 py-3 space-x-3 text-primary-600 hover:bg-primary-50 font-semibold border-b"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <FiUser className="w-5 h-5" />
                                            <span>Admin Dashboard</span>
                                        </Link>
                                    )}

                                    {isAuthenticated && (
                                        <button
                                            onClick={() => { logout(); setIsMenuOpen(false); }}
                                            className="flex items-center w-full px-5 py-3 space-x-3 text-red-600 hover:bg-red-50"
                                        >
                                            <FiX className="w-5 h-5" />
                                            <span>Logout</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>


            </nav>
        </motion.header>
    )
}

export default Header