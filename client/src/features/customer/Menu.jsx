import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShoppingBag, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import CategoryBar from './CategoryBar';
import MenuItemCard from './MenuItemCard';
import useCartStore from '../../store/cartStore';
import useTableStore from '../../store/tableStore';

// Mock data in case API fails or is empty
const MOCK_MENU = [
    { _id: '1', name: 'Paneer Tikka', price: 250, category: 'Starters', description: 'Grilled cottage cheese marinated in spices.', imageUrl: 'https://images.unsplash.com/photo-1567184109191-3783b27b8c85?w=500', enableTimer: true, preparationTime: 15 },
    { _id: '2', name: 'Butter Chicken', price: 350, category: 'Main Course', description: 'Creamy tomato-based chicken curry.', imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500', enableTimer: true, preparationTime: 20 },
    { _id: '3', name: 'Gulab Jamun', price: 120, category: 'Desserts', description: 'Deep-fried milk dumplings in sugar syrup.', imageUrl: 'https://images.unsplash.com/photo-1593759608142-e9b18c0dbe86?w=500', enableTimer: false },
    { _id: '4', name: 'Mango Lassi', price: 90, category: 'Beverages', description: 'Sweet mango-flavored yogurt drink.', imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=500', enableTimer: false },
];

const Menu = () => {
    const { tableInfo, setTableInfo } = useTableStore();
    const [activeCategory, setCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const cart = useCartStore((state) => state.cart);
    const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    // Parse tableId from URL (for QR code scans)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const idFromUrl = params.get('tableId');
        
        if (idFromUrl && idFromUrl !== tableInfo?._id) {
            const fetchTable = async () => {
                try {
                    const { data } = await api.get(`/tables/public/${idFromUrl}`);
                    setTableInfo(data);
                } catch (error) {
                    console.error('Invalid Table QR Code', error);
                }
            };
            fetchTable();
        }
    }, [tableInfo?._id, setTableInfo]);

    const { data: menuData, isLoading } = useQuery({
        queryKey: ['menu'],
        queryFn: async () => {
            const res = await api.get('/menu');
            return res.data;
        },
        refetchInterval: 3000 // Poll every 3 seconds for availability updates
    });

    const filteredMenu = (menuData || MOCK_MENU).filter(item => {
        const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen pb-24">
            {/* Header */}
            <header className="p-6 sticky top-0 bg-gray-50/80 backdrop-blur-lg z-10">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">RESTAURANT</h1>
                        <p className="text-gray-500 text-sm font-medium">Table #{tableInfo?.tableNumber?.toString().padStart(2, '0') || '??'} - Premium Experience</p>
                    </div>
                    <Link to="/cart" className="relative p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <ShoppingBag className="text-blue-600" />
                        {cartItemsCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                                {cartItemsCount}
                            </span>
                        )}
                    </Link>
                </div>

                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search for dishes..."
                        className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 transition-all outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <CategoryBar activeCategory={activeCategory} setCategory={setCategory} />
            </header>

            {/* Menu Grid */}
            <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoading && <p className="text-center text-gray-500 py-10">Loading tasty options...</p>}
                {!isLoading && filteredMenu.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-400">No dishes found in this category.</p>
                    </div>
                )}
                {filteredMenu.map((item) => (
                    <MenuItemCard key={item._id} item={item} />
                ))}
            </div>

            {/* Floating Cart Button for Mobile */}
            {/* Bottom Bar */}
            {cartItemsCount > 0 && (
                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl bg-white border-t border-gray-100 p-6 shadow-2xl rounded-t-[40px]">
                    <Link to="/cart">
                        <button className="w-full bg-blue-600 text-white p-4 rounded-2xl shadow-2xl flex justify-between items-center font-bold hover:bg-blue-700 transition-all active:scale-95">
                            <span className="flex items-center gap-2">
                                <ShoppingBag size={20} />
                                {cartItemsCount} Items
                            </span>
                            <span>View Cart • ₹{useCartStore.getState().getTotalAmount()}</span>
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Menu;
