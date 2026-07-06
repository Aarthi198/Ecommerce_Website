import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getMyOrders } from '@/lib/api';

interface OrderItem {
  product: string | { name: string; price: number };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  shippingAddress: {
    name: string;
    phoneNumber?: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  deliveryStatus: 'Pending' | 'Processing' | 'Shipped' | 'Out For Delivery' | 'Delivered';
  totalPrice: number;
  createdAt: string;
}

const timelineStages = [
  { key: 'Pending', label: 'Pending' },
  { key: 'Processing', label: 'Processing' },
  { key: 'Shipped', label: 'Shipped' },
  { key: 'Out For Delivery', label: 'Out For Delivery' },
  { key: 'Delivered', label: 'Delivered' },
];

const MyOrders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message || 'Failed to fetch orders',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const isStageCompleted = (stageKey: string, currentStatus: string): boolean => {
    const currentIndex = timelineStages.findIndex((stage) => stage.key === currentStatus);
    const stageIndex = timelineStages.findIndex((stage) => stage.key === stageKey);
    return stageIndex <= currentIndex;
  };

  const getProductName = (item: OrderItem) =>
    typeof item.product === 'string' ? item.product : item.product?.name || 'Product';

  const filteredOrders = orders.filter((order) => {
    return statusFilter === 'all' || order.deliveryStatus === statusFilter;
  });

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);

  if (loading) {
    return (
      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-96">
            <p className="text-muted-foreground">Loading your orders...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">Track your order delivery status in real time</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-pink-50 rounded-lg p-6 border border-pink-100">
            <p className="text-muted-foreground text-sm mb-1">Total Orders</p>
            <p className="text-3xl font-bold text-pink-600">{totalOrders}</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-6 border border-amber-100">
            <p className="text-muted-foreground text-sm mb-1">Total Spent</p>
            <p className="text-3xl font-bold text-amber-600">₹{totalSpent.toFixed(2)}</p>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="bg-secondary/30 rounded-lg p-6 mb-8">
          <div className="space-y-2 w-full md:w-64">
            <label className="text-sm font-medium">Filter by status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {timelineStages.map((stage) => (
                  <SelectItem key={stage.key} value={stage.key}>
                    {stage.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {orders.length === 0
                ? "You haven't placed any orders yet."
                : 'No orders match the selected filter.'}
            </p>
            <Button asChild className="bg-pink-600 hover:bg-pink-700">
              <Link to="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredOrders.map((order) => (
              <div key={order._id} className="border border-pink-100 rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-pink-50 to-amber-50 p-6 border-b">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Order</p>
                      <p className="font-mono font-semibold">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Order Date</p>
                      <p className="font-semibold">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-lg font-bold text-pink-600">₹{order.totalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white">
                  <p className="text-sm font-semibold mb-4 text-slate-700">Status</p>
                  <div className="space-y-2">
                    {timelineStages.map((stage) => {
                      const completed = isStageCompleted(stage.key, order.deliveryStatus);
                      const isCurrent = stage.key === order.deliveryStatus;

                      return (
                        <div
                          key={stage.key}
                          className={`flex items-center gap-3 text-sm ${
                            completed
                              ? 'text-green-700 font-medium'
                              : isCurrent
                              ? 'text-pink-600 font-medium'
                              : 'text-muted-foreground'
                          }`}
                        >
                          <span className="w-5 text-center font-mono">
                            {completed ? '✓' : '○'}
                          </span>
                          <span>{stage.label}</span>
                          {isCurrent && (
                            <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-6 border-t bg-gray-50">
                  <p className="text-sm font-semibold mb-3">Items Ordered</p>
                  <div className="space-y-2 text-sm">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between py-1">
                        <span className="text-muted-foreground">
                          {getProductName(item)}
                          <span className="text-xs ml-2">×{item.quantity}</span>
                        </span>
                        <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 border-t">
                  <p className="text-sm font-semibold mb-3">Shipping Address</p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p className="font-medium text-slate-800">{order.shippingAddress.name}</p>
                    {order.shippingAddress.phoneNumber && (
                      <p>{order.shippingAddress.phoneNumber}</p>
                    )}
                    <p>{order.shippingAddress.address}</p>
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                      {order.shippingAddress.postalCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default MyOrders;
