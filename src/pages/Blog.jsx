import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiCalendar, FiUser, FiArrowRight } from 'react-icons/fi'
import axios from 'axios'
import LoadingSpinner from '../components/LoadingSpinner'
import SEO from '../components/SEO'

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/blogs');
        setBlogs(data);
      } catch (err) {
        console.error('Failed to fetch blog posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <SEO 
        title="Herbal Wellness Blog" 
        description="Read the latest articles on traditional Tamil herbal remedies, wellness tips, benefits of organic skin care, and natural hair care recipes on the Thamizhoviyaa blog." 
        keywords="herbal blog, wellness tips, traditional remedies, organic lifestyle blog, natural beauty tips" 
      />
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
          {blogs.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <h3 className="text-xl font-bold mb-2">No Articles Found</h3>
              <p>Check back later for fresh herbal wisdom tips and guides!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((post, index) => (
                <motion.article
                  key={post._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="h-48 relative overflow-hidden">
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = 'https://placehold.co/400x250?text=Thamizhoviyaa'; }}
                      />
                      <span className="absolute top-3 left-3 bg-primary-600 text-white px-2.5 py-1 rounded-full text-xs font-semibold">
                        {post.category}
                      </span>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-primary-900 mb-3 line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-gray-650 mb-4 line-clamp-3 text-sm leading-relaxed">
                        {post.content.length > 150 ? `${post.content.substring(0, 150)}...` : post.content}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4 border-t pt-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <FiCalendar className="w-3.5 h-3.5 text-primary-500" />
                          <span>{new Date(post.publishDate || post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FiUser className="w-3.5 h-3.5 text-primary-500" />
                          <span>{post.author}</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/blog/${post._id}`}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 text-sm"
                    >
                      <span>Read More</span>
                      <FiArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          {/* Newsletter CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
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
              <button className="btn-secondary whitespace-nowrap bg-accent-400 text-white hover:bg-accent-500">
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