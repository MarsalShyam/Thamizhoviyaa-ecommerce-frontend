
// // frontend/src/pages/Checkout.jsx
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import {
//   FiArrowLeft, FiCreditCard, FiCheckCircle,
//   FiShoppingBag, FiPlus, FiMinus, FiTrash2
// } from 'react-icons/fi';
// import { useCart } from '../context/CartContext';
// import { useAuth } from '../context/AuthContext';
// import axios from 'axios';

// const loadRazorpayScript = (src) =>
//   new Promise((resolve) => {
//     const script = document.createElement('script');
//     script.src = src;
//     script.onload = () => resolve(true);
//     script.onerror = () => resolve(false);
//     document.body.appendChild(script);
//   });

// const Checkout = () => {
//   const {
//     cart,
//     fetchCart,
//     checkoutItems,
//     startCartCheckout,
//     clearCheckoutItems,
//     updateCheckoutQuantity,
//     removeFromCheckout,
//     getCheckoutTotal,
//   } = useCart();

//   const { user, isLoading: authLoading } = useAuth();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(false);
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [newAddress, setNewAddress] = useState({ name: '', phone: '', email: '', address: '', city: '', pincode: '' });
//   const [paymentMethod, setPaymentMethod] = useState('cod');

//   // initialize checkoutItems when arriving from cart or when sessionStorage has items
//   useEffect(() => {
//     // If checkout is empty but cart has items -> use cart
//     if ((!checkoutItems || checkoutItems.length === 0) && cart && cart.length > 0) {
//       startCartCheckout(); // uses cart from context
//     }
//     // If there is persisted checkout in sessionStorage it was loaded by context on mount already
//     // We intentionally do not include checkoutItems as dependency to avoid re-trigger loops
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [cart, authLoading]);

//   // default address
//   useEffect(() => {
//     if (user && user.addresses?.length > 0) {
//       setSelectedAddress(user.addresses.find(a => a.isDefault) || user.addresses[0]);
//     }
//   }, [user]);

//   const validateAddress = (addr) => {
//     if (!addr) return false;
//     return !!(addr.name && addr.phone && addr.address && addr.city && addr.pincode);
//   };

//   const changeQty = (item, delta) => {
//     const newQty = Math.max(1, (item.quantity || 1) + delta);
//     if (item.countInStock && newQty > item.countInStock) return;
//     updateCheckoutQuantity(item.product || item._id, newQty);
//   };

//   const handleRemove = (item) => {
//     removeFromCheckout(item.product || item._id);
//   };

//   const placeOrderOnServer = async (paymentDetails = {}) => {
//     setLoading(true);
//     const addressToUse = selectedAddress || newAddress;
//     if (!validateAddress(addressToUse)) {
//       alert('Please fill in shipping details.');
//       setLoading(false);
//       return;
//     }

//     const orderItems = (checkoutItems || []).map(item => ({
//       name: item.name,
//       qty: item.quantity,
//       image: item.image,
//       price: item.price,
//       product: item.product || item._id
//     }));

//     if (orderItems.length === 0) {
//       alert('No items selected for checkout.');
//       setLoading(false);
//       return;
//     }

//     try {
//       const { data } = await axios.post('/api/orders', {
//         orderItems,
//         shippingAddress: addressToUse,
//         paymentMethod,
//         totalPrice: getCheckoutTotal(),
//         taxPrice: 0,
//         shippingPrice: 0,
//         paymentResult: paymentDetails.id ? {
//           id: paymentDetails.id,
//           status: 'paid',
//           update_time: new Date().toISOString(),
//           email_address: user?.email,
//         } : undefined,
//       });

//       // sync server cart and clear checkout UI
//       try { await fetchCart(); } catch {}
//       clearCheckoutItems();
//       alert(`Order placed successfully! Order ID: ${data._id}`);
//       navigate('/profile/orders');
//     } catch (err) {
//       alert(`Order Failed: ${err.response?.data?.message || err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const displayRazorpay = async () => {
//     setLoading(true);
//     const loaded = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
//     if (!loaded) {
//       alert('Razorpay SDK failed to load. Check network.');
//       setLoading(false);
//       return;
//     }

