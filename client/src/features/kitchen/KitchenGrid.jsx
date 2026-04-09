import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChefHat, Clock, CheckCircle, Bell } from 'lucide-react';
import api from '../../api/axios';
import { useEffect } from 'react';
import useSocket from '../../hooks/useSocket';
import Button from '../../components/shared/Button';

const KitchenGrid = () => {
    const queryClient = useQueryClient();
    const { subscribe, join } = useSocket();

    const { data: orders, isLoading } = useQuery({
        queryKey: ['kitchen-orders'],
        queryFn: async () => {
            const res = await api.get('/orders');
            return res.data;
        }
    });

    useEffect(() => {
        join('kitchen');
        subscribe('NEW_ORDER', (newOrder) => {
            queryClient.setQueryData(['kitchen-orders'], (prev) => prev ? [newOrder, ...prev] : [newOrder]);
            // Play sound alert
            const audio = new Audio('/alert.mp3');
            audio.play().catch(e => console.log('Audio play failed', e));
        });
    }, [join, subscribe, queryClient]);

    const statusMutation = useMutation({
        mutationFn: async ({ id, status }) => {
            return await api.patch(`/orders/${id}/status`, { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['kitchen-orders']);
        }
    });

    const activeOrders = (orders || []).filter(o => o.status !== 'Paid' && o.status !== 'Cancelled');

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <header className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <ChefHat size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">KITCHEN DISPLAY</h1>
                        <p className="text-gray-400 font-medium">Real-time Order Feed</p>
                    </div>
                </div>
                <div className="bg-gray-800 px-6 py-3 rounded-2xl border border-gray-700 flex items-center gap-3">
                    <Bell className="text-blue-400 animate-bounce" size={20} />
                    <span className="font-bold text-xl">{activeOrders.length} Pending</span>
                </div>
            </header>

            {isLoading ? (
                <div className="text-center py-20 text-gray-500 text-xl font-bold">Connecting to order stream...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {activeOrders.map((order) => (
                        <div key={order._id} className="bg-gray-800 rounded-3xl border border-gray-700 overflow-hidden flex flex-col shadow-2xl">
                            <div className="p-5 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
                                <span className="text-2xl font-black text-blue-400">TABLE {order.table?.tableNumber || '??'}</span>
                                <div className="flex items-center gap-2 text-gray-400 text-sm font-bold bg-gray-900 px-3 py-1 rounded-full">
                                    <Clock size={14} />
                                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                            
                            <div className="p-5 flex-1 space-y-4">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-start">
                                        <div className="flex gap-3">
                                            <span className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center font-black text-sm">{item.quantity}</span>
                                            <div>
                                                <p className="font-bold text-lg leading-tight">{item.menuItem?.name || 'Unknown Item'}</p>
                                                {item.customizations && <p className="text-xs text-orange-400 mt-1">Note: {item.customizations}</p>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 bg-gray-900/50 flex gap-3">
                                {order.status === 'Pending' && (
                                    <Button 
                                        className="w-full bg-orange-500 hover:bg-orange-600 text-white border-none py-4 text-lg font-black"
                                        onClick={() => statusMutation.mutate({ id: order._id, status: 'Preparing' })}
                                    >
                                        PREPARE
                                    </Button>
                                )}
                                {order.status === 'Preparing' && (
                                    <Button 
                                        className="w-full bg-blue-500 hover:bg-blue-600 text-white border-none py-4 text-lg font-black"
                                        onClick={() => statusMutation.mutate({ id: order._id, status: 'Ready' })}
                                    >
                                        READY
                                    </Button>
                                )}
                                {order.status === 'Ready' && (
                                    <Button 
                                        className="w-full bg-green-500 hover:bg-green-600 text-white border-none py-4 text-lg font-black"
                                        onClick={() => statusMutation.mutate({ id: order._id, status: 'Served' })}
                                    >
                                        SERVE
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default KitchenGrid;
