// import img1 from './images/products/prod1/img1.png'

export const products = [
  {
    id: 1,
    name: "Arappu Powder",
    category: "Hair Care",
    price: 160,
    originalPrice: 209,
    description: "Natural hair cleanser made from traditional herbs. Arappu powder is known for its deep cleansing properties and helps maintain healthy, shiny hair.",
    fullDescription: "Our Arappu Powder is a 100% natural hair cleanser made from the traditional Arappu herb. It effectively cleanses the scalp, removes dirt and excess oil, while maintaining the natural oils of your hair. Regular use promotes hair growth, reduces hair fall, and adds natural shine to your hair. Free from chemicals and artificial additives.",
    benefits: [
      "Deep cleanses scalp and hair",
      "Promotes hair growth",
      "Reduces hair fall",
      "Adds natural shine",
      "Maintains scalp health"
    ],
    usage: "Mix with water to form a paste, apply to wet hair, massage gently and rinse thoroughly.",
    ingredients: ["Pure Arappu Herb", "Natural Soapnuts", "Dried Hibiscus Flowers"],
    size: "500g",
    image: "/images/products/prod1/img1.png",
    images:[
      "/images/products/prod1/img1.png",
      "/images/products/prod1/img1.png",
      "/images/products/prod1/img1.png",
      "/images/products/prod1/img1.png"

    ],
    featured: true,
    inStock: true,
    sku: "TH-AP-500",
    rating: 4.5,
    reviews: 128,
    tags: ["hair care", "natural", "traditional", "herbal"]
  },
  {
    id: 2,
    name: "Pure Castor Oil",
    category: "Hair & Skin Care",
    price: 160,
    originalPrice: 209,
    description: "100% pure castor oil with multiple benefits for hair growth, skin care, and overall wellness.",
    fullDescription: "Our Pure Castor Oil is cold-pressed to preserve all its natural benefits. Rich in ricinoleic acid, it promotes hair growth, strengthens eyelashes and eyebrows, and moisturizes dry skin. It's also known for its anti-inflammatory and antimicrobial properties.",
    benefits: [
      "Promotes hair growth",
      "Strengthens eyelashes & eyebrows",
      "Moisturizes dry skin",
      "Anti-inflammatory properties",
      "Natural antimicrobial"
    ],
    usage: "Apply directly to scalp for hair growth or to skin for moisturizing. Use sparingly.",
    ingredients: ["100% Pure Cold-Pressed Castor Oil"],
    size: "200ml",
    image: "/images/products/prod2/img2.png",
    images:[
      "/images/products/prod2/img2.png",
      "/images/products/prod2/img2.png",
      "/images/products/prod2/img2.png",
      "/images/products/prod2/img2.png"
    ],
    featured: true,
    inStock: true,
    sku: "TH-CO-200",
    rating: 4.3,
    reviews: 95,
    tags: ["castor oil", "hair growth", "skin care", "natural"]
  },
  {
    id: 3,
    name: "Kasturi Manjal",
    category: "Skin Care",
    price: 160,
    originalPrice: 209,
    description: "Pure Kasthuri manjal powder for glowing skin and natural skincare routine.",
    fullDescription: "Kasturi Manjal, also known as wild turmeric, is renowned for its skin-enhancing properties. Our pure powder helps reduce acne, lightens scars and pigmentation, and gives your skin a natural glow. It's anti-inflammatory and antibacterial, making it perfect for sensitive skin.",
    benefits: [
      "Reduces acne and pimples",
      "Lightens scars and pigmentation",
      "Anti-inflammatory properties",
      "Natural skin brightener",
      "Suitable for sensitive skin"
    ],
    usage: "Mix with rose water or milk to form a paste, apply on face and body, leave for 15-20 minutes and wash off.",
    ingredients: ["100% Pure Kasturi Manjal Powder"],
    size: "100g",
    image: "/images/products/prod3/img3.png",
    images:[
      "/images/products/prod3/img3.png",
      "/images/products/prod3/img3.png",
      "/images/products/prod3/img3.png",
      "/images/products/prod3/img3.png"
    ],
    featured: true,
    inStock: true,
    sku: "TH-CO-200",
    rating: 4.3,
    reviews: 95,
    tags: ["castor oil", "hair growth", "skin care", "natural"]
  },
  {
    id: 4,
    name: "Herbal Face Pack",
    category: "Skin Care",
    price: 180,
    originalPrice: 230,
    description: "Natural herbal face pack for glowing and radiant skin.",
    fullDescription: "Our herbal face pack is a blend of multiple natural herbs that work together to give you glowing, radiant skin. It helps in deep cleansing, removing dead skin cells, and improving skin texture.",
    benefits: [
      "Deep cleanses pores",
      "Removes dead skin cells",
      "Improves skin texture",
      "Natural glow",
      "Reduces blackheads"
    ],
    usage: "Apply on clean face, leave for 15 minutes, and wash with lukewarm water.",
    ingredients: ["Multani Mitti", "Sandalwood", "Turmeric", "Rose Petals"],
    size: "200g",
    image: "/images/products/face-pack.jpg",
    images:[
      "/images/products/prod3/img3.png",
      "/images/products/prod3/img3.png",
      "/images/products/prod3/img3.png",
      "/images/products/prod3/img3.png"
    ],
    featured: true,
    inStock: false,
    sku: "TH-CO-200",
    rating: 4.1,
    reviews: 80,
    tags: ["castor oil", "hair growth", "skin care", "natural"]
  },
  {
    id: 5,
    name: "Herbal Hair Oil",
    category: "Hair Care",
    price: 220,
    originalPrice: 280,
    description: "Ayurvedic hair oil for hair growth and scalp health.",
    fullDescription: "A traditional Ayurvedic formulation that nourishes the scalp, strengthens hair roots, and promotes healthy hair growth. Made with 20+ natural herbs.",
    benefits: [
      "Promotes hair growth",
      "Reduces hair fall",
      "Prevents premature graying",
      "Treats dandruff",
      "Strengthens hair roots"
    ],
    usage: "Massage into scalp 2-3 times a week, leave overnight for best results.",
    ingredients: ["Coconut Oil", "Brahmi", "Amla", "Bhringraj", "Neem"],
    size: "200ml",
    image: "/images/products/hair-oil.jpg",
    images:[
      "/images/products/prod3/img3.png",
      "/images/products/prod3/img3.png",
      "/images/products/prod3/img3.png",
      "/images/products/prod3/img3.png"
    ],
    featured: true,
    inStock: false,
    sku: "TH-HO-200",
    rating: 4.1,
    reviews: 53,
    tags: ["hair oil", "ayurvedic", "hair growth", "scalp care"]
  },
  {
    id: 6,
    name: "Natural Soap",
    category: "Bath & Body",
    price: 120,
    originalPrice: 150,
    description: "Handmade herbal soap for gentle skin cleansing.",
    fullDescription: "Our natural herbal soaps are handmade using traditional methods. Free from harsh chemicals, they cleanse your skin while maintaining its natural moisture balance.",
    benefits: [
      "Gentle on skin",
      "Maintains natural moisture",
      "Antibacterial properties",
      "Natural fragrance",
      "Eco-friendly"
    ],
    usage: "Use as regular soap for bathing.",
    ingredients: ["Natural Oils", "Herbal Extracts", "Essential Oils"],
    size: "100g",
    image: "/images/products/herbal-soap.jpg",
    images:[
      "/images/products/prod3/img3.png",
      "/images/products/prod3/img3.png",
      "/images/products/prod3/img3.png",
      "/images/products/prod3/img3.png"
    ],
    featured: true,
    inStock: false,
    sku: "TH-HS-100",
    rating: 4.6,
    reviews: 40,
    tags: ["herbal soap", "bath", "natural", "skin care"]
  }
];

