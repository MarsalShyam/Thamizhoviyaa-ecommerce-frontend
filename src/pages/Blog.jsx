import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiCalendar, FiUser, FiArrowRight } from 'react-icons/fi'

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Benefits of Arappu Powder for Hair Care",
      excerpt: "Discover how traditional Arappu powder can transform your hair care routine with its natural cleansing properties.",
      category: "Hair Care",
      date: "2024-01-15",
      author: "Thamizhoviyaa Team",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Kasturi Manjal: The Secret to Glowing Skin",
      excerpt: "Learn about the amazing skin benefits of Kasturi Manjal and how to incorporate it into your daily skincare.",
      category: "Skin Care",
      date: "2024-01-10",
      author: "Thamizhoviyaa Team",
      readTime: "4 min read"
    },
    {
      id: 3,
      title: "Traditional Tamil Herbal Wisdom for Modern Life",
      excerpt: "Explore how ancient Tamil herbal knowledge is relevant and beneficial for today's health and wellness needs.",
      category: "Wellness",
      date: "2024-01-05",
      author: "Thamizhoviyaa Team",
      readTime: "6 min read"
    },
    {
      id: 4,
      title: "The Power of Pure Castor Oil for Hair Growth",
      excerpt: "Understand how pure castor oil promotes hair growth and strengthens your hair naturally.",
      category: "Hair Care",
      date: "2024-01-01",
      author: "Thamizhoviyaa Team",
      readTime: "4 min read"
    },
    {
      id: 5,
      title: "Natural Ingredients vs Chemical Products",
      excerpt: "Why choosing natural herbal products is better for your health and the environment.",
      category: "Wellness",
      date: "2023-12-28",
      author: "Thamizhoviyaa Team",
      readTime: "5 min read"
    },
    {
      id: 6,
      title: "DIY Herbal Face Masks for Radiant Skin",
      excerpt: "Easy-to-make herbal face masks using natural ingredients for glowing, healthy skin.",
      category: "Skin Care",
      date: "2023-12-25",
      author: "Thamizhoviyaa Team",
      readTime: "3 min read"
    }
  ]

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Herbal Wisdom Blog</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Discover the power of traditional Tamil herbal remedies and natural wellness tips
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="h-48 bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center p-6">
                  <div className="text-center">
                    <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                      {post.category}
                    </span>
                    <h3 className="text-xl font-bold text-primary-900 line-clamp-2">
                      {post.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <FiCalendar className="w-4 h-4" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FiUser className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                    </div>
                    <span>{post.readTime}</span>
                  </div>

                  <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2">
                    <span>Read More</span>
                    <FiArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Newsletter CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 bg-primary-600 rounded-2xl p-8 text-center text-white"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated with Herbal Wisdom</h2>
            <p className="text-primary-100 text-lg mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter for the latest herbal remedies, wellness tips, and exclusive offers
            </p>
            <div className="max-w-md mx-auto flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-400"
              />
              <button className="btn-secondary whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Blog