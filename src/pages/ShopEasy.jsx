import React, { useState } from 'react';
 
// ============================================================
// MOCK DATA
// ============================================================
 
const productDB = [
  // Clothing
  { id: 1, name: 'Elegant Wedding Gown', category: 'clothing', price: 8999, rating: 4.8, reviews: 234, image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=500&fit=crop', discount: 25, isRecommended: true },
  { id: 2, name: 'Designer Lehenga Set', category: 'clothing', price: 12999, rating: 4.9, reviews: 189, image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=500&fit=crop', discount: 30, isRecommended: true },
  { id: 3, name: 'Classic Saree', category: 'clothing', price: 5999, rating: 4.6, reviews: 456, image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=500&fit=crop', discount: 15, isRecommended: false },
  { id: 4, name: 'Men\'s Wedding Suit', category: 'clothing', price: 7999, rating: 4.7, reviews: 312, image: 'https://images.unsplash.com/photo-1594938298603-c8248f4f4e1a?w=400&h=500&fit=crop', discount: 20, isRecommended: true },
  { id: 5, name: 'Bridal Lehenga', category: 'clothing', price: 24999, rating: 4.9, reviews: 567, image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=500&fit=crop', discount: 35, isRecommended: true },
  // Footwear
  { id: 6, name: 'Golden Heels', category: 'footwear', price: 2999, rating: 4.5, reviews: 178, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=500&fit=crop', discount: 10, isRecommended: false },
  { id: 7, name: 'Bridal Sandals', category: 'footwear', price: 3999, rating: 4.8, reviews: 234, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=500&fit=crop', discount: 20, isRecommended: true },
  { id: 8, name: 'Men\'s Formal Shoes', category: 'footwear', price: 4999, rating: 4.6, reviews: 345, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=500&fit=crop', discount: 15, isRecommended: true },
  { id: 9, name: 'Comfort Heels', category: 'footwear', price: 2499, rating: 4.3, reviews: 123, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=500&fit=crop', discount: 5, isRecommended: false },
  // Accessories
  { id: 10, name: 'Diamond Necklace', category: 'accessories', price: 15999, rating: 4.9, reviews: 89, image: 'https://images.unsplash.com/photo-1535632066927-ab7e9ab0e0b0?w=400&h=500&fit=crop', discount: 40, isRecommended: true },
  { id: 11, name: 'Pearl Earrings', category: 'accessories', price: 3999, rating: 4.7, reviews: 234, image: 'https://images.unsplash.com/photo-1535632066927-ab7e9ab0e0b0?w=400&h=500&fit=crop', discount: 25, isRecommended: true },
  { id: 12, name: 'Designer Watch', category: 'accessories', price: 7999, rating: 4.6, reviews: 456, image: 'https://images.unsplash.com/photo-1535632066927-ab7e9ab0e0b0?w=400&h=500&fit=crop', discount: 30, isRecommended: false },
  { id: 13, name: 'Gold Bangles', category: 'accessories', price: 8999, rating: 4.8, reviews: 123, image: 'https://images.unsplash.com/photo-1535632066927-ab7e9ab0e0b0?w=400&h=500&fit=crop', discount: 35, isRecommended: true },
  // Beauty & Fragrance
  { id: 14, name: 'Floral Eau de Parfum', category: 'beauty', price: 1299, rating: 4.6, reviews: 120, image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=500&fit=crop', discount: 35, isRecommended: true },
  { id: 15, name: 'Luxury Makeup Kit', category: 'beauty', price: 4999, rating: 4.8, reviews: 89, image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=500&fit=crop', discount: 20, isRecommended: true },
  { id: 16, name: 'Perfume Gift Set', category: 'beauty', price: 2499, rating: 4.5, reviews: 234, image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=500&fit=crop', discount: 15, isRecommended: false },
];
 
// Mock API call for AI recommendations
const fetchAIRecommendations = (eventType, gender, budget, forWhom) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Filter products based on criteria
      let filtered = [...productDB];
      // Filter by gender (simplified)
      if (gender === 'female') {
        filtered = filtered.filter(p => p.id % 2 === 0 || p.id % 3 === 0);
      } else if (gender === 'male') {
        filtered = filtered.filter(p => p.id % 2 !== 0 || p.id % 3 === 0);
      }
      // Filter by budget
      if (budget === 'economy') {
        filtered = filtered.filter(p => p.price < 5000);
      } else if (budget === 'mid') {
        filtered = filtered.filter(p => p.price >= 5000 && p.price < 15000);
      } else if (budget === 'luxury') {
        filtered = filtered.filter(p => p.price >= 15000);
      }
      // Group by category
      const grouped = filtered.reduce((acc, product) => {
        if (!acc[product.category]) acc[product.category] = [];
        acc[product.category].push(product);
        return acc;
      }, {});
      resolve(grouped);
    }, 1500);
  });
};
 
// ============================================================
// MAIN COMPONENT
// ============================================================
 
const ShopEasy = ({ onComplete }) => {
  // State
  const [currentStep, setCurrentStep] = useState(1);
  const [showPlan, setShowPlan] = useState(false);
  // Event details
  const [eventType, setEventType] = useState('');
  const [gender, setGender] = useState('female');
  const [eventDate, setEventDate] = useState('');
  const [budget, setBudget] = useState('mid');
  const [forWhom, setForWhom] = useState('self');
  const [customEvent, setCustomEvent] = useState('');
  // Recommendations
  const [recommendations, setRecommendations] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState(new Set());
 
  // Event types
  const eventTypes = [
    { icon: '💍', label: 'Wedding' },
    { icon: '🎂', label: 'Birthday' },
    { icon: '🎉', label: 'Party' },
    { icon: '⛺', label: 'Camping' },
    { icon: '✈️', label: 'Vacation' },
    { icon: '🎪', label: 'Festival' },
    { icon: '💼', label: 'Business Trip' },
    { icon: '👔', label: 'Formal Event' },
    { icon: '🎓', label: 'College Event' },
    { icon: '📌', label: 'Other' },
  ];
 
  // Handle AI recommendation
  const handleGetRecommendations = async () => {
    if (!eventType && !customEvent) {
      alert('Please select or describe your event');
      return;
    }
    setIsLoading(true);
    try {
      const results = await fetchAIRecommendations(
        eventType || 'wedding',
        gender,
        budget,
        forWhom
      );
      setRecommendations(results);
      setShowPlan(true);
      setCurrentStep(3);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      alert('Failed to get recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
 
  // Toggle product selection
  const toggleProduct = (productId) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };
 
  // Get category icon
  const getCategoryIcon = (category) => {
    const icons = {
      'clothing': '👗',
      'footwear': '👠',
      'accessories': '💎',
      'beauty': '💄'
    };
    return icons[category] || '📦';
  };
 
  // Get category display name
  const getCategoryName = (category) => {
    const names = {
      'clothing': 'Clothing',
      'footwear': 'Footwear',
      'accessories': 'Accessories',
      'beauty': 'Beauty & Fragrance'
    };
    return names[category] || category;
  };
 
  // Calculate total
  const calculateTotal = () => {
    let total = 0;
    let count = 0;
    Object.values(recommendations).forEach(products => {
      products.forEach(product => {
        if (selectedProducts.has(product.id)) {
          total += product.price;
          count++;
        }
      });
    });
    return { total, count };
  };
 
  const { total, count } = calculateTotal();
 
  // Render Step 1 - Event Details
  const renderStep1 = () => (
<div style={styles.stepContainer}>
<div style={styles.stepHeader}>
<h1 style={styles.mainTitle}>Let's create your shopping plan</h1>
<p style={styles.subTitle}>Answer a few questions and our AI will do the rest!</p>
</div>
 
      <div style={styles.eventGrid}>
        {/* Gender, Date, Budget, For Whom */}
<div style={styles.formRow}>
<div style={styles.formGroup}>
<label style={styles.label}>👤 Gender</label>
<select style={styles.select} value={gender} onChange={(e) => setGender(e.target.value)}>
<option value="female">Female</option>
<option value="male">Male</option>
<option value="unisex">Unisex</option>
</select>
</div>
<div style={styles.formGroup}>
<label style={styles.label}>📅 Event Date</label>
<input type="date" style={styles.input} value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
</div>
<div style={styles.formGroup}>
<label style={styles.label}>💰 Budget</label>
<select style={styles.select} value={budget} onChange={(e) => setBudget(e.target.value)}>
<option value="economy">Economy (Under ₹5,000)</option>
<option value="mid">Mid (₹5,000 - ₹15,000)</option>
<option value="luxury">Luxury (₹15,000+)</option>
</select>
</div>
<div style={styles.formGroup}>
<label style={styles.label}>🎯 For Whom</label>
<select style={styles.select} value={forWhom} onChange={(e) => setForWhom(e.target.value)}>
<option value="self">Myself</option>
<option value="partner">Partner</option>
<option value="family">Family</option>
<option value="friend">Friend</option>
<option value="cousin">Cousin</option>
</select>
</div>
</div>
 
        {/* Event Type Grid */}
<div style={styles.eventTypesGrid}>
<label style={styles.label}>🎯 Event Type</label>
<div style={styles.eventTypes}>
            {eventTypes.map((type) => (
<button
                key={type.label}
                style={{
                  ...styles.eventTypeBtn,
                  ...(eventType === type.label ? styles.eventTypeBtnActive : {})
                }}
                onClick={() => setEventType(type.label)}
>
                {type.icon} {type.label}
</button>
            ))}
</div>
</div>
 
        {/* OR Custom Description */}
<div style={styles.customEventSection}>
<div style={styles.orDivider}>OR</div>
<div style={styles.customEventInput}>
<textarea
              style={styles.textarea}
              placeholder="Describe your event (e.g., My cousin is getting married next week)"
              value={customEvent}
              onChange={(e) => setCustomEvent(e.target.value)}
              rows={3}
            />
</div>
</div>
 
        <button
          style={{
            ...styles.btn,
            ...styles.btnPrimary,
            ...(isLoading ? styles.btnDisabled : {})
          }}
          onClick={handleGetRecommendations}
          disabled={isLoading}
>
          {isLoading ? (
<>
<span style={styles.spinner}></span> AI is thinking...
</>
          ) : (
            '✨ Get AI Recommendations'
          )}
</button>
</div>
</div>
  );
 
  // Render Step 3 - Shopping Plan
  const renderShoppingPlan = () => {
    const categories = Object.keys(recommendations);
    const totalItems = Object.values(recommendations).reduce((sum, products) => sum + products.length, 0);
 
    return (
<div style={styles.planContainer}>
<div style={styles.planHeader}>
<div>
<h1 style={styles.mainTitle}>Your Personal Shopping Plan</h1>
<p style={styles.subTitle}>AI-curated items just for you</p>
</div>
<div style={styles.planActions}>
<button style={{ ...styles.btn, ...styles.btnOutline, ...styles.btnSmall }}>✏️ Edit Preferences</button>
<button style={{ ...styles.btn, ...styles.btnPrimary, ...styles.btnSmall }}>🔄 Regenerate Plan</button>
</div>
</div>
 
        {/* Category Summary Cards */}
<div style={styles.categorySummaryGrid}>
          {categories.map((category) => (
<div key={category} style={styles.categorySummaryCard}>
<div style={styles.categorySummaryIcon}>{getCategoryIcon(category)}</div>
<div style={styles.categorySummaryInfo}>
<h4 style={styles.categorySummaryTitle}>{getCategoryName(category)}</h4>
<p style={styles.categorySummaryCount}>{recommendations[category].length} items</p>
</div>
<button style={styles.viewAllBtn}>View All →</button>
</div>
          ))}
</div>
 
        {/* Detailed Product View */}
<div style={styles.planDetails}>
<div style={styles.planDetailsHeader}>
<h3 style={styles.sectionTitle}>Your Personalized Shopping Plan</h3>
<div style={styles.planActions}>
<button style={{ ...styles.btn, ...styles.btnOutline, ...styles.btnSmall }}>✏️ Edit Preferences</button>
<button style={{ ...styles.btn, ...styles.btnPrimary, ...styles.btnSmall }}>🔄 Regenerate Plan</button>
</div>
</div>
 
          {categories.map((category) => (
<div key={category} style={styles.categorySection}>
<div style={styles.categorySectionHeader}>
<div style={styles.categorySectionTitle}>
<span style={styles.categorySectionIcon}>{getCategoryIcon(category)}</span>
<span>{getCategoryName(category)}</span>
<span style={styles.categorySectionCount}>{recommendations[category].length} items</span>
</div>
<button style={styles.viewAllLink}>View All →</button>
</div>
 
              <div style={styles.productRow}>
                {recommendations[category].slice(0, 4).map((product) => (
<div
                    key={product.id}
                    style={{
                      ...styles.productCard,
                      ...(selectedProducts.has(product.id) ? styles.productCardSelected : {})
                    }}
                    onClick={() => toggleProduct(product.id)}
>
<div style={styles.productImageWrapper}>
<img src={product.image} alt={product.name} style={styles.productImage} />
                      {product.discount > 0 && (
<span style={styles.discountBadge}>{product.discount}% OFF</span>
                      )}
                      {product.isRecommended && (
<span style={styles.aiRecommendedBadge}>AI Recommended</span>
                      )}
                      {selectedProducts.has(product.id) && (
<div style={styles.selectedCheckmark}>✓</div>
                      )}
</div>
<div style={styles.productInfo}>
<h4 style={styles.productName}>{product.name}</h4>
<div style={styles.productRating}>
<span>⭐ {product.rating}</span>
<span style={styles.productReviews}>({product.reviews})</span>
</div>
<div style={styles.productPrice}>
<span style={styles.currentPrice}>₹{product.price.toLocaleString()}</span>
                        {product.discount > 0 && (
<span style={styles.originalPrice}>
                            ₹{(product.price / (1 - product.discount/100)).toLocaleString()}
</span>
                        )}
</div>
</div>
</div>
                ))}
</div>
</div>
          ))}
</div>
 
        {/* Shopping Plan Summary */}
<div style={styles.summarySection}>
<h3 style={styles.sectionTitle}>Shopping Plan Summary</h3>
<div style={styles.summaryGrid}>
            {categories.map((category) => {
              const products = recommendations[category];
              const selected = products.filter(p => selectedProducts.has(p.id));
              const totalPrice = selected.reduce((sum, p) => sum + p.price, 0);
              return (
<div key={category} style={styles.summaryCard}>
<div style={styles.summaryCardHeader}>
<span>{getCategoryIcon(category)}</span>
<span style={styles.summaryCardTitle}>{getCategoryName(category)}</span>
<span style={styles.summaryCardCount}>({selected.length})</span>
</div>
<div style={styles.summaryCardBody}>
<p style={styles.summaryTotal}>Estimated Total: ₹{totalPrice.toLocaleString()}</p>
<p style={styles.summaryBudget}>
                      Within your budget: ₹{(productDB[0]?.price || 5000).toLocaleString()} – ₹{(productDB[0]?.price || 15000).toLocaleString()}
</p>
</div>
</div>
              );
            })}
</div>
</div>
 
        {/* Actions */}
<div style={styles.planFooter}>
<button style={{ ...styles.btn, ...styles.btnSuccess, ...styles.btnLarge }}>
            🛒 Add All to Cart
</button>
<button style={{ ...styles.btn, ...styles.btnPrimary, ...styles.btnLarge }}>
            Add Selected to Cart ({count} items)
</button>
</div>
 
        {/* Why These Products */}
<div style={styles.whySection}>
<h4 style={styles.whyTitle}>Why these products?</h4>
<div style={styles.whyGrid}>
<div style={styles.whyItem}>✨ Perfect for {eventType || 'your'} occasions</div>
<div style={styles.whyItem}>👤 Matches {gender} preference</div>
<div style={styles.whyItem}>🎯 Ideal for your {forWhom}</div>
<div style={styles.whyItem}>💰 Within your budget range</div>
<div style={styles.whyItem}>⭐ Highly rated & best sellers</div>
<div style={styles.whyItem}>📦 In stock & ready to ship</div>
</div>
</div>
 
        {/* Delivery Estimate */}
<div style={styles.deliverySection}>
<div style={styles.deliveryInfo}>
<span style={styles.deliveryIcon}>🚚</span>
<div>
<h4 style={styles.deliveryTitle}>Delivery Estimate</h4>
<p style={styles.deliveryDate}>Get it by {new Date(Date.now() + 3*24*60*60*1000).toLocaleDateString()} – {new Date(Date.now() + 5*24*60*60*1000).toLocaleDateString()}</p>
<p style={styles.deliveryNote}>(Before your event date)</p>
</div>
</div>
</div>
</div>
    );
  };
 
  // Main render
  return (
<div style={styles.appContainer}>
      {/* Sidebar */}
<div style={styles.sidebar}>
<div style={styles.logo}>
<span style={styles.logoIcon}>🛍️</span>
<span style={styles.logoText}>ShopEasy</span>
</div>
<div style={styles.aiBadge}>
<span>🤖 AI Shopping Agent</span>
<span style={styles.betaBadge}>BETA</span>
</div>
<p style={styles.aiDescription}>Your personal AI stylist that finds the perfect products for any occasion.</p>
<nav style={styles.nav}>
<button style={styles.navItem}>📋 New Shopping Plan</button>
<button style={styles.navItem}>📊 My Shopping Plans</button>
<button style={styles.navItem}>📦 My Orders</button>
<button style={styles.navItem}>👤 My Profile</button>
<button style={styles.navItem}>⚙️ Settings</button>
</nav>
<div style={styles.sidebarFooter}>
<p style={styles.footerText}>AI-powered shopping assistant</p>
</div>
</div>
 
      {/* Main Content */}
<div style={styles.mainContent}>
        {!showPlan ? renderStep1() : renderShoppingPlan()}
</div>
</div>
  );
};
 
// ============================================================
// STYLES
// ============================================================
 
const styles = {
  appContainer: {
    display: 'flex',
    minHeight: '100vh',
    background: '#f5f7fa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  // Sidebar
  sidebar: {
    width: '280px',
    background: 'white',
    padding: '2rem 1.5rem',
    borderRight: '1px solid #e8eaed',
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: 0,
    height: '100vh',
    overflowY: 'auto',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },
  logoIcon: {
    fontSize: '2rem',
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#1a5f7a',
  },
  aiBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    background: '#e8f0fe',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    marginBottom: '0.75rem',
    fontWeight: 600,
    fontSize: '0.95rem',
  },
  betaBadge: {
    background: '#1a5f7a',
    color: 'white',
    padding: '0.15rem 0.6rem',
    borderRadius: '12px',
    fontSize: '0.65rem',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  aiDescription: {
    fontSize: '0.85rem',
    color: '#5f6368',
    marginBottom: '2rem',
    lineHeight: 1.5,
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    flex: 1,
  },
  navItem: {
    padding: '0.75rem 1rem',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    fontSize: '0.95rem',
    color: '#202124',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  sidebarFooter: {
    marginTop: 'auto',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e8eaed',
  },
  footerText: {
    fontSize: '0.8rem',
    color: '#5f6368',
    textAlign: 'center',
  },
  // Main Content
  mainContent: {
    flex: 1,
    padding: '2rem',
    overflowY: 'auto',
  },
  // Step 1
  stepContainer: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  stepHeader: {
    marginBottom: '2rem',
  },
  mainTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#202124',
    marginBottom: '0.5rem',
  },
  subTitle: {
    fontSize: '1.1rem',
    color: '#5f6368',
  },
  eventGrid: {
    background: 'white',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1.5rem',
    marginBottom: '1.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#202124',
  },
  input: {
    padding: '0.75rem',
    border: '2px solid #e8eaed',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border 0.2s',
  },
  select: {
    padding: '0.75rem',
    border: '2px solid #e8eaed',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    cursor: 'pointer',
  },
  eventTypesGrid: {
    marginBottom: '1.5rem',
  },
  eventTypes: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
    marginTop: '0.5rem',
  },
  eventTypeBtn: {
    padding: '0.6rem 1.2rem',
    border: '2px solid #e8eaed',
    borderRadius: '20px',
    background: 'white',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s',
  },
  eventTypeBtnActive: {
    borderColor: '#1a5f7a',
    background: '#e8f0fe',
    color: '#1a5f7a',
  },
  customEventSection: {
    marginBottom: '1.5rem',
  },
  orDivider: {
    textAlign: 'center',
    color: '#5f6368',
    fontSize: '0.9rem',
    marginBottom: '0.75rem',
  },
  customEventInput: {
    width: '100%',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '2px solid #e8eaed',
    borderRadius: '8px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical',
    outline: 'none',
    transition: 'border 0.2s',
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
  btnPrimary: {
    background: '#1a5f7a',
    color: 'white',
    width: '100%',
    justifyContent: 'center',
  },
  btnOutline: {
    background: 'transparent',
    border: '2px solid #e8eaed',
    color: '#202124',
  },
  btnSuccess: {
    background: '#28a745',
    color: 'white',
  },
  btnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  btnSmall: {
    padding: '0.5rem 1rem',
    fontSize: '0.85rem',
  },
  btnLarge: {
    padding: '1rem 2.5rem',
    fontSize: '1.1rem',
  },
  spinner: {
    display: 'inline-block',
    width: '18px',
    height: '18px',
    border: '3px solid rgba(255,255,255,0.3)',
    borderTop: '3px solid white',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  // Shopping Plan
  planContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  planHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  planActions: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  categorySummaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  categorySummaryCard: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  categorySummaryIcon: {
    fontSize: '2rem',
  },
  categorySummaryInfo: {
    flex: 1,
  },
  categorySummaryTitle: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#202124',
  },
  categorySummaryCount: {
    fontSize: '0.85rem',
    color: '#5f6368',
    margin: 0,
  },
  viewAllBtn: {
    padding: '0.4rem 0.8rem',
    border: '1px solid #e8eaed',
    borderRadius: '6px',
    background: 'white',
    cursor: 'pointer',
    fontSize: '0.8rem',
    color: '#1a5f7a',
  },
  planDetails: {
    background: 'white',
    borderRadius: '12px',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  planDetailsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  sectionTitle: {
    fontSize: '1.3rem',
    fontWeight: 600,
    color: '#202124',
  },
  categorySection: {
    marginBottom: '2rem',
  },
  categorySectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  categorySectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '1.1rem',
    fontWeight: 600,
  },
  categorySectionIcon: {
    fontSize: '1.5rem',
  },
  categorySectionCount: {
    fontSize: '0.85rem',
    color: '#5f6368',
    fontWeight: 400,
  },
  viewAllLink: {
    background: 'none',
    border: 'none',
    color: '#1a5f7a',
    cursor: 'pointer',
    fontWeight: 500,
  },
  productRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1rem',
  },
  productCard: {
    border: '2px solid transparent',
    borderRadius: '8px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.2s',
    background: '#f8f9fa',
  },
  productCardSelected: {
    borderColor: '#1a5f7a',
    boxShadow: '0 4px 12px rgba(26, 95, 122, 0.15)',
  },
  productImageWrapper: {
    position: 'relative',
    height: '180px',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: '8px',
    left: '8px',
    background: '#dc3545',
    color: 'white',
    padding: '0.2rem 0.6rem',
    borderRadius: '4px',
    fontSize: '0.7rem',
    fontWeight: 700,
  },
  aiRecommendedBadge: {
    position: 'absolute',
    bottom: '8px',
    left: '8px',
    background: '#1a5f7a',
    color: 'white',
    padding: '0.2rem 0.6rem',
    borderRadius: '4px',
    fontSize: '0.65rem',
    fontWeight: 600,
  },
  selectedCheckmark: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    background: '#1a5f7a',
    color: 'white',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    fontWeight: 700,
  },
  productInfo: {
    padding: '0.75rem',
  },
  productName: {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#202124',
    marginBottom: '0.25rem',
  },
  productRating: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.8rem',
    color: '#5f6368',
    marginBottom: '0.25rem',
  },
  productReviews: {
    color: '#9aa0a6',
  },
  productPrice: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  currentPrice: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#202124',
  },
  originalPrice: {
    fontSize: '0.8rem',
    color: '#9aa0a6',
    textDecoration: 'line-through',
  },
  summarySection: {
    background: 'white',
    borderRadius: '12px',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1rem',
  },
  summaryCard: {
    background: '#f8f9fa',
    padding: '1rem',
    borderRadius: '8px',
  },
  summaryCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  },
  summaryCardTitle: {
    fontWeight: 600,
    color: '#202124',
  },
  summaryCardCount: {
    color: '#5f6368',
    fontSize: '0.85rem',
  },
  summaryCardBody: {
    fontSize: '0.9rem',
  },
  summaryTotal: {
    fontWeight: 500,
    color: '#202124',
  },
  summaryBudget: {
    color: '#5f6368',
    fontSize: '0.85rem',
  },
  planFooter: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  whySection: {
    background: 'white',
    borderRadius: '12px',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  whyTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: '1rem',
  },
  whyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '0.75rem',
  },
  whyItem: {
    padding: '0.5rem 0.75rem',
    background: '#f8f9fa',
    borderRadius: '6px',
    fontSize: '0.9rem',
    color: '#202124',
  },
  deliverySection: {
    background: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  deliveryInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  deliveryIcon: {
    fontSize: '2rem',
  },
  deliveryTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#202124',
  },
  deliveryDate: {
    fontSize: '0.95rem',
    color: '#202124',
  },
  deliveryNote: {
    fontSize: '0.8rem',
    color: '#5f6368',
  },
};
 
// Add global styles
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  * {
    box-sizing: border-box;
  }
  input:focus, select:focus, textarea:focus {
    border-color: #1a5f7a;
    box-shadow: 0 0 0 3px rgba(26, 95, 122, 0.1);
  }
  .btn-primary:hover:not(:disabled) {
    background: #134c63;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(26, 95, 122, 0.3);
  }
  .btn-success:hover {
    background: #218838;
    transform: translateY(-1px);
  }
  .btn-outline:hover {
    background: #f8f9fa;
    border-color: #b0b8c0;
  }
  .nav-item:hover {
    background: #f1f3f4;
  }
  .event-type-btn:hover {
    border-color: #b0c4d9;
    transform: scale(1.02);
  }
  .product-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  .view-all-btn:hover, .view-all-link:hover {
    color: #134c63;
  }
  @media (max-width: 768px) {
    .sidebar {
      display: none;
    }
    .main-content {
      padding: 1rem;
    }
    .form-row {
      grid-template-columns: 1fr;
    }
    .product-row {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }
    .plan-footer {
      flex-direction: column;
    }
    .plan-footer .btn {
      width: 100%;
      justify-content: center;
    }
  }
`;
document.head.appendChild(styleSheet);
 
export default ShopEasy;