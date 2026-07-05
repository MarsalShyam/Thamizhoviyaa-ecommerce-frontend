// frontend/src/pages/Admin/CMS.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiFeather,
  FiX,
  FiCheck,
  FiFileText
} from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';

const CMS = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/blogs/admin');
      setBlogs(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openCreateModal = () => {
    setEditingBlog(null);
    setTitle('');
    setThumbnail('');
    setAuthor('Thamizhoviyaa Team');
    setContent('');
    setCategory('Hair Care');
    setIsPublished(true);
    setModalOpen(true);
  };

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setTitle(blog.title);
    setThumbnail(blog.thumbnail);
    setAuthor(blog.author);
    setContent(blog.content);
    setCategory(blog.category);
    setIsPublished(blog.isPublished);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !thumbnail || !author || !content) {
      toast.warn('Please fill in all required fields');
      return;
    }

    const payload = {
      title,
      thumbnail,
      author,
      content,
      category,
      isPublished
    };

    try {
      if (editingBlog) {
        await axios.put(`/api/blogs/${editingBlog._id}`, payload);
        toast.success('Blog post updated successfully!');
      } else {
        await axios.post('/api/blogs', payload);
        toast.success('Blog post created successfully!');
      }
      setModalOpen(false);
      fetchBlogs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save blog post');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await axios.delete(`/api/blogs/${id}`);
        toast.success('Blog post deleted successfully!');
        fetchBlogs();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete blog post');
      }
    }
  };

  const togglePublishStatus = async (blog) => {
    try {
      const updatedStatus = !blog.isPublished;
      await axios.put(`/api/blogs/${blog._id}`, {
        isPublished: updatedStatus
      });
      toast.success(updatedStatus ? 'Blog published!' : 'Blog unpublished!');
      fetchBlogs();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">CMS & Blog Management</h2>
          <p className="text-sm text-gray-500 mt-1">Create, edit, publish, and manage all your store's blog content</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg font-semibold shadow transition-colors inline-flex items-center space-x-2"
        >
          <FiPlus className="w-5 h-5" />
          <span>New Blog Post</span>
        </button>
      </div>

      {/* Blogs list */}
      <div className="bg-white shadow rounded-xl border border-gray-200 overflow-hidden">
        {blogs.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <FiFeather className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-750 mb-1">No articles found</h3>
            <p className="text-sm max-w-xs mx-auto">Get started by creating your very first herbal wisdom article!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Thumbnail</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={blog.thumbnail || 'https://placehold.co/100x60'}
                        alt={blog.title}
                        className="w-16 h-10 object-cover rounded-md border"
                        onError={(e) => { e.target.src = 'https://placehold.co/100x60'; }}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 max-w-sm truncate" title={blog.title}>
                      {blog.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className="px-2 py-1 rounded bg-gray-100 font-medium">
                        {blog.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {blog.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(blog.publishDate || blog.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => togglePublishStatus(blog)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${blog.isPublished
                          ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                          : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                          }`}
                        title={blog.isPublished ? 'Click to unpublish' : 'Click to publish'}
                      >
                        {blog.isPublished ? <FiEye className="w-3 h-3" /> : <FiEyeOff className="w-3 h-3" />}
                        <span>{blog.isPublished ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                      <button
                        onClick={() => openEditModal(blog)}
                        className="text-primary-600 hover:text-primary-900 inline-flex items-center gap-1"
                      >
                        <FiEdit2 className="w-4 h-4" />
                        {/* <span>Edit</span> */}
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="text-red-600 hover:text-red-900 inline-flex items-center gap-1"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        {/* <span>Delete</span> */}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b flex justify-between items-center bg-gray-55">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FiFileText className="text-primary-600" />
                  <span>{editingBlog ? 'Edit Blog Post' : 'Create Blog Post'}</span>
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Article Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. The Benefits of Arappu Powder for Hair Care"
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    >
                      <option value="Hair Care">Hair Care</option>
                      <option value="Skin Care">Skin Care</option>
                      <option value="Wellness">Wellness</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Author Name *</label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      required
                      placeholder="Thamizhoviyaa Team"
                      className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Thumbnail URL *</label>
                  <input
                    type="url"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    required
                    placeholder="https://example.com/image.jpg"
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">Provide a link to a hosted thumbnail image.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Content (Markdown / Text) *</label>
                  <textarea
                    rows={8}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    placeholder="Write the full body of the article here..."
                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="isPublished" className="text-sm font-semibold text-gray-700 select-none cursor-pointer">
                    Publish immediately (visible to visitors)
                  </label>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold shadow"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CMS;
