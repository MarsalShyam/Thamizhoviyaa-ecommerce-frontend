import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { FiHeart, FiShoppingCart, FiTrash2, FiArrowRight } from 'react-icons/fi'
import { products } from '../data/products'

const Wishlist = () => {
  const { wishlist, toggleWishlist, addToCart } = useCart()

  const handleRemoveFromWishlist = (product) => {
    toggleWishlist(product)
  }

  const handleAddToCart = (product) => {
    addToCart(product, 1)
    // Optional: Show success message
    alert(`${product.name} added to cart!`)
  }

  const handleMoveToCart = (product) => {
    addToCart(product, 1)
    toggleWishlist(product)
    alert(`${product.name} moved to cart!`)
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 section-padding">
        <div className="container-custom">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiHeart className="w-12 h-12 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">Save your favorite products here for later</p>
            <Link to="/products" className="btn-primary inline-flex items-center">
              Explore Products <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 section-padding">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600 mt-2">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved</p>
          </div>
          <Link to="/products" className="text-primary-600 hover:text-primary-700 font-medium">
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item, index) => {
            const fullProduct = products.find(p => p.id === item.id) || item
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group"
              >
                {/* Product Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={() => handleRemoveFromWishlist(fullProduct)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="mb-2">
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                      {fullProduct.category || 'Herbal Product'}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.name}</h3>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-primary-600">₹{item.price}</span>
                    {fullProduct.originalPrice > item.price && (
                      <span className="text-sm text-gray-500 line-through">₹{fullProduct.originalPrice}</span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {fullProduct.description || 'Traditional herbal product for natural wellness'}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleMoveToCart(fullProduct)}
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                    >
                      <FiShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                    <button
                      onClick={() => handleAddToCart(fullProduct)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors duration-200"
                      title="Add to Cart (Keep in Wishlist)"
                    >
                      <FiShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bulk Actions */}
        {wishlist.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mt-8 bg-white rounded-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  wishlist.forEach(item => {
                    const fullProduct = products.find(p => p.id === item.id) || item
                    addToCart(fullProduct, 1)
                  })
                  alert('All items added to cart!')
                }}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <FiShoppingCart className="w-5 h-5" />
                <span>Add All to Cart</span>
              </button>
              
              <Link
                to="/cart"
                className="bg-accent-400 hover:bg-accent-500 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <span>Go to Cart</span>
                <FiArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Wishlist