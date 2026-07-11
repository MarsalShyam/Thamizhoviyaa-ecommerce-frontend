import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiShoppingCart, FiUser, FiHeart } from 'react-icons/fi'
import { UserButton, SignInButton, useUser } from '@clerk/clerk-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const location = useLocation()
    const { cartCount, wishlist } = useCart()
    const { isAuthenticated, logout, isAdmin } = useAuth()
    const { user } = useUser() // Clerk's useUser hook
    const [scrolled, setScrolled] = useState(false)

    const navigation = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Products', href: '/products' },
        { name: 'Blog', href: '/blog' },
        { name: 'Contact', href: '/contact' },
    ]

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const isActive = (path) => location.pathname === path

    return (
        <motion.header
            className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/95 backdrop-blur-md shadow-md'
                : 'bg-white shadow-sm'
                }`}
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

                        {/* Wishlist */}
                        <Link
                            to="/wishlist"
                            className="p-2 text-gray-600 hover:text-primary-600 transition-colors relative"
                        >
                            <FiHeart className="w-5 h-5" />
                            {wishlist.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-accent-400 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                                    {wishlist.length}
                                </span>
                            )}
                        </Link>

                        {/* Cart */}
                        <Link
                            to="/cart"
                            className="p-2 text-gray-600 hover:text-primary-600 transition-colors relative"
                        >
                            <FiShoppingCart className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-accent-400 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* ✅ Clerk UserButton OR Sign In */}
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-2">
                                {/* Admin Badge */}
                                {isAdmin && (
                                    <Link
                                        to="/admin"
                                        className="hidden lg:flex items-center px-3 py-1.5 text-xs font-semibold text-primary-600 bg-primary-50 border border-primary-200 rounded-full hover:bg-primary-100 transition-colors"
                                    >
                                        Admin
                                    </Link>
                                )}

                                {/* Clerk UserButton - shows avatar with dropdown */}
                                <UserButton
                                    afterSignOutUrl="/"
                                    appearance={{
                                        elements: {
                                            avatarBox:
                                                'w-9 h-9 rounded-full ring-2 ring-primary-200 hover:ring-primary-500 transition-all duration-200 cursor-pointer',
                                            userButtonPopoverCard:
                                                'shadow-xl border border-gray-100 rounded-xl',
                                            userButtonPopoverActionButton:
                                                'hover:bg-primary-50 text-gray-700',
                                            userButtonPopoverActionButtonText:
                                                'font-medium',
                                            userButtonPopoverFooter: 'hidden',
                                        },
                                    }}
                                >
                                    {/* Custom Menu Items inside Clerk's dropdown */}
                                    <UserButton.MenuItems>
                                        <UserButton.Link
                                            label="My Profile"
                                            labelIcon={<FiUser className="w-4 h-4" />}
                                            href="/profile"
                                        />
                                        <UserButton.Link
                                            label="My Orders"
                                            labelIcon={
                                                <FiShoppingCart className="w-4 h-4" />
                                            }
                                            href="/profile/orders"
                                        />
                                        {isAdmin && (
                                            <UserButton.Link
                                                label="Admin Dashboard"
                                                labelIcon={
                                                    <FiUser className="w-4 h-4" />
                                                }
                                                href="/admin"
                                            />
                                        )}
                                    </UserButton.MenuItems>
                                </UserButton>
                            </div>
                        ) : (
                            /* Sign In Button when not authenticated */
                            <SignInButton mode="modal">
                                <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-full text-sm font-medium hover:bg-primary-700 transition-colors duration-200 shadow-sm hover:shadow-md">
                                    <FiUser className="w-4 h-4" />
                                    <span>SignIn</span>
                                </button>
                            </SignInButton>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center space-x-3">
                        {/* Show Clerk avatar in mobile header too */}
                        {isAuthenticated && (
                            <UserButton
                                afterSignOutUrl="/"
                                appearance={{
                                    elements: {
                                        avatarBox:
                                            'w-8 h-8 rounded-full ring-2 ring-primary-200 hover:ring-primary-500 transition-all duration-200',
                                    },
                                }}
                            />
                        )}
                        <button
                            className="p-2 text-gray-600"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? (
                                <FiX className="w-6 h-6" />
                            ) : (
                                <FiMenu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
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

                                {/* Mobile User Actions */}
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

                                    {/* Authenticated Mobile Links */}
                                    {isAuthenticated ? (
                                        <>
                                            {/* User Info Row */}
                                            <div className="flex items-center px-5 py-3 space-x-3 bg-gray-50 border-b">
                                                <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-primary-300">
                                                    <img
                                                        src={user?.imageUrl}
                                                        alt={user?.fullName || 'User'}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">
                                                        {user?.fullName || 'User'}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {user?.primaryEmailAddress?.emailAddress}
                                                    </p>
                                                </div>
                                            </div>

                                            <Link
                                                to="/profile"
                                                className="flex items-center px-5 py-3 space-x-3 text-gray-700 hover:bg-gray-100"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <FiUser className="w-5 h-5" />
                                                <span>My Profile</span>
                                            </Link>

                                            <Link
                                                to="/profile/orders"
                                                className="flex items-center px-5 py-3 space-x-3 text-gray-700 hover:bg-gray-100"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <FiShoppingCart className="w-5 h-5" />
                                                <span>My Orders</span>
                                            </Link>

                                            {isAdmin && (
                                                <Link
                                                    to="/admin"
                                                    className="flex items-center px-5 py-3 space-x-3 text-primary-600 hover:bg-primary-50 font-semibold border-b"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    <FiUser className="w-5 h-5" />
                                                    <span>Admin Dashboard</span>
                                                </Link>
                                            )}
                                        </>
                                    ) : (
                                        /* Sign In for Mobile */
                                        <SignInButton mode="modal">
                                            <button
                                                className="flex items-center w-full px-5 py-3 space-x-3 text-primary-600 hover:bg-primary-50 font-medium"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <FiUser className="w-5 h-5" />
                                                <span>Sign In</span>
                                            </button>
                                        </SignInButton>
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