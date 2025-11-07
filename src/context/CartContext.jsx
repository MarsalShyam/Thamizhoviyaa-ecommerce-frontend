// // frontend/src/context/CartContext.jsx (REVISED)
// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import { useAuth } from './AuthContext'; // Import useAuth

// const CartContext = createContext();

// export const useCart = () => useContext(CartContext);

// export const CartProvider = ({ children }) => {
//   const { user, isAuthenticated, isLoading: authLoading, token } = useAuth();
//   const [cart, setCart] = useState([]);
//   const [wishlist, setWishlist] = useState([]);
//   const [cartCount, setCartCount] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);
//   const [checkoutItems, setCheckoutItems] = useState([]);

//   // --- Utility Functions for Cart/Wishlist Data Fetching ---

//   const fetchCart = useCallback(async () => {
//     if (!isAuthenticated) {
//       setCart([]);
//       setCartCount(0);
//       return;
//     }
//     try {
//       const { data } = await axios.get('/api/users/cart');
//       setCart(data.cart);
//       setCartCount(data.cart.reduce((total, item) => total + item.quantity, 0));
//     } catch (error) {
//       console.error('Failed to fetch cart:', error);
//       setCart([]);
//       setCartCount(0);
//     }
//   }, [isAuthenticated]);

//   const fetchWishlist = useCallback(async () => {
//     if (!isAuthenticated) {
//       setWishlist([]);
//       return;
//     }
//     try {
//       const { data } = await axios.get('/api/users/wishlist');
//       setWishlist(data.wishlist);
//     } catch (error) {
//       console.error('Failed to fetch wishlist:', error);
//       setWishlist([]);
//     }
//   }, [isAuthenticated]);

//   // --- useEffect to sync on authentication change ---
//   useEffect(() => {
//     if (!authLoading) {
//       setIsLoading(true);
//       if (isAuthenticated) {
//         fetchCart();
//         fetchWishlist();
//       } else {
//         setCart([]);
//         setWishlist([]);
//       }
//       setIsLoading(false);
//     }
//   }, [isAuthenticated, authLoading, fetchCart, fetchWishlist]);


//   // --- API Interaction Functions (REPLACING LOCAL STORAGE) ---

//   const addToCart = async (product, quantity = 1) => {
//     if (!isAuthenticated) {
//       alert('Please sign in to add items to your cart.');
//       // Optionally redirect to signin page
//       return;
//     }
//     try {
//       const { data } = await axios.post('/api/users/cart', { 
//         productId: product._id, 
//         quantity 
//       });
//       setCart(data.cart);
//       setCartCount(data.cart.reduce((total, item) => total + item.quantity, 0));
//       // Add toast notification later
//     } catch (error) {
//       alert(error.response?.data?.message || 'Failed to add to cart.');
//     }
//   };

//   const removeFromCart = async (productId) => {
//     if (!isAuthenticated) return;
//     try {
//       const { data } = await axios.delete(`/api/users/cart/${productId}`);
//       setCart(data.cart);
//       setCartCount(data.cart.reduce((total, item) => total + item.quantity, 0));
//     } catch (error) {
//       alert(error.response?.data?.message || 'Failed to remove from cart.');
//     }
//   };

//   const updateQuantity = async (productId, quantity) => {
//     if (!isAuthenticated) return;
//     try {
//       const { data } = await axios.put(`/api/users/cart/${productId}`, { quantity });
//       setCart(data.cart);
//       setCartCount(data.cart.reduce((total, item) => total + item.quantity, 0));
//     } catch (error) {
//       alert(error.response?.data?.message || 'Failed to update quantity.');
//     }
//   };
  
//   const toggleWishlist = async (product) => {
//     if (!isAuthenticated) {
//       alert('Please sign in to manage your wishlist.');
//       return;
//     }
//     try {
//         const isCurrentlyInWishlist = wishlist.some(item => item._id === product._id);
//         const method = isCurrentlyInWishlist ? 'DELETE' : 'POST';
//         const url = `/api/users/wishlist/${product._id}`;

//         const { data } = await axios({ method, url });
//         setWishlist(data.wishlist);
//         // Add toast notification later
//     } catch (error) {
//         alert(error.response?.data?.message || 'Failed to update wishlist.');
//     }
//   };

//   const isInWishlist = (productId) => {
//     // Check local state for quick UI updates
//     return wishlist.some(item => item._id === productId); 
//   };
  
//   const getCartTotal = () => {
//     return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
//   };

