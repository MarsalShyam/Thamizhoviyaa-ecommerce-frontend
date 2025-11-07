// // frontend/src/pages/ProductDetails.jsx (MODIFIED)
// import React, { useState, useEffect, useCallback } from 'react'
// import { useParams, Link, useNavigate } from 'react-router-dom'
// import { motion } from 'framer-motion'
// import { useCart } from '../context/CartContext'
// import { useAuth } from '../context/AuthContext'
// import axios from 'axios'
// import LoadingSpinner from '../components/LoadingSpinner' // Assuming you have this
// import {
//   FiShoppingCart,
//   FiHeart,
//   FiShare2,
//   FiTruck,
//   FiShield,
//   FiStar,
//   FiChevronLeft,
//   FiChevronRight,
//   FiZoomIn
// } from 'react-icons/fi'

// const ProductDetail = () => {
//   const { id } = useParams()
//   const navigate = useNavigate()
//   const { addToCart, toggleWishlist, isInWishlist, isLoading: cartLoading } = useCart()
//   const { isAuthenticated } = useAuth()

//   const [product, setProduct] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   const [selectedImage, setSelectedImage] = useState(0)
//   const [quantity, setQuantity] = useState(1)
//   const [isLiked, setIsLiked] = useState(false)
//   const [showZoom, setShowZoom] = useState(false)
//   const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })

//   // --- Data Fetching ---
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         setLoading(true)
//         const { data } = await axios.get(`/api/products/${id}`)
//         setProduct(data)
//         setLoading(false)
//       } catch (err) {
//         setError('Product not found or server error.')
//         setLoading(false)
//       }
//     }
//     fetchProduct()
//   }, [id])

//   // --- Sync Wishlist State ---
//   useEffect(() => {
//     // Only check wishlist status once product and cart context are ready
//     if (product && !cartLoading) {
//       setIsLiked(isInWishlist(product._id))
//     }
//   }, [product, isInWishlist, cartLoading])


//   // --- Handlers ---
//   const handleAddToCart = () => {
//     if (!isAuthenticated) {
//       alert('Please sign in to add items to cart.');
//       navigate('/login');
//       return;
//     }
//     if (product.countInStock <= 0) {
//       alert('Product is out of stock.');
//       return;
//     }
//     addToCart(product, quantity)
//     alert(`${quantity} ${product.name} added to cart!`)
//   }

//   const handleBuyNow = () => {
//     if (!isAuthenticated) {
//       alert('Please sign in to proceed to checkout.');
//       navigate('/login');
//       return;
//     }
//     // Add to cart before navigating (if not already there)
//     // handleAddToCart();
//     navigate('/checkout');
//   }
//   const handleShare = async () => {
//   const shareData = {
//     title: product.name,
//     text: `Check out ${product.name} - ${product.description}`,
//     url: window.location.href
//   };

//   try {
//     // Check if Web Share API is supported
//     if (navigator.share) {
//       await navigator.share(shareData);
//     } else {
//       // Fallback: Copy link to clipboard
//       await navigator.clipboard.writeText(window.location.href);
//       alert('Product link copied to clipboard!');
//     }
//   } catch (err) {
//     // User cancelled or error occurred
//     if (err.name !== 'AbortError') {
//       console.error('Error sharing:', err);
//       // Fallback to copying link
//       try {
//         await navigator.clipboard.writeText(window.location.href);
//         alert('Product link copied to clipboard!');
//       } catch (clipboardErr) {
//         alert('Unable to share. Please copy the URL from your browser.');
//       }
//     }
//   }
// };

//   const handleToggleWishlist = () => {
//     if (!isAuthenticated) {
//       alert('Please sign in to add to wishlist.');
//       navigate('/login');
//       return;
//     }
//     toggleWishlist(product)
//     setIsLiked(!isLiked)
//   }

//   const handleImageZoom = (e) => {
//     const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
//     const x = ((e.clientX - left) / width) * 100
//     const y = ((e.clientY - top) / height) * 100
//     setZoomPosition({ x, y })
//   }

//   const nextImage = useCallback(() => {
//     if (product && product.images) {
//       setSelectedImage((prev) => (prev + 1) % product.images.length)
//     }
//   }, [product])

//   const prevImage = useCallback(() => {
//     if (product && product.images) {
//       setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)
//     }
//   }, [product])

