
import React, { useState, useRef } from 'react';
import { Product, Review, User } from '../types';
import { Icons } from '../constants';

interface ProductDetailModalProps {
  product: Product;
  user: User | null;
  relatedProducts: Product[];
  onClose: () => void;
  onAddReview: (productId: string, review: Omit<Review, 'id' | 'date' | 'userId' | 'userName'>) => void;
  onAddToCart: (p: Product) => void;
  onSelectProduct: (p: Product) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
  product, 
  user, 
  relatedProducts, 
  onClose, 
  onAddReview, 
  onAddToCart,
  onSelectProduct
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const reviewFormRef = useRef<HTMLDivElement>(null);

  const averageRating = product.reviews && product.reviews.length > 0
    ? (product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1)
    : 'New';

  const scrollToReviewForm = () => {
    reviewFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    onAddReview(product.id, { rating, comment });
    setComment('');
    setRating(5);
  };

  const renderStars = (count: number, active: boolean = true) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={i < count ? (active ? 'text-amber-400' : 'text-slate-300') : 'text-slate-200'}>
        <Icons.Star />
      </span>
    ));
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-start md:items-center justify-center p-4 pt-24 md:pt-8 bg-slate-900/60 backdrop-blur-md animate-fadeIn overflow-y-auto">
      {/* Container: Max width 2xl, Fixed Height 580px for desktop to keep it compact but fully visible */}
      <div className="bg-white w-full max-w-2xl rounded-[1.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-auto md:h-[580px] max-h-[85vh] relative border border-white/20 mb-8 md:mb-0">
        
        {/* Close Button - Always visible at top right of the modal */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-40 p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-600 shadow-md hover:bg-slate-100 transition-all border border-slate-100"
        >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        {/* Left Side: Product Image - Fixed 40% width */}
        <div className="w-full md:w-[42%] bg-slate-50 relative overflow-hidden flex items-center justify-center h-[250px] md:h-full border-r border-slate-50 shrink-0">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
          />
          {/* Rating Badge */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg shadow-sm border border-slate-100 flex items-center gap-1.5">
            <span className="text-amber-400 scale-75"><Icons.Star /></span>
            <span className="font-black text-slate-800 text-[11px]">{averageRating}</span>
          </div>
          {/* Brand Tag */}
          <div className="absolute top-4 left-4">
             <span className="bg-indigo-600 text-white text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest shadow-lg">
                {product.brand}
             </span>
          </div>
        </div>

        {/* Right Side: Scrollable Details Panel */}
        <div className="w-full md:w-[58%] flex flex-col h-full bg-white relative">
          <div className="flex-grow overflow-y-auto p-5 md:p-8 space-y-6 custom-scrollbar scroll-smooth">
            
            {/* Header Info */}
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Quick View</p>
              <h2 className="text-2xl font-black text-slate-900 leading-tight uppercase tracking-tight">{product.name}</h2>
              <div className="flex items-center gap-3 mt-2">
                <div className="text-xl font-black text-indigo-600">Rs. {product.price.toLocaleString()}</div>
                {product.originalPrice && (
                  <div className="text-sm text-slate-400 line-through font-bold">Rs. {product.originalPrice.toLocaleString()}</div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
               <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-1 inline-block">Product Overview</h4>
               <p className="text-slate-600 text-xs leading-relaxed font-medium">
                 {product.description}
               </p>
               <button 
                onClick={scrollToReviewForm}
                className="text-[9px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest flex items-center gap-1"
              >
                Read Feedback <Icons.ArrowUp className="w-3 h-3 rotate-180" />
              </button>
            </div>

            {/* Main Action Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <div className="flex-grow p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-center">
                <span className="text-[8px] text-slate-400 uppercase font-black tracking-widest">Inventory Status</span>
                <span className={`text-[11px] font-black uppercase ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {product.stock > 0 ? `${product.stock} Units In Stock` : 'Out of Stock'}
                </span>
              </div>
              <button 
                disabled={product.stock === 0}
                onClick={() => { onAddToCart(product); }}
                className="flex-[1.5] bg-indigo-600 text-white rounded-xl font-black text-xs h-12 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 disabled:bg-slate-300 active:scale-95 uppercase tracking-widest"
              >
                <Icons.Cart /> Add To Cart
              </button>
            </div>

            {/* Related Items - More compact grid */}
            {relatedProducts.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">More From {product.brand}</h4>
                <div className="grid grid-cols-2 gap-3">
                  {relatedProducts.slice(0, 2).map(rel => (
                    <div 
                      key={rel.id} 
                      onClick={() => onSelectProduct(rel)}
                      className="group cursor-pointer bg-white rounded-xl p-1.5 border border-slate-100 hover:border-indigo-200 transition-all shadow-sm"
                    >
                      <div className="aspect-square rounded-lg overflow-hidden mb-1.5 bg-slate-50">
                        <img src={rel.image} alt={rel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <h5 className="text-[10px] font-bold text-slate-800 truncate px-1 group-hover:text-indigo-600">{rel.name}</h5>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback & Reviews Section */}
            <div className="space-y-4 pt-4 border-t border-slate-50" ref={reviewFormRef}>
               <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Customer Reviews</h4>
               
               {/* Review Input / Login Prompt */}
               <div>
                 {user ? (
                   <form onSubmit={handleSubmitReview} className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                     <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Your Rating</span>
                       <div className="flex gap-1">
                         {[1, 2, 3, 4, 5].map(i => (
                           <button 
                             key={i} 
                             type="button" 
                             onClick={() => setRating(i)}
                             className={`transition-colors ${i <= rating ? 'text-amber-400' : 'text-slate-200'} hover:text-amber-300`}
                           >
                             <Icons.Star />
                           </button>
                         ))}
                       </div>
                     </div>
                     <textarea 
                       placeholder="Share your experience..."
                       value={comment}
                       onChange={(e) => setComment(e.target.value)}
                       className="w-full px-4 py-3 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                       rows={2}
                       required
                     />
                     <button type="submit" className="w-full bg-slate-900 text-white text-[10px] font-black py-3 rounded-xl hover:bg-black transition-all uppercase tracking-widest shadow-lg active:scale-95">
                       Post Review
                     </button>
                   </form>
                 ) : (
                   <div className="bg-indigo-50/50 p-6 rounded-2xl text-center border border-dashed border-indigo-200">
                      <p className="text-[10px] text-indigo-700 font-black uppercase tracking-widest mb-3">Sign in to leave feedback</p>
                      <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
                        Login To Share Your Thoughts
                      </button>
                   </div>
                 )}
               </div>

               {/* Reviews List */}
               <div className="space-y-4">
                 {product.reviews && product.reviews.length > 0 ? (
                   product.reviews.map(rev => (
                     <div key={rev.id} className="bg-white p-3 rounded-xl border border-slate-50 shadow-sm">
                       <div className="flex justify-between items-center mb-1">
                         <span className="font-black text-[10px] text-slate-800 uppercase tracking-tight">{rev.userName}</span>
                         <span className="text-[9px] text-slate-400 font-bold">{rev.date}</span>
                       </div>
                       <div className="flex gap-0.5 mb-2 scale-75 origin-left">
                         {renderStars(rev.rating)}
                       </div>
                       <p className="text-[11px] text-slate-600 font-medium leading-relaxed italic">"{rev.comment}"</p>
                     </div>
                   ))
                 ) : (
                   <div className="py-6 text-center">
                     <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">No feedback yet. Be the first!</p>
                   </div>
                 )}
               </div>
            </div>
          </div>
          
          {/* Static Gradient overlays to indicate more content */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent pointer-events-none z-10"></div>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default ProductDetailModal;
