import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from '@/contexts/AuthContext';
import StoreLayout from "@/layouts/StoreLayout";
import AdminAuthLayout from "@/layouts/AdminAuthLayout";

// Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AdminLogin from "./pages/AdminLogin";
import Checkout from "./pages/Checkout";
import CartPage from "./pages/Cart";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminOrders from "./pages/AdminOrders";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import MyOrders from "./pages/MyOrders";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Admin login — separate layout, no store header/footer */}
              <Route
                path="/admin/login"
                element={
                  <AdminAuthLayout>
                    <AdminLogin />
                  </AdminAuthLayout>
                }
              />
              <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

              {/* Storefront + admin dashboard (customer header for admin users) */}
              <Route element={<StoreLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:category" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

                <Route path="/signin" element={<SignIn />} />
                <Route path="/login" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />

                <Route path="/cart" element={<CartPage />} />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute requiredRole="customer">
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-orders"
                  element={
                    <ProtectedRoute requiredRole="customer">
                      <MyOrders />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminOrders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminProducts />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
      </CartProvider>
    </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


