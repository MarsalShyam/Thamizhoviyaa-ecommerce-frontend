// // frontend/src/pages/User/UserOrderDetails.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { FiArrowLeft, FiShoppingBag, FiMapPin, FiCreditCard, FiTruck } from 'react-icons/fi';
// import LoadingSpinner from '../../components/LoadingSpinner';

// const UserOrderDetails = () => {
//   const { id } = useParams();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         setLoading(true);
//         const { data } = await axios.get(`/api/orders/${id}`);
//         setOrder(data);
//         setLoading(false);
//       } catch (error) {
//         const message = error.response?.data?.message || 'Failed to load order details.';
//         toast.error(message);
//         setLoading(false);
//       }
//     };
//     fetchOrder();
//   }, [id]);

//   if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;
//   if (!order) return <div className="min-h-screen flex items-center justify-center">Order not found.</div>;

//   return (
//     <div className="min-h-screen bg-gray-50 section-padding">
//       <div className="container-custom">
//         <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
//           {/* Header */}
//           <div className="flex items-center justify-between mb-8">
//             <Link to="/profile/orders" className="flex items-center text-primary-600 hover:text-primary-700">
//               <FiArrowLeft className="mr-2" /> Back to Orders
//             </Link>
//             <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
//               <FiShoppingBag className="w-7 h-7 text-primary-600" />
//               <span>Order Details</span>
//             </h1>
//           </div>

//           {/* Order Summary */}
//           <div className="grid md:grid-cols-3 gap-8">
//             <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-6 space-y-6">
//               <h2 className="text-xl font-semibold text-gray-900 border-b pb-3">Order Summary</h2>

//               <p><span className="font-medium">Order ID:</span> {order._id}</p>
//               <p><span className="font-medium">Placed on:</span> {new Date(order.createdAt).toLocaleString()}</p>

//               {/* Ordered Items */}
//               <div>
//                 <h3 className="text-lg font-semibold mb-4 border-b pb-2">Items</h3>
//                 <div className="space-y-4">
//                   {order.orderItems.map(item => (
//                     <div key={item.product} className="flex items-center justify-between border-b pb-3">
//                       <div className="flex items-center space-x-3">
//                         <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover" />
//                         <div>
//                           <p className="font-medium text-gray-800">{item.name}</p>
//                           <p className="text-sm text-gray-500">Qty: {item.qty}</p>
//                         </div>
//                       </div>
//                       <p className="text-gray-800 font-medium">₹{item.price.toFixed(2)}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Price Details */}
//               <div className="border-t pt-4 text-gray-800 space-y-1">
//                 <p><span className="font-medium">Items Total:</span> ₹{order.itemsPrice.toFixed(2)}</p>
//                 <p><span className="font-medium">Shipping:</span> ₹{order.shippingPrice.toFixed(2)}</p>
//                 <p><span className="font-medium">Tax:</span> ₹{order.taxPrice.toFixed(2)}</p>
//                 <p className="font-semibold text-lg border-t pt-2">Total: ₹{order.totalPrice.toFixed(2)}</p>
//               </div>
//             </div>

//             {/* Delivery & Payment Info */}
//             <div className="space-y-6">
//               <div className="bg-white rounded-xl shadow-lg p-6">
//                 <h3 className="text-xl font-semibold flex items-center mb-3">
//                   <FiMapPin className="mr-2 text-primary-600" /> Shipping Address
//                 </h3>
//                 <p className="text-gray-700">{order.shippingAddress.fullName}</p>
//                 <p className="text-gray-700">{order.shippingAddress.address}</p>
//                 <p className="text-gray-700">{order.shippingAddress.city} - {order.shippingAddress.postalCode}</p>
//                 <p className="text-gray-700">{order.shippingAddress.country}</p>
//               </div>

//               <div className="bg-white rounded-xl shadow-lg p-6">
//                 <h3 className="text-xl font-semibold flex items-center mb-3">
//                   <FiCreditCard className="mr-2 text-primary-600" /> Payment Info
//                 </h3>
//                 <p><span className="font-medium">Method:</span> {order.paymentMethod}</p>
//                 <p><span className="font-medium">Paid:</span> {order.isPaid ? 'Yes' : 'No'}</p>
//               </div>

