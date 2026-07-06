// frontend/src/pages/Login.jsx
import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const LoginPage = () => {
  return (
    <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SEO 
        title="Login" 
        description="Log in to your Thamizhoviyaa account to track orders, manage your shipping addresses, and access your personalized wishlist." 
        keywords="login, sign in, customer account" 
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md flex flex-col items-center"
      >
        <SignIn routing="path" path="/login" signUpUrl="/signup" />
      </motion.div>
    </div>
  );
};

export default LoginPage;
