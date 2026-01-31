import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AddProduct from './pages/Admin/AddProduct';
import Dashboard from './pages/User/Dashboard';
import ProductDetails from './pages/User/ProductDetails';
import Cart from './pages/User/Cart';

import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <Router>
          <div className="app-container">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/admin/add-product" element={<AddProduct />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </LanguageProvider>
  );
}

export default App;
