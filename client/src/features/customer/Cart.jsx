import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Plus, Minus, CreditCard } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import useTableStore from '../../store/tableStore';
import useAuthStore from '../../store/authStore';
import Button from '../../components/shared/Button';
import api from '../../api/axios';

const Cart = () => {
    const { cart, updateQuantity, removeFromCart, getTotalAmount, clearCart } = useCartStore();
    const navigate = useNavigate();
    const total = getTotalAmount();

    const { tableInfo } = useTableStore();
    const { userInfo } = useAuthStore();

    const handlePlaceOrder = async () => {
        // Safety filter: Only send items that have a valid database length ID
        const validItems = cart.filter(item => item._id.length >= 24);
        
        if (validItems.length === 0) {
            alert('Your cart contains only demo items or is empty. Please add a REAL dish from the menu!');
            return;
        }

        if (tableInfo?._id?.startsWith('dynamic')) {
            alert('Invalid Table. Please use a fresh QR code from the Admin Panel.');
            return;
        }

        try {
            const orderData = {
                tableId: tableInfo._id,
                phoneNumber: userInfo?.phoneNumber || '9876543210', 
                items: validItems.map(item => ({
                    menuItem: item._id,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: validItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
            };

            const res = await api.post('/orders', orderData);
            clearCart();
            navigate(`/order/${res.data._id}`);
        } catch (error) {
            console.error('Failed to place order', error);
            alert(`Order Failed: ${error.response?.data?.message || 'Please use a new QR code link.'}`);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="max-w-md mx-auto min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Trash2 className="text-gray-400" size={40} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-8">Add something tasty from the menu to get started!</p>
                <Link to="/">
                    <Button variant="primary">Back to Menu</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-40">
            <header className="p-6 flex items-center gap-4 bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-100">
                <Link to="/">
                    <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <ArrowLeft size={24} className="text-gray-900" />
                    </button>
                </Link>
                <h1 className="text-xl font-bold text-gray-900">Your Order</h1>
            </header>

            <div className="p-6 space-y-4">
                {cart.map((item) => (
                    <div key={item._id} className="flex gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                            {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900">{item.name}</h3>
                            <p className="text-blue-600 font-bold mb-3">₹{item.price}</p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center bg-gray-50 rounded-lg p-1">
                                    <button 
                                        onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                                        className="p-1 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-500"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                                    <button 
                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                        className="p-1 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-500"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <button 
                                    onClick={() => removeFromCart(item._id)}
                                    className="p-2 text-red-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bill Summary */}
            <div className="p-6 mt-4">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
                    <div className="flex justify-between text-gray-500 text-sm">
                        <span>Items Total</span>
                        <span>₹{total}</span>
                    </div>
                    <div className="flex justify-between text-gray-500 text-sm">
                        <span>Taxes & GST (5%)</span>
                        <span>₹{Math.round(total * 0.05)}</span>
                    </div>
                    <div className="pt-3 border-t border-dashed flex justify-between items-center">
                        <span className="font-bold text-gray-900">Grand Total</span>
                        <span className="text-xl font-black text-blue-600">₹{total + Math.round(total * 0.05)}</span>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl bg-white border-t border-gray-100 p-6 shadow-2xl rounded-t-[40px]">
                <Button 
                    onClick={handlePlaceOrder}
                    className="w-full py-5 text-lg shadow-xl shadow-blue-200"
                >
                    <CreditCard size={20} /> Confirm & Place Order
                </Button>
            </div>
        </div>
    );
};

export default Cart;
