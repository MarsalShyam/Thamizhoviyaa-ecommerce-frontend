import React,{useState,useEffect} from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import ProductGrid from '../components/ProductGrid'
import { products } from '../data/products'
import { FiTruck, FiShield, FiAward, FiHeart } from 'react-icons/fi'
import axios from 'axios'
import { ProductGridSkeleton } from '../components/SkeletonLoader'


const Home = () => {
    // const featuredProducts = products.filter(product => product.featured)
    const [featuredProducts, setFeaturedProducts] = useState([])
    const [loading, setLoading] = useState(true)

    // Fetch ONLY featured products from API
    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const { data } = await axios.get('/api/products?featured=true') // Use the new query filter
                setFeaturedProducts(data)
                setLoading(false)
            } catch (err) {
                console.error('Failed to fetch featured products:', err)
                setLoading(false)
            }
        }
        fetchFeaturedProducts()
    }, [])

    const features = [
        {
            icon: FiAward,
            title: '100% Natural',
            description: 'Pure herbal ingredients with no chemicals or additives'
        },
        {
            icon: FiShield,
            title: 'Quality Assured',
            description: 'Traditional preparation methods with modern quality checks'
        },
        {
            icon: FiTruck,
            title: 'Free Shipping',
            description: 'Free delivery on orders above ₹500 across India'
        },
        {
            icon: FiHeart,
            title: 'Health First',
            description: 'Products designed for your overall wellness and beauty'
        }
    ]

    return (
        <div>
            <Hero />

            {/* Features Section */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Why Choose Thamizhoviyaa?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Experience the purity of traditional Tamil herbal wisdom combined with modern quality standards.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="text-center p-6 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors duration-300"
                            >
                                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <feature.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products (MODIFIED) */}
            {loading ? (
                <section className="section-padding bg-gray-100">
                    <div className="container-custom">
                        <ProductGridSkeleton count={3} />
                    </div>
                </section>
            ) : (
                <ProductGrid
                    products={featuredProducts}
                    title="Featured Products"
                    description="Our most popular herbal products loved by customers"
                />
            )}

            {/* About Preview */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Traditional Wisdom, Modern Wellness
                            </h2>
                            <p className="text-lg text-gray-600 mb-6">
                                Thamizhoviyaa brings you the ancient herbal wisdom of Tamil Nadu,
                                carefully preserved and presented for modern lifestyles. Our products
                                are crafted using time-tested recipes passed down through generations.
                            </p>
                            <p className="text-lg text-gray-600 mb-8">
                                From hair care to skin wellness, each product is made with 100% natural
                                ingredients, ensuring you get the purest form of herbal goodness without
                                any chemical additives.
                            </p>
                            <Link to="/about" className="btn-primary inline-flex items-center">
                                Our Story
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="grid grid-cols-2 gap-4"
                        >
                            <div className="space-y-4">
                                <div className="rounded-xl overflow-hidden h-60 relative group cursor-pointer">
                                    <img
                                        src="/images/products/prod1/img11.png"
                                        alt="Traditional Herbal Wisdom"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-4">
                                        <div className="text-white">
                                            <h3 className="font-bold text-lg">Traditional Wisdom</h3>
                                            <p className="text-sm opacity-90">Ancient Tamil Herbal Knowledge</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-xl overflow-hidden h-60 relative group cursor-pointer">
                                    <img
                                        src="/images/products/prod2/img22.png"
                                        alt="100% Natural Ingredients"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-4">
                                        <div className="text-white">
                                            <h3 className="font-bold text-lg">Pure & Natural</h3>
                                            <p className="text-sm opacity-90">No Chemicals Added</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 mt-8">
                                <div className="rounded-xl overflow-hidden h-60 relative group cursor-pointer">
                                    <img
                                        src="/images/products/prod3/img33.png"
                                        alt="Modern Wellness Solutions"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-4">
                                        <div className="text-white">
                                            <h3 className="font-bold text-lg">Modern Wellness</h3>
                                            <p className="text-sm opacity-90">Contemporary Health Solutions</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-xl overflow-hidden h-60 relative group cursor-pointer">
                                    <img
                                        src="/images/products/prod2/img222.png"
                                        alt="Herbal Heritage"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-4">
                                        <div className="text-white">
                                            <h3 className="font-bold text-lg">Herbal Heritage</h3>
                                            <p className="text-sm opacity-90">Preserving Traditional Recipes</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home