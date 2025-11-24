// import React from "react";
// import { motion } from "framer-motion";
// import { FiStar } from "react-icons/fi";

// const testimonials = [
//   {
//     name: "Priya R.",
//     location: "Chennai",
//     message:
//       "I have been using Thamizhoviyaa herbal hair oil for 3 months. My hair fall reduced drastically and the natural shine returned. Completely satisfied!",
//     image: "https://tse2.mm.bing.net/th/id/OIP.27kz4GeESmPrR3omDRYVyQHaHa?pid=Api&P=0&h=180",
//     rating: 5,
//   },
//   {
//     name: "Suresh Kumar",
//     location: "Coimbatore",
//     message:
//       "Authentic herbal products with zero chemicals. The skin care powder worked wonders for my face. Highly recommended!",
//     image: "https://tse2.mm.bing.net/th/id/OIP.27kz4GeESmPrR3omDRYVyQHaHa?pid=Api&P=0&h=180",
//     rating: 5,
//   },
//   {
//     name: "Lakshmi Devi",
//     location: "Madurai",
//     message:
//       "Pure, natural and effective. I loved the aroma and results of their herbal hair pack. Perfect for regular use!",
//     image: "https://tse2.mm.bing.net/th/id/OIP.27kz4GeESmPrR3omDRYVyQHaHa?pid=Api&P=0&h=180",
//     rating: 5,
//   },
//   {
//     name: "Raghav",
//     location: "Erode",
//     message:
//       "A brand that truly respects traditional Tamil herbal wisdom. The products feel fresh and genuinely natural.",
//     image: "https://tse2.mm.bing.net/th/id/OIP.27kz4GeESmPrR3omDRYVyQHaHa?pid=Api&P=0&h=180",
//     rating: 4,
//   },
// ];

// const Testimonials = () => {
//   return (
//     <section className="section-padding bg-gray-50 overflow-hidden">
//       <div className="container-custom text-center mb-10">
//         <motion.h2
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="text-3xl md:text-4xl font-bold text-gray-900"
//         >
//           What Our Customers Say
//         </motion.h2>
//         <p className="text-gray-600 mt-2 text-lg">
//           Real experiences from people who trust Thamizhoviyaa
//         </p>
//       </div>

//       {/* Infinite slider container */}
//       <div className="relative w-full overflow-hidden">
//         <motion.div
//           className="flex gap-6"
//           initial={{ x: 0 }}
//           animate={{ x: "-100%" }}
//           transition={{
//             repeat: Infinity,
//             duration: 10,
//             ease: "linear",
//           }}
//         >
//           {/* Duplicate list twice for infinite loop */}
//           {[...testimonials, ...testimonials].map((t, index) => (
//             <div
//               key={index}
//               className="min-w-[280px] sm:min-w-[350px] md:min-w-[400px] bg-white shadow-md rounded-xl p-6 border hover:shadow-lg transition-all"
//             >
//               <div className="flex items-center gap-4 mb-4">
//                 <img
//                   src={t.image}
//                   alt={t.name}
//                   className="w-12 h-12 rounded-full object-cover border"
//                 />
//                 <div className="text-left">
//                   <h3 className="text-xl font-semibold text-gray-900">
//                     {t.name}
//                   </h3>
//                   <p className="text-sm text-gray-600">{t.location}</p>
//                 </div>
//               </div>

//               <p className="text-gray-700 text-left italic">{t.message}</p>

//               {/* Stars */}
//               <div className="flex mt-4">
//                 {Array.from({ length: t.rating }).map((_, i) => (
//                   <FiStar key={i} className="text-yellow-500" />
//                 ))}
//               </div>
//             </div>
//           ))}
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default Testimonials;



import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiStar, FiChevronLeft, FiChevronRight, FiPlay, FiPause } from "react-icons/fi";

const testimonials = [
    {
        id: 1,
        name: "Priya R.",
        location: "Chennai",
        message: "I have been using Thamizhoviyaa herbal hair oil for 3 months. My hair fall reduced drastically and the natural shine returned. Completely satisfied!",
        image: "https://tse2.mm.bing.net/th/id/OIP.27kz4GeESmPrR3omDRYVyQHaHa?pid=Api&P=0&h=180",
        rating: 5,
        product: "Herbal Hair Oil"
    },
    {
        id: 2,
        name: "Suresh Kumar",
        location: "Coimbatore",
        message: "Authentic herbal products with zero chemicals. The skin care powder worked wonders for my face. Highly recommended!",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
        rating: 5,
        product: "Skin Care Powder"
    },
    {
        id: 3,
        name: "Lakshmi Devi",
        location: "Madurai",
        message: "Pure, natural and effective. I loved the aroma and results of their herbal hair pack. Perfect for regular use!",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
        rating: 5,
        product: "Herbal Hair Pack"
    },
    {
        id: 4,
        name: "Raghav",
        location: "Erode",
        message: "A brand that truly respects traditional Tamil herbal wisdom. The products feel fresh and genuinely natural.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
        rating: 4,
        product: "Herbal Collection"
    },
    {
        id: 5,
        name: "Anjali S.",
        location: "Trichy",
        message: "The face wash transformed my skin completely. No more acne and my skin feels so fresh and natural!",
        image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
        rating: 5,
        product: "Natural Face Wash"
    }
];

