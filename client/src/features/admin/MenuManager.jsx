import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Eye, EyeOff, X, UtensilsCrossed } from 'lucide-react';
import api from '../../api/axios';
import { useState } from 'react';
import Button from '../../components/shared/Button';

const MenuManager = () => {
    const queryClient = useQueryClient();
    const [activeCategory, setActiveCategory] = useState('All');

    const [editingItem, setEditingItem] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const { data } = await api.post('/upload', formData, config);
            const fullUrl = data.startsWith('http') ? data : `http://localhost:5001${data}`;
            
            setEditingItem(prev => ({ ...prev, imageUrl: fullUrl }));
            setUploading(false);
        } catch (error) {
            console.error('Upload Error:', error);
            setUploading(false);
            alert('Image upload failed. Please try again.');
        }
    };

    const { data: menuItems, isLoading: menuLoading } = useQuery({
        queryKey: ['admin-menu'],
        queryFn: async () => {
            const res = await api.get('/menu');
            return res.data;
        }
    });

    const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await api.get('/categories');
            return res.data;
        }
    });

    const categoryMutation = useMutation({
        mutationFn: async (name) => {
            return await api.post('/categories', { name });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['categories']);
            setShowCategoryModal(false);
        }
    });

    const editMutation = useMutation({
        mutationFn: async (data) => {
            if (isAdding) return await api.post('/menu', data);
            return await api.put(`/menu/${editingItem._id}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-menu']);
            setEditingItem(null);
            setIsAdding(false);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            return await api.delete(`/menu/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-menu']);
        }
    });

    const availabilityMutation = useMutation({
        mutationFn: async ({ id, isAvailable }) => {
            return await api.put(`/menu/${id}`, { isAvailable });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-menu']);
        }
    });

    const categories = ['All', ...(categoriesData || []).map(c => c.name)];
    const filteredItems = (menuItems || []).filter(item => activeCategory === 'All' || item.category === activeCategory);

    const handleEdit = (item) => {
        setEditingItem(item);
        setIsAdding(false);
    };

    const handleAdd = () => {
        setEditingItem({ name: '', price: 0, category: 'Main Course', description: '', imageUrl: '' });
        setIsAdding(true);
    };

    if (menuLoading || categoriesLoading) return <div className="p-10 text-gray-400">Loading menu database...</div>;

    return (
        <div className="space-y-8 relative">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-gray-900">Digital Menu Manager</h2>
                <div className="flex gap-4">
                    <Button variant="secondary" onClick={() => setShowCategoryModal(true)} className="flex items-center gap-2">
                        <Plus size={18} /> Add Category
                    </Button>
                    <Button onClick={handleAdd} className="flex items-center gap-2">
                        <Plus size={18} /> Add New Dish
                    </Button>
                </div>
            </div>

            {/* Category Modal */}
            {showCategoryModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
                    <div className="bg-white w-full max-w-sm rounded-[40px] shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                            <h3 className="text-xl font-black text-gray-900">New Category</h3>
                            <button onClick={() => setShowCategoryModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                        </div>
                        <form className="p-8 space-y-6" onSubmit={(e) => {
                            e.preventDefault();
                            categoryMutation.mutate(e.target.categoryName.value);
                        }}>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase ml-1">Category Name</label>
                                <input name="categoryName" required autoFocus className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900 placeholder:text-gray-400" placeholder="e.g. Desserts" />
                            </div>
                            <Button type="submit" isLoading={categoryMutation.isPending} className="w-full py-4 text-white">Create Category</Button>
                        </form>
                    </div>
                </div>
            )}

            {/* Category Filter */}
            <div className="flex bg-white rounded-2xl border border-gray-100 p-1 w-fit overflow-x-auto max-w-full">
                {categories.map((cat) => (
                    <button 
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                            activeCategory === cat ? 'bg-gray-900 text-white shadow-lg shadow-gray-400' : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                    <div key={item._id} className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-gray-100 transition-all duration-500">
                        <div className="relative h-48 bg-gray-50 overflow-hidden">
                            {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-200 bg-gray-50"><UtensilsCrossed size={48} /></div>
                            )}
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button onClick={() => handleEdit(item)} className="p-2 bg-white/90 backdrop-blur shadow-sm rounded-xl text-gray-600 hover:text-blue-600 transition-all hover:scale-110">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => deleteMutation.mutate(item._id)} className="p-2 bg-white/90 backdrop-blur shadow-sm rounded-xl text-gray-600 hover:text-red-500 transition-all hover:scale-110">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className={`absolute bottom-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                item.isAvailable ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-red-500 text-white shadow-lg shadow-red-200'
                            }`}>
                                {item.isAvailable ? 'In Stock' : 'Sold Out'}
                            </div>
                        </div>
                        
                        <div className="p-6 flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-black text-lg text-gray-900 line-clamp-1">{item.name}</h3>
                                <span className="font-black text-blue-600">₹{item.price}</span>
                            </div>
                            <p className="text-gray-500 text-xs font-medium line-clamp-2 mb-4 h-8">{item.description}</p>
                            
                            <button 
                                onClick={() => availabilityMutation.mutate({ id: item._id, isAvailable: !item.isAvailable })}
                                className={`w-full py-4 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                                    item.isAvailable ? 'bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500' : 'bg-green-50 text-green-600 hover:bg-green-100'
                                }`}
                            >
                                {item.isAvailable ? <><EyeOff size={16} /> Mark Out of Stock</> : <><Eye size={16} /> Mark In Stock</>}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit/Add Modal */}
            {editingItem && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                    <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                            <h3 className="text-2xl font-black text-gray-900">{isAdding ? 'Add New Dish' : 'Edit Dish Detail'}</h3>
                            <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                        </div>
                        <form className="p-8 space-y-6" onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const data = Object.fromEntries(formData);
                            data.price = parseFloat(data.price);
                            editMutation.mutate(data);
                        }}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                    <label className="text-xs font-black text-gray-400 uppercase ml-1">Dish Name</label>
                                    <input name="name" defaultValue={editingItem.name} required className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase ml-1">Price (₹)</label>
                                    <input name="price" type="number" defaultValue={editingItem.price} required className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase ml-1">Category</label>
                                    <select 
                                        name="category" 
                                        defaultValue={editingItem.category} 
                                        className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900"
                                    >
                                        {categories.filter(c => c !== 'All').map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase ml-1">Dish Image</label>
                                <div className="flex gap-4 items-center">
                                    {editingItem.imageUrl && (
                                        <div className="w-20 h-20 rounded-2xl overflow-hidden border border-gray-100 shrink-0">
                                            <img src={editingItem.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div className="flex-1 relative">
                                        <input 
                                            type="file" 
                                            id="image-file" 
                                            onChange={uploadFileHandler}
                                            className="hidden" 
                                        />
                                        <label 
                                            htmlFor="image-file"
                                            className="flex flex-col items-center justify-center w-full h-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-100 transition-all text-xs font-bold text-gray-400"
                                        >
                                            {uploading ? 'Uploading...' : 'Choose File / Drop Here'}
                                        </label>
                                    </div>
                                </div>
                                <input name="imageUrl" type="hidden" value={editingItem.imageUrl} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase ml-1">Description</label>
                                <textarea name="description" defaultValue={editingItem.description} className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none font-bold h-24 text-gray-900 placeholder:text-gray-400" placeholder="Describe this delicious dish..." />
                            </div>
                            <div className="pt-4 flex gap-4">
                                <Button type="button" variant="secondary" className="flex-1 py-4" onClick={() => setEditingItem(null)}>Cancel</Button>
                                <Button type="submit" isLoading={editMutation.isPending} className="flex-1 py-4 text-white">Save Changes</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuManager;
