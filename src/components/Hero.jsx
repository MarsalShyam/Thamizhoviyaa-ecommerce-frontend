import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiStar } from 'react-icons/fi'

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-r from-primary-500 to-primary-700 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Natural Herbal
                <span className="text-accent-400 block">Wellness</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl mb-8 text-primary-100 max-w-2xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Traditional Tamil herbal products for modern wellness. 
                100% natural, chemical-free solutions for your health and beauty.
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Link to="/products" className="btn-secondary inline-flex items-center justify-center">
                  Shop Now <FiArrowRight className="ml-2" />
                </Link>
                <Link to="/about" className="bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center">
                  Learn More
                </Link>
              </motion.div>

              <motion.div 
                className="mt-8 flex items-center justify-center lg:justify-start space-x-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="w-5 h-5 text-accent-400 fill-current" />
                  ))}
                </div>
                <span className="text-primary-100">500+ Happy Customers</span>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
  <div className="bg-white rounded-xl shadow-2xl overflow-hidden transform -rotate-3 relative">
    <img 
      src="/images/img.png" 
      alt="Thamizhoviyaa Herbal Products" 
      className="w-full h-auto object-cover"
    />
    {/* Product info overlay */}
    <div className=" absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary-900/90 to-transparent p-6 text-white">
      <h3 className="text-xl font-bold mb-2">Premium Herbal Collection</h3>
      <p className="text-primary-100">100% Natural • Traditional • Effective</p>
      <div className="flex space-x-4 mt-3">
        <span className="bg-accent-400 px-3 py-1 rounded-full text-sm">Arappu Powder</span>
        <span className="bg-green-500 px-3 py-1 rounded-full text-sm">Castor Oil</span>
      </div>
    </div>
  </div>
</div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero