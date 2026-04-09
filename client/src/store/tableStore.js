import { create } from 'zustand';

const useTableStore = create((set) => ({
    tableInfo: JSON.parse(localStorage.getItem('tableInfo')) || {
        _id: '661445766860f38b25626244', // Fallback ID for demo
        tableNumber: 5
    },
    
    setTableInfo: (info) => {
        localStorage.setItem('tableInfo', JSON.stringify(info));
        set({ tableInfo: info });
    },
}));

export default useTableStore;
