// frontend/src/pages/SignUp.jsx
import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const SignUpPage = () => {
  return (
    <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SEO 
        title="Sign Up" 
        description="Create a new account with Thamizhoviyaa and start shopping for 100% natural herbal products and home goodies today." 
        keywords="register, create account, sign up" 
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md flex flex-col items-center"
      >
        <SignUp routing="path" path="/signup" signInUrl="/login" />
      </motion.div>
    </div>
  );
};

export default SignUpPage;
