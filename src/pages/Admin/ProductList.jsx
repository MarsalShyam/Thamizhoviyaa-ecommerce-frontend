// ✅ frontend/src/pages/Admin/ProductList.jsx (Final Merged & Commented Version)
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiRefreshCw, FiCheckCircle, FiX } from 'react-icons/fi';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner';

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch products from backend API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data);
    } catch (error) {
      alert(`Error fetching products: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete product (admin only)
  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/admin/${id}`);
        alert('✅ Product deleted successfully.');
        fetchProducts();
      } catch (error) {
        alert(`Error deleting product: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="section-padding"
    >
      {/* 🔹 Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">
          Product Management ({products.length})
        </h2>

        <div className="flex space-x-3">
          {/* 🔁 Refresh Button */}
          <button
            onClick={fetchProducts}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          {/* ➕ Add New Product */}
          <Link
            to="/admin/products/create"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <FiPlus />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* 🔹 Conditional Loader */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-white shadow-md rounded-xl p-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* === TABLE HEAD === */}
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            {/* === TABLE BODY === */}
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  {/* ID Column */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">
                    {product._id.substring(18)}
                  </td>

                  {/* Name Column */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.name}
                  </td>

                  {/* Price Column */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{product.price}
                  </td>

                  {/* Stock Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.countInStock > 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.countInStock > 0
                        ? `In Stock (${product.countInStock})`
                        : 'Out of Stock'}
                    </span>
                  </td>

                  {/* Featured Column */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {product.isFeatured ? (
                      <FiCheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <FiX className="w-5 h-5 text-gray-400 mx-auto" />
                    )}
                  </td>

                  {/* Actions Column */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/admin/products/edit/${product._id}`}
                      className="text-primary-600 hover:text-primary-900 mr-4"
                    >
                      <FiEdit className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => deleteHandler(product._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 🧩 (Commented Old Code Reference Below) */}
          {/*
            --- OLD STATIC MOCK DATA VERSION ---
            const mockProducts = [
              { _id: '1', name: 'Arappu Powder', price: 160, countInStock: 50, category: 'Hair Care' },
              { _id: '2', name: 'Pure Castor Oil', price: 160, countInStock: 0, category: 'Hair & Skin Care' },
            ];

            Used previously like:
            {mockProducts.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>₹{product.price}</td>
                <td>
                  <span className={product.countInStock > 0 ? 'bg-green-100' : 'bg-red-100'}>
                    {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td>
                  <button><FiEdit /></button>
                  <button><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          */}
        </div>
      )}
    </motion.div>
  );
};

export default ProductList;
