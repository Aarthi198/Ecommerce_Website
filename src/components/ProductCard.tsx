
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Product, useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };
  
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-background hover:shadow-md transition-all duration-300">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              onClick={handleAddToCart}
              className="absolute bottom-4 right-4 rounded-full shadow-lg"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-medium text-sm truncate">{product.name}</h3>
          <div className="flex items-center justify-between mt-1">
            <span className="font-semibold">${product.price.toFixed(2)}</span>
            <span className="text-xs capitalize text-muted-foreground">{product.category}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
