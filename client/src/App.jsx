import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Menu from './features/customer/Menu';
import Cart from './features/customer/Cart';
import OrderTracker from './features/customer/OrderTracker';
import KitchenGrid from './features/kitchen/KitchenGrid';
import AdminDashboard from './features/admin/AdminDashboard';
import AdminLogin from './features/admin/AdminLogin';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order/:id" element={<OrderTracker />} />
            
            {/* Staff Routes */}
            <Route path="/kitchen" element={<KitchenGrid />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/login" element={<AdminLogin />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