//    // Start a checkout flow using a single product (Buy Now)
//   const startBuyNow = (product, qty = 1) => {
//     // Ensure we store minimal required fields for order
//     setCheckoutItems([{ 
//       product: product._id,
//       _id: product._id, // for UI keys
//       name: product.name,
//       image: (product.images && product.images[0]) || product.image,
//       price: product.price,
//       quantity: Math.max(1, qty),
//       countInStock: product.countInStock || 0,
//       size: product.size || ''
//     }]);
//   };

//    // Start a checkout flow using current cart (Cart -> Checkout)
//   const startCartCheckout = () => {
//     // copy cart -> checkoutItems (shallow copy) so checkout editing doesn't instantly mutate cart
//     const items = cart.map(i => ({
//       product: i.product || i._id || i.productId, // whichever shape your cart item uses
//       _id: i._id || i.product, // for react keys
//       name: i.name,
//       image: i.image,
//       price: i.price,
//       quantity: i.quantity,
//       countInStock: i.countInStock || i.countInStock === 0 ? i.countInStock : (i.productData?.countInStock || 0),
//       size: i.size || ''
//     }));
//     setCheckoutItems(items);
//   };

//   const clearCheckoutItems = () => setCheckoutItems([]);

//   // Update quantity locally in checkout (does not update server cart unless you call updateQuantity separately)
//   const updateCheckoutQuantity = (productId, qty) => {
//     setCheckoutItems(prev => prev.map(it => it.product === productId || it._id === productId ? { ...it, quantity: Math.max(1, qty) } : it));
//   };

//   // Remove item locally from checkout
//   const removeFromCheckout = (productId) => {
//     setCheckoutItems(prev => prev.filter(it => !(it.product === productId || it._id === productId)));
//   };

//   const getCheckoutTotal = () => {
//     return checkoutItems.reduce((total, item) => total + (item.price * item.quantity), 0);
//   };

//   const value = {
//     cart,
//     wishlist,
//     cartCount,
//     isLoading: isLoading || authLoading,
//     addToCart,
//     removeFromCart,
//     updateQuantity,
//     toggleWishlist,
//     isInWishlist,
//     getCartTotal,
//     fetchCart,
//     fetchWishlist,

//     // new checkout helpers
//     startBuyNow,
//     startCartCheckout,
//     clearCheckoutItems,
//     updateCheckoutQuantity,
//     removeFromCheckout,
//     getCheckoutTotal,
//   };

//   return (
//     <CartContext.Provider value={value}>
//       {children}
//     </CartContext.Provider>
//   );
// };


