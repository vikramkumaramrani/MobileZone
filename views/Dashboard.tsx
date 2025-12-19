
import React from 'react';
import { User, Order, Product } from '../types';
import { Icons } from '../constants';

interface DashboardProps {
  user: User;
  orders: Order[];
  products: Product[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, orders, products }) => {
  const userOrders = orders.filter(o => o.userId === user.id);
  
  const stats = {
    pending: userOrders.filter(o => o.status === 'Pending').length,
    completed: userOrders.filter(o => o.status === 'Completed').length,
    totalSpent: userOrders.reduce((acc, o) => o.status === 'Completed' ? acc + o.total : acc, 0)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-700';
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Order History</h1>
          <p className="text-slate-500">Track and manage your tech purchases</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <Icons.User />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">{user.name}</p>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-sm font-medium mb-1">Pending Orders</p>
          <p className="text-3xl font-bold text-amber-500">{stats.pending}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-sm font-medium mb-1">Completed Orders</p>
          <p className="text-3xl font-bold text-green-500">{stats.completed}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-sm font-medium mb-1">Total Lifetime Spend</p>
          <p className="text-3xl font-bold text-indigo-600">Rs. {stats.totalSpent.toLocaleString()}</p>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <h2 className="font-bold text-slate-800">All Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {userOrders.length > 0 ? userOrders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5 font-mono text-xs text-indigo-600">{order.id}</td>
                  <td className="px-6 py-5 text-sm text-slate-600">{order.date}</td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      {order.items.map((item, idx) => (
                        <span key={idx} className="text-xs text-slate-800">
                          {item.quantity}x {item.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-slate-900">Rs. {order.total.toLocaleString()}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-slate-400">
                    You haven't placed any orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
