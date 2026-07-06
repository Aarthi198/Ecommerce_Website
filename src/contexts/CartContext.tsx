
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the product interface
export interface Product {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  description: string;
  category: string;
  image: string;
  images?: { url: string; alt?: string }[];
}

// Define the cart item interface
export interface CartItem {
  product: Product;
  quantity: number;
}

// Define the cart context interface
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  toggleCart: () => void;
}

// Create the cart context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Hook to use the cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Cart provider component
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage', error);
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  // Calculate total items in the cart
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  
  // Calculate total price of the cart
  const totalPrice = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  
  // Add a product to the cart
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { product, quantity }];
      }
    });
  };
  
  // Remove a product from the cart
  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };
  
  // Update the quantity of a product in the cart
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity }
          : item
      )
    );
  };
  
  // Clear the cart
  const clearCart = () => {
    setCart([]);
  };
  
  // Toggle the cart sidebar visibility
  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };
  
  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isCartOpen,
    toggleCart
  };
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
