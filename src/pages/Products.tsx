
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProducts } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Search, SlidersHorizontal, X } from 'lucide-react';
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

const Products: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getProducts();
        setProducts(data.map(normalizeProduct));
      } catch (err) {
        setError((err as Error).message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const baseProducts = category ? products.filter(product => product.category === category) : products;
    return baseProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesPrice;
    });
  }, [category, products, priceRange, searchTerm]);

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <main className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif font-bold mb-2">
            {category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : 'All Products'}
          </h1>
          <p className="text-muted-foreground">
            {category === 'bangles'
              ? 'Explore our beautiful collection of handcrafted silk thread bangles.'
              : category === 'earrings'
                ? 'Discover our exquisite silk thread earrings that perfectly complement any outfit.'
                : 'Browse through our handcrafted silk thread jewelry collection.'}
          </p>
        </div>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Button
              variant="outline"
              className="md:w-auto flex items-center gap-2"
              onClick={toggleFilters}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </div>

          <div className={`mt-4 bg-background border rounded-lg p-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium mb-3">Price Range</h3>
                <div className="px-2">
                  <Slider
                    defaultValue={[0, 50]}
                    max={50}
                    step={1}
                    value={priceRange}
                    onValueChange={handlePriceChange}
                    className="mb-6"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">${priceRange[0]}</span>
                    <span className="text-sm">${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {!category && (
                <div>
                  <h3 className="text-sm font-medium mb-3">Category</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="category-bangles" />
                      <label htmlFor="category-bangles" className="text-sm">Bangles</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="category-earrings" />
                      <label htmlFor="category-earrings" className="text-sm">Earrings</label>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium mb-3">Sort By</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="sort-featured" defaultChecked />
                    <label htmlFor="sort-featured" className="text-sm">Featured</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="sort-price-low" />
                    <label htmlFor="sort-price-low" className="text-sm">Price: Low to High</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="sort-price-high" />
                    <label htmlFor="sort-price-high" className="text-sm">Price: High to Low</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">Loading products...</div>
        ) : error ? (
          <div className="text-center py-20 text-destructive">{error}</div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search or filter criteria</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setPriceRange([0, 50]);
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Products;