// Custom Quote Icon Component
const QuoteIcon = ({ className }) => (
    <svg
        className={className}
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
    </svg>
);

const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [direction, setDirection] = useState(0);

    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setDirection(1);
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, testimonials.length]);

    const nextTestimonial = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const goToTestimonial = (index) => {
        setDirection(index > currentIndex ? 1 : -1);
        setCurrentIndex(index);
    };

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
            scale: 0.9
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction) => ({
            x: direction < 0 ? 300 : -300,
            opacity: 0,
            scale: 0.9
        })
    };

    const starVariants = {
        hidden: { scale: 0 },
        visible: (i) => ({
            scale: 1,
            transition: {
                delay: i * 0.1,
                type: "spring",
                stiffness: 300,
                damping: 15
            }
        })
    };

    return (
        <section className="section-padding bg-gradient-to-br from-gray-50 to-white overflow-hidden relative">
            {/* Background decorative elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-primary-100 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-accent-100 rounded-full opacity-20 blur-xl"></div>

            <div className="container-custom text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="max-w-2xl mx-auto"
                >
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-primary-700 bg-clip-text text-transparent mb-2 md:mb-4">
                        Voices of Trust
                    </h2>
                    <p className="text-gray-600 text-lg md:text-xl">
                        Discover what our community says about their journey with Thamizhoviyaa
                    </p>
                </motion.div>

                {/* Main testimonial slider */}
                <div className="relative max-w-4xl mx-auto mt-1 md:mt-13">
                    <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/50 p-6 md:p-8 relative overflow-hidden">
                        {/* Quote icon - Using custom SVG instead of FiQuote */}
                        <div className="absolute top-6 left-6 text-primary-100">
                            <QuoteIcon className="w-12 h-12 md:w-16 md:h-16" />
                        </div>

                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.4 },
                                    scale: { duration: 0.4 }
                                }}
                                className="text-center px-4 py-6 md:px-8"
                            >
                                {/* Rating stars */}
                                <motion.div
                                    className="flex justify-center gap-1 mb-6"
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
                                        <motion.div
                                            key={i}
                                            custom={i}
                                            variants={starVariants}
                                        >
                                            <FiStar className="w-6 h-6 text-yellow-400 fill-current" />
                                        </motion.div>
                                    ))}
                                </motion.div>

                                {/* Testimonial message */}
                                <motion.blockquote
                                    className="text-gray-700 text-lg md:text-xl leading-relaxed mb-8 font-medium"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    "{testimonials[currentIndex].message}"
                                </motion.blockquote>

                                {/* Customer info */}
                                <motion.div
                                    className="flex flex-col items-center"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <div className="relative mb-4">
                                        <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                            <img
                                                src={testimonials[currentIndex].image}
                                                alt={testimonials[currentIndex].name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {/* <div className="absolute -bottom-1 -right-1 bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                                            {testimonials[currentIndex].product}
                                        </div> */}
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">
                                            {testimonials[currentIndex].name}
                                        </h4>
                                        <p className="text-gray-600 flex items-center justify-center gap-1">
                                            <span>{testimonials[currentIndex].location}</span>
                                        </p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation controls */}
                        
                    </div>
                </div>

                {/* Testimonial thumbnails */}
                {/* <motion.div 
          className="flex justify-center gap-4 mt-8 overflow-x-auto py-4 px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.id}
              onClick={() => goToTestimonial(index)}
              className={`flex-shrink-0 transition-all duration-300 ${
                index === currentIndex 
                  ? "scale-110 ring-2 ring-primary-500" 
                  : "opacity-70 hover:opacity-100 hover:scale-105"
              }`}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </button>
          ))}
        </motion.div> */}

                {/* Stats section */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 md:mt-16 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {[
                        { number: "500+", label: "Happy Customers" },
                        { number: "98%", label: "Satisfaction Rate" },
                        { number: "4.9", label: "Average Rating" },
                        { number: "10+", label: "Products" }
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50"
                            whileHover={{
                                scale: 1.05,
                                backgroundColor: "rgba(255, 255, 255, 0.9)"
                            }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                                {stat.number}
                            </div>
                            <div className="text-gray-600 text-sm mt-1">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Testimonials;