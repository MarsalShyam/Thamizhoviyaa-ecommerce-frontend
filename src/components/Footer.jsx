import React from 'react'
import { Link } from 'react-router-dom'
import { FiFacebook, FiInstagram, FiTwitter, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="bg-primary-700 text-white">
      <div className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold text-lg">T</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">THAMIZHOVIYAA</h1>
                  <p className="text-sm text-primary-200">Herbal Products & Home Goodies</p>
                </div>
              </Link>
              <p className="text-primary-200 mb-6 max-w-md">
                Traditional Tamil herbal products for modern wellness. 
                100% natural, chemical-free solutions for your health and beauty needs.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="bg-primary-600 hover:bg-primary-500 p-2 rounded-lg transition-colors">
                  <FiFacebook className="w-5 h-5" />
                </a>
                <a href="#" className="bg-primary-600 hover:bg-primary-500 p-2 rounded-lg transition-colors">
                  <FiInstagram className="w-5 h-5" />
                </a>
                <a href="#" className="bg-primary-600 hover:bg-primary-500 p-2 rounded-lg transition-colors">
                  <FiTwitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-primary-200 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/about" className="text-primary-200 hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/products" className="text-primary-200 hover:text-white transition-colors">Products</Link></li>
                <li><Link to="/blog" className="text-primary-200 hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/contact" className="text-primary-200 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <FiMapPin className="w-5 h-5 text-accent-400" />
                  <span className="text-primary-200 text-sm">
                    PAVADAI STREET, KALANGANI POST,<br />
                    NAMAKKAL-637014, TAMILNADU
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <FiPhone className="w-5 h-5 text-accent-400" />
                  <span className="text-primary-200">+91 9876543210</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FiMail className="w-5 h-5 text-accent-400" />
                  <span className="text-primary-200">priyankanavagiri@gmail.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-primary-600 mt-12 pt-8 text-center">
            <p className="text-primary-200">
              &copy; {new Date().getFullYear()} THAMIZHOVIYAA HERBAL PRODUCTS. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer