import React, { useState, useEffect } from 'react';

// ============================================================
// MOCK DATA & AI SERVICE - 100 Products with Images
// ============================================================

// Helper to get random image from Unsplash
const getProductImage = (category, gender, id) => {
  // Different image categories for variety
  const imageCategories = {
    'formal': 'business',
    'casual': 'fashion',
    'sports': 'sports',
    'accessories': 'jewelry',
    'grooming': 'beauty',
    'luxury': 'luxury',
    'decor': 'interior',
    'celebration': 'party',
    'gift': 'gift',
    'wedding': 'wedding',
    'party': 'party',
    'elegant': 'fashion',
    'romantic': 'love',
    'tech': 'technology',
    'outdoor': 'nature',
    'professional': 'business',
    'kids': 'kids'
  };
  
  const baseCategory = imageCategories[category] || 'product';
  return `https://images.unsplash.com/photo-${getPhotoId(baseCategory, gender, id)}?w=400&h=300&fit=crop`;
};

// Generate consistent photo IDs for demo purposes
const getPhotoId = (category, gender, id) => {
  const photoMap = {
    'business': ['1581091226825-a6a2a5a0a8e8', '1573167508483-e5f8a8c8c8c8', '1557804506252-4c8e8a8a8a8a', '1522075468154-8a8a8a8a8a8a'],
    'fashion': ['1581045735656-c8c8c8c8c8c8', '1556906785a5a5a5a5a5a5', '1564581212121212', '1578952424242424'],
    'sports': ['1517649763636363', '1574620369696969', '1584730440404040', '1574523636363636'],
    'jewelry': ['1515560000000000', '1584351515151515', '1573401515151515', '1591362626262626'],
    'beauty': ['1522333232323232', '1571562121212121', '1585773838383838', '1567883838383838'],
    'luxury': ['1583843232323232', '1576503030303030', '1563082929292929', '1581544444444444'],
    'interior': ['1584819999999999', '1577193939393939', '1561043838383838', '1558612222222222'],
    'party': ['1519462626262626', '1573153131313131', '1588171919191919', '1568843939393939'],
    'gift': ['1513919191919191', '1574863636363636', '1565944949494949', '1586930303030303'],
    'wedding': ['1519691212121212', '1573573737373737', '1568584848484848', '1587438383838383'],
    'love': ['1516585858585858', '1573662222222222', '1568124242424242', '1584725252525252'],
    'technology': ['1518773737373737', '1573737373737373', '1563983838383838', '1583737373737373'],
    'nature': ['1500464848484848', '1583838383838383', '1564646464646464', '1576363636363636'],
    'kids': ['1573636363636363', '1586868686868686', '1569393939393939', '1592626262626262']
  };
  
  const photos = photoMap[category] || photoMap['fashion'];
  return photos[id % photos.length];
};

// 100 Products with images
const generateProducts = () => {
  const products = [];
  const categories = ['formal', 'casual', 'sports', 'accessories', 'grooming', 'luxury', 'decor', 'celebration', 'gift', 'elegant'];
  const genders = ['men', 'women'];
  const names = {
    men: {
      formal: ['Formal Suit', 'Tuxedo', 'Blazer', 'Dress Shirt', 'Formal Shoes', 'Tie Set', 'Cufflinks', 'Vest', 'Formal Trousers', 'Dress Belt'],
      casual: ['T-Shirt', 'Jeans', 'Polo Shirt', 'Sneakers', 'Hoodie', 'Cargo Pants', 'Denim Jacket', 'Sports Jersey', 'Chino Pants', 'Sweater'],
      sports: ['Running Shoes', 'Track Suit', 'Gym Bag', 'Sports Watch', 'Fitness Tracker', 'Yoga Mat', 'Dumbbells', 'Sports Jersey', 'Trainers', 'Water Bottle'],
      accessories: ['Watch', 'Sunglasses', 'Wallet', 'Backpack', 'Belt', 'Cap', 'Scarf', 'Gloves', 'Keychain', 'Travel Bag'],
      grooming: ['Perfume', 'Shaving Kit', 'Hair Gel', 'Face Wash', 'Lotion', 'Deodorant', 'Beard Oil', 'Shaver', 'Aftershave', 'Cologne'],
      luxury: ['Gold Watch', 'Designer Suit', 'Leather Shoes', 'Luxury Wallet', 'Diamond Ring', 'Silk Tie', 'Leather Briefcase', 'Pocket Watch', 'Cufflink Set', 'Fountain Pen'],
      decor: ['Wall Art', 'Vase', 'Candle Set', 'Table Runner', 'Picture Frame', 'Decorative Pillow', 'Area Rug', 'Lamp', 'Clocks', 'Mirror'],
      celebration: ['Champagne Set', 'Party Hat', 'Balloons', 'Confetti', 'Party Favors', 'Decoration Kit', 'Streamers', 'Party Banner', 'Glow Sticks', 'Party Supplies'],
      gift: ['Gift Basket', 'Chocolate Box', 'Gift Card', 'Wine Set', 'Personalized Gift', 'Hamper', 'Flower Bouquet', 'Gift Wrapping', 'Candle Gift Set', 'Luxury Gift Box'],
      elegant: ['Dress Watch', 'Silk Scarf', 'Leather Gloves', 'Tie Clip', 'Pocket Square', 'Dress Socks', 'Oxford Shoes', 'Dress Belt', 'Cufflink Set', 'Tie Bar']
    },
    women: {
      formal: ['Evening Gown', 'Cocktail Dress', 'Formal Skirt', 'Blazer', 'Formal Shoes', 'Clutch', 'Pearl Necklace', 'Silk Blouse', 'Pencil Skirt', 'Formal Handbag'],
      casual: ['Summer Dress', 'Jeans', 'Blouse', 'Sneakers', 'Cardigan', 'Maxi Skirt', 'Denim Jacket', 'Tank Top', 'Leggings', 'Sweater'],
      sports: ['Sports Bra', 'Leggings', 'Running Shoes', 'Yoga Set', 'Tank Top', 'Track Suit', 'Sports Watch', 'Fitness Tracker', 'Yoga Mat', 'Water Bottle'],
      accessories: ['Handbag', 'Sunglasses', 'Scarf', 'Watch', 'Belt', 'Jewelry Set', 'Hair Accessories', 'Clutch', 'Wallet', 'Hat'],
      grooming: ['Perfume', 'Makeup Kit', 'Face Cream', 'Hair Dryer', 'Nail Polish', 'Lipstick Set', 'Eye Shadow', 'Face Mask', 'Hair Straightener', 'Beauty Set'],
      luxury: ['Diamond Necklace', 'Designer Dress', 'Luxury Handbag', 'Gold Earrings', 'Platinum Watch', 'Silk Scarf', 'Leather Gloves', 'Designer Shoes', 'Luxury Perfume', 'Pearl Set'],
      decor: ['Decorative Vase', 'Wall Art', 'Candle Set', 'Throw Pillows', 'Area Rug', 'Photo Frame', 'Table Runner', 'Decorative Mirror', 'Lamps', 'Clocks'],
      celebration: ['Champagne Glasses', 'Party Decor', 'Balloons', 'Confetti', 'Party Favors', 'Decoration Kit', 'Streamers', 'Party Banner', 'Glow Sticks', 'Celebration Set'],
      gift: ['Gift Basket', 'Chocolate Box', 'Gift Card', 'Wine Set', 'Personalized Gift', 'Flower Bouquet', 'Gift Wrapping', 'Candle Gift Set', 'Luxury Gift Box', 'Spa Set'],
      elegant: ['Pearl Necklace', 'Evening Clutch', 'Silk Scarf', 'Diamond Earrings', 'Leather Gloves', 'Designer Watch', 'Silk Dress', 'Lace Gloves', 'Tiaras', 'Elegant Handbag']
    },
    unisex: {
      formal: ['Unisex Suit', 'Formal Shoes', 'Dress Watch', 'Leather Belt', 'Dress Socks', 'Tie', 'Cufflinks', 'Formal Bag', 'Wallet', 'Scarf'],
      casual: ['T-Shirt', 'Jeans', 'Sneakers', 'Hoodie', 'Backpack', 'Cap', 'Jacket', 'Sweater', 'Chinos', 'Polo'],
      sports: ['Sports Shoes', 'Gym Bag', 'Water Bottle', 'Fitness Tracker', 'Yoga Mat', 'Dumbbells', 'Track Suit', 'Sports Watch', 'Trainers', 'Sports Accessories'],
      accessories: ['Watch', 'Sunglasses', 'Wallet', 'Backpack', 'Belt', 'Cap', 'Scarf', 'Gloves', 'Keychain', 'Travel Bag'],
      grooming: ['Perfume', 'Skincare Set', 'Hair Care', 'Beauty Kit', 'Lotion', 'Deodorant', 'Face Wash', 'Shaving Kit', 'Makeup Kit', 'Hair Dryer'],
      luxury: ['Luxury Watch', 'Designer Bag', 'Diamond Ring', 'Gold Chain', 'Luxury Pen', 'Silk Tie', 'Leather Briefcase', 'Pocket Watch', 'Cufflink Set', 'Fountain Pen'],
      decor: ['Wall Art', 'Vase', 'Candle Set', 'Table Runner', 'Picture Frame', 'Decorative Pillow', 'Area Rug', 'Lamp', 'Clocks', 'Mirror'],
      celebration: ['Champagne Set', 'Party Hat', 'Balloons', 'Confetti', 'Party Favors', 'Decoration Kit', 'Streamers', 'Party Banner', 'Glow Sticks', 'Party Supplies'],
      gift: ['Gift Basket', 'Chocolate Box', 'Gift Card', 'Wine Set', 'Personalized Gift', 'Hamper', 'Flower Bouquet', 'Gift Wrapping', 'Candle Gift Set', 'Luxury Gift Box'],
      elegant: ['Elegant Watch', 'Silk Scarf', 'Leather Gloves', 'Diamond Earrings', 'Pearl Set', 'Designer Handbag', 'Evening Clutch', 'Lace Accessories', 'Tie Bar', 'Elegant Set']
    }
  };

  let id = 1;
  for (let g of genders) {
    for (let cat of categories) {
      const items = names[g][cat] || [];
      for (let i = 0; i < 5; i++) {
        const idx = (i * 3 + id) % items.length;
        const name = items[idx] || `${cat.charAt(0).toUpperCase() + cat.slice(1)} Item ${i + 1}`;
        const price = (Math.random() * 300 + 20).toFixed(2);
        const tags = [cat, ...getRandomTags(cat)];
        
        products.push({
          id: id++,
          name: `${g === 'unisex' ? '👥' : g === 'men' ? '👨' : '👩'} ${name}`,
          tags: [...new Set(tags)],
          gender: g,
          category: cat,
          price: parseFloat(price),
          image: getProductImage(cat, g, id)
        });
      }
    }
  }
  return products.slice(0, 100);
};

