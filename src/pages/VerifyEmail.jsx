// frontend/src/pages/VerifyEmail.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();

  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    const run = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link.');
        return;
      }

      try {
        const data = await verifyEmail(token);
        setStatus('success');
        setMessage(data.message || 'Email verified successfully!');
        setTimeout(() => navigate('/login'), 2000);
      } catch (err) {
        setStatus('error');
        setMessage(
          typeof err === 'string' ? err : 'Email verification failed or link expired.'
        );
      }
    };

    run();
  }, [searchParams, verifyEmail, navigate]);

  return (
    <div className="min-h-[80vh] bg-gray-50 section-padding flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 sm:p-10 border border-gray-100 text-center"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Email Verification</h1>
        {status === 'verifying' && <p className="text-gray-600">Verifying your email...</p>}
        {status === 'success' && <p className="text-green-700">{message}</p>}
        {status === 'error' && <p className="text-red-700">{message}</p>}
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
