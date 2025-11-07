// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiLock, FiUser, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [form, setForm] = useState({
    name: '',
    phoneOrEmail: '',
    phone: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = isLogin
        ? await login(form.phoneOrEmail, form.password)
        : await register(form.name, form.phone, form.password, form.email);

      // ✅ data = { user: {...} }
      if (data.user?.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setForm({
      name: '',
      phoneOrEmail: '',
      phone: '',
      email: '',
      password: '',
    });
  };

  return (
    <div className="min-h-[80vh] bg-gray-50 section-padding flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 sm:p-10 border border-gray-100"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          {isLogin ? 'Welcome Back' : 'Create Your Account'}
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          {isLogin
            ? 'Sign in to access your cart, orders, and profile.'
            : 'Join our community for 100% natural herbal products.'}
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
              <div>
                <label className="input-label flex items-center mb-1">
                  <FiUser className="w-4 h-4 mr-2 text-primary-600" /> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="input-label flex items-center mb-1">
                  <FiPhone className="w-4 h-4 mr-2 text-primary-600" /> Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="9876543210"
                />
              </div>

              <div>
                <label className="input-label flex items-center mb-1">
                  <FiMail className="w-4 h-4 mr-2 text-primary-600" /> Email (Optional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your email"
                />
              </div>
            </>
          )}

          {isLogin && (
            <div>
              <label className="input-label flex items-center mb-1">
                <FiPhone className="w-4 h-4 mr-2 text-primary-600" /> Phone or Email
              </label>
              <input
                type="text"
                name="phoneOrEmail"
                value={form.phoneOrEmail}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Phone number or Email"
              />
            </div>
          )}

          <div>
            <label className="input-label flex items-center mb-1">
              <FiLock className="w-4 h-4 mr-2 text-primary-600" /> Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
            {!loading && <FiArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            {isLogin ? 'New to Thamizhoviyaa? ' : 'Already have an account? '}
            <button
              onClick={toggleMode}
              className="font-semibold text-accent-500 hover:text-accent-400 transition-colors"
            >
              {isLogin ? 'Create an Account' : 'Sign In'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
