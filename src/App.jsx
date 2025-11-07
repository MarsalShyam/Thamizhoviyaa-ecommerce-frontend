// // frontend/src/App.jsx
// import React from 'react'
// import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'

// // === Shared Layouts ===
// import Header from './components/Header'
// import Footer from './components/Footer'
// import ScrollToTop from './components/ScrollToTop'

// // === Context Providers ===
// import { AuthProvider } from './context/AuthContext'
// import { CartProvider } from './context/CartContext'

// // === Toastify Notifications ===
// import { ToastContainer } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'

// // === Public Pages ===
// import Home from './pages/Home'
// import About from './pages/About'
// import Products from './pages/Products'
// import ProductDetail from './pages/ProductDetail'
// import Contact from './pages/Contact'
// import Blog from './pages/Blog'
// import LoginPage from './pages/Login'

// // === User / Protected Pages ===
// import ProtectedRoute from './components/ProtectedRoute'
// import Cart from './pages/Cart'
// import Checkout from './pages/Checkout'
// import Wishlist from './pages/Wishlist'

// // === User Profile Related Pages ===
// // import UserProfile from './pages/User/UserProfile_old'
// import UserProfileLayout from './pages/User/UserProfileLayout'

// import UserOrderList from './pages/Users/UserOrderList'
// import UserOrderDetails from './pages/Users/UserOrderDetails'
// import Overview from './pages/User/UserProfile/Overview'
// import EditProfileForm from './pages/User/UserProfile/EditProfileForm'
// import AddressManagement from './pages/User/UserProfile/AddressManagement'

// // === Admin Pages ===
// import AdminRoute from './components/AdminRoute'
// import AdminLayout from './components/AdminLayout'
// import AdminDashboard from './pages/Admin/Dashboard'
// import AdminProductList from './pages/Admin/ProductList'
// import AdminProductCreateEdit from './pages/Admin/ProductCreateEdit'
// import AdminOrderList from './pages/Admin/AdminOrderList'
// import AdminOrderDetails from './pages/Admin/AdminOrderDetails'
// import AdminUserList from './pages/Admin/AdminUserList'




// // === MainLayout for Public + User Pages ===
// const MainLayout = () => (
//   <>
//     <Header />
//     <main className="flex-grow">
//       <Outlet />
//     </main>
//     <Footer />
//   </>
// )

// function App() {
//   return (
//     <AuthProvider>
//       <CartProvider>
//         <Router>
//           <ScrollToTop />

//           <Routes>
//             {/* ======================== ADMIN ROUTES ======================== */}
//             <Route path="/admin" element={<AdminRoute />}>
//               <Route element={<AdminLayout />}>
//                 <Route index element={<AdminDashboard />} />
//                 <Route path="products" element={<AdminProductList />} />
//                 <Route path="products/create" element={<AdminProductCreateEdit />} />
//                 <Route path="products/edit/:id" element={<AdminProductCreateEdit />} />
//                 <Route path="orders" element={<AdminOrderList />} />
//                 <Route path="orders/:id" element={<AdminOrderDetails />} />
//                 <Route path="users" element={<AdminUserList />} />
//                 <Route path="cms" element={<h1>Blog/CMS Management (To be built)</h1>} />
//               </Route>
//             </Route>

//             {/* ======================== PUBLIC + USER ROUTES ======================== */}
//             <Route element={<MainLayout />}>
//               {/* --- PUBLIC ROUTES --- */}
//               <Route path="/" element={<Home />} />
//               <Route path="/about" element={<About />} />
//               <Route path="/products" element={<Products />} />
//               <Route path="/products/:id" element={<ProductDetail />} />
//               <Route path="/contact" element={<Contact />} />
//               <Route path="/blog" element={<Blog />} />
//               <Route path="/login" element={<LoginPage />} />

//               {/* --- PROTECTED USER ROUTES --- */}
//               <Route element={<ProtectedRoute />}>
//                 {/* Cart / Checkout / Wishlist */}
//                 <Route path="/cart" element={<Cart />} />
//                 <Route path="/checkout" element={<Checkout />} />
//                 <Route path="/wishlist" element={<Wishlist />} />

//                 {/* --- User Profile Layout --- */}
//                 <Route path="/profile" element={<UserProfileLayout />}>
//                   <Route index element={<Overview/>} />
//                   {/* <Route path="orders" element={<UserOrderList />} /> */}
//                   <Route path="orders" element={<UserOrderList/>}/>
//                   {/* <Route path="orders/:id" element={<UserOrderDetails />} /> */}
//                   <Route path="orders/:id" element={<UserOrderDetails/>}/>
//                   {/* <Route path="edit" element={<EditProfileFor/>} /> */}
//                   <Route path="edit" element={<EditProfileForm/>}/>
//                   {/* <Route path="addresses" element={<AddressManagement />} /> */}
//                   <Route path="addresses" element={<AddressManagement/>}/>
//                 </Route>
//               </Route>

//               {/* --- 404 Page --- */}
//               <Route
//                 path="*"
//                 element={
//                   <h1 className="text-center text-2xl py-20 font-semibold text-gray-600">
//                     404 - Page Not Found
//                   </h1>
//                 }
//               />
//             </Route>
//           </Routes>

//           {/* === Global Toast Notifications === */}
//           <ToastContainer
//             position="top-right"
//             autoClose={3000}
//             hideProgressBar={false}
//             newestOnTop={false}
//             closeOnClick
//             rtl={false}
//             pauseOnFocusLoss
//             draggable
//             pauseOnHover
//             theme="light"
//           />
//         </Router>
//       </CartProvider>
//     </AuthProvider>
//   )
// }

// export default App







// frontend/src/App.jsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
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

// === Layout ===
const MainLayout = () => (
  <>
    <Header />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </>
)

function App() {
  return (
    <Router> {/* ✅ Router goes OUTSIDE the providers */}
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
                <Route path="cms" element={<h1>Blog/CMS Management (To be built)</h1>} />
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
              <Route path="/login" element={<LoginPage />} />

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
  )
}

export default App
