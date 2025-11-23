// frontend/src/pages/ForgotPasswordPhone.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPhone, FiLock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebaseConfig';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';

const ForgotPasswordPhone = () => {
  const { resetPasswordWithPhone } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [firebaseIdToken, setFirebaseIdToken] = useState(null);

  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifierForgot) {
      window.recaptchaVerifierForgot = new RecaptchaVerifier(auth, 'recaptcha-container-forgot', {
        size: 'invisible',
        callback: () => {},
      });
    }
    return window.recaptchaVerifierForgot;
  };

  const handleSendOtp = async () => {
    try {
      setError(null);
      if (!phone || phone.trim().length < 10) {
        setError('Please enter a valid phone number.');
        return;
      }

      const phoneNumber = '+91' + phone.trim(); // adjust country code if needed
      const appVerifier = setupRecaptcha();

      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(result);
      setOtpSent(true);
    } catch (err) {
      console.error(err);
      setError('Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setError(null);
      if (!otp || !confirmationResult) {
        setError('Please enter the OTP sent to your phone.');
        return;
      }

      const result = await confirmationResult.confirm(otp);
      const token = await result.user.getIdToken();

      setIsPhoneVerified(true);
      setFirebaseIdToken(token);
    } catch (err) {
      console.error(err);
      setError('Invalid OTP. Please try again.');
      setIsPhoneVerified(false);
      setFirebaseIdToken(null);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isPhoneVerified || !firebaseIdToken) {
      setError('Please verify your phone via OTP first.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }

    if (newPassword !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await resetPasswordWithPhone(phone, newPassword, firebaseIdToken);
      navigate('/login');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-gray-50 section-padding flex items-center justify-center">
      <div id="recaptcha-container-forgot"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 sm:p-10 border border-gray-100"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Reset Password via Phone
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Verify your phone number using OTP, then set a new password.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleResetPassword} className="space-y-6">
          {/* Phone + OTP section */}
          <div>
            <label className="input-label flex items-center mb-1">
              <FiPhone className="w-4 h-4 mr-2 text-primary-600" /> Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="input-field"
              placeholder="9876543210"
            />
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={handleSendOtp}
                className="text-xs px-3 py-1 rounded-full border border-accent-500 text-accent-500 hover:bg-accent-50"
              >
                {otpSent ? 'Resend OTP' : 'Send OTP'}
              </button>
              {isPhoneVerified && (
                <span className="text-xs text-green-600 font-medium">
                  Phone verified ✅
                </span>
              )}
            </div>
          </div>

          {otpSent && !isPhoneVerified && (
            <div>
              <label className="input-label flex items-center mb-1">
                <FiLock className="w-4 h-4 mr-2 text-primary-600" /> Enter OTP
              </label>
              <input
                type="text"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="input-field"
                placeholder="6-digit OTP"
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="mt-2 text-xs px-3 py-1 rounded-full border border-primary-600 text-primary-600 hover:bg-primary-50"
              >
                Verify OTP
              </button>
            </div>
          )}

          {/* New password section */}
          <div>
            <label className="input-label flex items-center mb-1">
              <FiLock className="w-4 h-4 mr-2 text-primary-600" /> New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="input-field"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="input-label flex items-center mb-1">
              <FiLock className="w-4 h-4 mr-2 text-primary-600" /> Confirm Password
            </label>
            <input
              type="password"
              name="confirm"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
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
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPhone;
