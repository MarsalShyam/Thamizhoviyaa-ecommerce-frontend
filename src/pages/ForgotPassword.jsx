// frontend/src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const ForgotPassword = () => {
  const { requestPasswordReset } = useAuth();
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const data = await requestPasswordReset(phoneOrEmail);
      setSuccessMsg(data.message || 'Reset link sent if account exists.');
    } catch (err) {
      setError(typeof err === 'string' ? err : err?.toString() || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-gray-50 section-padding flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 sm:p-10 border border-gray-100"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Forgot Password
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Enter your registered phone or email. If we find your account and it has an email, we&apos;ll send a reset link.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-4 text-sm text-center">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="input-label flex items-center mb-1">
              <FiPhone className="w-4 h-4 mr-2 text-primary-600" /> Phone or Email
            </label>
            <input
              type="text"
              name="phoneOrEmail"
              value={phoneOrEmail}
              onChange={(e) => setPhoneOrEmail(e.target.value)}
              required
              className="input-field"
              placeholder="Enter your phone number or email"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