//     try {
//       const resp = await axios.post('/api/orders/razorpay/create-order', { totalPrice: getCheckoutTotal() });
//       const { id: order_id, amount, currency } = resp.data;

//       const options = {
//         key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//         amount,
//         currency,
//         name: "THAMIZHOVIYAA",
//         description: "E-Commerce Purchase",
//         order_id,
//         handler: async function (response) {
//           try {
//             const verifyResp = await axios.post('/api/orders/razorpay/verify', {
//               order_id: response.razorpay_order_id,
//               payment_id: response.razorpay_payment_id,
//               signature: response.razorpay_signature,
//             });
//             if (verifyResp.data.success) {
//               await placeOrderOnServer({ id: response.razorpay_payment_id });
//             } else {
//               alert('Payment verification failed.');
//             }
//           } catch (e) {
//             alert('Payment verification failed.');
//           }
//         },
//         prefill: {
//           name: user?.name || newAddress.name,
//           email: user?.email || newAddress.email,
//           contact: selectedAddress ? selectedAddress.phone : newAddress.phone,
//         },
//         theme: { color: '#234823' },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (err) {
//       alert('Failed to initialize payment. Try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e?.preventDefault?.();
//     if (paymentMethod === 'razorpay') {
//       await displayRazorpay();
//     } else {
//       await placeOrderOnServer();
//     }
//   };

//   const handleAddressChange = (e) => {
//     const value = e.target.value;
//     if (value === 'new') setSelectedAddress(null);
//     else setSelectedAddress(user.addresses.find(addr => addr._id === value));
//   };

//   if (!checkoutItems || checkoutItems.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 section-padding">
//         <div className="container-custom">
//           <div className="text-center py-16">
//             <FiShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
//             <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
//             <p className="text-gray-600 mb-8">Add some products to proceed to checkout</p>
//             <Link to="/products" className="btn-primary">Continue Shopping</Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 section-padding">
//       <div className="container-custom">
//         <Link to="/cart" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
//           <FiArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
//         </Link>

//         <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

//         <div className="grid lg:grid-cols-2 gap-8">
//           {/* LEFT: Shipping & Payment */}
//           <motion.form initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
//             <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>

//             {user?.addresses?.length > 0 && (
//               <div className="mb-6">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Choose Saved Address</label>
//                 <select onChange={handleAddressChange} value={selectedAddress?._id || 'new'} className="w-full border border-gray-300 rounded-lg px-3 py-2">
//                   {user.addresses.map(addr => (
//                     <option key={addr._id} value={addr._id}>
//                       {addr.name} - {addr.address}, {addr.pincode} {addr.isDefault && '(Default)'}
//                     </option>
//                   ))}
//                   <option value="new">Create a New Address</option>
//                 </select>
//               </div>
//             )}

//             {(!user?.addresses?.length || !selectedAddress) && (
//               <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
//                 <h3 className="text-lg font-semibold text-gray-800">New Address Details</h3>
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <input type="text" placeholder="Full Name" value={newAddress.name} onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })} required className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
//                   <input type="tel" placeholder="Phone" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} required className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
//                 </div>
//                 <input type="email" placeholder="Email" value={newAddress.email} onChange={(e) => setNewAddress({ ...newAddress, email: e.target.value })} required className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
//                 <textarea placeholder="Address" rows="2" value={newAddress.address} onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })} required className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-vertical" />
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <input type="text" placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} required className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
//                   <input type="text" placeholder="Pincode" value={newAddress.pincode} onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} required className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
//                 </div>
//               </div>
//             )}

//             <div className="mt-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
//               <div className="space-y-3">
//                 <label className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer ${paymentMethod === 'razorpay' ? 'border-primary-600 bg-primary-50' : 'border-gray-300'}`}>
//                   <input type="radio" name="paymentMethod" value="razorpay" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} className="text-primary-600" />
//                   <FiCreditCard className="w-5 h-5 text-primary-600" />
//                   <span>Pay Online (Razorpay)</span>
//                 </label>

