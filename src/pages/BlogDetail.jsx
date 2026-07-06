// frontend/src/pages/BlogDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiUser, FiArrowLeft, FiTag } from 'react-icons/fi';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import SEO from '../components/SEO';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/blogs/${id}`);
        setBlog(data);
      } catch (err) {
        console.error('Failed to fetch blog post details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) return <LoadingSpinner />;

  if (!blog) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <SEO title="Article Not Found" description="The blog post you are looking for does not exist." keywords="not found, 404, blog" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Article Not Found</h2>
        <p className="text-gray-500 mb-4">The blog post you are looking for does not exist or has been removed.</p>
        <Link to="/blog" className="btn-primary inline-flex items-center gap-2">
          <FiArrowLeft /> Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-50 min-h-screen py-10"
    >
      <SEO 
        title={blog.title} 
        description={`Read about ${blog.title} on Thamizhoviyaa.`} 
        keywords={`${blog.title}, herbal remedy, health tips, traditional tamil herbal recipes`} 
      />
      <div className="container-custom max-w-4xl">
        <Link to="/blog" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 font-semibold mb-6 transition-colors">
          <FiArrowLeft /> Back to Articles
        </Link>

        <article className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
          {/* Cover image / Banner */}
          <div className="h-64 md:h-96 w-full relative">
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = 'https://placehold.co/800x450?text=Thamizhoviyaa+Herbal'; }}
            />
            <div className="absolute top-4 left-4">
              <span className="bg-primary-600 text-white px-3.5 py-1.5 rounded-full text-sm font-semibold shadow-md">
                {blog.category}
              </span>
            </div>
          </div>

          {/* Article Info */}
          <div className="p-6 md:p-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
              {blog.title}
            </h1>

            {/* Author and Date Meta */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-500 border-b pb-6 mb-6">
              <div className="flex items-center gap-1.5 font-medium text-gray-700">
                <FiUser className="w-4 h-4 text-primary-500" />
                <span>By {blog.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FiCalendar className="w-4 h-4 text-primary-500" />
                <span>{new Date(blog.publishDate || blog.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FiTag className="w-4 h-4 text-primary-500" />
                <span>{blog.category}</span>
              </div>
            </div>

            {/* Content Body */}
            <div className="prose max-w-none text-gray-700 leading-relaxed space-y-6 text-base md:text-lg">
              {blog.content.split('\n').map((paragraph, index) => {
                if (!paragraph.trim()) return null;
                // Basic markdown rendering support
                if (paragraph.startsWith('### ')) {
                  return <h3 key={index} className="text-xl font-bold text-gray-900 pt-3">{paragraph.replace('### ', '')}</h3>;
                }
                if (paragraph.startsWith('## ')) {
                  return <h2 key={index} className="text-2xl font-bold text-gray-900 pt-4 pb-1 border-b">{paragraph.replace('## ', '')}</h2>;
                }
                if (paragraph.startsWith('# ')) {
                  return <h1 key={index} className="text-3xl font-extrabold text-gray-900 pt-5">{paragraph.replace('# ', '')}</h1>;
                }
                if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                  return (
                    <li key={index} className="ml-6 list-disc text-gray-700">
                      {paragraph.substring(2)}
                    </li>
                  );
                }
                return <p key={index}>{paragraph}</p>;
              })}
            </div>
          </div>
        </article>
      </div>
    </motion.div>
  );
};

export default BlogDetail;