const getRandomTags = (mainCategory) => {
  const tagMap = {
    'formal': ['professional', 'elegant', 'classic', 'business', 'sophisticated'],
    'casual': ['comfortable', 'everyday', 'trendy', 'relaxed', 'streetwear'],
    'sports': ['active', 'fitness', 'performance', 'athletic', 'energy'],
    'accessories': ['stylish', 'trendy', 'essential', 'complete', 'detail'],
    'grooming': ['self-care', 'wellness', 'fresh', 'clean', 'groomed'],
    'luxury': ['premium', 'exclusive', 'high-end', 'designer', 'opulent'],
    'decor': ['aesthetic', 'stylish', 'home', 'interior', 'design'],
    'celebration': ['party', 'festive', 'joyful', 'memorable', 'special'],
    'gift': ['thoughtful', 'surprise', 'special', 'present', 'meaningful'],
    'elegant': ['refined', 'graceful', 'sophisticated', 'classy', 'chic']
  };
  const tags = tagMap[mainCategory] || ['versatile', 'quality', 'durable'];
  return tags.slice(0, 2 + Math.floor(Math.random() * 3));
};

const productDB = generateProducts();

// Enhanced mock AI API call with gender consideration
const fetchAISuggestions = (eventType, gender) => {
  const categoryMap = {
    wedding: {
      men: ['formal', 'accessories', 'grooming', 'elegant', 'gift', 'luxury'],
      women: ['formal', 'elegant', 'accessories', 'grooming', 'gift', 'luxury'],
      unisex: ['decor', 'celebration', 'gift', 'elegant', 'accessories']
    },
    birthday: {
      men: ['casual', 'sports', 'gift', 'celebration', 'accessories'],
      women: ['casual', 'gift', 'celebration', 'decor', 'accessories'],
      unisex: ['decor', 'celebration', 'gift', 'party', 'accessories']
    },
    corporate: {
      men: ['formal', 'professional', 'accessories', 'grooming', 'tech'],
      women: ['formal', 'professional', 'accessories', 'elegant', 'tech'],
      unisex: ['professional', 'tech', 'gift', 'decor', 'accessories']
    },
    baby_shower: {
      men: ['gift', 'celebration', 'decor', 'casual', 'accessories'],
      women: ['gift', 'celebration', 'decor', 'elegant', 'accessories'],
      unisex: ['decor', 'celebration', 'gift', 'party', 'accessories']
    },
    anniversary: {
      men: ['formal', 'elegant', 'accessories', 'gift', 'luxury'],
      women: ['formal', 'elegant', 'accessories', 'gift', 'luxury'],
      unisex: ['decor', 'celebration', 'gift', 'elegant', 'accessories']
    }
  };
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const categories = categoryMap[eventType]?.[gender] || 
                        ['decor', 'gift', 'celebration', 'accessories', 'formal'];
      resolve([...categories]);
    }, 800);
  });
};

// AI shopping-plan integration (uses local mock)
const fetchAIPlan = async ({ event, gender, eventDate, budget, shoppingFor }) => {
  // Use local suggestions and productDB to build a recommendation shape
  const cats = await fetchAISuggestions(event, gender);
  const recommendations = (cats || []).map((cat) => ({
    categoryName: cat,
    products: productDB.filter(p => p.category === cat).map(p => ({
      productId: p.id,
      productName: p.name,
      imageUrl: p.image,
      price: p.price,
      tags: p.tags,
      gender: p.gender,
    })),
  }));
  return { recommendations };
};

// ============================================================
// SIDEBAR COMPONENT
// ============================================================

