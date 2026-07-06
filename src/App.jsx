

// frontend/src/App.jsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import { ClerkProvider, AuthenticateWithRedirectCallback } from '@clerk/clerk-react'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// === Pages ===
import Home from './pages/Home'
import About from './pages/About'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Contact from './pages/Contact'
import Blog from './pages/Blog'
import LoginPage from './pages/Login'
import SignUpPage from './pages/SignUp'
import ProtectedRoute from './components/ProtectedRoute'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Wishlist from './pages/Wishlist'
import UserProfileLayout from './pages/User/UserProfileLayout'
import UserOrderList from './pages/Users/UserOrderList'
import UserOrderDetails from './pages/Users/UserOrderDetails'
import Overview from './pages/User/UserProfile/Overview'
import EditProfileForm from './pages/User/UserProfile/EditProfileForm'
import AddressManagement from './pages/User/UserProfile/AddressManagement'
import AdminRoute from './components/AdminRoute'
import AdminLayout from './components/AdminLayout'
import AdminDashboard from './pages/Admin/Dashboard'
import AdminProductList from './pages/Admin/ProductList'
import AdminProductCreateEdit from './pages/Admin/ProductCreateEdit'
import AdminOrderList from './pages/Admin/AdminOrderList'
import AdminOrderDetails from './pages/Admin/AdminOrderDetails'
import AdminUserList from './pages/Admin/AdminUserList'
import AdminCMS from './pages/Admin/CMS'
import BlogDetail from './pages/BlogDetail'

import FloatingContact from './components/FloatingContact'

// === Layout ===
const MainLayout = () => (
  <>
    <Header />
    {/* <FloatingContact /> */}
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </>
)

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  if (!PUBLISHABLE_KEY) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-6 max-w-md shadow-md text-center">
          <h2 className="text-xl font-bold mb-2">Configuration Required</h2>
          <p>Please define <code>VITE_CLERK_PUBLISHABLE_KEY</code> in your frontend <code>.env</code> file.</p>
        </div>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <Router>
        <AuthProvider>
          <CartProvider>
            <ScrollToTop />

            <Routes>
              {/* ======================== ADMIN ROUTES ======================== */}
              <Route path="/admin" element={<AdminRoute />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProductList />} />
                  <Route path="products/create" element={<AdminProductCreateEdit />} />
                  <Route path="products/edit/:id" element={<AdminProductCreateEdit />} />
                  <Route path="orders" element={<AdminOrderList />} />
                  <Route path="orders/:id" element={<AdminOrderDetails />} />
                  <Route path="users" element={<AdminUserList />} />
                  <Route path="cms" element={<AdminCMS />} />
                </Route>
              </Route>

              {/* ======================== PUBLIC + USER ROUTES ======================== */}
              <Route element={<MainLayout />}>
                {/* --- PUBLIC ROUTES --- */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                <Route path="/login/*" element={<LoginPage />} />
                <Route path="/signup/*" element={<SignUpPage />} />
                <Route path="/login/sso-callback" element={<AuthenticateWithRedirectCallback />} />
                <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback />} />

                {/* --- PROTECTED USER ROUTES --- */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/wishlist" element={<Wishlist />} />

                  <Route path="/profile" element={<UserProfileLayout />}>
                    <Route index element={<Overview />} />
                    <Route path="orders" element={<UserOrderList />} />
                    <Route path="orders/:id" element={<UserOrderDetails />} />
                    <Route path="edit" element={<EditProfileForm />} />
                    <Route path="addresses" element={<AddressManagement />} />
                  </Route>
                </Route>

                {/* --- 404 Page --- */}
                <Route
                  path="*"
                  element={
                    <h1 className="text-center text-2xl py-20 font-semibold text-gray-600">
                      404 - Page Not Found
                    </h1>
                  }
                />
              </Route>
            </Routes>

            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </CartProvider>
        </AuthProvider>
      </Router>
    </ClerkProvider>
  )
}

export default App
