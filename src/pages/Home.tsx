import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { getFeaturedProducts } from '@/data/products';
import ProductCard from '@/components/ProductCard';

const Home: React.FC = () => {
  const featuredProducts = getFeaturedProducts();
  
  return (
    <main>
      {/* Hero Section */}
      <section className="hero-background relative overflow-hidden py-20 lg:py-28 animate-fade-in">
        <div className="hero-floral hero-floral--top-left"></div>
        <div className="hero-floral hero-floral--bottom-right"></div>
        <div className="container mx-auto px-4">
          <div className="grid gap-16 items-center lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-[650px] text-center lg:text-left">
              <h1 className="text-4xl font-serif font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-[4.75rem] hero-heading-large mx-auto lg:mx-0">
                Artisan Crafted Silk Thread Jewelry
              </h1>
              <p className="mt-6 max-w-[650px] mx-auto lg:mx-0 text-lg leading-9 text-slate-600">
                Welcome to Threads & Trinkets, where each piece tells a story of elegance, craftsmanship, and timeless luxury.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:items-start lg:items-start lg:justify-start">
                <Button asChild size="lg" className="btn-primary-custom">
                  <Link to="/products">Shop Collection</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="btn-outline-custom">
                  <Link to="/about">Our Story</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="hero-image-frame group overflow-hidden border border-pink-100 bg-white shadow-[0_25px_80px_rgba(212,175,55,0.14)]">
                <img
                  src="/images/Screenshot 2026-05-31 191144.png"
                  alt="Homepage hero upload"
                  className="h-full w-full min-h-[520px] object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  style={{ objectPosition: '80% 20%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Strip */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center gap-4 rounded-[1rem] bg-white p-6 text-center shadow-[0_20px_60px_rgba(16,24,40,0.08)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(16,24,40,0.12)]">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50 text-pink-600 text-2xl">❤</span>
              <div>
                <p className="text-base font-semibold text-slate-900">Handcrafted with Love</p>
                <p className="mt-2 text-sm text-slate-500">Beautifully made for every occasion.</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 rounded-[1rem] bg-white p-6 text-center shadow-[0_20px_60px_rgba(16,24,40,0.08)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(16,24,40,0.12)]">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50 text-pink-600 text-2xl">💎</span>
              <div>
                <p className="text-base font-semibold text-slate-900">Premium Quality Materials</p>
                <p className="mt-2 text-sm text-slate-500">High-quality silk thread and embellishments.</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 rounded-[1rem] bg-white p-6 text-center shadow-[0_20px_60px_rgba(16,24,40,0.08)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(16,24,40,0.12)]">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50 text-pink-600 text-2xl">🌿</span>
              <div>
                <p className="text-base font-semibold text-slate-900">Lightweight & Comfortable</p>
                <p className="mt-2 text-sm text-slate-500">Easy to wear all day long.</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 rounded-[1rem] bg-white p-6 text-center shadow-[0_20px_60px_rgba(16,24,40,0.08)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(16,24,40,0.12)]">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50 text-pink-600 text-2xl">🎁</span>
              <div>
                <p className="text-base font-semibold text-slate-900">Perfect for Gifting</p>
                <p className="mt-2 text-sm text-slate-500">Ready to delight your loved ones.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-20 category-showcase-section">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-center text-slate-900 mb-14">Shop by Category</h2>
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Bangles Category */}
            <div className="category-card group">
              <img 
                src="/images/Emerald%20Royale%20Silk%20Thread%20Bangle%20Set.png" 
                alt="Royal Emerald Silk Thread Bangles" 
                className="category-card-image"
              />
              <div className="category-card-overlay"></div>
              <div className="category-card-content">
                <p className="text-sm uppercase tracking-[0.35em] text-pink-100/85 mb-3">Royal Collection</p>
                <h3 className="category-card-title">Royal Emerald Silk Thread Bangles</h3>
                <p className="category-card-copy">Handcrafted silk thread bangles adorned with premium stones and elegant detailing.</p>
                <Button asChild variant="secondary" className="category-card-button">
                  <Link to="/products/bangles" className="flex items-center">
                    Explore Bangles
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Earrings Category */}
            <div className="category-card group">
              <img 
                src="/images/Emerald%20Pearl%20Silk%20Thread%20Jhumka.png" 
                alt="Emerald Pearl Silk Thread Jhumkas" 
                className="category-card-image"
              />
              <div className="category-card-overlay"></div>
              <div className="category-card-content">
                <p className="text-sm uppercase tracking-[0.35em] text-pink-100/85 mb-3">Emerald Collection</p>
                <h3 className="category-card-title">Emerald Pearl Silk Thread Jhumkas</h3>
                <p className="category-card-copy">Beautiful silk thread jhumkas featuring pearl drops and traditional handcrafted artistry.</p>
                <Button asChild variant="secondary" className="category-card-button">
                  <Link to="/products/earrings" className="flex items-center">
                    Explore Earrings
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-serif font-bold">Featured Products</h2>
            <Button asChild variant="ghost" className="hidden md:flex">
              <Link to="/products" className="flex items-center">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-8 flex justify-center md:hidden">
            <Button asChild variant="outline">
              <Link to="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-silk-mauve/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">What Our Customers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium">Sarah J.</p>
                  <p className="text-xs text-muted-foreground">New York, USA</p>
                </div>
                <div className="flex text-silk-gold">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-sm italic">
                "I absolutely love my silk thread bangles! The colors are vibrant and the craftsmanship is exceptional. I receive compliments every time I wear them."
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium">Priya M.</p>
                  <p className="text-xs text-muted-foreground">Toronto, Canada</p>
                </div>
                <div className="flex text-silk-gold">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-sm italic">
                "The silk thread jhumkas I ordered are stunning! They're lightweight and comfortable to wear all day. The attention to detail is amazing."
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium">Lisa R.</p>
                  <p className="text-xs text-muted-foreground">London, UK</p>
                </div>
                <div className="flex text-silk-gold">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-sm italic">
                "Fast shipping and beautiful packaging! The earrings were even more beautiful in person than in the photos. Will definitely be ordering more."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-16 bg-silk-peach">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold mb-4">Stay Updated</h2>
            <p className="text-muted-foreground mb-6">
              Subscribe to our newsletter and be the first to know about new collections and exclusive offers.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              />
              <Button type="submit" className="sm:w-auto">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
