import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LayoutDashboard, UtensilsCrossed, Monitor, Settings, TrendingUp, Users, ShoppingBag, LogOut } from 'lucide-react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
// import { useEffect } from 'react';

import TableMap from './TableMap';
import OrdersManager from './OrdersManager';
import MenuManager from './MenuManager';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${color} bg-opacity-10`}>
                <Icon className={color.replace('bg-', 'text-')} size={24} />
            </div>
            <span className="text-green-500 font-bold text-xs bg-green-50 px-2 py-1 rounded-full">+12%</span>
        </div>
        <h3 className="text-gray-500 font-medium text-sm">{title}</h3>
        <p className="text-2xl font-black text-gray-900 mt-1">{value}</p>
    </div>
);

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { userInfo, logout } = useAuthStore();
    const [activeView, setActiveView] = useState('dashboard');

    useEffect(() => {
        if (!userInfo || userInfo.role !== 'Admin') {
            navigate('/admin/login');
        }
    }, [userInfo, navigate]);

    const { data: analytics } = useQuery({
        queryKey: ['admin-analytics'],
        queryFn: async () => {
            const res = await api.get('/orders/analytics');
            return res.data;
        }
    });

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 p-6 flex flex-col gap-8 sticky top-0 h-screen">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                        <UtensilsCrossed size={20} />
                    </div>
                    <span className="font-black text-xl tracking-tight">ADMIN</span>
                </div>

                <nav className="flex flex-col gap-2 flex-1">
                    <button 
                        onClick={() => setActiveView('dashboard')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                            activeView === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-50'
                        }`}
                    >
                        <LayoutDashboard size={20} /> Dashboard
                    </button>
                    <button 
                        onClick={() => setActiveView('orders')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                            activeView === 'orders' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-50'
                        }`}
                    >
                        <ShoppingBag size={20} /> Orders
                    </button>
                    <button 
                        onClick={() => setActiveView('tables')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                            activeView === 'tables' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-50'
                        }`}
                    >
                        <Monitor size={20} /> Tables
                    </button>
                    <button 
                        onClick={() => setActiveView('settings')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                            activeView === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-50'
                        }`}
                    >
                        <Settings size={20} /> Menu Settings
                    </button>
                </nav>

                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-50 rounded-2xl font-bold transition-all mt-auto"
                >
                    <LogOut size={20} /> Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 overflow-y-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 capitalize">{activeView.replace('-', ' ')} Overview</h1>
                        <p className="text-gray-500 font-medium">Welcome back, {userInfo?.name || 'Manager'}!</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="font-bold text-gray-900">{userInfo?.name || 'Admin User'}</p>
                            <p className="text-xs text-gray-500 font-medium">System Administrator</p>
                        </div>
                        <div className="w-12 h-12 bg-gray-200 rounded-2xl border-2 border-white shadow-sm overflow-hidden text-center flex items-center justify-center font-bold">
                            {userInfo?.name?.charAt(0) || 'A'}
                        </div>
                    </div>
                </header>

                {activeView === 'dashboard' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                            <StatCard title="Total Revenue" value={`₹${analytics?.totalSales || 0}`} icon={TrendingUp} color="bg-blue-600" />
                            <StatCard title="Active Tables" value={analytics?.activeTables || 0} icon={Monitor} color="bg-purple-600" />
                            <StatCard title="Total Orders" value={analytics?.totalOrders || 0} icon={ShoppingBag} color="bg-orange-600" />
                            <StatCard title="Popular Item" value={analytics?.popularDish || 'N/A'} icon={Users} color="bg-green-600" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-xl font-black text-gray-900">Recent Transactions</h2>
                                    <button onClick={() => setActiveView('orders')} className="text-blue-600 font-bold text-sm hover:underline">View All</button>
                                </div>
                                <div className="space-y-6">
                                    {(analytics?.recentOrders || []).map((order) => (
                                        <div key={order._id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-3xl transition-colors border border-transparent hover:border-gray-100">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 font-bold">#O...{order._id.slice(-3).toUpperCase()}</div>
                                                <div>
                                                    <p className="font-bold text-gray-900">Customer Table #{order.table?.tableNumber || '??'}</p>
                                                    <p className="text-xs text-gray-400 font-medium">{new Date(order.createdAt).toLocaleTimeString()} • {order.items.length} Items</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-gray-900">₹{order.totalAmount}</p>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                                    order.status === 'Paid' ? 'bg-green-100 text-green-600' : 
                                                    order.status === 'Served' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                                                }`}>{order.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm">
                                <h2 className="text-xl font-black text-gray-900 mb-8">Quick Actions</h2>
                                <div className="space-y-4">
                                    <button 
                                        onClick={() => setActiveView('tables')}
                                        className="w-full p-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                                    >
                                        Manage Tables
                                    </button>
                                    <button 
                                        onClick={() => setActiveView('settings')}
                                        className="w-full p-4 border border-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition-all"
                                    >
                                        Edit Menu
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeView === 'tables' && <TableMap />}
                {activeView === 'orders' && <OrdersManager />}
                {activeView === 'settings' && <MenuManager />}
            </main>
        </div>
    );
};

export default AdminDashboard;
