
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/components/ui/use-toast';
import { Home, ShoppingCart, Heart } from 'lucide-react';
import { Product } from '@/contexts/CartContext';

const normalizeProduct = (product: any): Product => ({
  id: product.id || product._id,
  name: product.name,
  price: product.price,
  salePrice: product.salePrice,
  description: product.description,
  category: product.category,
  image: product.image || product.images?.[0]?.url || '/images/product-placeholder.png',
  images: product.images,
});

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('Invalid product selected.');
        setLoading(false);
        return;
      }

      try {
        const data = await getProductById(id);
        setProduct(normalizeProduct(data));
      } catch (err) {
        setError((err as Error).message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    toast({
      title: 'Added to cart',
      description: `${quantity} × ${product.name} added to your cart.`,
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">Loading product...</div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/products">Back to Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <main className="py-12">
      <div className="container mx-auto px-4">
        <nav className="mb-6 flex items-center text-sm text-muted-foreground">
          <Link to="/" className="flex items-center hover:text-foreground">
            <Home className="mr-1 h-3 w-3" />
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-foreground">Products</Link>
          <span className="mx-2">/</span>
          <Link to={`/products/${product.category}`} className="hover:text-foreground capitalize">
            {product.category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square overflow-hidden rounded-lg bg-muted">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">{product.name}</h1>
            <div className="flex items-baseline mb-4">
              <span className="text-2xl font-semibold">${product.price.toFixed(2)}</span>
              <span className="ml-2 text-sm text-muted-foreground">USD</span>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Quantity</h3>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => handleQuantityChange(quantity - 1)}
                >
                  <span>-</span>
                </Button>
                <span className="mx-4 w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  <span>+</span>
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                className="flex-1 flex items-center justify-center"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <Button variant="outline" className="flex-1 flex items-center justify-center">
                <Heart className="mr-2 h-4 w-4" />
                Add to Wishlist
              </Button>
            </div>

            <div className="border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h3 className="font-medium">Shipping</h3>
                  <p className="text-muted-foreground">Free shipping on orders over $50</p>
                </div>
                <div>
                  <h3 className="font-medium">Returns</h3>
                  <p className="text-muted-foreground">30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
