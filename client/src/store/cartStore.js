import { create } from 'zustand';

const useCartStore = create((set, get) => ({
    cart: [],
    
    addToCart: (item) => {
        const currentCart = get().cart;
        const exists = currentCart.find((i) => i._id === item._id);
        
        if (exists) {
            set({
                cart: currentCart.map((i) => 
                    i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
                )
            });
        } else {
            set({ cart: [...currentCart, { ...item, quantity: 1 }] });
        }
    },
    
    removeFromCart: (id) => {
        set({ cart: get().cart.filter((i) => i._id !== id) });
    },
    
    updateQuantity: (id, qty) => {
        set({
            cart: get().cart.map((i) => 
                i._id === id ? { ...i, quantity: qty } : i
            )
        });
    },
    
    clearCart: () => set({ cart: [] }),
    
    getTotalAmount: () => {
        return get().cart.reduce((total, item) => total + item.price * item.quantity, 0);
    }
}));

export default useCartStore;
