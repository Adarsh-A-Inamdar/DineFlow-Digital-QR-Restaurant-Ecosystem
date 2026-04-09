import { motion } from 'framer-motion';
import { Plus, Clock } from 'lucide-react';
import Button from '../../components/shared/Button';
import useCartStore from '../../store/cartStore';

const MenuItemCard = ({ item }) => {
    const addToCart = useCartStore((state) => state.addToCart);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 ${
                !item.isAvailable ? 'grayscale opacity-75' : ''
            }`}
        >
            <div className="relative h-44 bg-gray-50">
                {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200">
                        No Image
                    </div>
                )}
                {item.enableTimer && item.isAvailable && (
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-black flex items-center gap-1.5">
                        <Clock size={12} /> {item.preparationTime}m
                    </div>
                )}
                {!item.isAvailable && (
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-red-200">
                            Sold Out
                        </span>
                    </div>
                )}
            </div>
            
            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-black text-gray-900 text-lg leading-tight">{item.name}</h3>
                    <span className="text-blue-600 font-black text-lg">₹{item.price}</span>
                </div>
                <p className="text-gray-500 text-xs font-medium line-clamp-2 mb-6 h-8">{item.description}</p>
                
                <Button 
                    onClick={() => item.isAvailable && addToCart(item)}
                    className="w-full py-4 rounded-2xl text-xs font-black"
                    disabled={!item.isAvailable}
                    variant={item.isAvailable ? "primary" : "secondary"}
                >
                    {item.isAvailable ? (
                        <><Plus size={18} /> Add to Cart</>
                    ) : (
                        'Not Available'
                    )}
                </Button>
            </div>
        </motion.div>
    );
};

export default MenuItemCard;
