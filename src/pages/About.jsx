

import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiUsers, FiTarget, FiHeart, FiAward, FiPlay } from 'react-icons/fi'
import { useState, useRef, useCallback, useEffect } from 'react';
import { FiYoutube, FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi';

const About = () => {
    const values = [
        {
            icon: FiUsers,
            title: 'Customer First',
            description: 'Your health and satisfaction are our top priorities'
        },
        {
            icon: FiTarget,
            title: 'Quality Focus',
            description: 'Traditional methods with modern quality standards'
        },
        {
            icon: FiHeart,
            title: 'Natural & Pure',
            description: '100% natural ingredients, no chemicals or additives'
        },
        {
            icon: FiAward,
            title: 'Traditional Wisdom',
            description: 'Preserving ancient Tamil herbal knowledge'
        }
    ]

    // YouTube video data - replace with your actual video embed codes later
    const youtubeVideos = [
        {
            id: 1,
            title: "Our Herbal Product Journey",
            description: "கொல்லிமலை மிளகு தோட்டம்⛰️| இது தானா 🤔 | Kolli Hills Pepper | Pepper garden Explore | Pepper Benefits",
            videoId: "PAImykWY5bs"
        },
        {
            id: 2,
            title: "Traditional Preparation Methods",
            description: "Arappu Making | அரப்பு தயாரிக்கும் முறை| Arappu Manufacturing |Traditional Hair Growth Plant | அரப்பு மரத்தின் நன்மைகள்",
            videoId: "APxEqyqvY24?si=10rne8x1ywvGL41t"
        },
        {
            id: 3,
            title: "kasturi Manjal Packing",
            description: "Watch THAMIZHOVIYAA HOME GOODIES Kasturi Haldi Powder (100 grams), Kasturi manjal, Wild Turmeric Powder, Natural Face Pack Mix for Glowing Skin",
            videoId: "Gc7TZP_2aZw?si=3eoaXP51OKsMWP5z"
        },
        {
            id: 4,
            title: "Ingredients dry process",
            description: "THAMIZHOVIYAA HOME GOODIES Kasturi Haldi Powder (100 grams), Kasturi manjal, Wild Turmeric Powder, Natural Face Pack Mix for Glowing Skin",
            videoId: "2i_nLXajSmE?si=c8igFmdu0NMz8G6r"
        }
    ]
    // Add these inside your component
    const scrollContainerRef = useRef(null);
    const [showPrevArrow, setShowPrevArrow] = useState(false);
    const [showNextArrow, setShowNextArrow] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    const checkScrollButtons = useCallback(() => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowPrevArrow(scrollLeft > 0);
            setShowNextArrow(scrollLeft + clientWidth < scrollWidth - 10); // 10px tolerance
        }
    }, []);

    const scrollNext = useCallback(() => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth * 0.85; // Match card width
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    }, []);

    const scrollPrev = useCallback(() => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth * 0.85; // Match card width
            scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
    }, []);

    const scrollToIndex = useCallback((index) => {
        if (scrollContainerRef.current) {
            const cardWidth = scrollContainerRef.current.clientWidth * 0.85;
            const gap = 24; // space-x-6 = 1.5rem = 24px
            scrollContainerRef.current.scrollTo({
                left: index * (cardWidth + gap),
                behavior: 'smooth'
            });
        }
    }, []);

    const handleScroll = useCallback(() => {
        checkScrollButtons();

        // Update current index based on scroll position
        if (scrollContainerRef.current) {
            const scrollLeft = scrollContainerRef.current.scrollLeft;
            const cardWidth = scrollContainerRef.current.clientWidth * 0.85;
            const gap = 24;
            const newIndex = Math.round(scrollLeft / (cardWidth + gap));
            setCurrentIndex(newIndex);
        }
    }, [checkScrollButtons]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            window.addEventListener('resize', checkScrollButtons);

            // Initial check
            checkScrollButtons();

            return () => {
                container.removeEventListener('scroll', handleScroll);
                window.removeEventListener('resize', checkScrollButtons);
            };
        }
    }, [handleScroll, checkScrollButtons]);

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
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">About Thamizhoviyaa</h1>
                        <p className="text-xl text-primary-100 max-w-2xl mx-auto">
                            Preserving traditional Tamil herbal wisdom for modern wellness
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Story Section */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
                            <p className="text-lg text-gray-600 mb-6">
                                Thamizhoviyaa was born from a deep respect for the ancient herbal wisdom of Tamil Nadu.
                                Our journey began in the heart of Namakkal, where traditional herbal remedies have been
                                passed down through generations.
                            </p>
                            <p className="text-lg text-gray-600 mb-6">
                                We saw the need to preserve these traditional formulations while making them accessible
                                to modern lifestyles. Each product is carefully crafted using time-tested recipes,
                                ensuring you receive the purest form of herbal goodness.
                            </p>
                            <p className="text-lg text-gray-600 mb-8">
                                Today, Thamizhoviyaa stands as a bridge between traditional Tamil herbal wisdom and
                                contemporary wellness needs, offering 100% natural solutions for health and beauty.
                            </p>
                            <Link to="/products" className="btn-primary">
                                Explore Our Products
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="grid grid-cols-2 gap-4"
                        >
                            <div className="space-y-4">
                                {/* Traditional */}
                                <div className="rounded-xl overflow-hidden h-56 relative group">
                                    <img
                                        src="/images/about/tradition.png"
                                        alt="Traditional Methods"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-primary-900/70 flex items-center justify-center p-6">
                                        <div className="text-center text-white">
                                            <FiAward className="w-8 h-8 text-accent-400 mx-auto mb-3" />
                                            <h3 className="font-bold text-lg mb-1">Traditional</h3>
                                            <p className="text-sm opacity-90">Ancient Wisdom</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Natural */}
                                <div className="rounded-xl overflow-hidden h-56 relative group">
                                    <img
                                        src="/images/about/natural.png"
                                        alt="Pure & Natural"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-green-900/60 flex items-center justify-center p-6">
                                        <div className="text-center text-white">
                                            <FiHeart className="w-8 h-8 text-accent-400 mx-auto mb-3" />
                                            <h3 className="font-bold text-lg mb-1">Natural</h3>
                                            <p className="text-sm opacity-90">Chemical Free</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 mt-8">
                                {/* Trusted */}
                                <div className="rounded-xl overflow-hidden h-56 relative group">
                                    <img
                                        src="/images/about/trust.png"
                                        alt="Community Trust"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-blue-900/60 flex items-center justify-center p-6">
                                        <div className="text-center text-white">
                                            <FiUsers className="w-8 h-8 text-accent-400 mx-auto mb-3" />
                                            <h3 className="font-bold text-lg mb-1">Trusted</h3>
                                            <p className="text-sm opacity-90">By Generations</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Quality */}
                                <div className="rounded-xl overflow-hidden h-56 relative group">
                                    <img
                                        src="/images/about/quality.png"
                                        alt="Premium Quality"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-purple-900/60 flex items-center justify-center p-6">
                                        <div className="text-center text-white">
                                            <FiTarget className="w-8 h-8 text-accent-400 mx-auto mb-3" />
                                            <h3 className="font-bold text-lg mb-1">Quality</h3>
                                            <p className="text-sm opacity-90">Craftsmanship</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* YouTube Videos Section - Added between Story and Values */}
            <section className="section-padding bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <div className="flex items-center justify-center mb-4">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-red-500 rounded-full blur opacity-25"></div>
                                <FiYoutube className="w-10 h-10 text-red-600 mr-3 relative" />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                Watch Our Journey
                            </h2>
                        </div>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Experience the story of Thamizhoviyaa through our videos showcasing traditional methods and modern wellness
                        </p>
                    </motion.div>

                    {/* Video Carousel Container */}
                    <div className="relative">
                        {/* Navigation Buttons */}
                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                            onClick={scrollPrev}

                            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:shadow-xl transition-all duration-300 group ${!showPrevArrow ? 'opacity-0 pointer-events-none' : 'opacity-100'
                                }`}
                        >
                            <FiChevronLeft className="w-6 h-6 text-gray-700 group-hover:text-red-600 transition-colors" />
                        </motion.button>

                        <motion.button
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                            onClick={scrollNext}
                            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:shadow-xl transition-all duration-300 group ${!showNextArrow ? 'opacity-0 pointer-events-none' : 'opacity-100'
                                }`}
                        >
                            <FiChevronRight className="w-6 h-6 text-gray-700 group-hover:text-red-600 transition-colors" />
                        </motion.button>

                        {/* Video Carousel */}
                        <div
                            ref={scrollContainerRef}
                            className="flex overflow-x-auto scrollbar-hide space-x-6 pb-4 snap-x snap-mandatory scroll-smooth"
                            onScroll={handleScroll}
                        >
                            {youtubeVideos.map((video, index) => (
                                <motion.div
                                    key={video.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="flex-shrink-0 w-[85vw] md:w-[45vw] lg:w-[30vw] snap-center"
                                >
                                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 group border border-gray-200">
                                        <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-2xl overflow-hidden relative">
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                src={`https://www.youtube.com/embed/${video.videoId}`}
                                                title={video.title}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                allowFullScreen
                                                className="relative z-10"
                                            ></iframe>
                                            <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                Watch Now
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-3">
                                                <h3 className="text-xl font-bold text-gray-900 line-clamp-2 leading-tight">
                                                    {video.title}
                                                </h3>
                                                <div className="flex-shrink-0 ml-3">
                                                    <FiYoutube className="w-5 h-5 text-red-600" />
                                                </div>
                                            </div>
                                            <p className="text-gray-600 leading-relaxed line-clamp-3">
                                                {video.description}
                                            </p>

                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Scroll Indicator */}
                        <div className="flex justify-center mt-6 space-x-2">
                            {youtubeVideos.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => scrollToIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-green-600 w-6' : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Call to Action */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-center mt-14"
                    >
                        <div className="relative rounded-2xl p-8 shadow-2xl border border-gray-200 overflow-hidden min-h-[300px] flex items-center justify-center">
                            {/* Banner Background */}
                            <div
                                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                                style={{
                                    backgroundImage: 'url("https://imgs.search.brave.com/XeCQQsZ9jjkKOzK9c01sie7wOle741D-d9VjeRMNogk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/d2FsbHBhcGVyc2Fm/YXJpLmNvbS84NC8z/NS9CcmtUUHEuanBl/Zw")',
                                }}
                            >
                                {/* Overlay for better text readability */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/30 backdrop-blur-[0px]"></div>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute -top-10 -right-10 w-20 h-20 bg-red-500 rounded-full opacity-20 blur-xl"></div>
                            <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-green-500 rounded-full opacity-20 blur-xl"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-yellow-400 rounded-full opacity-10 blur-2xl"></div>

                            {/* Content */}
                            <div className="relative z-10 max-w-3xl mx-auto">
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                                    Want to See More of Our Journey?
                                </h3>
                                <p className="text-base text-gray-200 mb-6 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
                                    Subscribe to our YouTube channel and join our community exploring traditional Tamil herbal wisdom transformed into modern wellness solutions.
                                </p>

                                <motion.a
                                    href="https://www.youtube.com/@admin_thamizhoviyaa"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{
                                        scale: 1.05,
                                        boxShadow: "0 20px 40px rgba(220, 38, 38, 0.3)"
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-red-600 hover:bg-red-700 text-white px-10 py-5 rounded-2xl font-bold transition-all duration-300 inline-flex items-center shadow-2xl hover:shadow-3xl text-lg group"
                                >
                                    <FiYoutube className="w-7 h-7 mr-3 group-hover:scale-110 transition-transform" />
                                    Subscribe to Our Channel
                                </motion.a>

                                {/* Additional Stats or Info */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.8 }}
                                    className="mt-8 flex flex-wrap justify-center gap-6 text-white/80"
                                >
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                                        <span className="text-sm font-medium">New Videos Every Week</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                                        <span className="text-sm font-medium">Traditional Methods</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>
                                        <span className="text-sm font-medium">Behind the Scenes</span>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Values Section */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            The principles that guide everything we do at Thamizhoviyaa
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="text-center p-6 bg-primary-50 hover:bg-primary-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
                            >
                                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <value.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                                <p className="text-gray-600">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="section-padding bg-primary-600 text-white">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
                            <p className="text-xl text-primary-100 mb-6">
                                To make traditional Tamil herbal wisdom accessible to everyone, providing
                                100% natural solutions for health and beauty that are effective, affordable,
                                and environmentally sustainable.
                            </p>
                            <p className="text-xl text-primary-100">
                                We are committed to preserving ancient herbal knowledge while adapting it
                                to meet the needs of modern lifestyles, ensuring that future generations
                                can benefit from this rich heritage.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8"
                        >
                            <h3 className="text-2xl font-bold mb-4">Why Choose Us?</h3>
                            <ul className="space-y-4">
                                <li className="flex items-center space-x-3">
                                    <div className="w-6 h-6 bg-accent-400 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm">✓</span>
                                    </div>
                                    <span className="text-primary-100">100% Natural Ingredients</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <div className="w-6 h-6 bg-accent-400 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm">✓</span>
                                    </div>
                                    <span className="text-primary-100">Traditional Preparation Methods</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <div className="w-6 h-6 bg-accent-400 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm">✓</span>
                                    </div>
                                    <span className="text-primary-100">No Chemicals or Additives</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <div className="w-6 h-6 bg-accent-400 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm">✓</span>
                                    </div>
                                    <span className="text-primary-100">Affordable Pricing</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <div className="w-6 h-6 bg-accent-400 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm">✓</span>
                                    </div>
                                    <span className="text-primary-100">Environmentally Conscious</span>
                                </li>
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default About