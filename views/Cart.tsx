
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartItem, User, DiscountCode } from '../types';
import { Icons } from '../constants';

interface CartProps {
  user: User | null;
  items: CartItem[];
  discountCodes: DiscountCode[];
  onUpdateQty: (id: string, delta: number) => void;
  onPlaceOrder: (total: number, discountAmount: number, phone: string, discountCode?: string) => string | undefined;
}

const Cart: React.FC<CartProps> = ({ user, items, discountCodes, onUpdateQty, onPlaceOrder }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null);
  const [promoError, setPromoError] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [phoneError, setPhoneError] = useState('');
  
  const navigate = useNavigate();
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const calculateDiscount = () => {
    if (!appliedDiscount) return 0;
    if (appliedDiscount.type === 'percentage') {
      return (subtotal * appliedDiscount.value) / 100;
    }
    return Math.min(subtotal, appliedDiscount.value);
  };

  const discountAmount = calculateDiscount();
  const total = Math.max(0, subtotal - discountAmount);

  const handleApplyPromo = () => {
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    const found = discountCodes.find(d => d.code === code);
    if (found) {
      setAppliedDiscount(found);
    } else {
      setPromoError('Invalid or expired discount code');
    }
  };

  const handleRemovePromo = () => {
    setAppliedDiscount(null);
    setPromoCode('');
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!phone || phone.length < 10) {
      setPhoneError('Please enter a valid phone number for delivery.');
      return;
    }

    const orderId = onPlaceOrder(total, discountAmount, phone, appliedDiscount?.code);
    if (orderId) {
      setIsSuccess(true);
      setTimeout(() => navigate('/dashboard'), 3000);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 animate-fadeIn">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Order Placed Successfully!</h1>
        <p className="text-slate-500 mb-8">Thank you for shopping with us. Your order is now being processed.</p>
        <div className="bg-indigo-50 p-6 rounded-2xl inline-block text-indigo-700 font-medium">
          Redirecting to your dashboard...
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="text-slate-300 mb-6 flex justify-center">
          <Icons.Cart />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Your Cart is Empty</h1>
        <p className="text-slate-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-fadeIn">
      <h1 className="text-3xl font-bold text-slate-800 mb-10">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-800">{item.name}</h3>
                    <p className="text-xs text-slate-400">{item.category} • {item.brand}</p>
                  </div>
                  <span className="font-bold text-indigo-600">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center bg-slate-50 rounded-lg p-1">
                    <button 
                      onClick={() => onUpdateQty(item.id, -1)}
                      className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm transition-all"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQty(item.id, 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm transition-all"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    onClick={() => onUpdateQty(item.id, -item.quantity)}
                    className="text-red-400 hover:text-red-600 p-2"
                  >
                    <Icons.Trash />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Promo Code Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mt-6">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Icons.Tag /> Have a Discount Code?
            </h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Enter code (e.g. WELCOME10)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-grow px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button 
                onClick={handleApplyPromo}
                className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-slate-800 transition-colors"
              >
                Apply
              </button>
            </div>
            {promoError && <p className="text-red-500 text-xs mt-2 ml-1">{promoError}</p>}
            {appliedDiscount && (
              <div className="mt-4 flex items-center justify-between bg-green-50 text-green-700 px-4 py-2 rounded-xl border border-green-100">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-bold">{appliedDiscount.code}</span> applied! 
                  ({appliedDiscount.type === 'percentage' ? `${appliedDiscount.value}% off` : `Rs. ${appliedDiscount.value} off`})
                </div>
                <button onClick={handleRemovePromo} className="text-green-800 hover:text-green-950">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 h-fit sticky top-24 shadow-lg shadow-slate-100">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>
          
          {user && (
            <div className="mb-8 space-y-4">
              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                <label className="block text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Delivery Contact Number</label>
                <input 
                  type="tel"
                  placeholder="e.g. 03001234567"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setPhoneError(''); }}
                  className="w-full bg-transparent font-bold text-slate-800 focus:outline-none"
                />
              </div>
              {phoneError && <p className="text-red-500 text-[10px] font-bold px-1">{phoneError}</p>}
            </div>
          )}

          <div className="space-y-4 text-slate-600 mb-8">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium">Rs. {subtotal.toLocaleString()}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span className="font-medium">- Rs. {discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span className="text-green-600 font-medium">FREE</span>
            </div>
            <div className="flex justify-between pt-4 border-t border-slate-100">
              <span className="text-lg font-bold text-slate-800">Total</span>
              <span className="text-lg font-bold text-indigo-600">Rs. {total.toLocaleString()}</span>
            </div>
          </div>
          
          <button 
            onClick={handleCheckout}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            {user ? 'Checkout (Cash on Delivery)' : 'Login to Checkout'}
          </button>
          
          {!user && (
            <p className="mt-4 text-xs text-slate-500 text-center">
              You need an account to place an order.
            </p>
          )}
          
          <p className="text-center text-xs text-slate-400 mt-4 italic">
            Delivery across Pakistan in 2-3 business days.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
