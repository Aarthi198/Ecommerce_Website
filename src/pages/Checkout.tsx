
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { submitOrder } from '@/lib/api';

enum CheckoutStep {
  SHIPPING,
  PAYMENT,
  CONFIRMATION,
}

const Checkout: React.FC = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(CheckoutStep.SHIPPING);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [shippingForm, setShippingForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  const handleChange = (field: string, value: string) => {
    setShippingForm((prev) => ({ ...prev, [field]: value }));
  };

  if (cart.length === 0 && currentStep !== CheckoutStep.CONFIRMATION) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl font-serif font-bold mb-4">Your cart is empty</h2>
        <p className="mb-8">Add some beautiful silk thread jewelry to your cart before checking out.</p>
        <Button asChild>
          <Link to="/products">Shop Now</Link>
        </Button>
      </div>
    );
  }

  const handleSubmitShipping = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(CheckoutStep.PAYMENT);
    window.scrollTo(0, 0);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast({ title: 'Your cart is empty', description: 'Add items before placing an order.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await submitOrder({
        items: cart.map((item) => ({ product: item.product.id, quantity: item.quantity })),
        shippingAddress: {
          name: `${shippingForm.firstName} ${shippingForm.lastName}`.trim(),
          phoneNumber: shippingForm.phone,
          address: shippingForm.address,
          city: shippingForm.city,
          state: shippingForm.state,
          postalCode: shippingForm.postalCode,
          country: shippingForm.country,
        },
        paymentMethod,
      });

      setOrderNumber(order._id || order.id || null);
      setCurrentStep(CheckoutStep.CONFIRMATION);
      clearCart();
      toast({
        title: 'Order placed successfully!',
        description: 'Thank you for your purchase.',
      });
      window.scrollTo(0, 0);
    } catch (err) {
      toast({
        title: 'Order failed',
        description: (err as Error).message || 'Unable to place your order. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const orderTotal = totalPrice + (totalPrice >= 50 ? 0 : 4.99) + totalPrice * 0.08;

  return (
    <main className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <div className="flex items-center justify-center max-w-xl mx-auto">
            <div className={`flex flex-col items-center ${currentStep >= CheckoutStep.SHIPPING ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${currentStep >= CheckoutStep.SHIPPING ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                1
              </div>
              <span className="mt-1 text-xs">Shipping</span>
            </div>

            <div className={`w-24 h-0.5 ${currentStep >= CheckoutStep.PAYMENT ? 'bg-primary' : 'bg-muted'}`} />

            <div className={`flex flex-col items-center ${currentStep >= CheckoutStep.PAYMENT ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${currentStep >= CheckoutStep.PAYMENT ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                2
              </div>
              <span className="mt-1 text-xs">Payment</span>
            </div>

            <div className={`w-24 h-0.5 ${currentStep >= CheckoutStep.CONFIRMATION ? 'bg-primary' : 'bg-muted'}`} />

            <div className={`flex flex-col items-center ${currentStep >= CheckoutStep.CONFIRMATION ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${currentStep >= CheckoutStep.CONFIRMATION ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                3
              </div>
              <span className="mt-1 text-xs">Confirmation</span>
            </div>
          </div>
        </div>

        {currentStep === CheckoutStep.SHIPPING && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-serif font-bold mb-6">Shipping Information</h2>

              <form onSubmit={handleSubmitShipping} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={shippingForm.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={shippingForm.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={shippingForm.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={shippingForm.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    value={shippingForm.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={shippingForm.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province *</Label>
                    <Input
                      id="state"
                      value={shippingForm.state}
                      onChange={(e) => handleChange('state', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Zip/Postal Code *</Label>
                    <Input
                      id="postalCode"
                      value={shippingForm.postalCode}
                      onChange={(e) => handleChange('postalCode', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <select
                    id="country"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={shippingForm.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    required
                  >
                    <option value="">Select a country</option>
                    <option value="IN">India</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="saveAddress" />
                  <label htmlFor="saveAddress" className="text-sm text-muted-foreground">
                    Save this address for future orders
                  </label>
                </div>

                <Button type="submit" className="w-full md:w-auto">
                  Continue to Payment
                </Button>
              </form>
            </div>

            <div>
              <div className="bg-secondary/30 rounded-lg p-6 sticky top-20">
                <h3 className="text-lg font-medium mb-4">Order Summary</h3>

                <div className="space-y-2 mb-4">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span>{item.quantity} × {item.product.name}</span>
                      <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{totalPrice >= 50 ? 'Free' : '$4.99'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${(totalPrice * 0.08).toFixed(2)}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${orderTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === CheckoutStep.PAYMENT && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-serif font-bold mb-6">Payment Method</h2>

              <form onSubmit={handleSubmitPayment} className="space-y-6">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-start space-x-2 border p-4 rounded-md">
                    <RadioGroupItem value="card" id="payment-card" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="payment-card" className="font-medium">Credit Card</Label>
                      {paymentMethod === 'card' && (
                        <div className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardNumber">Card Number *</Label>
                            <Input id="cardNumber" placeholder="0000 0000 0000 0000" required />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="expiryDate">Expiry Date *</Label>
                              <Input id="expiryDate" placeholder="MM/YY" required />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cvv">CVV *</Label>
                              <Input id="cvv" placeholder="123" required />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="nameOnCard">Name on Card *</Label>
                            <Input id="nameOnCard" required />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 border p-4 rounded-md">
                    <RadioGroupItem value="paypal" id="payment-paypal" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="payment-paypal" className="font-medium">PayPal</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        You will be redirected to PayPal to complete your purchase securely.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 border p-4 rounded-md">
                    <RadioGroupItem value="cod" id="payment-cod" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="payment-cod" className="font-medium">Cash on Delivery</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Pay with cash when your order is delivered. Available for eligible delivery addresses.
                      </p>
                    </div>
                  </div>
                </RadioGroup>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium mb-2">Billing Address</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="sameAsShipping" defaultChecked />
                    <label htmlFor="sameAsShipping" className="text-sm">
                      Same as shipping address
                    </label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Button type="button" variant="outline" onClick={() => setCurrentStep(CheckoutStep.SHIPPING)}>
                    Back to Shipping
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Placing order...' : 'Place Order'}
                  </Button>
                </div>
              </form>
            </div>

            <div>
              <div className="bg-secondary/30 rounded-lg p-6 sticky top-20">
                <h3 className="text-lg font-medium mb-4">Order Summary</h3>

                <div className="space-y-2 mb-4">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span>{item.quantity} × {item.product.name}</span>
                      <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{totalPrice >= 50 ? 'Free' : '$4.99'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${(totalPrice * 0.08).toFixed(2)}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${orderTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === CheckoutStep.CONFIRMATION && (
          <div className="max-w-lg mx-auto text-center">
            <div className="bg-primary/10 inline-flex items-center justify-center w-16 h-16 rounded-full mb-6">
              <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-3xl font-serif font-bold mb-4">Thank You for Your Order!</h2>
            <p className="text-muted-foreground mb-8">
              Your order has been placed successfully. We'll send a confirmation email soon.
            </p>

            <div className="bg-secondary/30 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-medium mb-2">Order {orderNumber ? `#${orderNumber}` : 'Received'}</h3>
              <p className="text-sm text-muted-foreground mb-4">We are preparing your items for shipment.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link to="/">Continue Shopping</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/products">Browse More</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Checkout;
