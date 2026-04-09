import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, ShieldCheck } from 'lucide-react';
import api from '../../api/axios';
import useAuthStore from '../../store/authStore';
import Button from '../../components/shared/Button';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const setUserInfo = useAuthStore((state) => state.setUserInfo);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const res = await api.post('/auth/login', { email, password });
            setUserInfo(res.data);
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050510] flex items-center justify-center p-6 relative overflow-hidden text-white">
            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full"></div>

            <div className="w-full max-w-md z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-3xl shadow-2xl shadow-blue-500/30 mb-6 rotate-3">
                        <ShieldCheck size={40} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Internal Portal</h1>
                    <p className="text-gray-400 font-medium">Authorized Personnel Only</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-2xl p-8 rounded-[40px] border border-white/10 shadow-2xl space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-600"
                                placeholder="name@restaurant.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-600"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        className="w-full py-5 text-lg font-black bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20"
                        isLoading={loading}
                    >
                        <LogIn size={20} /> Authenticate
                    </Button>
                </form>

                <p className="text-center mt-8 text-gray-500 text-sm">
                    Forgotten credentials? Contact IT Support
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