export const categories = [
  "All",
  "Hair Care",
  "Skin Care",
  "Bath & Body",
  "Wellness"
];




// Local storage helper functions
export const cartHelper = {
  getCart: () => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('thamizhoviyaa_cart') || '[]');
    }
    return [];
  },

  addToCart: (product, quantity) => {
    const cart = cartHelper.getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: quantity,
        size: product.size
      });
    }
    
    localStorage.setItem('thamizhoviyaa_cart', JSON.stringify(cart));
    // Dispatch cart update event
    window.dispatchEvent(new Event('cartUpdated'));
    return cart;
  },

  removeFromCart: (productId) => {
    const cart = cartHelper.getCart().filter(item => item.id !== productId);
    localStorage.setItem('thamizhoviyaa_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    return cart;
  },

  updateQuantity: (productId, quantity) => {
    const cart = cartHelper.getCart();
    const item = cart.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
      localStorage.setItem('thamizhoviyaa_cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
    }
    return cart;
  },

  getCartCount: () => {
    const cart = cartHelper.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  }
};

export const wishlistHelper = {
  getWishlist: () => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('thamizhoviyaa_wishlist') || '[]');
    }
    return [];
  },

  toggleWishlist: (product) => {
    const wishlist = wishlistHelper.getWishlist();
    const existingIndex = wishlist.findIndex(item => item.id === product.id);
    
    if (existingIndex >= 0) {
      wishlist.splice(existingIndex, 1);
    } else {
      wishlist.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size: product.size
      });
    }
    
    localStorage.setItem('thamizhoviyaa_wishlist', JSON.stringify(wishlist));
    window.dispatchEvent(new Event('wishlistUpdated'));
    return wishlist;
  },

  isInWishlist: (productId) => {
    const wishlist = wishlistHelper.getWishlist();
    return wishlist.some(item => item.id === productId);
  }
};