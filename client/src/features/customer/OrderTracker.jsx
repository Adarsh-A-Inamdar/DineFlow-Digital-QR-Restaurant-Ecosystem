import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Clock, ChefHat, Utensils, ArrowLeft } from 'lucide-react';
import api from '../../api/axios';
import { useEffect, useState } from 'react';
import useSocket from '../../hooks/useSocket';

const STATUS_STEPS = [
    { label: 'Pending', icon: Clock, color: 'text-gray-400', bg: 'bg-gray-100' },
    { label: 'Preparing', icon: ChefHat, color: 'text-orange-500', bg: 'bg-orange-100' },
    { label: 'Ready', icon: CheckCircle2, color: 'text-blue-500', bg: 'bg-blue-100' },
    { label: 'Served', icon: Utensils, color: 'text-green-500', bg: 'bg-green-100' },
];

const OrderTracker = () => {
    const { id } = useParams();
    const { subscribe, join } = useSocket();
    const [liveStatus, setLiveStatus] = useState(null);

    const { data: order, isLoading } = useQuery({
        queryKey: ['order', id],
        queryFn: async () => {
            const res = await api.get(`/orders/${id}`);
            return res.data;
        }
    });

    useEffect(() => {
        if (order) {
            join(`table_${order.table._id || order.table}`);
            subscribe('STATUS_UPDATE', (updatedOrder) => {
                if (updatedOrder._id === id) {
                    setLiveStatus(updatedOrder.status);
                }
            });
        }
    }, [order, id, join, subscribe]);

    const currentStatus = liveStatus || order?.status || 'Pending';
    const activeIndex = STATUS_STEPS.findIndex(s => s.label === currentStatus);

    if (isLoading) return <div className="p-10 text-center">Tracking your session...</div>;

    return (
        <div className="min-h-screen bg-white">
            <header className="p-6">
                <Link to="/" className="inline-flex items-center gap-2 text-gray-500 font-medium hover:text-blue-600 transition-colors">
                    <ArrowLeft size={18} /> Back to Home
                </Link>
                <div className="mt-6">
                    <h1 className="text-3xl font-black text-gray-900">Track Order</h1>
                    <p className="text-gray-500 font-medium">Order ID: #{id.slice(-6).toUpperCase()}</p>
                </div>
            </header>

            <div className="p-6">
                <div className="relative space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                    {STATUS_STEPS.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = index <= activeIndex;
                        const isCurrent = index === activeIndex;

                        return (
                            <div key={step.label} className="relative flex items-center gap-6">
                                <div className={`z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? step.bg : 'bg-white border-2 border-gray-100'}`}>
                                    <Icon size={20} className={isActive ? step.color : 'text-gray-300'} />
                                </div>
                                <div className="flex-1">
                                    <h3 className={`font-bold transition-colors ${isActive ? 'text-gray-900' : 'text-gray-300'}`}>{step.label}</h3>
                                    {isCurrent && <p className="text-sm text-gray-500 font-medium animate-pulse">Chef is working on it...</p>}
                                </div>
                                {isActive && !isCurrent && index < activeIndex && (
                                    <CheckCircle2 size={18} className="text-green-500" />
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="mt-12 p-6 bg-blue-50 rounded-3xl border border-blue-100">
                    <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                            <Utensils size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-blue-900">Table #{order?.table?.tableNumber.toString().padStart(2, '0')}</h4>
                            <p className="text-blue-700 text-sm font-medium">Your food will be served shortly!</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t border-gray-100 pt-8">
                    <h4 className="font-bold text-gray-900 mb-4">Order Summary</h4>
                    <div className="space-y-3">
                        {order?.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 bg-gray-200 rounded-md flex items-center justify-center text-xs font-bold text-gray-600">{item.quantity}</span>
                                    <span className="font-medium text-gray-800">{item.menuItem?.name || 'Item'}</span>
                                </div>
                                <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                            </div>
                        ))}
                        <div className="flex justify-between items-center pt-3 border-t border-dashed border-gray-200">
                            <span className="font-bold text-gray-500">Total Paid</span>
                            <span className="text-xl font-black text-gray-900">₹{order?.totalAmount}</span>
                        </div>
                    </div>
                    {currentStatus === 'Served' && (
                        <a 
                            href={`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/orders/${id}/invoice`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="block mt-6"
                        >
                            <Button className="w-full bg-gray-900 text-white py-4 font-bold border-none">
                                Download Digital Invoice (PDF)
                            </Button>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderTracker;
