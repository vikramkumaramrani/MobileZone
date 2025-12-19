
import React, { useState } from 'react';
import { Product, Order, Category, OrderStatus, DiscountCode } from '../types';
import { Icons } from '../constants';

interface AdminPanelProps {
  products: Product[];
  onUpdateProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  orders: Order[];
  onUpdateOrderStatus: (id: string, status: OrderStatus) => void;
  discountCodes: DiscountCode[];
  onAddDiscount: (code: DiscountCode) => void;
  onDeleteDiscount: (id: string) => void;
  flashSaleEnd: string;
  onUpdateFlashSale: (isoString: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  products, 
  onUpdateProduct, 
  onDeleteProduct, 
  orders, 
  onUpdateOrderStatus,
  discountCodes,
  onAddDiscount,
  onDeleteDiscount,
  flashSaleEnd,
  onUpdateFlashSale
}) => {
  const [view, setView] = useState<'products' | 'orders' | 'discounts' | 'settings'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isAddingDiscount, setIsAddingDiscount] = useState(false);

  const categories: Category[] = ['Mobiles', 'Cables', 'Earbuds', 'Accessories', 'Mobile Parts'];

  const totalRevenue = orders.reduce((acc, o) => o.status === 'Completed' ? acc + o.total : acc, 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const completedOrders = orders.filter(o => o.status === 'Completed').length;
  const cancelledOrders = orders.filter(o => o.status === 'Cancelled').length;
  const lowStockCount = products.filter(p => p.stock < 5).length;
  const totalProducts = products.length;
  
  const revenueGoal = 1000000;
  const revenueProgress = Math.min(100, (totalRevenue / revenueGoal) * 100);
  
  const totalOrders = orders.length || 1;

  const inventoryHealth = totalProducts > 0 ? Math.round(((totalProducts - lowStockCount) / totalProducts) * 100) : 100;

  const handleProductSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const imageUrl = formData.get('image') as string;
    const hoverImageUrl = formData.get('hoverImage') as string;
    
    const product: Product = {
      id: editingProduct?.id || 'P-' + Date.now(),
      name: formData.get('name') as string,
      brand: formData.get('brand') as string,
      category: formData.get('category') as Category,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      originalPrice: formData.get('originalPrice') ? Number(formData.get('originalPrice')) : undefined,
      stock: Number(formData.get('stock')),
      isHot: formData.get('isHot') === 'on',
      image: imageUrl || `https://picsum.photos/seed/${formData.get('name')}/400/400`,
      hoverImage: hoverImageUrl || undefined
    };
    onUpdateProduct(product);
    setEditingProduct(null);
    setIsAddingProduct(false);
  };

  const handleDiscountSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const discount: DiscountCode = {
      id: 'D-' + Date.now(),
      code: (formData.get('code') as string).toUpperCase(),
      type: formData.get('type') as 'percentage' | 'fixed',
      value: Number(formData.get('value'))
    };
    onAddDiscount(discount);
    setIsAddingDiscount(false);
  };

  const handleSettingsSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const date = formData.get('saleDate') as string;
    const time = formData.get('saleTime') as string;
    
    if (date && time) {
      const newEnd = new Date(`${date}T${time}`);
      onUpdateFlashSale(newEnd.toISOString());
      alert('Offer time updated successfully!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Admin Control Center</h1>
          <p className="text-slate-500">Manage your store's performance and inventory</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-slate-100 shadow-sm h-fit overflow-x-auto">
          <button 
            onClick={() => setView('products')}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all whitespace-nowrap ${view === 'products' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-indigo-600'}`}
          >
            Products
          </button>
          <button 
            onClick={() => setView('orders')}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all whitespace-nowrap ${view === 'orders' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-indigo-600'}`}
          >
            Orders
          </button>
          <button 
            onClick={() => setView('discounts')}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all whitespace-nowrap ${view === 'discounts' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-indigo-600'}`}
          >
            Discounts
          </button>
          <button 
            onClick={() => setView('settings')}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all whitespace-nowrap ${view === 'settings' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-indigo-600'}`}
          >
            Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between overflow-hidden relative group">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Total Revenue</p>
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Icons.Dashboard />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">Rs. {totalRevenue.toLocaleString()}</p>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold text-indigo-600">{Math.round(revenueProgress)}% of Goal</span>
            </div>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden relative z-10">
            <div className="h-full bg-indigo-600" style={{ width: `${revenueProgress}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between overflow-hidden relative group">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Order Status</p>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <Icons.Tag />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">{orders.length}</p>
            <div className="flex gap-4 text-[10px] font-bold uppercase tracking-tight mb-4">
              <span className="text-amber-500">{pendingOrders} Pending</span>
              <span className="text-emerald-500">{completedOrders} Done</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between overflow-hidden relative group">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Inventory Health</p>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Icons.Fire />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">{inventoryHealth}%</p>
          </div>
        </div>
      </div>

      {view === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">Inventory List</h2>
            <button 
              onClick={() => setIsAddingProduct(true)}
              className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-lg shadow-indigo-100 transition-all active:scale-95"
            >
              <Icons.Plus /> Add Product
            </button>
          </div>

          {(isAddingProduct || editingProduct) && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl animate-scaleIn">
                <h3 className="text-2xl font-bold mb-6">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Product Name</label>
                      <input name="name" required defaultValue={editingProduct?.name} className="w-full px-4 py-2 bg-slate-50 border rounded-xl" />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Main Image URL</label>
                      <input name="image" placeholder="https://example.com/image.jpg" defaultValue={editingProduct?.image} className="w-full px-4 py-2 bg-slate-50 border rounded-xl" />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Hover Image URL (Opt)</label>
                      <input name="hoverImage" placeholder="Secondary Image" defaultValue={editingProduct?.hoverImage} className="w-full px-4 py-2 bg-slate-50 border rounded-xl" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Brand</label>
                      <input name="brand" required defaultValue={editingProduct?.brand} className="w-full px-4 py-2 bg-slate-50 border rounded-xl" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Category</label>
                      <select name="category" defaultValue={editingProduct?.category} className="w-full px-4 py-2 bg-slate-50 border rounded-xl">
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Sale Price (PKR)</label>
                      <input name="price" type="number" required defaultValue={editingProduct?.price} className="w-full px-4 py-2 bg-slate-50 border rounded-xl" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Original Price (Opt)</label>
                      <input name="originalPrice" type="number" defaultValue={editingProduct?.originalPrice} placeholder="For slashed price display" className="w-full px-4 py-2 bg-slate-50 border rounded-xl" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Initial Stock</label>
                      <input name="stock" type="number" required defaultValue={editingProduct?.stock} className="w-full px-4 py-2 bg-slate-50 border rounded-xl" />
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                      <input type="checkbox" name="isHot" id="isHot" defaultChecked={editingProduct?.isHot} className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                      <label htmlFor="isHot" className="text-xs font-bold text-slate-700 uppercase">Mark as Hot Deal</label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Description</label>
                    <textarea name="description" rows={3} required defaultValue={editingProduct?.description} className="w-full px-4 py-2 bg-slate-50 border rounded-xl" />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => { setEditingProduct(null); setIsAddingProduct(false); }} className="flex-1 px-6 py-3 border rounded-xl font-bold hover:bg-slate-50 transition-colors">Cancel</button>
                    <button type="submit" className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">Save Product</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Price Info</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={p.image} className="w-10 h-10 rounded-lg object-cover" alt="" />
                          <div>
                            <p className="font-bold text-slate-800 flex items-center gap-2">
                               {p.name}
                               {p.isHot && <span className="text-orange-500 scale-75"><Icons.Fire /></span>}
                            </p>
                            <p className="text-[10px] text-slate-400 uppercase">{p.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900">Rs. {p.price.toLocaleString()}</p>
                        {p.originalPrice && (
                           <p className="text-[10px] text-slate-400 line-through">Rs. {p.originalPrice.toLocaleString()}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${p.stock < 5 ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-600'}`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => setEditingProduct(p)} className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Icons.Edit /></button>
                          <button onClick={() => onDeleteProduct(p.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Icons.Trash /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {view === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm max-w-2xl">
             <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Icons.Fire className="text-orange-500" /> Flash Sale Settings
             </h2>
             <p className="text-slate-500 text-sm mb-8">Set when your flash sale campaign should end. This affects the countdown timer on the homepage.</p>
             
             <form onSubmit={handleSettingsSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">End Date</label>
                      <input 
                        type="date" 
                        name="saleDate" 
                        required 
                        defaultValue={new Date(flashSaleEnd).toISOString().split('T')[0]} 
                        className="w-full px-4 py-2 bg-slate-50 border rounded-xl" 
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">End Time</label>
                      <input 
                        type="time" 
                        name="saleTime" 
                        required 
                        defaultValue={new Date(flashSaleEnd).toTimeString().split(' ')[0].substring(0, 5)} 
                        className="w-full px-4 py-2 bg-slate-50 border rounded-xl" 
                      />
                   </div>
                </div>
                
                <div className="bg-indigo-50 p-4 rounded-2xl">
                   <p className="text-xs text-indigo-700 font-bold uppercase mb-1">Current End Time</p>
                   <p className="text-sm font-medium text-indigo-900">
                      {new Date(flashSaleEnd).toLocaleString('en-PK', { dateStyle: 'full', timeStyle: 'short' })}
                   </p>
                </div>

                <button 
                  type="submit" 
                  className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
                >
                  Update Offer Time
                </button>
             </form>
          </div>
        </div>
      )}
      
      {view === 'orders' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800">Order Management</h2>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                   <tr>
                     <th className="px-6 py-4">ID / Customer</th>
                     <th className="px-6 py-4">Contact</th>
                     <th className="px-6 py-4">Total</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                   {orders.map(o => (
                     <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                       <td className="px-6 py-4">
                         <p className="text-xs font-mono text-indigo-600">{o.id}</p>
                         <p className="text-sm font-bold">{o.customerName}</p>
                       </td>
                       <td className="px-6 py-4">
                         <p className="text-xs font-bold text-slate-700">{o.phone}</p>
                       </td>
                       <td className="px-6 py-4 font-bold">Rs. {o.total.toLocaleString()}</td>
                       <td className="px-6 py-4">
                         <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                           o.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                           o.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                         }`}>
                           {o.status}
                         </span>
                       </td>
                       <td className="px-6 py-4">
                         <select 
                           value={o.status} 
                           onChange={(e) => onUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                           className="text-xs border rounded-lg p-1 bg-white outline-none"
                         >
                           <option value="Pending">Pending</option>
                           <option value="Completed">Completed</option>
                           <option value="Cancelled">Cancelled</option>
                         </select>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        </div>
      )}

      {view === 'discounts' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">Discount Coupons</h2>
            <button 
              onClick={() => setIsAddingDiscount(true)}
              className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-slate-800 flex items-center gap-2 transition-all active:scale-95"
            >
              <Icons.Plus /> New Code
            </button>
          </div>

          {isAddingDiscount && (
             <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-8 max-sm w-full shadow-2xl animate-scaleIn">
                   <h3 className="text-2xl font-bold mb-6">Create Coupon</h3>
                   <form onSubmit={handleDiscountSubmit} className="space-y-4">
                      <div>
                         <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Code</label>
                         <input name="code" required placeholder="OFF20" className="w-full px-4 py-2 bg-slate-50 border rounded-xl" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Type</label>
                            <select name="type" className="w-full px-4 py-2 bg-slate-50 border rounded-xl">
                               <option value="percentage">Percent (%)</option>
                               <option value="fixed">Fixed (Rs)</option>
                            </select>
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Value</label>
                            <input name="value" type="number" required className="w-full px-4 py-2 bg-slate-50 border rounded-xl" />
                         </div>
                      </div>
                      <div className="flex gap-3 pt-4">
                         <button type="button" onClick={() => setIsAddingDiscount(false)} className="flex-1 px-6 py-3 border rounded-xl font-bold">Cancel</button>
                         <button type="submit" className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold">Create</button>
                      </div>
                   </form>
                </div>
             </div>
          )}

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
             <table className="w-full text-left">
               <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                 <tr>
                   <th className="px-6 py-4">Code</th>
                   <th className="px-6 py-4">Benefit</th>
                   <th className="px-6 py-4">Action</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                 {discountCodes.map(d => (
                   <tr key={d.id}>
                     <td className="px-6 py-4 font-bold text-indigo-600">{d.code}</td>
                     <td className="px-6 py-4 text-sm">
                        {d.type === 'percentage' ? `${d.value}% Off` : `Rs. ${d.value.toLocaleString()} Off`}
                     </td>
                     <td className="px-6 py-4 text-sm text-red-500 cursor-pointer hover:underline" onClick={() => onDeleteDiscount(d.id)}>Delete</td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
