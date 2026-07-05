
// frontend/src/pages/ProductDetails.jsx
import React, { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'
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

const renderRichTabContent = (sections) => {
  if (!sections || sections.length === 0) return null;

  return (
    <div className="space-y-12">
      {sections.map((section, idx) => {
        return (
          <div key={idx} className="space-y-4">
            {/* Heading */}
            {section.heading && (
              <h2 className="text-2xl font-bold text-gray-900 border-b pb-2 tracking-tight">
                {section.heading}
              </h2>
            )}

            {/* Format 1: heading, subheading, description */}
            {section.type === 'format1' && (
              <div className="space-y-2">
                {section.subheading && (
                  <h3 className="text-lg font-semibold text-primary-700 italic">
                    {section.subheading}
                  </h3>
                )}
                <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                  {section.description}
                </p>
              </div>
            )}

            {/* Format 2: heading, subsections (subheading + description) */}
            {section.type === 'format2' && (
              <div className="grid md:grid-cols-2 gap-6">
                {(section.subsections || []).map((sub, sidx) => (
                  <div key={sidx} className="bg-gray-50/50 rounded-xl p-5 border border-gray-100 hover:shadow-sm transition-shadow">
                    <h4 className="font-bold text-gray-800 text-base mb-2">
                      {sub.subheading}
                    </h4>
                    <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
                      {sub.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Format 3: heading, subsections with key-value table */}
            {section.type === 'format3' && (
              <div className="space-y-6">
                {(section.subsections || []).map((sub, sidx) => (
                  <div key={sidx} className="space-y-3">
                    {sub.subheading && (
                      <h4 className="font-semibold text-gray-700 text-base">
                        {sub.subheading}
                      </h4>
                    )}
                    {sub.tableData && sub.tableData.length > 0 && (
                      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm max-w-3xl">
                        <table className="min-w-full divide-y divide-gray-200">
                          <tbody className="bg-white divide-y divide-gray-100">
                            {sub.tableData.map((row, ridx) => (
                              <tr key={ridx} className={ridx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}>
                                <td className="px-6 py-4 text-sm font-semibold text-gray-600 w-1/3 border-r border-gray-100 bg-gray-50/50">
                                  {row.key}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 font-medium whitespace-pre-line">
                                  {row.value}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, toggleWishlist, isInWishlist, isLoading: cartLoading, startBuyNow } = useCart()
  const { isAuthenticated, user } = useAuth()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isLiked, setIsLiked] = useState(false)
  const [activeTab, setActiveTab] = useState('aboutThisItem')
  const [showImageModal, setShowImageModal] = useState(false)

  // Review states
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)

  const [selectedVariant, setSelectedVariant] = useState(null)

  // Extract variant combinations
  const colors = product && product.variants ? [...new Set(product.variants.map(v => v.color).filter(Boolean))] : []
  const sizes = product && product.variants ? [...new Set(product.variants.map(v => v.size).filter(Boolean))] : []
  const customNames = product && product.variants ? [...new Set(product.variants.map(v => v.name).filter(Boolean))] : []

  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedCustomName, setSelectedCustomName] = useState('')

  // Set default selection when product details are fetched
  useEffect(() => {
    if (product) {
      if (colors.length > 0) setSelectedColor(colors[0])
      if (sizes.length > 0) setSelectedSize(sizes[0])
      if (customNames.length > 0) setSelectedCustomName(customNames[0])
    }
  }, [product])

  // Select active tab on mount/load
  useEffect(() => {
    if (product) {
      const hasAbout = product.aboutThisItem && product.aboutThisItem.length > 0;
      const hasInfo = product.productInformation && product.productInformation.length > 0;
      const hasBrand = product.fromTheBrand && product.fromTheBrand.length > 0;

      if (hasAbout) {
        setActiveTab('aboutThisItem');
      } else if (hasInfo) {
        setActiveTab('productInformation');
      } else if (hasBrand) {
        setActiveTab('fromTheBrand');
      } else {
        setActiveTab('aboutThisItem');
      }
    }
  }, [product])

  // Find matching variant
  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      const match = product.variants.find(v => {
        const colorMatch = !v.color || v.color === selectedColor
        const sizeMatch = !v.size || v.size === selectedSize
        const nameMatch = !v.name || v.name === selectedCustomName
        return colorMatch && sizeMatch && nameMatch
      })
      setSelectedVariant(match || product.variants[0])
    } else {
      setSelectedVariant(null)
    }
  }, [selectedColor, selectedSize, selectedCustomName, product])

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
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.warning('Please sign in to write a review.');
      navigate('/login');
      return;
    }
    if (!reviewComment.trim()) {
      toast.warning('Please enter a review comment.');
      return;
    }

    try {
      setReviewSubmitting(true);
      await axios.post(`/api/products/${product._id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment
      });
      toast.success('Review submitted successfully!');

      // Reload product details to fetch updated reviews list
      const { data } = await axios.get(`/api/products/${product._id}`);
      setProduct(data);

      // Reset form states
      setReviewComment('');
      setReviewRating(5);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert('Please sign in to add items to cart.')
      navigate('/login')
      return
    }
    const finalStock = selectedVariant ? selectedVariant.stock : product.countInStock
    if (finalStock <= 0) {
      alert('Selected option is out of stock.')
      return
    }

    // Pass variant override details so cart reflects selection
    const cartProduct = {
      ...product,
      price: selectedVariant ? selectedVariant.price : product.price,
      size: selectedVariant && selectedVariant.size ? selectedVariant.size : product.size,
      color: selectedVariant && selectedVariant.color ? selectedVariant.color : undefined,
      sku: selectedVariant && selectedVariant.sku ? selectedVariant.sku : product.sku,
      countInStock: finalStock
    }

    addToCart(cartProduct, quantity)
    alert(`${quantity} ${product.name} ${selectedVariant ? `(${selectedVariant.color || ''} ${selectedVariant.size || ''})` : ''} added to cart!`)
  }

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      alert('Please sign in to proceed to checkout.')
      navigate('/login')
      return
    }
    const finalStock = selectedVariant ? selectedVariant.stock : product.countInStock
    if (finalStock <= 0) {
      alert('Selected option is out of stock.')
      return
    }

    const checkoutProduct = {
      ...product,
      price: selectedVariant ? selectedVariant.price : product.price,
      size: selectedVariant && selectedVariant.size ? selectedVariant.size : product.size,
      color: selectedVariant && selectedVariant.color ? selectedVariant.color : undefined,
      sku: selectedVariant && selectedVariant.sku ? selectedVariant.sku : product.sku,
      countInStock: finalStock
    }

    startBuyNow(checkoutProduct, quantity)
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

  const tabs = []
  const hasAbout = product.aboutThisItem && product.aboutThisItem.length > 0;
  const hasInfo = product.productInformation && product.productInformation.length > 0;
  const hasBrand = product.fromTheBrand && product.fromTheBrand.length > 0;

  if (!hasAbout && !hasInfo && !hasBrand) {
    tabs.push({ id: 'aboutThisItem', label: 'About this Item' })
  } else {
    if (hasAbout) tabs.push({ id: 'aboutThisItem', label: 'About this Item' })
    if (hasInfo) tabs.push({ id: 'productInformation', label: 'Product Information' })
    if (hasBrand) tabs.push({ id: 'fromTheBrand', label: 'From the Brand' })
  }
  tabs.push({ id: 'reviews', label: 'Reviews' })

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
                <div className="grid grid-cols-4 gap-2">
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
                        className="w-full h-full object-contain"
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
                  <span className="text-sm text-gray-500 font-mono">SKU: {selectedVariant && selectedVariant.sku ? selectedVariant.sku : product.sku}</span>
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight">
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
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                    ₹{selectedVariant && selectedVariant.price !== undefined ? selectedVariant.price : product.price}
                  </span>
                  {product.originalPrice > (selectedVariant && selectedVariant.price !== undefined ? selectedVariant.price : product.price) && (
                    <>
                      <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
                      <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-md text-sm font-bold">
                        {Math.round(((product.originalPrice - (selectedVariant && selectedVariant.price !== undefined ? selectedVariant.price : product.price)) / product.originalPrice) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-600">Inclusive of all taxes</p>
              </div>

              {/* Product Variants (Selectors) */}
              {product.variants && product.variants.length > 0 && (
                <div className="border-b border-gray-200 pb-6 mb-6 space-y-4">
                  {colors.length > 0 && (
                    <div>
                      <span className="block text-sm font-semibold text-gray-700 mb-2">Available Colors</span>
                      <div className="flex flex-wrap gap-2">
                        {colors.map(color => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${selectedColor === color
                              ? 'border-primary-600 bg-primary-50 text-primary-700 ring-2 ring-primary-600/20'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                              }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {sizes.length > 0 && (
                    <div>
                      <span className="block text-sm font-semibold text-gray-700 mb-2">Available Sizes</span>
                      <div className="flex flex-wrap gap-2">
                        {sizes.map(size => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${selectedSize === size
                              ? 'border-primary-600 bg-primary-50 text-primary-700 ring-2 ring-primary-600/20'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                              }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {customNames.length > 0 && (
                    <div>
                      <span className="block text-sm font-semibold text-gray-700 mb-2">Options</span>
                      <div className="flex flex-wrap gap-2">
                        {customNames.map(name => (
                          <button
                            key={name}
                            onClick={() => setSelectedCustomName(name)}
                            className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${selectedCustomName === name
                              ? 'border-primary-600 bg-primary-50 text-primary-700 ring-2 ring-primary-600/20'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                              }`}
                          >
                            {name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Product Details Grid */}
              <div className="grid sm:grid-cols-2 gap-4 border-b border-gray-200 pb-6 mb-6">
                <div>
                  <span className="text-sm text-gray-600">Selected Option SKU</span>
                  <p className="font-semibold text-gray-900 font-mono text-sm">
                    {selectedVariant && selectedVariant.sku ? selectedVariant.sku : (product.sku || 'N/A')}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Availability</span>
                  <p className={`font-semibold ${(selectedVariant ? selectedVariant.stock : product.countInStock) > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {(selectedVariant ? selectedVariant.stock : product.countInStock) > 0
                      ? `In Stock (${selectedVariant ? selectedVariant.stock : product.countInStock} units)`
                      : 'Out of Stock'}
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
                      disabled={quantity <= 1 || (selectedVariant ? selectedVariant.stock : product.countInStock) <= 0}
                      className="px-4 py-2.5 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <span className="text-lg font-semibold">−</span>
                    </button>
                    <span className="px-6 py-2.5 font-semibold text-gray-900 min-w-[50px] text-center bg-gray-50">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={
                        (selectedVariant ? selectedVariant.stock : product.countInStock) <= 0 ||
                        quantity >= (selectedVariant ? selectedVariant.stock : product.countInStock)
                      }
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
              {/* About this Item Tab */}
              {activeTab === 'aboutThisItem' && (
                <motion.div
                  key="aboutThisItem"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {product.aboutThisItem && product.aboutThisItem.length > 0 ? (
                    renderRichTabContent(product.aboutThisItem)
                  ) : (
                    /* Fallback for legacy products */
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Overview</h2>
                        <div className="prose max-w-none">
                          <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                            {product.fullDescription || product.description}
                          </p>
                        </div>
                      </div>

                      {product.benefits && product.benefits.length > 0 && (
                        <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl p-6 border border-primary-100">
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

                      {product.usage && (
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-3">How to Use</h3>
                          <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line bg-gray-50 p-5 rounded-xl border">
                            {product.usage}
                          </p>
                        </div>
                      )}

                      {product.ingredients && product.ingredients.length > 0 && (
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-4">Ingredients</h3>
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {product.ingredients.map((ingredient, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
                              >
                                <div className="w-1.5 h-1.5 bg-primary-600 rounded-full flex-shrink-0"></div>
                                <span className="text-gray-800 font-medium text-sm">{ingredient}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {product.attributes && product.attributes.length > 0 && (
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-4">Technical Specifications</h3>
                          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm max-w-2xl">
                            <table className="min-w-full divide-y divide-gray-200">
                              <tbody className="bg-white divide-y divide-gray-100">
                                {product.attributes.map((attr, index) => (
                                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-600 w-1/3 border-r border-gray-100 bg-gray-50/50">
                                      {attr.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                      {attr.value}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Product Information Tab */}
              {activeTab === 'productInformation' && product.productInformation && product.productInformation.length > 0 && (
                <motion.div
                  key="productInformation"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderRichTabContent(product.productInformation)}
                </motion.div>
              )}

              {/* From the Brand Tab */}
              {activeTab === 'fromTheBrand' && product.fromTheBrand && product.fromTheBrand.length > 0 && (
                <motion.div
                  key="fromTheBrand"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderRichTabContent(product.fromTheBrand)}
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
                  className="space-y-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>

                  <div className="grid lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Overall Rating & Form */}
                    <div className="lg:col-span-4 space-y-6">
                      <div className="bg-gray-50 rounded-2xl p-6 border">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Customer Rating</h3>
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-4xl font-extrabold text-gray-900">{product.rating ? product.rating.toFixed(1) : '0.0'}</span>
                          <span className="text-sm text-gray-500 font-medium">out of 5</span>
                        </div>
                        <div className="flex items-center gap-1.5 mb-2">
                          {renderStars(product.rating || 0)}
                        </div>
                        <p className="text-xs text-gray-500 mb-6">{product.reviews || 0} global ratings</p>

                        {/* Progress Bars */}
                        <div className="space-y-2">
                          {[5, 4, 3, 2, 1].map((stars) => {
                            const count = (product.reviewsList || []).filter(r => r.rating === stars).length;
                            const pct = (product.reviewsList || []).length > 0 ? Math.round((count / product.reviewsList.length) * 100) : 0;
                            return (
                              <div key={stars} className="flex items-center text-xs text-gray-600 gap-3">
                                <span className="w-12 hover:underline cursor-default">{stars} star</span>
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                                </div>
                                <span className="w-8 text-right font-medium">{pct}%</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Review Form Card */}
                      <div className="bg-white rounded-2xl p-6 border shadow-sm space-y-4">
                        <h3 className="text-lg font-bold text-gray-800">Write a Review</h3>
                        {!isAuthenticated ? (
                          <div className="bg-primary-50 text-primary-800 p-4 rounded-xl text-center border border-primary-100">
                            <p className="text-sm font-medium mb-3">Sign in to rate and comment on this product.</p>
                            <Link to="/login" className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors">
                              Sign In
                            </Link>
                          </div>
                        ) : (product.reviewsList || []).some(r => r.user && user && (r.user.toString() === user._id.toString() || r.user.toString() === user.clerkId)) ? (
                          <div className="bg-gray-50 text-gray-600 p-4 rounded-xl text-center border text-sm font-medium">
                            ✓ You have already reviewed this product.
                          </div>
                        ) : (
                          <form onSubmit={handleReviewSubmit} className="space-y-4">
                            <div>
                              <label className="block text-xs font-bold text-gray-500 mb-2">Rating</label>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((stars) => (
                                  <button
                                    key={stars}
                                    type="button"
                                    onClick={() => setReviewRating(stars)}
                                    className="focus:outline-none transition-transform active:scale-95"
                                  >
                                    <FiStar className={`w-7 h-7 ${stars <= reviewRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Your Comment *</label>
                              <textarea
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                placeholder="What did you like or dislike? How was the quality?"
                                rows="4"
                                className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-white focus:ring-primary-500 focus:border-primary-500"
                                required
                              />
                            </div>
                            <button
                              type="submit"
                              disabled={reviewSubmitting}
                              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 px-4 rounded-lg text-sm shadow-md transition-colors disabled:opacity-50"
                            >
                              {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                          </form>
                        )}
                      </div>
                    </div>

                    {/* Right: Reviews List */}
                    <div className="lg:col-span-8 space-y-4">
                      {!(product.reviewsList && product.reviewsList.length > 0) ? (
                        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/30">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <FiStar className="w-6 h-6 text-gray-400" />
                          </div>
                          <h3 className="text-base font-semibold text-gray-900 mb-1">No reviews yet</h3>
                          <p className="text-sm text-gray-500">Be the first to share your thoughts about this product!</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {product.reviewsList.map((rev, idx) => (
                            <div key={idx} className="bg-white p-5 rounded-2xl border hover:shadow-sm transition-shadow space-y-2">
                              <div className="flex justify-between items-start gap-4">
                                <div>
                                  <span className="font-bold text-gray-900 text-sm block">{rev.name || 'Anonymous User'}</span>
                                  <div className="flex items-center gap-1.5 mt-1">
                                    <div className="flex items-center gap-0.5">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <FiStar key={star} className={`w-3.5 h-3.5 ${star <= rev.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                      ))}
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-mono">
                                      {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recent'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                                {rev.comment}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
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