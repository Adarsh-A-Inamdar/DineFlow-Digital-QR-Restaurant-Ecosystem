import { create } from 'zustand';

const useAuthStore = create((set) => ({
    userInfo: localStorage.getItem('userInfo') 
        ? JSON.parse(localStorage.getItem('userInfo')) 
        : null,
    
    setUserInfo: (info) => {
        localStorage.setItem('userInfo', JSON.stringify(info));
        set({ userInfo: info });
    },
    
    logout: () => {
        localStorage.removeItem('userInfo');
        set({ userInfo: null });
    },

    customerSession: null,
    setCustomerSession: (session) => set({ customerSession: session }),
}));

export default useAuthStore;
