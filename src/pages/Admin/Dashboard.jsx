// // frontend/src/pages/Admin/Dashboard.jsx
// import React from 'react';
// import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiLogOut } from 'react-icons/fi';
// import { Link, Outlet, useLocation } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { motion } from 'framer-motion';


// const Dashboard = () => {
//     const { logout, user } = useAuth();
//     const location = useLocation();
    
//     const navItems = [
//         { name: 'Dashboard', path: '/admin', icon: FiGrid },
//         { name: 'Products', path: '/admin/products', icon: FiPackage },
//         { name: 'Orders', path: '/admin/orders', icon: FiShoppingBag },
//         { name: 'Users', path: '/admin/users', icon: FiUsers },
//     ];

//     return (
//         <div className="min-h-screen flex bg-gray-100">
//             {/* Sidebar */}
//             {/* <div className="w-64 bg-primary-700 text-white flex flex-col p-4 shadow-xl">
//                 <div className="text-2xl font-bold mb-8 p-2">Admin Panel</div>
//                 <nav className="flex-grow space-y-2">
//                     {navItems.map((item) => (
//                         <Link
//                             key={item.name}
//                             to={item.path}
//                             className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
//                                 location.pathname === item.path 
//                                     ? 'bg-primary-600 text-accent-400 font-semibold' 
//                                     : 'hover:bg-primary-600/50'
//                             }`}
//                         >
//                             <item.icon className="w-5 h-5" />
//                             <span>{item.name}</span>
//                         </Link>
//                     ))}
//                 </nav>
//                 <div className="border-t border-primary-600 pt-4">
//                     <p className="text-sm text-primary-200 mb-2">Logged in as: {user?.name}</p>
//                     <button
//                         onClick={logout}
//                         className="w-full flex items-center justify-center space-x-2 p-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
//                     >
//                         <FiLogOut className="w-5 h-5" />
//                         <span>Logout</span>
//                     </button>
//                 </div>
//             </div> */}

//             {/* Content Area */}
//             <div className="flex-1 p-8 overflow-y-auto">
//                 {location.pathname === '/admin' ? (
//                     <motion.div initial={{opacity: 0}} animate={{opacity: 1}}>
//                         <h1 className="text-4xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
//                         <p className="text-gray-600">Welcome to the Admin Dashboard. Use the sidebar to manage your store's content, orders, and users.</p>
//                         {/* Summary Cards would go here (e.g., total sales, new orders) */}
//                     </motion.div>
//                 ) : (
//                     <Outlet /> // Renders child routes (e.g., ProductList, OrderList)
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Dashboard;
// frontend/src/pages/Admin/Dashboard.jsx
import React from "react";
import { motion } from "framer-motion";

const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Dashboard Overview
      </h1>

      <p className="text-gray-600 mb-6">
        Welcome to the Admin Dashboard. Use the sidebar to manage products,
        orders, users, and more.
      </p>

      {/* Example Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white shadow rounded-xl">
          <h2 className="text-xl font-semibold mb-2">Total Products</h2>
          <p className="text-3xl font-bold">148</p>
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <h2 className="text-xl font-semibold mb-2">New Orders</h2>
          <p className="text-3xl font-bold">26</p>
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <h2 className="text-xl font-semibold mb-2">Total Customers</h2>
          <p className="text-3xl font-bold">532</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