//   const renderStars = (rating) => {
//     // ... (Your existing renderStars function)
//   }

//   // --- Rendering States ---
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <LoadingSpinner />
//       </div>
//     );
//   }

//   if (error || !product) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-red-500 mb-4">{error}</h2>
//           <Link to="/products" className="btn-primary">
//             Back to Products
//           </Link>
//         </div>
//       </div>
//     )
//   }

//   const images = product.images || []

//   // NOTE: The rest of the component remains largely the same, but uses 'product' state variable.
//   // Ensure the product keys match the new Mongo schema (e.g., product.countInStock instead of product.inStock bool)

//   return (
//     // ... (rest of the component structure, using 'product' state data)
//     <div>
//       {/* Breadcrumb */}
//       <section className="bg-gray-50 py-4">
//         <div className="container-custom">
//           <nav className="flex space-x-2 text-sm">
//             <Link to="/" className="text-gray-500 hover:text-primary-600">Home</Link>
//             <span className="text-gray-400">/</span>
//             <Link to="/products" className="text-gray-500 hover:text-primary-600">Products</Link>
//             <span className="text-gray-400">/</span>
//             <span className="text-primary-600">{product.name}</span>
//           </nav>
//         </div>
//       </section>

//       {/* Product Details */}
//       <section className="section-padding">
//         <div className="container-custom">
//           <div className="grid lg:grid-cols-2 gap-12">
//             {/* Product Images */}
//             <motion.div
//               initial={{ opacity: 0, x: -50 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.6 }}
//             >
//               {/* Main Image */}
//               <div className="bg-white rounded-xl shadow-lg p-4 mb-4 relative overflow-hidden group">
//                 <div
//                   className="h-80 bg-gray-100 rounded-lg flex items-center justify-center relative cursor-zoom-in"
//                   onMouseMove={handleImageZoom}
//                   onMouseEnter={() => setShowZoom(true)}
//                   onMouseLeave={() => setShowZoom(false)}
//                 >
//                   {images.length > 0 ? (
//                     <>
//                       <img
//                         src={images[selectedImage]}
//                         alt={product.name}
//                         className="w-full h-full object-contain transition-transform duration-300"
//                       />
//                       {showZoom && (
//                         <div
//                           className="absolute inset-0 bg-cover bg-no-repeat"
//                           style={{
//                             backgroundImage: `url(${images[selectedImage]})`,
//                             backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
//                             backgroundSize: '200%',
//                             opacity: 0.5
//                           }}
//                         />
//                       )}
//                     </>
//                   ) : (
//                     <div className="w-48 h-48 bg-gradient-to-br from-primary-50 to-accent-50 rounded-full shadow-2xl flex items-center justify-center">
//                       <span className="text-4xl font-bold text-primary-600">
//                         {product.name.split(' ').map(word => word[0]).join('')}
//                       </span>
//                     </div>
//                   )}

//                   {/* Image Navigation */}
//                   {images.length > 1 && (
//                     <>
//                       <button
//                         onClick={prevImage}
//                         className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
//                       >
//                         <FiChevronLeft className="w-5 h-5 text-gray-700" />
//                       </button>
//                       <button
//                         onClick={nextImage}
//                         className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
//                       >
//                         <FiChevronRight className="w-5 h-5 text-gray-700" />
//                       </button>
//                     </>
//                   )}

//                   {/* Zoom Indicator */}
//                   <div className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center">
//                     <FiZoomIn className="w-3 h-3 mr-1" />
//                     Hover to zoom
//                   </div>
//                 </div>
//               </div>

//               {/* Thumbnail Images */}
//               {images.length > 1 && (
//                 <div className="grid grid-cols-4 gap-3">
//                   {images.map((img, index) => (
//                     <button
//                       key={index}
//                       onClick={() => setSelectedImage(index)}
//                       className={`bg-white rounded-lg p-2 border-2 transition-all duration-200 ${selectedImage === index
//                           ? 'border-primary-600 shadow-md'
//                           : 'border-gray-200 hover:border-primary-400'
//                         }`}
//                     >
//                       <div className="h-20 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
//                         <img
//                           src={img}
//                           alt={`${product.name} view ${index + 1}`}
//                           className="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
//                         />
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </motion.div>

