// frontend/src/components/ProductCard.jsx (MODIFIED)
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext' // Import Auth
import { FiShoppingCart, FiEye, FiHeart } from 'react-icons/fi'

const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart()
  const { isAuthenticated } = useAuth()
  // Use product._id for the key
  const [isLiked, setIsLiked] = useState(isInWishlist(product._id))

  const handleActionCheck = (action) => {
    if (!isAuthenticated) {
      alert(`Please sign in to ${action}.`)
      // You can also redirect here: navigate('/login')
      return false
    }
    return true
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (handleActionCheck('add items to cart')) {
      addToCart(product, 1)
      // Add a toast notification here later
    }
  }

  const handleToggleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (handleActionCheck('add items to wishlist')) {
      toggleWishlist(product)
      setIsLiked(!isLiked)
    }
  }

  return (
    <motion.div
      className="product-card bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/products/${product._id}`} className="block relative group">
        <div className="h-80 bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center p-4 relative overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-600">
                {product.name.split(' ').map(word => word[0]).join('')}
              </span>
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${isLiked
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500 shadow-md'
              }`}
          >
            <FiHeart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="absolute top-3 left-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">

          {/* ✅ Replace Link with div to avoid <a> inside <a> */}
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.location.href = `/products/${product._id}`;
            }}
            className="bg-white p-2 rounded-full shadow-md hover:bg-primary-50 transition-colors cursor-pointer"
          >
            <FiEye className="w-4 h-4 text-primary-600" />
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-white p-2 rounded-full shadow-md hover:bg-primary-50 transition-colors"
          >
            <FiShoppingCart className="w-4 h-4 text-primary-600" />
          </button>

        </div>


        {/* Out of Stock Overlay */}
        {product.countInStock <= 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
          <span className="bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-primary-600">₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.countInStock <= 0}
            className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard