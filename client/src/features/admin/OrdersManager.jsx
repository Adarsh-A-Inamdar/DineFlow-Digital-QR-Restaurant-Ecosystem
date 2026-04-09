import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingBag, Clock, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import api from '../../api/axios';
import { useState } from 'react';

const OrdersManager = () => {
    const queryClient = useQueryClient();
    const [filter, setFilter] = useState('All');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [viewItems, setViewItems] = useState(null);

    const { data: orders, isLoading } = useQuery({
        queryKey: ['admin-orders'],
        queryFn: async () => {
            const res = await api.get('/orders');
            return res.data;
        }
    });

    const statusMutation = useMutation({
        mutationFn: async ({ id, status }) => {
            return await api.patch(`/orders/${id}/status`, { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-orders']);
            queryClient.invalidateQueries(['admin-analytics']);
        },
        onError: (error) => {
            console.error('Update failed:', error);
            alert(`Action Failed: ${error.response?.data?.message || 'Please log out and log in again.'}`);
        }
    });

    const filteredOrders = (orders || []).filter(o => filter === 'All' || o.status === filter);

    if (isLoading) return <div className="p-10">Loading order history...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-gray-900">Order Management</h2>
                <div className="flex gap-4">
                    <div className="flex bg-white rounded-2xl border border-gray-100 p-1">
                        {['All', 'Pending', 'Preparing', 'Ready', 'Served', 'Paid', 'Cancelled'].map((s) => (
                            <button 
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                    filter === s ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-wider">Order / Table</th>
                            <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-wider">Items</th>
                            <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-wider">Amount</th>
                            <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-wider">Time</th>
                            <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredOrders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-8 py-6">
                                    <p className="font-bold text-gray-900">#...{order._id.slice(-6).toUpperCase()}</p>
                                    <p className="text-xs text-blue-600 font-bold">Table #{order.table?.tableNumber || '??'}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <button 
                                        onClick={() => setViewItems(order)}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors"
                                    >
                                        {order.items.length} Items <Search size={14} />
                                    </button>
                                </td>
                                <td className="px-8 py-6 font-black text-gray-900 text-sm">₹{(order.totalAmount * 1.05).toFixed(0)}</td>
                                <td className="px-8 py-6">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                                        order.status === 'Paid' ? 'bg-green-100 text-green-600' : 
                                        order.status === 'Served' ? 'bg-blue-100 text-blue-600' : 
                                        order.status === 'Cancelled' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                                    }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-sm text-gray-500 font-medium">
                                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex gap-2">
                                        {order.status === 'Ready' && (
                                            <button 
                                                onClick={() => statusMutation.mutate({ id: order._id, status: 'Served' })}
                                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors" title="Mark Served"
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                        )}
                                        {order.status === 'Served' && (
                                            <button 
                                                onClick={() => setSelectedOrder(order)}
                                                className="flex-1 bg-green-600 text-white px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-green-700 transition-colors"
                                            >
                                                View Bill
                                            </button>
                                        )}
                                        {order.status !== 'Paid' && order.status !== 'Cancelled' && (
                                            <button 
                                                onClick={() => statusMutation.mutate({ id: order._id, status: 'Cancelled' })}
                                                className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors" title="Cancel Order"
                                            >
                                                <XCircle size={18} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* View Items Modal */}
            {viewItems && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 text-gray-900">
                    <div className="bg-white w-full max-w-sm rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                            <h3 className="text-xl font-black text-gray-900">Order Contents</h3>
                            <button onClick={() => setViewItems(null)} className="text-gray-400 hover:text-gray-600"><XCircle size={24} /></button>
                        </div>
                        <div className="p-8 max-h-96 overflow-y-auto space-y-4">
                            {viewItems.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-black text-xs">{item.quantity}</span>
                                        <span className="font-bold text-gray-700">{item.menuItem?.name || 'Item'}</span>
                                    </div>
                                    <span className="font-bold text-gray-400 text-xs">₹{item.price} ea.</span>
                                </div>
                            ))}
                            <button 
                                onClick={() => setViewItems(null)}
                                className="w-full mt-4 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                            >
                                Close View
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bill Preview Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 text-gray-900">
                    <div className="bg-white w-full max-w-sm rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="text-xl font-black text-gray-900">Order Summary</h3>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Table #{selectedOrder.table?.tableNumber || '??'} • #{selectedOrder._id.slice(-6).toUpperCase()}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600"><XCircle size={24} /></button>
                        </div>
                        
                        <div className="p-8 space-y-6">
                            {/* Items List */}
                            <div className="max-h-48 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                                {selectedOrder.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-start text-sm">
                                        <div className="flex gap-3">
                                            <span className="font-bold text-blue-600">x{item.quantity}</span>
                                            <span className="font-medium text-gray-600">{item.menuItem?.name || 'Item'}</span>
                                        </div>
                                        <span className="font-bold">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-dashed border-gray-100 pt-6 space-y-3">
                                <div className="flex justify-between text-sm text-gray-500 font-medium">
                                    <span>Subtotal</span>
                                    <span>₹{selectedOrder.totalAmount}</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-400 font-medium">
                                    <span>SGST (2.5%)</span>
                                    <span>₹{(selectedOrder.totalAmount * 0.025).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-400 font-medium">
                                    <span>CGST (2.5%)</span>
                                    <span>₹{(selectedOrder.totalAmount * 0.025).toFixed(2)}</span>
                                </div>
                                <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                                    <span className="text-lg font-black text-gray-900">Total Amount</span>
                                    <span className="text-2xl font-black text-blue-600">₹{(selectedOrder.totalAmount * 1.05).toFixed(2)}</span>
                                </div>
                            </div>
                            
                            <div className="pt-4">
                                <button 
                                    onClick={() => {
                                        statusMutation.mutate({ id: selectedOrder._id, status: 'Paid' });
                                        setSelectedOrder(null);
                                    }}
                                    className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-gray-200 hover:bg-gray-800 transition-all flex items-center justify-center gap-3"
                                >
                                    <CheckCircle size={18} /> Confirm Payment
                                </button>
                                <p className="text-[10px] text-center text-gray-400 mt-4 font-bold uppercase tracking-widest">Generating Digital Receipt...</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersManager;
