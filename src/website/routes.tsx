import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import HomePage from './HomePage';
import AboutPage from './AboutPage';
import PricingPage from './PricingPage';
import ContactPage from './ContactPage';

const WebsiteRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/about" element={<Layout><AboutPage /></Layout>} />
      <Route path="/pricing" element={<Layout><PricingPage /></Layout>} />
      <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
      <Route path="*" element={<Layout><HomePage /></Layout>} />
    </Routes>
  );
};

export default WebsiteRoutes; 