//                 <label className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer ${paymentMethod === 'cod' ? 'border-primary-600 bg-primary-50' : 'border-gray-300'}`}>
//                   <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="text-primary-600" />
//                   <FiCheckCircle className="w-5 h-5 text-green-600" />
//                   <span>Cash on Delivery (COD)</span>
//                 </label>
//               </div>
//             </div>
//           </motion.form>

//           {/* RIGHT: Order Summary */}
//           <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
//             <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

//             <div className="space-y-4 mb-6">
//               {(checkoutItems || []).map(item => (
//                 <div key={item.product || item._id} className="flex items-center space-x-4 py-3 border-b border-gray-100">
//                   <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
//                   <div className="flex-1">
//                     <h4 className="font-medium text-gray-900">{item.name}</h4>
//                     <p className="text-sm text-gray-600">Size: {item.size}</p>
//                     <p className="text-sm text-gray-600">₹{item.price}</p>
//                   </div>

//                   <div className="flex items-center space-x-2">
//                     <button type="button" onClick={() => changeQty(item, -1)} className="p-2 rounded-full hover:bg-gray-100"><FiMinus className="w-4 h-4" /></button>
//                     <span className="w-8 text-center">{item.quantity}</span>
//                     <button type="button" onClick={() => changeQty(item, +1)} className="p-2 rounded-full hover:bg-gray-100"><FiPlus className="w-4 h-4" /></button>
//                     <button type="button" onClick={() => handleRemove(item)} className="p-2 text-red-600 hover:bg-red-50 rounded-full"><FiTrash2 className="w-4 h-4" /></button>
//                   </div>

//                   <span className="font-semibold text-primary-600">₹{(item.price || 0) * (item.quantity || 0)}</span>
//                 </div>
//               ))}
//             </div>

//             <div className="space-y-3 border-t border-gray-200 pt-4">
//               <div className="flex justify-between"><span>Subtotal</span><span>₹{getCheckoutTotal()}</span></div>
//               <div className="flex justify-between"><span>Shipping</span><span className="text-green-600">Free</span></div>
//               <div className="flex justify-between text-lg font-semibold border-t pt-3"><span>Total</span><span>₹{getCheckoutTotal()}</span></div>
//             </div>

//             <button type="button" onClick={handleSubmit} disabled={loading || (checkoutItems || []).length === 0} className="w-full bg-accent-400 hover:bg-accent-500 text-white py-4 rounded-lg font-semibold text-lg mt-6 disabled:opacity-50">
//               {loading ? 'Processing...' : paymentMethod === 'cod' ? 'Place Order (COD)' : `Pay ₹${getCheckoutTotal()}`}
//             </button>

//             <p className="text-sm text-gray-500 text-center mt-4">By placing your order, you agree to our terms and conditions</p>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;



// frontend/src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCreditCard, FiCheckCircle, FiShoppingBag, FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// --- Razorpay Script Loader ---
const loadRazorpayScript = (src) =>
  new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

// --- Dynamic Shipping Charge Logic ---
const calculateShippingCharge = (pincode, total) => {
  if (!pincode) return 0;
  if (total >= 1000) return 0; // Free above ₹1000

  const prefix = String(pincode).slice(0, 3);
  if (prefix === '637') return 50; // Local
  if (/^(60|61|62|63|64)/.test(prefix)) return 80; // Tamil Nadu
  return 100; // National
};

