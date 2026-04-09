import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Monitor, Plus, Trash2, Edit2, X } from 'lucide-react';
import api from '../../api/axios';
import { useState } from 'react';
import Button from '../../components/shared/Button';

const TableMap = () => {
    const queryClient = useQueryClient();
    const [editingTable, setEditingTable] = useState(null);
    const [isAdding, setIsAdding] = useState(false);

    const { data: tables, isLoading } = useQuery({
        queryKey: ['admin-tables'],
        queryFn: async () => {
            const res = await api.get('/tables');
            return res.data;
        }
    });

    const statusMutation = useMutation({
        mutationFn: async ({ id, status }) => {
            return await api.patch(`/tables/${id}/status`, { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-tables']);
        }
    });

    const tableActionMutation = useMutation({
        mutationFn: async (data) => {
            if (isAdding) return await api.post('/tables', data);
            return await api.put(`/tables/${editingTable._id}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-tables']);
            setEditingTable(null);
            setIsAdding(false);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            return await api.delete(`/tables/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-tables']);
        }
    });

    const handleAddTable = () => {
        setEditingTable({ tableNumber: (tables?.length || 0) + 1, capacity: 4 });
        setIsAdding(true);
    };

    const handleEditTable = (table) => {
        setEditingTable(table);
        setIsAdding(false);
    };

    if (isLoading) return <div className="p-10 text-gray-400">Loading floor map...</div>;

    return (
        <div className="space-y-8 relative">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-gray-900">Floor Table Map</h2>
                <Button onClick={handleAddTable} className="flex items-center gap-2">
                    <Plus size={18} /> Add New Table
                </Button>
            </div>

            {/* Tables Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {(tables || []).map((table) => (
                    <div key={table._id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-100 transition-all duration-500 flex flex-col group">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-2xl ${
                                table.status === 'Free' ? 'bg-green-50 text-green-600' :
                                table.status === 'Occupied' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                            }`}>
                                <Monitor size={24} />
                            </div>
                            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                                table.status === 'Free' ? 'bg-green-100 text-green-600 shadow-sm shadow-green-50' : 'bg-orange-100 text-orange-600 shadow-sm shadow-orange-50'
                            }`}>
                                {table.status}
                            </span>
                        </div>
                        
                        <div className="flex justify-between items-center mb-1">
                            <h3 className="text-xl font-black text-gray-900">Table #{table.tableNumber.toString().padStart(2, '0')}</h3>
                            <button onClick={() => handleEditTable(table)} className="text-gray-400 hover:text-blue-600 transition-colors p-2 flex items-center justify-center rounded-xl hover:bg-blue-50">
                                <Edit2 size={16} />
                            </button>
                        </div>
                        <p className="text-gray-500 text-xs font-bold mb-6">Capacity: {table.capacity} Guests</p>

                        {/* QR Code Display */}
                        {table.qrCode && (
                            <div className="mb-6 p-4 border-2 border-dashed border-gray-100 rounded-[24px] flex flex-col items-center bg-gray-50 group-hover:bg-white transition-colors">
                                <img src={table.qrCode} alt="QR Code" className="w-24 h-24 mb-3 drop-shadow-sm" />
                                <a 
                                    href={table.qrCode} 
                                    download={`table-${table.tableNumber}-qr.png`}
                                    className="text-[10px] font-black text-blue-600 hover:underline tracking-widest uppercase"
                                >
                                    Download QR
                                </a>
                            </div>
                        )}

                        <div className="flex gap-2 mt-auto">
                            <button 
                                onClick={() => statusMutation.mutate({ id: table._id, status: table.status === 'Free' ? 'Occupied' : 'Free' })}
                                className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    table.status === 'Free' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 hover:bg-blue-700' : 'bg-gray-900 text-white shadow-lg shadow-gray-200 hover:bg-gray-800'
                                }`}
                            >
                                {table.status === 'Free' ? 'Check In' : 'Clear Table'}
                            </button>
                            <button 
                                onClick={() => deleteMutation.mutate(table._id)}
                                className="p-3 border border-gray-100 text-red-100 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Table Modal */}
            {editingTable && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                    <div className="bg-white w-full max-w-sm rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                            <h3 className="text-xl font-black text-gray-900">{isAdding ? 'Add New Table' : 'Edit Table Details'}</h3>
                            <button onClick={() => setEditingTable(null)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                        </div>
                        <form className="p-8 space-y-6" onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const data = Object.fromEntries(formData);
                            data.tableNumber = parseInt(data.tableNumber);
                            data.capacity = parseInt(data.capacity);
                            tableActionMutation.mutate(data);
                        }}>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase ml-1">Table Number</label>
                                    <input name="tableNumber" type="number" defaultValue={editingTable.tableNumber} required className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase ml-1">Guest Capacity</label>
                                    <input name="capacity" type="number" defaultValue={editingTable.capacity} required className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900" />
                                </div>
                            </div>
                            <div className="pt-2 flex gap-4">
                                <Button type="button" variant="secondary" className="flex-1 py-4" onClick={() => setEditingTable(null)}>Cancel</Button>
                                <Button type="submit" isLoading={tableActionMutation.isPending} className="flex-1 py-4 text-white">Save Table</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TableMap;
