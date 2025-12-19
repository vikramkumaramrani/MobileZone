
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Product, Category, User, Review } from '../types';
import { Icons, TESTIMONIALS } from '../constants';
import ProductDetailModal from '../components/ProductDetailModal';
import ShareModal from '../components/ShareModal';
import SkeletonCard from '../components/SkeletonCard';

interface HomeProps {
  products: Product[];
  user: User | null;
  visitorCount: number;
  onAddToCart: (p: Product) => void;
  onAddReview: (productId: string, review: Omit<Review, 'id' | 'date' | 'userId' | 'userName'>) => void;
  flashSaleEnd: string;
}

type SortOption = 'featured' | 'price-low' | 'price-high' | 'name-az';

const HERO_IMAGES = [
  "https://picsum.photos/seed/phone1/600/800",
  "https://picsum.photos/seed/phone2/600/800",
  "https://picsum.photos/seed/phone3/600/800",
  "https://picsum.photos/seed/phone4/600/800"
];

const Home: React.FC<HomeProps> = ({ products, user, visitorCount, onAddToCart, onAddReview, flashSaleEnd }) => {
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sharingProduct, setSharingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [displayCount, setDisplayCount] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const categories: (Category | 'All')[] = ['All', 'Mobiles', 'Cables', 'Earbuds', 'Accessories', 'Mobile Parts'];

  // Hero Slider logic
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(slideInterval);
  }, []);

  // Countdown timer logic
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(flashSaleEnd).getTime();
      const difference = end - now;
      if (difference <= 0) return { hours: 0, minutes: 0, seconds: 0 };
      return {
        hours: Math.floor((difference / (1000 * 60 * 60))),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [flashSaleEnd]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Smooth counting animation for visitor counter
  useEffect(() => {
    let start = 0;
    const end = visitorCount;
    if (start === end) return;
    let totalDuration = 2000;
    let increment = end / (totalDuration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayCount(end);
        clearInterval(timer);
      } else {
        setDisplayCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [visitorCount]);

  // Enhanced Loading Effect
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery, sortBy]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const cleanQuery = searchQuery.trim().toLowerCase();
      const matchesSearch = p.name.toLowerCase().includes(cleanQuery) || 
                            p.brand.toLowerCase().includes(cleanQuery);
      return matchesCategory && matchesSearch;
    });

    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'name-az': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break;
    }
    return result;
  }, [products, activeCategory, searchQuery, sortBy]);

  const flashSaleProducts = useMemo(() => {
    return products.filter(p => p.originalPrice && p.originalPrice > p.price).slice(0, 4);
  }, [products]);

  const suggestions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query.length < 1) return { brands: [], products: [] };
    const uniqueBrands = Array.from(new Set(products.map(p => p.brand)))
      .filter((brand: string) => brand.toLowerCase().includes(query))
      .slice(0, 3);
    const matchingProducts = products
      .filter(p => p.name.toLowerCase().includes(query))
      .slice(0, 5);
    return { brands: uniqueBrands, products: matchingProducts };
  }, [products, searchQuery]);

  const resetFilters = () => {
    setActiveCategory('All');
    setSearchQuery('');
    setSortBy('featured');
    setShowSuggestions(false);
  };

  const isFiltered = activeCategory !== 'All' || searchQuery !== '' || sortBy !== 'featured';

  const calculateDiscount = (p: Product) => {
    if (!p.originalPrice) return 0;
    return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {selectedProduct && (
        <ProductDetailModal 
          product={products.find(p => p.id === selectedProduct.id) || selectedProduct} 
          user={user}
          relatedProducts={products.filter(p => p.id !== selectedProduct.id && p.category === selectedProduct.category).slice(0, 4)}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={onAddToCart}
          onAddReview={onAddReview}
          onSelectProduct={(p) => setSelectedProduct(p)}
        />
      )}

      {sharingProduct && (
        <ShareModal product={sharingProduct} onClose={() => setSharingProduct(null)} />
      )}

      {/* HERO SECTION WITH IMAGE SLIDER */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-500 text-white shadow-2xl">
        <div className="flex flex-col lg:flex-row items-center min-h-[500px]">
          {/* Left Text Content */}
          <div className="w-full lg:w-1/2 p-6 md:p-10 lg:pl-16 z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-100">
                {displayCount.toLocaleString()} Live Visits
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-1 tracking-tighter uppercase italic leading-none">Mobile Phones</h1>
            <p className="text-lg md:text-xl font-semibold mb-0.5 text-white/90">Affordable Phones For Your Budget</p>
            <p className="text-xs md:text-sm text-indigo-100/70 mb-6 font-medium">Quality You Can Trust, Price You'll Love!</p>
            <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start">
              <div className="px-5 py-2 bg-yellow-400 rounded-xl transform -rotate-1 hover:rotate-0 transition-all cursor-default shadow-lg">
                 <span className="text-2xl md:text-3xl font-black text-indigo-900 uppercase tracking-tighter">FLASH SALE</span>
              </div>
              <button onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })} className="flex items-center gap-2 bg-white text-indigo-900 px-6 py-2.5 rounded-full font-bold hover:bg-slate-50 transition-all shadow-xl group">
                <div className="bg-indigo-900 text-white rounded-full p-1 group-hover:rotate-12 transition-transform"><Icons.Cart /></div>
                <span className="text-sm">BUY NOW</span>
              </button>
            </div>
          </div>

          {/* Right Image Slider */}
          <div className="w-full lg:w-1/2 relative h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden flex items-center justify-center">
            {HERO_IMAGES.map((img, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out transform flex items-center justify-center p-8 ${
                  index === currentSlide 
                    ? 'opacity-100 scale-100 translate-x-0' 
                    : 'opacity-0 scale-90 translate-x-12'
                }`}
              >
                <div className="relative group">
                  <div className="absolute -inset-4 bg-white/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <img 
                    src={img} 
                    className="max-h-[80%] lg:max-h-[90%] w-auto rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-white/10 relative z-10" 
                    alt={`Slide ${index + 1}`} 
                  />
                </div>
              </div>
            ))}

            {/* Slider Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {HERO_IMAGES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 transition-all duration-300 rounded-full ${
                    index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FLASH DEALS BAR */}
      <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-slate-900 p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-yellow-400 text-slate-900 rounded-xl animate-pulse"><Icons.Fire /></div>
             <div>
                <h2 className="text-white font-black uppercase tracking-tighter leading-none text-xl md:text-2xl">Flash Deals</h2>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Limited Time Only</p>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <span className="text-slate-400 text-xs font-bold uppercase tracking-widest hidden sm:block">Ending In:</span>
             <div className="flex gap-2">
                {[ { label: 'H', val: timeLeft.hours }, { label: 'M', val: timeLeft.minutes }, { label: 'S', val: timeLeft.seconds } ].map((t, idx) => (
                  <div key={idx} className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-center min-w-[44px]">
                     <span className="text-white font-black block text-lg leading-none">{t.val.toString().padStart(2, '0')}</span>
                     <span className="text-slate-400 text-[8px] font-bold uppercase">{t.label}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
        <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
           {flashSaleProducts.map(p => (
              <div key={p.id} onClick={() => setSelectedProduct(p)} className="group cursor-pointer space-y-3">
                 <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                    <img 
                      src={p.image} 
                      className={`w-full h-full object-cover transition-all duration-500 ${p.hoverImage ? 'group-hover:opacity-0' : 'group-hover:scale-110'}`} 
                      alt="" 
                    />
                    {p.hoverImage && (
                      <img 
                        src={p.hoverImage} 
                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                        alt="" 
                      />
                    )}
                    <div className="absolute top-2 left-2 bg-yellow-400 text-indigo-900 text-[9px] font-black px-2 py-1 rounded-lg shadow-sm uppercase">-{calculateDiscount(p)}% Off</div>
                    
                    {/* Quick View Button for Deals */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                       <div className="bg-white/90 backdrop-blur-md p-3 rounded-full shadow-2xl text-indigo-600 scale-90 group-hover:scale-100 transition-transform">
                          <Icons.Eye />
                       </div>
                    </div>
                 </div>
                 <div className="space-y-1">
                    <h3 className="font-bold text-slate-800 text-xs line-clamp-1">{p.name}</h3>
                    <div className="flex items-center gap-2">
                       <span className="text-sm font-black text-indigo-600">Rs. {p.price.toLocaleString()}</span>
                       <span className="text-[10px] text-slate-400 line-through">Rs. {p.originalPrice?.toLocaleString()}</span>
                    </div>
                 </div>
              </div>
           ))}
        </div>
      </section>

      {/* FILTERS & SEARCH */}
      <div className="bg-white p-4 md:p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          <div className="flex flex-wrap gap-1.5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activeCategory === cat ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-start">
            <div className="relative flex-grow sm:w-64" ref={searchContainerRef}>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Icons.Search /></span>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onFocus={() => setShowSuggestions(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-sm transition-all"
                />
              </div>
              {showSuggestions && (suggestions.brands.length > 0 || suggestions.products.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[80] overflow-hidden animate-slideInDown">
                  {suggestions.brands.map(brand => (
                    <button key={brand} onClick={() => { setSearchQuery(brand); setShowSuggestions(false); }} className="w-full text-left px-3 py-1.5 text-xs hover:bg-indigo-50 rounded-lg flex items-center gap-2">
                      <span className="text-slate-400"><Icons.Tag /></span>
                      <span className="font-medium text-slate-700">{brand}</span>
                    </button>
                  ))}
                  {suggestions.products.map(product => (
                    <button key={product.id} onClick={() => { setSelectedProduct(product); setShowSuggestions(false); }} className="w-full text-left px-3 py-1.5 text-xs hover:bg-indigo-50 rounded-lg flex items-center gap-3">
                      <img src={product.image} alt="" className="w-6 h-6 rounded-md object-cover" />
                      <span className="font-bold text-slate-800 line-clamp-1">{product.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer w-full sm:w-auto"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-low">Price: Low-High</option>
              <option value="price-high">Price: High-Low</option>
              <option value="name-az">Name: A-Z</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-slate-50 pt-3">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            {isLoading ? "Refreshing inventory..." : <><span className="text-indigo-600">{filteredAndSortedProducts.length}</span> results</>}
          </p>
          {isFiltered && !isLoading && <button onClick={resetFilters} className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest">Reset Filters</button>}
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          filteredAndSortedProducts.map(product => (
            <div key={product.id} onClick={() => setSelectedProduct(product)} className="group cursor-pointer bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-indigo-50/50 transition-all transform hover:-translate-y-1 flex flex-col h-full relative">
              <div className="relative aspect-square overflow-hidden bg-slate-50">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className={`w-full h-full object-cover transition-all duration-500 ${product.hoverImage ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`} 
                />
                {product.hoverImage && (
                  <img 
                    src={product.hoverImage} 
                    alt={product.name} 
                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                  />
                )}
                
                {product.originalPrice && product.originalPrice > product.price && (
                   <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-md animate-bounce z-20">-{calculateDiscount(product)}%</div>
                )}
                {product.isHot && (
                   <div className="absolute top-2 right-2 bg-orange-500 text-white p-1 rounded-lg shadow-md animate-pulse z-20"><Icons.Fire /></div>
                )}
                
                {/* Floating Action Buttons Overlay */}
                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0 z-30">
                   <button 
                     onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); }}
                     className="p-2 bg-white text-indigo-600 rounded-xl shadow-lg hover:bg-indigo-600 hover:text-white transition-all scale-90"
                     title="Quick View"
                   >
                     <Icons.Eye />
                   </button>
                   <button 
                     onClick={(e) => { e.stopPropagation(); setSharingProduct(product); }} 
                     className="p-2 bg-white text-slate-600 rounded-xl shadow-lg hover:bg-indigo-600 hover:text-white transition-all scale-90"
                     title="Share"
                   >
                     <Icons.Share />
                   </button>
                </div>

                {/* Explicit Quick View Label for Desktop */}
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20 hidden md:block">
                  <div className="bg-white/90 backdrop-blur-md py-2.5 rounded-xl text-center text-[10px] font-black text-indigo-600 uppercase tracking-widest shadow-xl border border-indigo-50">
                    Quick View
                  </div>
                </div>

                {/* Small Mobile Quick View Indicator */}
                <div className="absolute bottom-2 right-2 p-1.5 bg-white/90 backdrop-blur-md rounded-lg text-indigo-600 md:hidden shadow-sm z-10 scale-90">
                   <Icons.Eye />
                </div>
              </div>
              
              <div className="p-3 md:p-5 flex flex-col flex-grow">
                <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1">{product.brand}</span>
                <h3 className="font-bold text-slate-800 text-sm md:text-base mb-1 md:mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">{product.name}</h3>
                <div className="flex items-center gap-1.5 mb-3">
                  <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 5 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-orange-500' : 'bg-red-500'}`}></div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">
                    {product.stock === 0 ? 'Sold Out' : product.stock <= 5 ? 'Low Stock' : 'Available'}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-900 leading-none">Rs. {product.price.toLocaleString()}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                       <span className="text-[10px] text-slate-400 line-through">Rs. {product.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                  <button disabled={product.stock === 0} onClick={(e) => { e.stopPropagation(); onAddToCart(product); }} className={`p-2 rounded-lg transition-all ${product.stock === 0 ? 'bg-slate-100 text-slate-300' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white shadow-sm scale-90 md:scale-100'}`}><Icons.Cart /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* TRUST FEATURES */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center text-center group">
            <div className="mb-2 text-slate-800 transition-colors group-hover:text-indigo-600 scale-75"><Icons.Truck /></div>
            <h3 className="text-[10px] md:text-xs font-black text-slate-900 uppercase tracking-widest">Free Shipping</h3>
          </div>
          <div className="flex flex-col items-center text-center group">
            <div className="mb-2 text-slate-800 transition-colors group-hover:text-indigo-600 scale-75"><Icons.Video /></div>
            <h3 className="text-[10px] md:text-xs font-black text-slate-900 uppercase tracking-widest">Packing Video</h3>
          </div>
          <div className="flex flex-col items-center text-center group">
            <div className="mb-2 text-slate-800 transition-colors group-hover:text-indigo-600 scale-75"><Icons.Clock /></div>
            <h3 className="text-[10px] md:text-xs font-black text-slate-900 uppercase tracking-widest">Fast Delivery</h3>
          </div>
          <div className="flex flex-col items-center text-center group">
            <div className="mb-2 text-slate-800 transition-colors group-hover:text-indigo-600 scale-75"><Icons.Shield /></div>
            <h3 className="text-[10px] md:text-xs font-black text-slate-900 uppercase tracking-widest leading-none">Checking Warranty</h3>
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <section className="bg-slate-50 py-12 px-6 rounded-[40px] border border-slate-100">
        <h2 className="text-2xl md:text-4xl font-black text-slate-800 uppercase tracking-tight text-center mb-10">Customer Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(t => (
            <div key={t.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50 flex flex-col">
              <p className="text-sm text-slate-600 italic mb-6">"{t.comment}"</p>
              <div className="flex items-center gap-4 mt-auto">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full border-2 border-indigo-50" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800">{t.name}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{t.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