const Sidebar = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && <div style={styles.overlay} onClick={onClose} />}
      <div style={{
        ...styles.sidebar,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)'
      }}>
        <div style={styles.sidebarHeader}>
          <h3 style={styles.sidebarTitle}>📋 Filters</h3>
          <button style={styles.sidebarClose} onClick={onClose}>✕</button>
        </div>
        <div style={styles.sidebarContent}>
          {children}
        </div>
      </div>
    </>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const EventPlanner = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [eventType, setEventType] = useState('wedding');
  const [eventDate, setEventDate] = useState(() => {
    const future = new Date();
    future.setDate(future.getDate() + 7);
    return future.toISOString().split('T')[0];
  });
  const [gender, setGender] = useState('unisex');
  const [forWhom, setForWhom] = useState('self');
  const [age, setAge] = useState('');
  const [suggestedCategories, setSuggestedCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [aiRecommendations, setAiRecommendations] = useState({});
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [matchedProducts, setMatchedProducts] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [budgetRange, setBudgetRange] = useState({ min: 0, max: 50000 });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');

  // For whom options
  const forWhomOptions = [
    { value: 'self', label: '👤 Myself' },
    { value: 'spouse', label: '💑 Spouse/Partner' },
    { value: 'parent', label: '👴 Parent' },
    { value: 'child', label: '👶 Child' },
    { value: 'sibling', label: '👫 Sibling' },
    { value: 'friend', label: '🤝 Friend' },
    { value: 'colleague', label: '💼 Colleague' },
    { value: 'client', label: '🤵 Client' }
  ];

  // Age groups
  const ageGroups = ['0-5', '6-12', '13-17', '18-24', '25-34', '35-44', '45-54', '55+'];

  // Get unique categories from products
  const allCategories = [...new Set(productDB.map(p => p.category))];

  // Apply filters
  useEffect(() => {
    let filtered = [...matchedProducts];
    
    // Filter by category
    if (activeCategoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === activeCategoryFilter);
    }
    
    // Filter by budget
    filtered = filtered.filter(p => 
      p.price >= budgetRange.min && p.price <= budgetRange.max
    );
    
    setFilteredProducts(filtered);
  }, [matchedProducts, activeCategoryFilter, budgetRange]);

  // Handlers
  const handleNextStep1 = async () => {
    if (!eventDate) {
      alert('Please select a valid event date.');
      return;
    }
    if (!age) {
      alert('Please enter age of the person.');
      return;
    }
    setIsLoading(true);
    setAiError(null);
    setAiRecommendations({});
    setAiLoading(true);
    try {
      // prefer real AI API; fallback to local mock if it fails
      const rawLabel = (forWhomOptions.find(o => o.value === forWhom)?.label) || forWhom;
      const shoppingForLabel = String(rawLabel).replace(/[^a-zA-Z0-9 \-]/g, '').trim();
      let data;
      try {
        data = await fetchAIPlan({ event: eventType, gender, eventDate, budget: budgetRange.max, shoppingFor: shoppingForLabel });
      } catch (apiErr) {
        console.warn('AI API failed, falling back to mock suggestions:', apiErr);
        const categories = await fetchAISuggestions(eventType, gender);
        setSuggestedCategories(categories);
        setSelectedCategories(new Set());
        setCurrentStep(2);
        return;
      }

      // expected shape: { recommendations: [ { categoryName, products: [...] }, ... ] }
      const recommendations = Array.isArray(data.recommendations) ? data.recommendations : [];
      const cats = recommendations.map(r => r.categoryName);
      setSuggestedCategories(cats);
      // map categoryName -> array of product objects
      const map = {};
      recommendations.forEach((r) => {
        map[r.categoryName] = (r.products || []).map(p => {
          // normalize tags: API may return comma-separated string in `tag` or an array in `tags`
          let tags = [];
          if (p.tags) {
            if (Array.isArray(p.tags)) tags = p.tags.map(t => String(t).toLowerCase());
            else tags = String(p.tags).split(',').map(t => t.trim().toLowerCase());
          } else if (p.tag) {
            tags = String(p.tag).split(',').map(t => t.trim().toLowerCase());
          }
          // infer gender from tags when available
          const genderFromTags = (() => {
            const t = tags.join(' ');
            if (/\b(bride|woman|women|female|girl)\b/.test(t)) return 'women';
            if (/\b(groom|man|men|male|boy)\b/.test(t)) return 'men';
            return 'unisex';
          })();
          return {
            id: p.productId,
            name: p.productName,
            image: p.imageUrl,
            price: Number(p.price) || 0,
            category: r.categoryName,
            tags,
            gender: p.gender || genderFromTags || 'unisex',
          };
        });
      });
      setAiRecommendations(map);
      setSelectedCategories(new Set());
      setCurrentStep(2);
    } catch (error) {
      console.error('AI suggestion error:', error);
      setAiError(error.message || String(error));
      alert('Failed to fetch category suggestions. Please try again.');
    } finally {
      setIsLoading(false);
      setAiLoading(false);
    }
  };

  const toggleCategory = (category) => {
    setSelectedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const handleNextStep2 = () => {
    if (selectedCategories.size === 0) {
      alert('Please select at least one category.');
      return;
    }
    const selected = Array.from(selectedCategories);
    let matched = [];
    // If AI returned product recommendations, use them (preferred)
    if (aiRecommendations && Object.keys(aiRecommendations).length > 0) {
      selected.forEach((cat) => {
        const items = aiRecommendations[cat] || [];
        matched = matched.concat(items);
      });
      // remove duplicates by id
      const seen = new Set();
      matched = matched.filter((p) => {
        if (!p || !p.id) return false;
        if (seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
      });
      // filter by user-selected gender and event
      const eventTag = String(eventType || '').toLowerCase();
      const genderTagMap = {
        men: ['groom', 'man', 'men', 'male', 'boy'],
        women: ['bride', 'woman', 'women', 'female', 'girl'],
      };
      matched = matched.filter((p) => {
        const tags = (p.tags || []).map(t => String(t).toLowerCase());
        const hasEvent = eventTag ? tags.includes(eventTag) || tags.some(t => t.includes(eventTag)) : true;
        if (!hasEvent) return false;
        if (gender === 'unisex') return true;
        const genderTags = genderTagMap[gender] || [];
        const hasGender = tags.some(t => genderTags.includes(t));
        return hasGender;
      });
      // ensure budgetRange includes recommended prices so filteredProducts isn't empty
      const prices = matched.map(p => Number(p.price || 0)).filter(v => !Number.isNaN(v));
      if (prices.length > 0) {
        const maxPrice = Math.max(...prices);
        if (budgetRange.max < maxPrice) {
          setBudgetRange({ min: Math.min(budgetRange.min, 0), max: Math.ceil(maxPrice) });
        }
      }
    } else {
      matched = productDB.filter((product) => {
        const genderMatch = product.gender === 'unisex' || product.gender === gender;
        const tagMatch = product.tags.some((tag) => selected.includes(tag));
        return genderMatch && tagMatch;
      }).map(p => ({
        id: p.id,
        name: p.name,
        image: p.image,
        price: p.price,
        category: p.category,
        tags: p.tags || [],
        gender: p.gender || 'unisex',
      }));
    }
    setMatchedProducts(matched);
    setFilteredProducts(matched);
    setActiveCategoryFilter('all');
    setCurrentStep(3);
  };

  const goToStep1 = () => setCurrentStep(1);
  const goToStep2 = () => setCurrentStep(2);

  const handleDone = () => {
    if (onComplete) {
      onComplete({
        eventType,
        eventDate,
        gender,
        forWhom,
        age,
        categories: Array.from(selectedCategories),
      });
    }
    alert('🎉 Done! Your event plan is ready.');
  };

  // Helper function for category icons
  const getCategoryIcon = (category) => {
    const icons = {
      'formal': '👔', 'casual': '👕', 'sports': '🏃', 'accessories': '⌚',
      'grooming': '💄', 'luxury': '💎', 'gift': '🎁', 'decor': '🎨',
      'celebration': '🎉', 'party': '🥳', 'elegant': '✨', 'professional': '💼',
      'tech': '💻', 'outdoor': '🌳', 'kids': '🧸', 'romantic': '❤️'
    };
    return icons[category] || '🏷️';
  };

  // Image error handler
  const handleImageError = (e) => {
    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23f0f0f0"/%3E%3Ctext x="200" y="150" font-family="Arial" font-size="20" fill="%23999" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
  };

  const renderHeader = () => (
    <header style={styles.header}>
      <div style={styles.headerContent}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>🛍️</span>
          <span style={styles.logoText}>EventMarket</span>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.headerBtn} onClick={() => setIsSidebarOpen(true)}>
            ⚙️ Filters
          </button>
          <button style={styles.headerBtn} onClick={() => alert('Cart')}>
            🛒 Cart
          </button>
          <button style={styles.headerBtn} onClick={() => alert('Account')}>
            👤 Account
          </button>
        </div>
      </div>
    </header>
  );

  const renderStepIndicator = () => (
    <div style={styles.stepContainer}>
      <div style={styles.stepIndicator}>
        {[
          { step: 1, label: 'Event Details', icon: '📋' },
          { step: 2, label: 'Categories', icon: '🏷️' },
          { step: 3, label: 'Products', icon: '📦' }
        ].map((item) => (
          <div key={item.step} style={styles.stepWrapper}>
            <div style={{
              ...styles.stepCircle,
              ...(currentStep === item.step ? styles.stepCircleActive : {}),
              ...(currentStep > item.step ? styles.stepCircleCompleted : {}),
            }}>
              {currentStep > item.step ? '✓' : item.icon}
            </div>
            <span style={{
              ...styles.stepLabel,
              ...(currentStep === item.step ? styles.stepLabelActive : {}),
            }}>
              {item.label}
            </span>
            {item.step < 3 && (
              <div style={{
                ...styles.stepLine,
                ...(currentStep > item.step ? styles.stepLineCompleted : {}),
              }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div style={styles.stepPanel}>
      <div style={styles.stepContent}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Tell us about your event</h3>
          <p style={styles.cardSubtitle}>We'll personalize recommendations based on your preferences</p>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}><span>🎯</span> Event Type</label>
              <select style={styles.select} value={eventType} onChange={(e) => setEventType(e.target.value)} disabled={isLoading}>
                <option value="wedding">💍 Wedding</option>
                <option value="birthday">🎂 Birthday</option>
                <option value="corporate">🏢 Corporate</option>
                <option value="baby_shower">🍼 Baby shower</option>
                <option value="anniversary">🥂 Anniversary</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}><span>👤</span> Gender</label>
              <select style={styles.select} value={gender} onChange={(e) => setGender(e.target.value)} disabled={isLoading}>
                <option value="men">👨 Men</option>
                <option value="women">👩 Women</option>
                <option value="unisex">👥 Kids</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}><span>👥</span> For Whom</label>
              <select style={styles.select} value={forWhom} onChange={(e) => setForWhom(e.target.value)} disabled={isLoading}>
                {forWhomOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}><span>🎂</span> Age</label>
              <select style={styles.select} value={age} onChange={(e) => setAge(e.target.value)} disabled={isLoading}>
                <option value="">Select age group</option>
                {ageGroups.map(group => (
                  <option key={group} value={group}>{group} years</option>
                ))}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}><span>📅</span> Event Date</label>
              <input type="date" style={styles.input} value={eventDate} onChange={(e) => setEventDate(e.target.value)} disabled={isLoading} />
            </div>
          </div>
          <div style={styles.features}>
            <div style={styles.featureItem}><span>🎯</span><span>AI-Powered Suggestions</span></div>
            <div style={styles.featureItem}><span>👤</span><span>Gender-Specific Products</span></div>
            <div style={styles.featureItem}><span>🛍️</span><span>Curated Collections</span></div>
          </div>
          <div style={styles.actionBar}>
            <button style={{ ...styles.btn, ...styles.btnPrimary, ...(isLoading ? styles.btnDisabled : {}) }} onClick={handleNextStep1} disabled={isLoading}>
              {isLoading ? (<><span style={styles.aiLoader}></span> Finding suggestions...</>) : (<>Discover Products <span>→</span></>)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div style={styles.stepPanel}>
      <div style={styles.stepContent}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <h3 style={styles.cardTitle}>Select your interests</h3>
              <p style={styles.cardSubtitle}>Choose categories that match your event needs</p>
            </div>
            <div style={styles.selectionCounter}>
              <span style={styles.counterBadge}>{selectedCategories.size}</span>
              <span>selected</span>
            </div>
          </div>
          <div style={styles.categoryGrid}>
            {suggestedCategories.length === 0 ? (
              <div style={styles.emptyState}>
                <span style={styles.emptyIcon}>🔍</span>
                <p>No categories available</p>
              </div>
            ) : (
              suggestedCategories.map((category) => {
                const isSelected = selectedCategories.has(category);
                return (
                  <div key={category} style={{ ...styles.categoryCard, ...(isSelected ? styles.categoryCardSelected : {}) }} onClick={() => toggleCategory(category)}>
                    <div style={styles.categoryIcon}>{getCategoryIcon(category)}</div>
                    <div style={styles.categoryName}>{category.charAt(0).toUpperCase() + category.slice(1)}</div>
                    {isSelected && <div style={styles.checkmark}>✓</div>}
                  </div>
                );
              })
            )}
          </div>
          <div style={styles.actionBar}>
            <button style={{ ...styles.btn, ...styles.btnOutline }} onClick={goToStep1}>← Back</button>
            <button style={{ ...styles.btn, ...styles.btnPrimary, ...(selectedCategories.size === 0 ? styles.btnDisabled : {}) }} onClick={handleNextStep2} disabled={selectedCategories.size === 0}>
              View Products →
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div style={styles.stepPanel}>
      <div style={styles.stepContent}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <h3 style={styles.cardTitle}>Products for you</h3>
              <p style={styles.cardSubtitle}>{filteredProducts.length} products found matching your preferences</p>
            </div>
            <div style={styles.viewOptions}>
              <button style={styles.headerBtn} onClick={() => setIsSidebarOpen(true)}>
                ⚙️ Filter
              </button>
            </div>
          </div>
          <div style={styles.productGrid}>
            {filteredProducts.length === 0 ? (
              <div style={styles.emptyState}>
                <span style={styles.emptyIcon}>🛒</span>
                <p>No products match your preferences</p>
                <button style={{ ...styles.btn, ...styles.btnOutline, marginTop: '1rem' }} onClick={goToStep2}>Adjust Categories</button>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div key={product.id} style={styles.productCard}>
                  <div style={styles.productImage}>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      style={styles.productImg}
                      onError={handleImageError}
                      loading="lazy"
                    />
                    {product.gender !== 'unisex' && (
                      <span style={styles.genderTag}>{product.gender === 'men' ? '👨' : '👩'}</span>
                    )}
                    <div style={styles.productBadge}>${product.price.toFixed(2)}</div>
                    <div style={styles.categoryTag}>{getCategoryIcon(product.category)} {product.category}</div>
                  </div>
                  <div style={styles.productInfo}>
                    <h4 style={styles.productName}>{product.name}</h4>
                    <div style={styles.productTags}>
                      {product.tags.slice(0, 3).map((tag) => (
                        <span key={tag} style={styles.productTag}>#{tag}</span>
                      ))}
                    </div>
                    <div style={styles.productFooter}>
                      <span style={styles.productPrice}>${product.price.toFixed(2)}</span>
                      <button style={styles.addToCartBtn} onClick={() => alert(`Added ${product.name} to cart`)}>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div style={styles.actionBar}>
            <button style={{ ...styles.btn, ...styles.btnOutline }} onClick={goToStep2}>← Back to Categories</button>
            <button style={{ ...styles.btn, ...styles.btnSuccess }} onClick={handleDone}>✓ Complete Selection</button>
          </div>
        </div>
      </div>
    </div>
  );

  // Sidebar content
  const renderSidebarContent = () => (
    <>
      <div style={styles.sidebarSection}>
        <h4 style={styles.sidebarSectionTitle}>🎯 Category Filter</h4>
        <div style={styles.sidebarFilterGroup}>
          <button 
            style={{...styles.sidebarFilterBtn, ...(activeCategoryFilter === 'all' ? styles.sidebarFilterBtnActive : {})}}
            onClick={() => setActiveCategoryFilter('all')}
          >
            All Categories
          </button>
          {allCategories.map(cat => (
            <button 
              key={cat}
              style={{...styles.sidebarFilterBtn, ...(activeCategoryFilter === cat ? styles.sidebarFilterBtnActive : {})}}
              onClick={() => setActiveCategoryFilter(cat)}
            >
              {getCategoryIcon(cat)} {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.sidebarSection}>
        <h4 style={styles.sidebarSectionTitle}>💰 Budget Range</h4>
        <div style={styles.budgetControls}>
          <div style={styles.budgetInputGroup}>
            <label style={styles.budgetLabel}>Min ($)</label>
            <input 
              type="number" 
              style={styles.budgetInput} 
              value={budgetRange.min} 
              onChange={(e) => setBudgetRange({...budgetRange, min: parseFloat(e.target.value) || 0})}
              min="0"
            />
          </div>
          <div style={styles.budgetInputGroup}>
            <label style={styles.budgetLabel}>Max ($)</label>
            <input 
              type="number" 
              style={styles.budgetInput} 
              value={budgetRange.max} 
              onChange={(e) => setBudgetRange({...budgetRange, max: parseFloat(e.target.value) || 50000})}
              min="0"
            />
          </div>
        </div>
        <div style={styles.budgetSlider}>
          <input 
            type="range" 
            min="0" 
            max="50000" 
            value={budgetRange.max} 
            onChange={(e) => setBudgetRange({...budgetRange, max: parseFloat(e.target.value)})}
            style={styles.rangeInput}
          />
          <div style={styles.budgetRangeDisplay}>
            <span>${budgetRange.min}</span>
            <span>${budgetRange.max}</span>
          </div>
        </div>
      </div>

      <div style={styles.sidebarSection}>
        <h4 style={styles.sidebarSectionTitle}>📊 Summary</h4>
        <div style={styles.summaryStats}>
          <div style={styles.summaryStat}>
            <span style={styles.summaryLabel}>Total Products</span>
            <span style={styles.summaryValue}>{filteredProducts.length}</span>
          </div>
          <div style={styles.summaryStat}>
            <span style={styles.summaryLabel}>Categories</span>
            <span style={styles.summaryValue}>
              {activeCategoryFilter === 'all' 
                ? new Set(filteredProducts.map(p => p.category)).size 
                : 1}
            </span>
          </div>
          <div style={styles.summaryStat}>
            <span style={styles.summaryLabel}>Price Range</span>
            <span style={styles.summaryValue}>
              ${Math.min(...filteredProducts.map(p => p.price), 0).toFixed(0)} - 
              ${Math.max(...filteredProducts.map(p => p.price), 0).toFixed(0)}
            </span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div style={styles.pageContainer}>
      {renderHeader()}
      <div style={styles.mainContainer}>
        {renderStepIndicator()}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <span>© 2026 EventMarket - Your event planning partner</span>
          <span style={styles.footerLinks}>
            <a href="#" style={styles.footerLink}>About</a>
            <a href="#" style={styles.footerLink}>Help</a>
            <a href="#" style={styles.footerLink}>Privacy</a>
          </span>
        </div>
      </footer>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}>
        {renderSidebarContent()}
      </Sidebar>
    </div>
  );
};

// ============================================================
// STYLES - Updated for sidebar, filters, and new features
// ============================================================

const styles = {
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#f5f7fa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    background: 'white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    padding: '0 2rem',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    borderBottom: '1px solid #e8eaed',
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '64px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
  },
  logoIcon: { fontSize: '1.5rem' },
  logoText: {
    fontSize: '1.3rem',
    fontWeight: 700,
    color: '#1a5f7a',
    letterSpacing: '-0.5px',
  },
  headerActions: { display: 'flex', gap: '1rem' },
  headerBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1rem',
    cursor: 'pointer',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    transition: 'background 0.2s',
    color: '#1a5f7a',
    fontWeight: 500,
  },
  mainContainer: {
    flex: 1,
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    width: '100%',
  },
  stepContainer: {
    background: 'white',
    borderRadius: '12px',
    padding: '1.5rem 2rem',
    marginBottom: '2rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  stepIndicator: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  stepWrapper: { display: 'flex', alignItems: 'center', flex: 1, position: 'relative' },
  stepCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: '#e8eaed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    color: '#7a7f85',
    fontWeight: 600,
    transition: 'all 0.3s',
    zIndex: 2,
  },
  stepCircleActive: {
    background: '#1a5f7a',
    color: 'white',
    boxShadow: '0 4px 12px rgba(26, 95, 122, 0.3)',
  },
  stepCircleCompleted: {
    background: '#28a745',
    color: 'white',
  },
  stepLabel: {
    fontSize: '0.85rem',
    color: '#7a7f85',
    marginLeft: '0.75rem',
    fontWeight: 500,
    whiteSpace: 'nowrap',
  },
  stepLabelActive: {
    color: '#1a5f7a',
    fontWeight: 600,
  },
  stepLine: {
    flex: 1,
    height: '2px',
    background: '#e8eaed',
    margin: '0 1rem',
    position: 'relative',
  },
  stepLineCompleted: { background: '#28a745' },
  stepPanel: { animation: 'fadeIn 0.3s ease-in-out' },
  stepContent: { width: '100%' },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '2.5rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#202124',
    marginBottom: '0.5rem',
  },
  cardSubtitle: {
    fontSize: '1rem',
    color: '#5f6368',
    marginBottom: '2rem',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  label: {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#202124',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  input: {
    padding: '0.75rem 1rem',
    border: '2px solid #e8eaed',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'border 0.2s',
    background: 'white',
    outline: 'none',
  },
  select: {
    padding: '0.75rem 1rem',
    border: '2px solid #e8eaed',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'border 0.2s',
    background: 'white',
    outline: 'none',
    cursor: 'pointer',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
    padding: '1rem',
    background: '#f8f9fa',
    borderRadius: '12px',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '0.95rem',
    color: '#202124',
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  categoryCard: {
    padding: '1.5rem 1rem',
    border: '2px solid #e8eaed',
    borderRadius: '12px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    position: 'relative',
    background: 'white',
  },
  categoryCardSelected: {
    borderColor: '#1a5f7a',
    background: '#f0f7ff',
    boxShadow: '0 4px 12px rgba(26, 95, 122, 0.15)',
  },
  categoryIcon: { fontSize: '2rem', marginBottom: '0.5rem' },
  categoryName: { fontSize: '0.9rem', fontWeight: 500, color: '#202124' },
  checkmark: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    background: '#1a5f7a',
    color: 'white',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
  },
  selectionCounter: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: '#f8f9fa',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
  },
  counterBadge: {
    background: '#1a5f7a',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontWeight: 600,
    fontSize: '0.85rem',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  productCard: {
    border: '1px solid #e8eaed',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'all 0.3s',
    background: 'white',
    cursor: 'pointer',
  },
  productImage: {
    height: '200px',
    background: '#f8f9fa',
    position: 'relative',
    overflow: 'hidden',
  },
  productImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  productBadge: {
    position: 'absolute',
    bottom: '8px',
    left: '8px',
    background: 'rgba(26, 95, 122, 0.9)',
    color: 'white',
    padding: '0.3rem 0.8rem',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: 600,
  },
  categoryTag: {
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    background: 'rgba(255,255,255,0.95)',
    padding: '0.3rem 0.7rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    color: '#202124',
  },
  genderTag: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    background: 'rgba(255,255,255,0.95)',
    padding: '0.3rem 0.7rem',
    borderRadius: '12px',
    fontSize: '1rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  productInfo: { padding: '1rem' },
  productName: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#202124',
    marginBottom: '0.5rem',
  },
  productTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.25rem',
    marginBottom: '0.75rem',
  },
  productTag: {
    fontSize: '0.7rem',
    background: '#f1f3f4',
    padding: '0.2rem 0.6rem',
    borderRadius: '12px',
    color: '#5f6368',
  },
  productFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#1a5f7a',
  },
  addToCartBtn: {
    padding: '0.4rem 1rem',
    background: '#1a5f7a',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 500,
    transition: 'background 0.2s',
  },
  viewOptions: { display: 'flex', gap: '0.5rem' },
  viewBtn: {
    padding: '0.4rem 0.8rem',
    border: '1px solid #e8eaed',
    background: 'white',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    color: '#5f6368',
  },
  actionBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e8eaed',
  },
  btn: {
    padding: '0.75rem 2rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  btnPrimary: { background: '#1a5f7a', color: 'white' },
  btnOutline: { background: 'transparent', border: '2px solid #e8eaed', color: '#202124' },
  btnSuccess: { background: '#28a745', color: 'white' },
  btnDisabled: { opacity: 0.6, cursor: 'not-allowed' },
  emptyState: { textAlign: 'center', padding: '3rem', color: '#5f6368', gridColumn: '1 / -1' },
  emptyIcon: { fontSize: '3rem', display: 'block', marginBottom: '1rem' },
  aiLoader: {
    display: 'inline-block',
    width: '18px',
    height: '18px',
    border: '3px solid rgba(255,255,255,0.3)',
    borderTop: '3px solid white',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  footer: {
    background: 'white',
    borderTop: '1px solid #e8eaed',
    padding: '1.5rem 2rem',
    marginTop: 'auto',
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#5f6368',
    fontSize: '0.9rem',
  },
  footerLinks: { display: 'flex', gap: '1.5rem' },
  footerLink: { color: '#5f6368', textDecoration: 'none', transition: 'color 0.2s' },

  // Sidebar styles
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
  },
  sidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: '320px',
    background: 'white',
    zIndex: 1001,
    transition: 'transform 0.3s ease-in-out',
    boxShadow: '2px 0 12px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '1px solid #e8eaed',
  },
  sidebarTitle: {
    margin: 0,
    fontSize: '1.2rem',
    color: '#202124',
  },
  sidebarClose: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#5f6368',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    transition: 'background 0.2s',
  },
  sidebarContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '1.5rem',
  },
  sidebarSection: {
    marginBottom: '2rem',
  },
  sidebarSectionTitle: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#202124',
    marginBottom: '1rem',
  },
  sidebarFilterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  sidebarFilterBtn: {
    padding: '0.6rem 1rem',
    border: '1px solid #e8eaed',
    borderRadius: '8px',
    background: 'white',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '0.9rem',
    transition: 'all 0.2s',
    color: '#202124',
  },
  sidebarFilterBtnActive: {
    background: '#1a5f7a',
    color: 'white',
    borderColor: '#1a5f7a',
  },
  budgetControls: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
  },
  budgetInputGroup: {
    flex: 1,
  },
  budgetLabel: {
    display: 'block',
    fontSize: '0.8rem',
    color: '#5f6368',
    marginBottom: '0.25rem',
  },
  budgetInput: {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #e8eaed',
    borderRadius: '6px',
    fontSize: '0.9rem',
  },
  budgetSlider: {
    marginTop: '0.5rem',
  },
  rangeInput: {
    width: '100%',
    cursor: 'pointer',
  },
  budgetRangeDisplay: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    color: '#5f6368',
    marginTop: '0.25rem',
  },
  summaryStats: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    background: '#f8f9fa',
    padding: '1rem',
    borderRadius: '8px',
  },
  summaryStat: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
  },
  summaryLabel: { color: '#5f6368' },
  summaryValue: { fontWeight: 600, color: '#202124' },
};

// Add global animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeIn {
    0% { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .btn-primary:hover { background: #134c63; }
  .btn-outline:hover { background: #f8f9fa; }
  .btn-success:hover { background: #218838; }
  .add-to-cart-btn:hover { background: #134c63; }
  .product-card:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    transform: translateY(-4px);
  }
  .footer-link:hover { color: #1a5f7a; }
  .view-btn:hover { background: #f8f9fa; }
  .category-card:hover:not(.category-card-selected) {
    border-color: #b0c4d9;
    transform: scale(1.02);
  }
  .header-btn:hover { background: #f1f3f4; }
  .product-img {
    transition: transform 0.3s;
  }
  .product-card:hover .product-img {
    transform: scale(1.05);
  }
  .sidebar-close:hover { background: #f1f3f4; }
  .sidebar-filter-btn:hover:not(.sidebar-filter-btn-active) {
    background: #f1f3f4;
  }
`;
document.head.appendChild(styleSheet);

export default EventPlanner;
