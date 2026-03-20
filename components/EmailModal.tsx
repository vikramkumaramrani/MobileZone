
import React from 'react';
import { Order, User } from '../types';

interface EmailModalProps {
  order: Order;
  user: User;
  onClose: () => void;
}

const EmailModal: React.FC<EmailModalProps> = ({ order, user, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Email Header */}
        <div className="bg-slate-50 border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-xs">P</div>
            <div>
              <p className="text-xs font-bold text-slate-800">Devrajani Mobile Zone  Support</p>
              <p className="text-[10px] text-slate-500">To: {user.email}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Email Body */}
        <div className="overflow-y-auto p-8 md:p-12 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Order Confirmed!</h1>
            <p className="text-slate-500">Hi {user.name}, your order has been received and is being processed.</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Order Details</span>
              <span className="text-sm font-mono text-indigo-600">{order.id}</span>
            </div>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-slate-700">
                    <span className="font-bold">{item.quantity}x</span> {item.name}
                  </span>
                  <span className="font-bold text-slate-900">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-900">Total Amount</span>
                <span className="text-xl font-bold text-indigo-600">Rs. {order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <h4 className="font-bold text-slate-800 mb-2">Shipping To</h4>
              <p className="text-slate-500 leading-relaxed">
                {user.name}<br />
                {order.phone}<br />
                Standard Delivery Address<br />
                Pakistan
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-2">Payment Method</h4>
              <p className="text-slate-500">Cash on Delivery (COD)</p>
            </div>
          </div>

          <div className="pt-8 border-t text-center text-[11px] text-slate-400">
            <p>© 2026 Devrajani Mobile Zone. All rights reserved.</p>
            <p className="mt-1">If you have any questions, reply to this email or visit our help center.</p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-6 bg-slate-50 border-t flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailModal;