// frontend/src/context/CartContext.jsx
// frontend/src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutItems, setCheckoutItems] = useState([]);

  // persist helper for checkoutItems (session scope)
  const persistCheckout = (items) => {
    try {
      if (items && items.length > 0) sessionStorage.setItem('checkoutItems', JSON.stringify(items));
      else sessionStorage.removeItem('checkoutItems');
    } catch (e) {
      console.warn('persistCheckout failed', e);
    }
  };

  // load checkout items from sessionStorage once at mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('checkoutItems');
      if (stored) setCheckoutItems(JSON.parse(stored));
    } catch (e) {
      console.error('Failed to parse checkoutItems', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // persist checkout items on change
  useEffect(() => {
    persistCheckout(checkoutItems);
  }, [checkoutItems]);

  // initialize cart & wishlist when auth state stabilizes
  useEffect(() => {
    if (authLoading) return;

    const init = async () => {
      if (!isAuthenticated) {
        setCart([]);
        setWishlist([]);
        setCartCount(0);
        setIsLoading(false);
        return;
      }

      try {
        const [cartRes, wishRes] = await Promise.allSettled([
          axios.get('/api/users/cart'),
          axios.get('/api/users/wishlist'),
        ]);

        if (cartRes.status === 'fulfilled') {
          const c = cartRes.value.data.cart || [];
          setCart(c);
          setCartCount(c.reduce((t, i) => t + (i.quantity || 0), 0));
        } else {
          setCart([]);
          setCartCount(0);
        }

        if (wishRes.status === 'fulfilled') {
          setWishlist(wishRes.value.data.wishlist || []);
        } else {
          setWishlist([]);
        }
      } catch (err) {
        console.error('init cart/wishlist error', err);
        setCart([]);
        setWishlist([]);
        setCartCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [isAuthenticated, authLoading]);

  // totals
  const getCartTotal = () =>
    cart.reduce((t, i) => t + (i.price || 0) * (i.quantity || 0), 0);

  const getCheckoutTotal = () =>
    (checkoutItems || []).reduce((t, i) => t + (i.price || 0) * (i.quantity || 0), 0);

  // fetch cart (server)
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart([]);
      setCartCount(0);
      return;
    }
    try {
      const { data } = await axios.get('/api/users/cart');
      const c = data.cart || [];
      setCart(c);
      setCartCount(c.reduce((t, i) => t + (i.quantity || 0), 0));
    } catch (err) {
      console.error('fetchCart error', err);
      setCart([]);
      setCartCount(0);
    }
  }, [isAuthenticated]);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }
    try {
      const { data } = await axios.get('/api/users/wishlist');
      setWishlist(data.wishlist || []);
    } catch (err) {
      console.error('fetchWishlist error', err);
      setWishlist([]);
    }
  }, [isAuthenticated]);

  // cart actions
  const addToCart = async (product, quantity = 1) => {
    if (!isAuthenticated) {
      alert('Please sign in to add items to your cart.');
      return;
    }
    try {
      const { data } = await axios.post('/api/users/cart', { productId: product._id, quantity });
      setCart(data.cart || []);
      setCartCount((data.cart || []).reduce((t, i) => t + (i.quantity || 0), 0));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add to cart.');
    }
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return;
    try {
      const { data } = await axios.delete(`/api/users/cart/${productId}`);
      setCart(data.cart || []);
      setCartCount((data.cart || []).reduce((t, i) => t + (i.quantity || 0), 0));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove from cart.');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!isAuthenticated) return;
    try {
      const { data } = await axios.put(`/api/users/cart/${productId}`, { quantity });
      setCart(data.cart || []);
      setCartCount((data.cart || []).reduce((t, i) => t + (i.quantity || 0), 0));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update quantity.');
    }
  };

  // wishlist
  const toggleWishlist = async (product) => {
    if (!isAuthenticated) {
      alert('Please sign in to manage your wishlist.');
      return;
    }
    try {
      const exists = wishlist.some(i => i._id === product._id);
      const method = exists ? 'DELETE' : 'POST';
      const url = `/api/users/wishlist/${product._id}`;
      const { data } = await axios({ method, url });
      setWishlist(data.wishlist || []);
    } catch (err) {
      alert(err.response?.data?.message || 'Wishlist update failed.');
    }
  };

  const isInWishlist = (productId) => wishlist.some(i => i._id === productId);

  // checkout helpers
  // Start Buy Now (single product checkout)
  const startBuyNow = (product, qty = 1) => {
    const item = {
      product: product._id,
      _id: product._id,
      name: product.name,
      image: (product.images && product.images[0]) || product.image,
      price: product.price,
      quantity: Math.max(1, qty),
      countInStock: product.countInStock || 0,
      size: product.size || '',
    };
    const arr = [item];
    setCheckoutItems(arr);
    persistCheckout(arr);
  };

  // Start checkout from cart; optional override param accepted for flexibility
  const startCartCheckout = (itemsOverride) => {
    const source = itemsOverride || cart;
    const items = (source || []).map(i => ({
      product: i.product || i._id || i.productId,
      _id: i._id || i.product || i.productId,
      name: i.name,
      image: i.image,
      price: i.price,
      quantity: i.quantity,
      countInStock: i.countInStock || 0,
      size: i.size || '',
    }));
    setCheckoutItems(items);
    persistCheckout(items);
  };

  const clearCheckoutItems = () => {
    setCheckoutItems([]);
    try { sessionStorage.removeItem('checkoutItems'); } catch {}
  };

  const updateCheckoutQuantity = (productId, qty) =>
    setCheckoutItems(prev => prev.map(it =>
      (it.product === productId || it._id === productId)
        ? { ...it, quantity: Math.max(1, qty) }
        : it
    ));

  const removeFromCheckout = (productId) =>
    setCheckoutItems(prev => prev.filter(it => !(it.product === productId || it._id === productId)));

  const value = {
    cart,
    wishlist,
    cartCount,
    checkoutItems,
    isLoading: isLoading || authLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    toggleWishlist,
    isInWishlist,
    fetchCart,
    fetchWishlist,
    getCartTotal,
    getCheckoutTotal,
    startBuyNow,
    startCartCheckout,
    clearCheckoutItems,
    updateCheckoutQuantity,
    removeFromCheckout,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
