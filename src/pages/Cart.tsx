import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, totalItems, totalPrice, clearCart } = useCart();

  return (
    <main className="min-h-screen bg-silk-cream/30 py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-serif font-bold text-center mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products list */}
          <div className="lg:col-span-2 space-y-6">
            {cart.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 shadow-md text-center">
                <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">Discover our beautiful handcrafted silk thread jewelry.</p>
                <Button asChild>
                  <Link to="/products">Start Shopping</Link>
                </Button>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.product.id} className="bg-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row gap-4 md:items-center">
                  <div className="w-full md:w-40 h-40 flex-shrink-0 rounded-lg overflow-hidden bg-secondary/50 flex items-center justify-center">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{item.product.name}</h3>
                    <p className="text-silk-gold font-semibold mt-2">₹{item.product.price}</p>

                    <div className="mt-4 flex items-center gap-3">
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>-</Button>
                      <div className="px-3 py-1 rounded-md border">{item.quantity}</div>
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</Button>

                      <div className="ml-6 text-sm text-muted-foreground">Subtotal: <span className="font-medium">₹{item.product.price * item.quantity}</span></div>

                      <Button variant="ghost" size="icon" className="ml-auto" onClick={() => removeFromCart(item.product.id)}>
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Order summary */}
          <aside className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="text-xl font-medium mb-4">Order Summary</h3>
            <div className="flex justify-between mb-2">
              <span>Items</span>
              <span>{totalItems}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Shipping</span>
              <span>Free</span>
            </div>

            <div className="border-t pt-4 mt-4 flex justify-between items-center">
              <div>
                <div className="text-sm text-muted-foreground">Total</div>
                <div className="text-2xl font-bold">₹{totalPrice}</div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Button asChild className="w-full bg-white text-slate-900 border">
                <Link to="/products">Continue Shopping</Link>
              </Button>
              <Button asChild className="w-full btn-primary-custom">
                <Link to="/checkout">Proceed to Checkout</Link>
              </Button>
            </div>

            {cart.length > 0 && (
              <div className="mt-4 text-center">
                <button className="text-sm text-muted-foreground underline" onClick={() => clearCart()}>Clear Cart</button>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
};

export default CartPage;