//               <div className="bg-white rounded-xl shadow-lg p-6">
//                 <h3 className="text-xl font-semibold flex items-center mb-3">
//                   <FiTruck className="mr-2 text-primary-600" /> Delivery Status
//                 </h3>
//                 <p>{order.isDelivered ? (
//                   <span className="text-green-600 font-medium">Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</span>
//                 ) : (
//                   <span className="text-yellow-600 font-medium">Not Delivered</span>
//                 )}</p>
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default UserOrderDetails;



// frontend/src/pages/User/UserOrderDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiShoppingBag, FiMapPin, FiCreditCard, FiTruck } from 'react-icons/fi';

const STATUS_ORDER = ['Ordered', 'Packed', 'Shipped', 'Delivered'];

const ProgressBar = ({ status }) => {
  const activeIndex = Math.max(0, STATUS_ORDER.indexOf(status));
  return (
    <div className="w-full bg-white rounded-xl p-4 shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Order Progress</h3>
        <span className="text-sm text-gray-500">{status}</span>
      </div>

      <div className="flex items-center">
        {STATUS_ORDER.map((s, idx) => {
          const completed = idx <= activeIndex;
          return (
            <div key={s} className="flex-1 flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${completed ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                {idx + 1}
              </div>
              {idx !== STATUS_ORDER.length - 1 && (
                <div className={`flex-1 h-1 ${idx < activeIndex ? 'bg-primary-600' : 'bg-gray-200'}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 grid grid-cols-4 text-xs text-center text-gray-600">
        {STATUS_ORDER.map((s) => (
          <div key={s}>{s}</div>
        ))}
      </div>
    </div>
  );
};

const UserOrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/orders/${id}`);
        setOrder(data);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;
  if (!order) return <div className="min-h-screen flex items-center justify-center">Order not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 section-padding">
      <div className="container-custom">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <Link to="/profile/orders" className="text-primary-600 flex items-center gap-2"><FiArrowLeft /> Back to Orders</Link>
            <h1 className="text-2xl font-bold">Order #{order._id}</h1>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="font-semibold mb-3">Items</h2>
                <div className="space-y-3">
                  {order.orderItems.map((item) => (
                    <div key={item.product} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img src={item.image} alt={item.name} className="w-14 h-14 rounded object-cover" />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                        </div>
                      </div>
                      <div className="text-sm font-medium">₹{(item.qty * item.price).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 border-t pt-3 text-right">
                  <p className="text-sm">Items Total: ₹{order.itemsPrice?.toFixed(2) ?? '0.00'}</p>
                  <p className="text-sm">Shipping: ₹{order.shippingPrice?.toFixed(2) ?? '0.00'}</p>
                  <p className="text-sm">Tax: ₹{order.taxPrice?.toFixed(2) ?? '0.00'}</p>
                  <p className="font-semibold text-lg">Total: ₹{order.totalPrice?.toFixed(2) ?? '0.00'}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="font-semibold mb-3">Shipping Address</h2>
                <p className="text-sm">{order.shippingAddress?.fullName}</p>
                <p className="text-sm">{order.shippingAddress?.address}</p>
                <p className="text-sm">{order.shippingAddress?.city} - {order.shippingAddress?.postalCode}</p>
                <p className="text-sm">{order.shippingAddress?.country}</p>
                <p className="text-sm mt-2">Phone: {order.shippingAddress?.phone}</p>
              </div>
            </div>

            <div className="space-y-4">
              <ProgressBar status={order.status} />

              <div className="bg-white p-4 rounded-xl shadow">
                <h3 className="font-semibold mb-2">Payment</h3>
                <p className="text-sm">Method: {order.paymentMethod}</p>
                <p className="text-sm">Paid: {order.isPaid ? 'Yes' : 'No'}</p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow">
                <h3 className="font-semibold mb-2">Status History</h3>
                <div className="space-y-2 text-sm text-gray-700 max-h-48 overflow-auto">
                  {(order.statusHistory || []).slice().reverse().map((h, idx) => (
                    <div key={idx} className="border-b pb-2">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">{h.status}</div>
                          {h.note && <div className="text-xs text-gray-500">{h.note}</div>}
                        </div>
                        <div className="text-xs text-gray-500">{new Date(h.timestamp).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserOrderDetails;