const Checkout = () => {
  const {
    cart,
    fetchCart,
    checkoutItems,
    startCartCheckout,
    clearCheckoutItems,
    updateCheckoutQuantity,
    removeFromCheckout,
    getCheckoutTotal,
  } = useCart();

  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({ name: '', phone: '', email: '', address: '', city: '', pincode: '' });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [shippingCharge, setShippingCharge] = useState(0);

  // Load cart if empty
  useEffect(() => {
    if ((!checkoutItems || checkoutItems.length === 0) && cart && cart.length > 0) startCartCheckout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart, authLoading]);

  // Default Address
  useEffect(() => {
    if (user && user.addresses?.length > 0) {
      setSelectedAddress(user.addresses.find((a) => a.isDefault) || user.addresses[0]);
    }
  }, [user]);

  // Update shipping charge whenever subtotal/pincode changes
  useEffect(() => {
    const pincode = selectedAddress?.pincode || newAddress.pincode;
    const subtotal = getCheckoutTotal();
    setShippingCharge(calculateShippingCharge(pincode, subtotal));
  }, [selectedAddress, newAddress.pincode, checkoutItems]);

  // --- Validation ---
  const validateAddress = (addr) => !!(addr && addr.name && addr.phone && addr.address && addr.city && addr.pincode);

  const changeQty = (item, delta) => {
    const newQty = Math.max(1, (item.quantity || 1) + delta);
    if (item.countInStock && newQty > item.countInStock) return;
    updateCheckoutQuantity(item.product || item._id, newQty);
  };

  const handleRemove = (item) => removeFromCheckout(item.product || item._id);

  // --- Place Order ---
  const placeOrderOnServer = async (paymentDetails = {}) => {
    const addressToUse = selectedAddress || newAddress;
    if (!validateAddress(addressToUse)) {
      alert('Please fill in shipping details before placing order.');
      return;
    }

    setLoading(true);
    const orderItems = (checkoutItems || []).map((item) => ({
      name: item.name,
      qty: item.quantity,
      image: item.image,
      price: item.price,
      product: item.product || item._id,
    }));

    if (orderItems.length === 0) {
      alert('No items selected for checkout.');
      setLoading(false);
      return;
    }

    const subtotal = getCheckoutTotal();
    const totalPrice = subtotal + shippingCharge;

    try {
      const { data } = await axios.post('/api/orders', {
        orderItems,
        shippingAddress: addressToUse,
        paymentMethod,
        totalPrice,
        taxPrice: 0,
        shippingPrice: shippingCharge,
        paymentResult: paymentDetails.id
          ? {
              id: paymentDetails.id,
              status: 'paid',
              update_time: new Date().toISOString(),
              email_address: user?.email,
            }
          : undefined,
      });

      await fetchCart();
      clearCheckoutItems();
      alert(`Order placed successfully! Order ID: ${data._id}`);
      navigate('/profile/orders');
    } catch (err) {
      alert(`Order Failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // --- Razorpay Flow (with validation before payment) ---
  const displayRazorpay = async () => {
    const addressToUse = selectedAddress || newAddress;
    if (!validateAddress(addressToUse)) {
      alert('Please fill in shipping details before payment.');
      return;
    }

    setLoading(true);
    const loaded = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!loaded) {
      alert('Razorpay SDK failed to load. Check network.');
      setLoading(false);
      return;
    }

    try {
      const subtotal = getCheckoutTotal();
      const totalWithShipping = subtotal + shippingCharge;
      const resp = await axios.post('/api/orders/razorpay/create-order', { totalPrice: totalWithShipping });
      const { id: order_id, amount, currency } = resp.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: 'THAMIZHOVIYAA',
        description: 'E-Commerce Purchase',
        order_id,
        handler: async function (response) {
          try {
            const verifyResp = await axios.post('/api/orders/razorpay/verify', {
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            if (verifyResp.data.success) {
              await placeOrderOnServer({ id: response.razorpay_payment_id });
            } else alert('Payment verification failed.');
          } catch {
            alert('Payment verification failed.');
          }
        },
        prefill: {
          name: user?.name || newAddress.name,
          email: user?.email || newAddress.email,
          contact: addressToUse.phone,
        },
        theme: { color: '#234823' },
      };

      new window.Razorpay(options).open();
    } catch {
      alert('Failed to initialize payment. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    const addressToUse = selectedAddress || newAddress;
    if (!validateAddress(addressToUse)) {
      alert('Please fill in shipping details before placing order.');
      return;
    }
    if (paymentMethod === 'razorpay') await displayRazorpay();
    else await placeOrderOnServer();
  };

  const handleAddressChange = (e) => {
    const value = e.target.value;
    if (value === 'new') setSelectedAddress(null);
    else setSelectedAddress(user.addresses.find((addr) => addr._id === value));
  };

  if (!checkoutItems || checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 section-padding">
        <div className="container-custom">
          <div className="text-center py-16">
            <FiShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some products to proceed to checkout</p>
            <Link to="/products" className="btn-primary">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = getCheckoutTotal();
  const totalWithShipping = subtotal + shippingCharge;
  const addressValid = validateAddress(selectedAddress || newAddress);

  return (
    <div className="min-h-screen bg-gray-50 section-padding">
      <div className="container-custom">
        <Link to="/cart" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
          <FiArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* LEFT SIDE (Address + Payment Method) */}
          <motion.form initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>

            {user?.addresses?.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Choose Saved Address</label>
                <select onChange={handleAddressChange} value={selectedAddress?._id || 'new'} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  {user.addresses.map((addr) => (
                    <option key={addr._id} value={addr._id}>
                      {addr.name} - {addr.address}, {addr.pincode} {addr.isDefault && '(Default)'}
                    </option>
                  ))}
                  <option value="new">Create a New Address</option>
                </select>
              </div>
            )}

            {(!user?.addresses?.length || !selectedAddress) && (
              <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800">New Address Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Full Name" value={newAddress.name} onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })} required className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                  <input type="tel" placeholder="Phone" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} required className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                </div>
                <input type="email" placeholder="Email" value={newAddress.email} onChange={(e) => setNewAddress({ ...newAddress, email: e.target.value })} required className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                <textarea placeholder="Address" rows="2" value={newAddress.address} onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })} required className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-vertical" />
                <div className="grid md:grid-cols-2 gap-4">
                  <input type="text" placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} required className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                  <input type="text" placeholder="Pincode" value={newAddress.pincode} onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} required className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                </div>
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
              <div className="space-y-3">
                <label className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer ${paymentMethod === 'razorpay' ? 'border-primary-600 bg-primary-50' : 'border-gray-300'}`}>
                  <input type="radio" name="paymentMethod" value="razorpay" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} className="text-primary-600" />
                  <FiCreditCard className="w-5 h-5 text-primary-600" />
                  <span>Pay Online (Razorpay)</span>
                </label>
                <label className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer ${paymentMethod === 'cod' ? 'border-primary-600 bg-primary-50' : 'border-gray-300'}`}>
                  <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="text-primary-600" />
                  <FiCheckCircle className="w-5 h-5 text-green-600" />
                  <span>Cash on Delivery (COD)</span>
                </label>
              </div>
            </div>
          </motion.form>

          {/* RIGHT: Order Summary */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {(checkoutItems || []).map((item) => (
                <div key={item.product || item._id} className="flex items-center space-x-4 py-3 border-b border-gray-100">
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">Size: {item.size}</p>
                    <p className="text-sm text-gray-600">₹{item.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button type="button" onClick={() => changeQty(item, -1)} className="p-2 rounded-full hover:bg-gray-100"><FiMinus className="w-4 h-4" /></button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button type="button" onClick={() => changeQty(item, +1)} className="p-2 rounded-full hover:bg-gray-100"><FiPlus className="w-4 h-4" /></button>
                    <button type="button" onClick={() => handleRemove(item)} className="p-2 text-red-600 hover:bg-red-50 rounded-full"><FiTrash2 className="w-4 h-4" /></button>
                  </div>
                  <span className="font-semibold text-primary-600">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
              <div className="flex justify-between"><span>Shipping</span>
                <span className={shippingCharge === 0 ? 'text-green-600' : ''}>{shippingCharge === 0 ? 'Free' : `₹${shippingCharge}`}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t pt-3"><span>Total</span><span>₹{totalWithShipping}</span></div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!addressValid || loading || (checkoutItems || []).length === 0}
              className={`w-full ${!addressValid ? 'opacity-50 cursor-not-allowed' : 'bg-accent-400 hover:bg-accent-500'} text-white py-4 rounded-lg font-semibold text-lg mt-6 transition-all duration-200`}
            >
              {loading ? 'Processing...' : paymentMethod === 'cod' ? 'Place Order (COD)' : `Pay ₹${totalWithShipping}`}
            </button>

            {!addressValid && (
              <p className="text-red-500 text-sm text-center mt-2">
                ⚠️ Please fill address and pincode before proceeding
              </p>
            )}

            <p className="text-sm text-gray-500 text-center mt-4">By placing your order, you agree to our terms and conditions</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
