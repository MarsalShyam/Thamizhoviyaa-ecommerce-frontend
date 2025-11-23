// // frontend/src/pages/Login.jsx
// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { FiMail, FiPhone, FiLock, FiUser, FiArrowRight } from 'react-icons/fi';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const LoginPage = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();
//   const { login, register } = useAuth();

//   const [form, setForm] = useState({
//     name: '',
//     phoneOrEmail: '',
//     phone: '',
//     email: '',
//     password: '',
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       if (isLogin) {
//         const data = await login(form.phoneOrEmail, form.password);

//         if (data.user?.isAdmin) {
//           navigate('/admin');
//         } else {
//           navigate('/');
//         }
//       } else {
//         // Registration – no auto-login; just send verification email
//         await register(form.name, form.phone || undefined, form.password, form.email);
//         // switch to login mode
//         setIsLogin(true);
//       }
//     } catch (err) {
//       setError(typeof err === 'string' ? err : 'Authentication failed.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleMode = () => {
//     setIsLogin(!isLogin);
//     setError(null);
//     setForm({
//       name: '',
//       phoneOrEmail: '',
//       phone: '',
//       email: '',
//       password: '',
//     });
//   };

//   const handleForgotPassword = () => {
//     navigate('/forgot-password');
//   };

//   return (
//     <div className="min-h-[80vh] bg-gray-50 section-padding flex items-center justify-center">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.5 }}
//         className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 sm:p-10 border border-gray-100"
//       >
//         <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
//           {isLogin ? 'Welcome Back' : 'Create Your Account'}
//         </h1>
//         <p className="text-gray-600 mb-8 text-center">
//           {isLogin
//             ? 'Sign in to access your cart, orders, and profile.'
//             : 'Join our community for 100% natural herbal products.'}
//         </p>

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4 text-sm text-center">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {!isLogin && (
//             <>
//               <div>
//                 <label className="input-label flex items-center mb-1">
//                   <FiUser className="w-4 h-4 mr-2 text-primary-600" /> Full Name
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={form.name}
//                   onChange={handleChange}
//                   required
//                   className="input-field"
//                   placeholder="Enter your name"
//                 />
//               </div>

//               <div>
//                 <label className="input-label flex items-center mb-1">
//                   <FiPhone className="w-4 h-4 mr-2 text-primary-600" /> Phone Number (Optional)
//                 </label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={form.phone}
//                   onChange={handleChange}
//                   className="input-field"
//                   placeholder="9876543210"
//                 />
//               </div>

//               <div>
//                 <label className="input-label flex items-center mb-1">
//                   <FiMail className="w-4 h-4 mr-2 text-primary-600" /> Email
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={form.email}
//                   onChange={handleChange}
//                   required
//                   className="input-field"
//                   placeholder="Enter your email"
//                 />
//               </div>
//             </>
//           )}

//           {isLogin && (
//             <div>
//               <label className="input-label flex items-center mb-1">
//                 <FiMail className="w-4 h-4 mr-2 text-primary-600" /> Email or Phone
//               </label>
//               <input
//                 type="text"
//                 name="phoneOrEmail"
//                 value={form.phoneOrEmail}
//                 onChange={handleChange}
//                 required
//                 className="input-field"
//                 placeholder="Email or phone number"
//               />
//             </div>
//           )}

//           <div>
//             <label className="input-label flex items-center mb-1">
//               <FiLock className="w-4 h-4 mr-2 text-primary-600" /> Password
//             </label>
//             <input
//               type="password"
//               name="password"
//               value={form.password}
//               onChange={handleChange}
//               required
//               className="input-field"
//               placeholder="••••••••"
//             />
//             {isLogin && (
//               <div className="flex justify-end mt-1">
//                 <button
//                   type="button"
//                   onClick={handleForgotPassword}
//                   className="text-xs text-accent-500 hover:text-accent-400"
//                 >
//                   Forgot password?
//                 </button>
//               </div>
//             )}
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
//           >
//             {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
//             {!loading && <FiArrowRight className="w-5 h-5" />}
//           </button>
//         </form>

//         <div className="mt-6 text-center text-sm">
//           <p className="text-gray-600">
//             {isLogin ? 'New to Thamizhoviyaa? ' : 'Already have an account? '}
//             <button
//               onClick={toggleMode}
//               className="font-semibold text-accent-500 hover:text-accent-400 transition-colors"
//             >
//               {isLogin ? 'Create an Account' : 'Sign In'}
//             </button>
//           </p>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default LoginPage;



// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiMail,
  FiPhone,
  FiLock,
  FiUser,
  FiArrowRight,
  FiEye,
  FiEyeOff,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

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

  // ----------- BASIC VALIDATIONS -----------
  const isValidEmail = (email) =>
    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);

  const isValidPhone = (phone) =>
    /^\d{10}$/.test(phone);

  const passwordStrength = (() => {
    const pwd = form.password;
    if (!pwd) return '';
    if (pwd.length < 6) return 'weak';
    if (pwd.length < 8) return 'medium';
    return 'strong';
  })();

  // Disable button logic
  const canSubmit = (() => {
    if (loading) return false;

    if (isLogin) {
      return (
        form.phoneOrEmail.trim() !== '' &&
        form.password.trim() !== ''
      );
    } else {
      return (
        form.name.trim() !== '' &&
        isValidEmail(form.email) &&
        form.password.trim() !== ''
      );
    }
  })();

  const handleKeyDown = (e) => {
    setCapsLock(e.getModifierState && e.getModifierState("CapsLock"));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const data = await login(form.phoneOrEmail, form.password);

        if (data.user?.isAdmin) navigate('/admin');
        else navigate('/');
      } else {
        await register(form.name, form.phone || undefined, form.password, form.email);
        setIsLogin(true);
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

  const handleForgotPassword = () => navigate('/forgot-password');

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
          {/* REGISTER FIELDS */}
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
                  <FiPhone className="w-4 h-4 mr-2 text-primary-600" /> Phone (Optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="9876543210"
                />
                {form.phone && !isValidPhone(form.phone) && (
                  <p className="text-xs text-red-500 mt-1">Phone must be 10 digits.</p>
                )}
              </div>

              <div>
                <label className="input-label flex items-center mb-1">
                  <FiMail className="w-4 h-4 mr-2 text-primary-600" /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Enter your email"
                />
                {form.email && !isValidEmail(form.email) && (
                  <p className="text-xs text-red-500 mt-1">Invalid email format.</p>
                )}
              </div>
            </>
          )}

          {/* LOGIN FIELD */}
          {isLogin && (
            <div>
              <label className="input-label flex items-center mb-1">
                <FiMail className="w-4 h-4 mr-2 text-primary-600" /> Email or Phone
              </label>
              <input
                type="text"
                name="phoneOrEmail"
                value={form.phoneOrEmail}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Email or phone number"
              />
            </div>
          )}

          {/* PASSWORD FIELD */}
          <div>
            <label className="input-label flex items-center mb-1">
              <FiLock className="w-4 h-4 mr-2 text-primary-600" /> Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                required
                className="input-field pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {capsLock && (
              <p className="text-xs text-orange-600 mt-1">Caps Lock is ON</p>
            )}

            {/* PASSWORD STRENGTH (REGISTER ONLY) */}
            {!isLogin && form.password && (
              <div className="mt-2">
                <div
                  className={`h-2 rounded-full ${
                    passwordStrength === 'weak'
                      ? 'bg-red-500 w-1/3'
                      : passwordStrength === 'medium'
                      ? 'bg-yellow-500 w-2/3'
                      : 'bg-green-600 w-full'
                  }`}
                ></div>
                <p className="text-xs mt-1 text-gray-600 capitalize">
                  Strength: {passwordStrength}
                </p>
              </div>
            )}

            {isLogin && (
              <div className="flex justify-end mt-1">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-accent-500 hover:text-accent-400"
                >
                  Forgot password?
                </button>
              </div>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={!canSubmit || loading}
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
