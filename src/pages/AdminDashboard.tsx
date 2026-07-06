import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Users, TrendingUp, Package, ArrowRight } from 'lucide-react';
import { getAdminStats, getAdminOrders } from '@/lib/api';

interface OrderStats {
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  pendingOrders: number;
}

interface RecentOrder {
  _id: string;
  shippingAddress: {
    name: string;
    email?: string;
  };
  totalPrice: number;
  deliveryStatus: string;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<OrderStats>({
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, orders] = await Promise.all([
        getAdminStats(),
        getAdminOrders(),
      ]);

      setStats({
        totalOrders: statsData.totalOrders,
        totalCustomers: statsData.totalCustomers,
        totalRevenue: statsData.totalRevenue,
        pendingOrders: statsData.pendingOrders,
      });

      const recent = [...orders]
        .sort((a: RecentOrder, b: RecentOrder) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5);
      setRecentOrders(recent);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Processing: 'bg-blue-100 text-blue-800',
      Shipped: 'bg-purple-100 text-purple-800',
      'Out For Delivery': 'bg-orange-100 text-orange-800',
      Delivered: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-12 bg-gradient-to-b from-pink-50/30 to-background min-h-[70vh]">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to Threads & Trinkets admin. Manage orders and store operations.
          </p>
        </div>

        <Separator className="mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-pink-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <ShoppingCart className="h-8 w-8 text-pink-300" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">All time orders</p>
            </CardContent>
          </Card>

          <Card className="border-pink-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stats.totalCustomers}</div>
                <Users className="h-8 w-8 text-pink-300" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Registered customers</p>
            </CardContent>
          </Card>

          <Card className="border-pink-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
                <TrendingUp className="h-8 w-8 text-green-300" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Revenue generated</p>
            </CardContent>
          </Card>

          <Card className="border-pink-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</div>
                <Package className="h-8 w-8 text-yellow-200" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Awaiting processing</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Recent Orders</CardTitle>
              <CardDescription>Latest orders from your customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No orders yet</p>
                ) : (
                  recentOrders.map((order) => (
                    <div
                      key={order._id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-pink-50/50 transition"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{order.shippingAddress.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.shippingAddress.email || '—'}
                        </p>
                      </div>
                      <div className="text-right mr-4">
                        <p className="font-bold text-sm">₹{order.totalPrice.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.deliveryStatus)}`}
                      >
                        {order.deliveryStatus}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Quick Actions</CardTitle>
              <CardDescription>Manage your store operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link to="/admin/orders">
                  <Button variant="outline" className="w-full justify-between hover:border-pink-300">
                    Manage All Orders
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/admin/products">
                  <Button variant="outline" className="w-full justify-between hover:border-pink-300">
                    Manage Products
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
