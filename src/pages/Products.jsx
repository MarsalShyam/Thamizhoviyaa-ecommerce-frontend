// frontend/src/pages/Products.jsx (MODIFIED)
import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductGrid from '../components/ProductGrid'
import axios from 'axios'
import { ProductGridSkeleton } from '../components/SkeletonLoader'

// Hardcoded categories list (can be dynamic via an API later)
const CATEGORIES = [
  "All",
  "Hair Care",
  "Skin Care",
  "Bath & Body",
  "Wellness"
];

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('name')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get('/api/products')
        setProducts(data)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch products from server.')
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    const cloned = [...products]
    
    let result = cloned.filter(
      (product) =>
        selectedCategory === 'All' || product.category === selectedCategory
    )

    return result.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })
  }, [selectedCategory, sortBy, products])

  return (
    <div>
      {/* Header */}
      <section className="bg-primary-600 text-white section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Discover our range of 100% natural herbal products for health,
              beauty, and wellness.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b">
        <div className="container-custom section-padding py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding bg-gray-100">
        <div className="container-custom">
            {loading ? (
                <ProductGridSkeleton count={8} /> // Show loading skeleton
            ) : error ? (
                <p className="text-center text-red-500 text-xl">{error}</p>
            ) : (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${selectedCategory}-${sortBy}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                    >
                        <ProductGrid products={filteredProducts} title="" description="" />
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
      </section>

      {/* Call to Action (Existing code retained) */}
      <section className="bg-primary-600 text-white section-padding">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Contact us for custom herbal solutions or bulk orders. We're here
              to help you find the perfect natural remedy.
            </p>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex items-center"
            >
              WhatsApp Us
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Products