//             {/* Product Info */}
//             <motion.div
//               initial={{ opacity: 0, x: 50 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.6, delay: 0.2 }}
//             >
//               <div className="mb-6">
//                 <div className="flex items-center justify-between mb-3">
//                   <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
//                     {product.category}
//                   </span>
//                   <span className="text-sm text-gray-500">SKU: {product.sku}</span>
//                 </div>

//                 <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
//                   {product.name}
//                 </h1>

//                 {/* Rating */}
//                 <div className="flex items-center space-x-2 mb-4">
//                   <div className="flex items-center space-x-1">
//                     {/* {renderStars(product.rating)} */}
//                   </div>
//                   <span className="text-sm text-gray-600">
//                     {/* {product.rating} ({product.reviews} reviews) */}
//                     No Rating Data
//                   </span>
//                 </div>

//                 <p className="text-xl text-gray-600 leading-relaxed">{product.description}</p>
//               </div>

//               {/* Price */}
//               <div className="mb-6 p-4 bg-gray-50 rounded-lg">
//                 <div className="flex items-center space-x-4 mb-2">
//                   <span className="text-3xl font-bold text-primary-600">₹{product.price}</span>
//                   {product.originalPrice > product.price && (
//                     <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
//                   )}
//                   {product.originalPrice > product.price && (
//                     <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
//                       Save ₹{product.originalPrice - product.price}
//                     </span>
//                   )}
//                 </div>
//                 <div className="flex items-center space-x-4 text-sm text-gray-600">
//                   <span>Size: {product.size}</span>
//                   <span className={`px-2 py-1 rounded-full ${product.countInStock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//                     {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
//                   </span>
//                 </div>
//               </div>

//               {/* Quantity & Add to Cart */}
//               <div className="mb-8">
//                 <div className="flex items-center space-x-4 mb-6">
//                   <span className="text-gray-700 font-medium">Quantity:</span>
//                   <div className="flex items-center border border-gray-300 rounded-lg">
//                     <button
//                       onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                       className="px-4 py-3 text-gray-600 hover:bg-gray-100 transition-colors"
//                       disabled={quantity <= 1 || product.countInStock <= 0}
//                     >
//                       -
//                     </button>
//                     <span className="px-6 py-3 text-gray-900 font-medium min-w-12 text-center">{quantity}</span>
//                     <button
//                       onClick={() => setQuantity(quantity + 1)}
//                       className="px-4 py-3 text-gray-600 hover:bg-gray-100 transition-colors"
//                       disabled={product.countInStock <= 0 || quantity >= product.countInStock}
//                     >
//                       +
//                     </button>
//                   </div>
//                   <span className="text-sm text-gray-500">
//                     {product.countInStock > 0 ? `${product.countInStock} Available` : 'Out of Stock'}
//                   </span>
//                 </div>

//                 <div className="flex space-x-4 mb-4">
//                   <button
//                     onClick={handleAddToCart}
//                     disabled={product.countInStock <= 0}
//                     className="btn-primary flex-1 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     <FiShoppingCart className="w-5 h-5" />
//                     <span>Add to Cart</span>
//                   </button>
//                   <button
//                     onClick={handleToggleWishlist}
//                     className={`p-4 rounded-lg border transition-colors duration-200 ${isLiked
//                         ? 'bg-red-50 border-red-200 text-red-600'
//                         : 'bg-white border-primary-600 text-primary-600 hover:bg-primary-50'
//                       }`}
//                   >
//                     <FiHeart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
//                   </button>
//                   <button
//                     onClick={handleShare}
//                     className="bg-white border border-primary-600 text-primary-600 p-4 rounded-lg hover:bg-primary-50 transition-colors duration-200"
//                   >
//                     <FiShare2 className="w-5 h-5" />
//                   </button>
//                 </div>

//                 {/* Buy Now Button */}
//                 <button
//                   onClick={handleBuyNow}
//                   disabled={product.countInStock <= 0}
//                   className="w-full bg-accent-400 hover:bg-accent-500 text-white py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
//                 >
//                   Buy Now
//                 </button>
//               </div>

