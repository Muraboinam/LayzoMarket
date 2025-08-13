import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Download, Calendar, Search, Filter, Eye, RefreshCw } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  total: number;
  items: {
    id: string;
    title: string;
    price: number;
    image: string;
    downloadUrl?: string;
  }[];
  paymentMethod: string;
  paymentId?: string;
}

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        const userOrdersRef = doc(db, 'orders', user.email);
        const userOrdersDoc = await getDoc(userOrdersRef);
        
        if (userOrdersDoc.exists()) {
          const data = userOrdersDoc.data();
          const firestoreOrders = data.orders || [];
          
          // Convert Firestore orders to the expected format
          const convertedOrders: Order[] = firestoreOrders.map((order: any) => ({
            id: order.id,
            orderNumber: order.orderNumber,
            date: order.orderDate?.toDate ? order.orderDate.toDate().toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            status: order.status,
            total: order.total,
            items: order.items.map((item: any) => ({
              id: item.id,
              title: item.title,
              price: item.price,
              image: item.image,
              downloadUrl: '#' // You can add actual download URLs later
            })),
            paymentMethod: order.paymentDetails?.method || 'Razorpay',
            paymentId: order.paymentDetails?.paymentId
          }));
          
          setOrders(convertedOrders);
        } else {
          // No orders found for this user
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.items.some(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-500/20 border-green-400/30';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-400/30';
      case 'failed':
        return 'text-red-400 bg-red-500/20 border-red-400/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-400/30';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-purple-200 mb-6">Please sign in to view your orders.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900">
      <Header cartCount={0} onSearchChange={() => {}} profitableUrl="" />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-purple-300 hover:text-white transition-colors bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-purple-300/20"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
              My Orders
            </h1>
          </div>

          {/* Filters */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-purple-300/20 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-purple-300/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-purple-300" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-white/10 border border-purple-300/30 rounded-lg text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Orders List */}
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
              <p className="text-purple-200">Loading your orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-24 h-24 text-purple-400/50 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-white mb-4">
                {orders.length === 0 ? 'No orders yet' : 'No orders found'}
              </h2>
              <p className="text-purple-200 mb-8">
                {orders.length === 0 
                  ? 'Start shopping to see your orders here.' 
                  : 'Try adjusting your search or filter criteria.'}
              </p>
              <button
                onClick={() => navigate('/templates')}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300"
              >
                Browse Templates
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-white/10 backdrop-blur-sm rounded-lg border border-purple-300/20 p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Order #{order.orderNumber}</h3>
                      <div className="flex items-center space-x-4 text-sm text-purple-200">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(order.date).toLocaleDateString()}</span>
                        </div>
                        <span>•</span>
                        <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl font-bold text-white mb-1">
                        ₹{order.total.toLocaleString('en-IN')}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{item.title}</h4>
                          <p className="text-purple-300">₹{item.price.toLocaleString('en-IN')}</p>
                        </div>
                        
                        {order.status === 'completed' && (
                          <div className="flex space-x-2">
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {order.paymentId && (
                    <div className="mt-4 pt-4 border-t border-purple-300/20">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-purple-200">Payment ID:</span>
                        <span className="text-white font-mono">{order.paymentId}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrdersPage;