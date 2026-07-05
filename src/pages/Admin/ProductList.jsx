// ✅ frontend/src/pages/Admin/ProductList.jsx
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
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">
          Product Management ({products.length})
        </h2>

        <div className="flex space-x-3">
          <button
            onClick={fetchProducts}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          <Link
            to="/admin/products/create"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <FiPlus />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        // 🔑 FIX 1: Removed `overflow-x-auto` — that was letting table push wider than screen.
        //          Added `w-full` so container respects parent width.
        <div className="bg-white shadow-md rounded-xl p-6 w-full">
          {/* 
            🔑 FIX 2: 
            - `w-full` (not min-w-full) → table takes exactly parent width, no more
            - `table-fixed` → forces browser to honor column widths
          */}
          <table className="w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* 
                  🔑 FIX 3: Using percentage widths so it's responsive.
                  Total = 100%
                */}
                <th className="w-[10%] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="w-[35%] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="w-[10%] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="w-[20%] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="w-[10%] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Featured
                </th>
                <th className="w-[15%] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  {/* ID */}
                  <td className="px-4 py-4 text-sm text-gray-500 truncate">
                    {product._id.substring(18)}
                  </td>

                  {/* 
                    🔑 FIX 4: NAME cell 
                    - NO whitespace-nowrap 
                    - `break-words` allows wrapping to next line
                    - OR use `truncate` if you want single-line with "..."
                    Pick ONE approach below:
                  */}
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">
                    {/* Option A: Truncate with ellipsis + hover tooltip */}
                    <div className="truncate" title={product.name}>
                      {product.name}
                    </div>

                    {/* Option B (alternative): allow wrapping to multiple lines
                    <div className="break-words">
                      {product.name}
                    </div>
                    */}
                  </td>

                  {/* Price */}
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{product.price}
                  </td>

                  {/* Stock */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.countInStock > 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}
                    >
                      {product.countInStock > 0
                        ? `In Stock (${product.countInStock})`
                        : 'Out of Stock'}
                    </span>
                  </td>

                  {/* Featured */}
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    {product.isFeatured ? (
                      <FiCheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <FiX className="w-5 h-5 text-gray-400 mx-auto" />
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <Link
                        to={`/admin/products/edit/${product._id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <FiEdit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => deleteHandler(product._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default ProductList;