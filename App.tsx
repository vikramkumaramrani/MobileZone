
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { Product, User, CartItem, Order, Category, OrderStatus, DiscountCode, Review } from './types';
import { INITIAL_USER, INITIAL_PRODUCTS, Icons } from './constants';
import Login from './views/Login';
import Signup from './views/Signup';
import Home from './views/Home';
import Dashboard from './views/Dashboard';
import AdminPanel from './views/AdminPanel';
import Cart from './views/Cart';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import EmailModal from './components/EmailModal';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('pmh_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('pmh_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('pmh_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('pmh_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>(() => {
    const saved = localStorage.getItem('pmh_discounts');
    return saved ? JSON.parse(saved) : [
      { id: 'd1', code: 'WELCOME10', type: 'percentage', value: 10 },
      { id: 'd2', code: 'PKTECH', type: 'fixed', value: 1000 }
    ];
  });

  // Flash Sale End Time State
  const [flashSaleEnd, setFlashSaleEnd] = useState<string>(() => {
    const saved = localStorage.getItem('pmh_flash_sale_end');
    if (saved) return saved;
    // Default to 24 hours from now
    const tomorrow = new Date();
    tomorrow.setHours(tomorrow.getHours() + 24);
    return tomorrow.toISOString();
  });

  // Visitor Counter State
  const [visitorCount, setVisitorCount] = useState<number>(() => {
    const saved = localStorage.getItem('pmh_visitor_count');
    return saved ? parseInt(saved, 10) : 1248; // Realistic starting seed
  });

  // Email simulation states
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showEmailToast, setShowEmailToast] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('pmh_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('pmh_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('pmh_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('pmh_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('pmh_discounts', JSON.stringify(discountCodes));
  }, [discountCodes]);

  useEffect(() => {
    localStorage.setItem('pmh_flash_sale_end', flashSaleEnd);
  }, [flashSaleEnd]);

  // Visitor Counter Persistence & Auto-increment logic
  useEffect(() => {
    const sessionVisited = sessionStorage.getItem('pmh_session_visited');
    if (!sessionVisited) {
      setVisitorCount(prev => {
        const next = prev + 1;
        localStorage.setItem('pmh_visitor_count', next.toString());
        return next;
      });
      sessionStorage.setItem('pmh_session_visited', 'true');
    }
  }, []);

  const handleLogin = (u: User) => setUser(u);
  const handleLogout = () => {
    setUser(null);
    setCart([]);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const placeOrder = (total: number, discountAmount: number, phone: string, discountCode?: string) => {
    if (!user || cart.length === 0) return;
    
    const newOrder: Order = {
      id: 'ORD-' + Date.now(),
      userId: user.id,
      customerName: user.name,
      phone: phone,
      date: new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Pending',
      total: total,
      discountAmount,
      discountCode,
      items: cart.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    };

    // Decrement stock
    setProducts(prev => prev.map(p => {
      const cartItem = cart.find(ci => ci.id === p.id);
      if (cartItem) {
        return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
      }
      return p;
    }));

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    
    // Trigger email simulation
    setLastOrder(newOrder);
    setTimeout(() => {
      setShowEmailToast(true);
      // Auto-hide toast after 8 seconds
      setTimeout(() => setShowEmailToast(false), 8000);
    }, 1500);

    return newOrder.id;
  };

  const updateProduct = (p: Product) => {
    setProducts(prev => {
      const exists = prev.find(item => item.id === p.id);
      if (exists) return prev.map(item => item.id === p.id ? p : item);
      return [p, ...prev];
    });
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addReview = (productId: string, reviewData: Omit<Review, 'id' | 'date' | 'userId' | 'userName'>) => {
    if (!user) return;
    const newReview: Review = {
      ...reviewData,
      id: 'R-' + Date.now(),
      date: new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }),
      userId: user.id,
      userName: user.name
    };

    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          reviews: [newReview, ...(p.reviews || [])]
        };
      }
      return p;
    }));
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const addDiscountCode = (code: DiscountCode) => {
    setDiscountCodes(prev => [...prev, code]);
  };

  const deleteDiscountCode = (id: string) => {
    setDiscountCodes(prev => prev.filter(d => d.id !== id));
  };

  const updateFlashSaleEnd = (isoString: string) => {
    setFlashSaleEnd(isoString);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col relative">
        <Navbar user={user} cartCount={cart.length} onLogout={handleLogout} />
        
        {/* Email Simulation Toast */}
        {showEmailToast && (
          <div className="fixed top-20 right-4 z-[90] animate-slideInRight cursor-pointer group" onClick={() => { setShowEmailModal(true); setShowEmailToast(false); }}>
            <div className="bg-white border border-slate-100 shadow-2xl rounded-2xl p-4 flex items-center gap-4 max-w-sm hover:border-indigo-200 transition-all">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Icons.Email />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-indigo-600 mb-0.5">New Email Received</p>
                <p className="text-sm font-bold text-slate-800 truncate">Your Order Confirmation</p>
                <p className="text-xs text-slate-500 truncate">Click to view order details for {lastOrder?.id}</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setShowEmailToast(false); }} className="text-slate-300 hover:text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Email Modal */}
        {showEmailModal && lastOrder && user && (
          <EmailModal 
            order={lastOrder} 
            user={user} 
            onClose={() => setShowEmailModal(false)} 
          />
        )}

        <main className="flex-grow container mx-auto px-4 py-6 md:py-10">
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
            <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup onLogin={handleLogin} />} />
            
            <Route path="/" element={
              <Home 
                products={products} 
                user={user} 
                visitorCount={visitorCount} 
                onAddToCart={addToCart} 
                onAddReview={addReview} 
                flashSaleEnd={flashSaleEnd}
              />
            } />
            
            <Route path="/cart" element={
              <Cart 
                user={user}
                items={cart} 
                discountCodes={discountCodes}
                onUpdateQty={updateCartQuantity} 
                onPlaceOrder={placeOrder} 
              />
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute user={user}>
                <Dashboard user={user!} orders={orders} products={products} />
              </ProtectedRoute>
            } />
            
            <Route path="/admin" element={
              <ProtectedRoute user={user} adminOnly>
                <AdminPanel 
                  products={products} 
                  onUpdateProduct={updateProduct} 
                  onDeleteProduct={deleteProduct}
                  orders={orders}
                  onUpdateOrderStatus={updateOrderStatus}
                  discountCodes={discountCodes}
                  onAddDiscount={addDiscountCode}
                  onDeleteDiscount={deleteDiscountCode}
                  flashSaleEnd={flashSaleEnd}
                  onUpdateFlashSale={updateFlashSaleEnd}
                />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <Footer />

        <ScrollToTop />
      </div>
    </Router>
  );
};

const ProtectedRoute: React.FC<{ user: User | null, adminOnly?: boolean, children: React.ReactNode }> = ({ user, adminOnly, children }) => {
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;
  return <>{children}</>;
};

export default App;
