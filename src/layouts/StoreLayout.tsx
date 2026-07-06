import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

/**
 * Standard storefront layout with customer navigation.
 */
const StoreLayout: React.FC = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <div className="flex-grow">
      <Outlet />
    </div>
    <Footer />
  </div>
);

export default StoreLayout;