//               {/* Features / Benefits / Details Tabs */}
//               {/* ... (Your existing content below here is fine, but ensure you use product.fullDescription, product.usage, product.ingredients from the fetched state) */}
//               {/* ... */}
//             </motion.div>
//           </div>
//           {/* Product Details Tabs (Full Description, Usage, Ingredients) */}
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.4 }}
//             className="mt-16"
//           >
//             <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//               <div className="border-b">
//                 <div className="flex overflow-x-auto">
//                   {/* Simplified tabs - in production, you would manage active tab state */}
//                   {['Description', 'Usage', 'Ingredients', 'Reviews'].map((tab) => (
//                     <button
//                       key={tab}
//                       className={`px-6 py-4 font-medium text-gray-600 hover:text-primary-600 border-b-2 ${tab === 'Description' ? 'border-primary-600' : 'border-transparent'} hover:border-primary-600 whitespace-nowrap`}
//                     >
//                       {tab}
//                     </button>
//                   ))}
//                 </div>

//               </div>

//               <div className="p-8">
//                 <div className="grid md:grid-cols-2 gap-8">
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Instructions</h3>
//                     <p className="text-gray-600 leading-relaxed">{product.usage}</p>

//                     <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-4">Ingredients</h3>
//                     <ul className="space-y-2">
//                       {product.ingredients.map((ingredient, index) => (
//                         <li key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
//                           <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0"></div>
//                           <span className="text-gray-600">{ingredient}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>

//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-4">Full Description</h3>
//                     <p className="text-gray-600 leading-relaxed mb-6">{product.fullDescription}</p>

//                     <div className="bg-primary-50 rounded-lg p-6 border border-primary-100">
//                       <h4 className="font-semibold text-primary-900 mb-3 text-lg">Key Benefits</h4>
//                       <ul className="space-y-2 list-disc list-inside text-primary-700">
//                         {product.benefits.map((benefit, index) => (
//                           <li key={index}>{benefit}</li>
//                         ))}
//                       </ul>
//                     </div>

//                   </div>
//                 </div>

//                 {/* Reviews Section - Placeholder for future backend */}
//                 <div className="mt-8 pt-8 border-t">
//                   <h3 className="text-xl font-semibold text-gray-900 mb-6">Customer Reviews</h3>
//                   <div className="text-center py-8">
//                     <p className="text-gray-500 mb-4">No reviews yet. Be the first to review this product!</p>
//                     <button className="btn-primary">
//                       Write a Review
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* Related Products - You can implement this later */}
//       <section className="section-padding bg-gray-50">
//         <div className="container-custom">
//           <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
//           {/* Add related products component here */}
//         </div>
//       </section>
//     </div>
//   )
// }

// export default ProductDetail







// frontend/src/pages/ProductDetails.jsx
import React, { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import LoadingSpinner from '../components/LoadingSpinner'
import {
  FiShoppingCart,
  FiHeart,
  FiShare2,
  FiTruck,
  FiShield,
  FiStar,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiPackage,
  FiAward,
  FiRefreshCw,
  FiCheck
} from 'react-icons/fi'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, toggleWishlist, isInWishlist, isLoading: cartLoading, startBuyNow } = useCart()
  const { isAuthenticated } = useAuth()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isLiked, setIsLiked] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [showImageModal, setShowImageModal] = useState(false)

  // --- Data Fetching ---
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get(`/api/products/${id}`)
        setProduct(data)
        setLoading(false)
      } catch (err) {
        setError('Product not found or server error.')
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  // --- Sync Wishlist State ---
  useEffect(() => {
    if (product && !cartLoading) {
      setIsLiked(isInWishlist(product._id))
    }
  }, [product, isInWishlist, cartLoading])

  // --- Handlers ---
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert('Please sign in to add items to cart.')
      navigate('/login')
      return
    }
    if (product.countInStock <= 0) {
      alert('Product is out of stock.')
      return
    }
    addToCart(product, quantity)
    alert(`${quantity} ${product.name} added to cart!`)
  }

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      alert('Please sign in to proceed to checkout.')
      navigate('/login')
      return
    }
    // Start a checkout with only this product (does NOT add to cart)
    startBuyNow(product, quantity)
    navigate('/checkout')
  }
//   const handleBuyNow = () => {
//   if (!isAuthenticated) {
//     alert('Please sign in to proceed to checkout.');
//     navigate('/login');
//     return;
//   }

//   // ✅ Start Buy Now
//   startBuyNow(product, quantity);

