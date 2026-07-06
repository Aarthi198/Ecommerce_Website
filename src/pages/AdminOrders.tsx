import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { getAdminOrders, updateAdminDeliveryStatus } from '@/lib/api';
import { ArrowLeft } from 'lucide-react';

interface OrderItem {
  product: string | { name: string; price: number };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  user?: { name: string; email: string } | null;
  items: OrderItem[];
  shippingAddress: {
    name: string;
    email?: string;
    phoneNumber?: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  deliveryStatus: 'Pending' | 'Processing' | 'Shipped' | 'Out For Delivery' | 'Delivered';
  totalPrice: number;
  createdAt: string;
}

const DELIVERY_STATUSES = [
  'Pending',
  'Processing',
  'Shipped',
  'Out For Delivery',
  'Delivered',
] as const;

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAdminOrders();
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

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      const updated = await updateAdminDeliveryStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, deliveryStatus: updated.deliveryStatus } : order
        )
      );
      toast({
        title: 'Status updated',
        description: `Order delivery status set to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message || 'Failed to update order status',
        variant: 'destructive',
      });
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getProductName = (item: OrderItem) =>
    typeof item.product === 'string' ? item.product : item.product?.name || 'Product';

  const filteredOrders = orders.filter((order) => {
    const search = searchTerm.toLowerCase();
    const customerName = (order.user?.name || order.shippingAddress.name).toLowerCase();
    const email = (order.user?.email || order.shippingAddress.email || '').toLowerCase();
    const phone = (order.shippingAddress.phoneNumber || '').toLowerCase();
    const orderId = order._id.toLowerCase();

    const matchesSearch =
      !searchTerm ||
      customerName.includes(search) ||
      email.includes(search) ||
      phone.includes(search) ||
      orderId.includes(search);

    const matchesStatus = statusFilter === 'all' || order.deliveryStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-96">
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-12 bg-gradient-to-b from-pink-50/30 to-background min-h-[70vh]">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-pink-600 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-serif font-bold mb-2">Order Management</h1>
          <p className="text-muted-foreground">View and update all customer orders</p>
        </div>

        <Separator className="mb-8" />

        <div className="bg-secondary/30 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Order ID, name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Filter by delivery status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {DELIVERY_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={fetchOrders} className="w-full bg-pink-600 hover:bg-pink-700">
                Refresh Orders
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-white">
            <p className="text-muted-foreground">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-pink-100 bg-white shadow-sm">
            <Table>
              <TableHeader className="bg-pink-50/50">
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Shipping Address</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Delivery Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order._id} className="hover:bg-pink-50/30">
                    <TableCell className="font-mono text-xs align-top">
                      #{order._id.slice(-8).toUpperCase()}
                    </TableCell>
                    <TableCell className="font-medium align-top">
                      {order.user?.name || order.shippingAddress.name}
                    </TableCell>
                    <TableCell className="text-sm align-top">
                      {order.user?.email || order.shippingAddress.email || '—'}
                    </TableCell>
                    <TableCell className="text-sm align-top">
                      {order.shippingAddress.phoneNumber || '—'}
                    </TableCell>
                    <TableCell className="text-sm align-top max-w-[180px]">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-xs mb-1">
                          {getProductName(item)}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell className="text-sm align-top">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-xs mb-1">
                          {item.quantity}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell className="font-medium align-top">
                      ₹{order.totalPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-sm align-top max-w-[200px]">
                      <div>{order.shippingAddress.address}</div>
                      <div className="text-xs text-muted-foreground">
                        {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                        {order.shippingAddress.postalCode}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {order.shippingAddress.country}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm align-top whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="align-top">
                      <Select
                        value={order.deliveryStatus}
                        onValueChange={(newStatus) => updateOrderStatus(order._id, newStatus)}
                        disabled={updatingOrderId === order._id}
                      >
                        <SelectTrigger className="w-44">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DELIVERY_STATUSES.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminOrders;