//   // ✅ Give context a moment to persist before navigating
//   setTimeout(() => navigate('/checkout'), 100);
// };



  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      alert('Please sign in to add to wishlist.')
      navigate('/login')
      return
    }
    toggleWishlist(product)
    setIsLiked(!isLiked)
  }

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} - ${product.description}`,
      url: window.location.href
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        alert('Product link copied to clipboard!')
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing:', err)
        try {
          await navigator.clipboard.writeText(window.location.href)
          alert('Product link copied to clipboard!')
        } catch (clipboardErr) {
          alert('Unable to share. Please copy the URL from your browser.')
        }
      }
    }
  }

  const nextImage = useCallback(() => {
    if (product && product.images) {
      setSelectedImage((prev) => (prev + 1) % product.images.length)
    }
  }, [product])

  const prevImage = useCallback(() => {
    if (product && product.images) {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)
    }
  }, [product])

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FiStar
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  // --- Rendering States ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">{error}</h2>
          <Link to="/products" className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  const images = product.images || []

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'usage', label: 'How to Use' },
    { id: 'ingredients', label: 'Ingredients' },
    { id: 'reviews', label: 'Reviews' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm overflow-x-auto">
            <Link to="/" className="text-gray-600 hover:text-primary-600 transition-colors whitespace-nowrap">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/products" className="text-gray-600 hover:text-primary-600 transition-colors whitespace-nowrap">
              Products
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* Main Product Section */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 mb-8">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-3">
              {/* Main Image Display */}
              <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-white">
                  {images.length > 0 ? (
                    <div className="relative w-full h-full group">
                      <img
                        src={images[selectedImage]}
                        alt={product.name}
                        className="w-full h-full object-contain p-6 cursor-pointer"
                        onClick={() => setShowImageModal(true)}
                      />

                      {/* Navigation Arrows - Only show on desktop */}
                      {images.length > 1 && (
                        <div className="hidden md:block">
                          <button
                            onClick={prevImage}
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                            aria-label="Previous image"
                          >
                            <FiChevronLeft className="w-5 h-5 text-gray-800" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                            aria-label="Next image"
                          >
                            <FiChevronRight className="w-5 h-5 text-gray-800" />
                          </button>
                        </div>
                      )}

                      {/* Click to Zoom Hint */}
                      <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1.5 rounded-md text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to view full size
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-12">
                      <div className="w-40 h-40 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-3xl font-bold text-primary-700">
                          {product.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail Grid */}
              {images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${selectedImage === index
                          ? 'border-primary-600 shadow-md'
                          : 'border-gray-200 hover:border-gray-400'
                        }`}
                    >
                      <img
                        src={img}
                        alt={`View ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Action Buttons - Mobile Only */}
              <div className="flex lg:hidden gap-2 pt-2">
                <button
                  onClick={handleToggleWishlist}
                  className={`flex-1 border-2 py-3 rounded-lg font-medium transition-all ${isLiked
                      ? 'bg-red-50 border-red-300 text-red-600'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                >
                  <FiHeart className={`w-5 h-5 mx-auto ${isLiked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:border-gray-400 transition-all"
                >
                  <FiShare2 className="w-5 h-5 mx-auto" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 sm:p-6 lg:p-8">
              {/* Product Header */}
              <div className="border-b border-gray-200 pb-6 mb-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-md text-sm font-semibold uppercase tracking-wide">
                    {product.category}
                  </span>
                  <span className="text-sm text-gray-500 font-mono">SKU: {product.sku}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                  {product.name}
                </h1>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {renderStars(product.rating || 0)}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating ? (
                      <>
                        <span className="font-semibold text-gray-900">{product.rating}</span>
                        {' '}({product.reviews || 0} reviews)
                      </>
                    ) : (
                      'No ratings yet'
                    )}
                  </span>
                </div>

                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Pricing */}
              <div className="border-b border-gray-200 pb-6 mb-6">
                <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900">₹{product.price}</span>
                  {product.originalPrice > product.price && (
                    <>
                      <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
                      <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-md text-sm font-bold">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-600">Inclusive of all taxes</p>
              </div>

              {/* Product Details Grid */}
              <div className="grid sm:grid-cols-2 gap-4 border-b border-gray-200 pb-6 mb-6">
                <div>
                  <span className="text-sm text-gray-600">Size</span>
                  <p className="font-semibold text-gray-900">{product.size}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Availability</span>
                  <p className={`font-semibold ${product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.countInStock > 0 ? `In Stock (${product.countInStock} units)` : 'Out of Stock'}
                  </p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1 || product.countInStock <= 0}
                      className="px-4 py-2.5 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <span className="text-lg font-semibold">−</span>
                    </button>
                    <span className="px-6 py-2.5 font-semibold text-gray-900 min-w-[50px] text-center bg-gray-50">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={product.countInStock <= 0 || quantity >= product.countInStock}
                      className="px-4 py-2.5 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <span className="text-lg font-semibold">+</span>
                    </button>
                  </div>
                  {product.countInStock > 0 && (
                    <span className="text-sm text-gray-600">{product.countInStock} available</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={product.countInStock <= 0}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3.5 px-6 rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary-100"
                >
                  <FiShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.countInStock <= 0}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3.5 px-6 rounded-lg font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-100"
                >
                  Buy Now
                </button>
              </div>

              {/* Wishlist & Share - Desktop Only */}
              <div className="hidden lg:flex gap-3 mb-6">
                <button
                  onClick={handleToggleWishlist}
                  className={`flex-1 border-2 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${isLiked
                      ? 'bg-red-50 border-red-300 text-red-600'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                >
                  <FiHeart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  {isLiked ? 'Saved' : 'Save for Later'}
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:border-gray-400 transition-all flex items-center justify-center gap-2"
                >
                  <FiShare2 className="w-5 h-5" />
                  Share
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2.5 rounded-lg flex-shrink-0">
                    <FiTruck className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Free Delivery</p>
                    <p className="text-gray-600 text-xs">Orders above ₹500</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2.5 rounded-lg flex-shrink-0">
                    <FiRefreshCw className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Easy Returns</p>
                    <p className="text-gray-600 text-xs">7-day return policy</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2.5 rounded-lg flex-shrink-0">
                    <FiShield className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Secure Payment</p>
                    <p className="text-gray-600 text-xs">100% Protected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Section with Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <nav className="flex overflow-x-auto scrollbar-hide" aria-label="Product details">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-shrink-0 px-6 py-4 text-sm font-semibold border-b-3 transition-all whitespace-nowrap ${activeTab === tab.id
                        ? 'text-primary-600 border-b-primary-600 bg-white'
                        : 'text-gray-600 border-b-transparent hover:text-gray-900 hover:bg-gray-100/50'
                      }`}
                    style={{ borderBottomWidth: activeTab === tab.id ? '3px' : '0' }}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-8 lg:p-10">
            <AnimatePresence mode="wait">
              {/* Description Tab */}
              {activeTab === 'description' && (
                <motion.div
                  key="description"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Description</h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed text-base mb-6 whitespace-pre-line">
                      {product.fullDescription || product.description}
                    </p>
                  </div>

                  {product.benefits && product.benefits.length > 0 && (
                    <div className="mt-8 bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl p-6 border border-primary-100">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FiAward className="text-primary-600" />
                        Key Benefits
                      </h3>
                      <ul className="space-y-3">
                        {product.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <FiCheck className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Usage Tab */}
              {activeTab === 'usage' && (
                <motion.div
                  key="usage"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Use</h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                      {product.usage || 'Usage instructions not available for this product.'}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Ingredients Tab */}
              {activeTab === 'ingredients' && (
                <motion.div
                  key="ingredients"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Ingredients</h2>
                  {product.ingredients && product.ingredients.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {product.ingredients.map((ingredient, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50/30 transition-all"
                        >
                          <div className="w-1.5 h-1.5 bg-primary-600 rounded-full flex-shrink-0"></div>
                          <span className="text-gray-800 font-medium text-sm">{ingredient}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No ingredient information available for this product.</p>
                  )}
                </motion.div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiStar className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
                    <p className="text-gray-600 mb-6">Be the first to share your thoughts about this product</p>
                    <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                      Write a Review
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {showImageModal && images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setShowImageModal(false)}
          >
            <button
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10"
              onClick={() => setShowImageModal(false)}
              aria-label="Close modal"
            >
              <FiX className="w-8 h-8" />
            </button>

            <div className="relative max-w-6xl max-h-full">
              <motion.img
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                src={images[selectedImage]}
                alt={product.name}
                className="max-w-full max-h-[90vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Modal Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      prevImage()
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all"
                  >
                    <FiChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      nextImage()
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all"
                  >
                    <FiChevronRight className="w-6 h-6 text-white" />
                  </button>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium">
                    {selectedImage + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProductDetail