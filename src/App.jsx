import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Tape from './components/sections/Tape';
import Header from './components/layout/Header';
import Hero from './components/sections/Hero';
import Terminal from './components/sections/Terminal';
import Portfolio from './components/sections/Portfolio';
import Calculator from './components/sections/Calculator';
import Why from './components/sections/Why';
import News from './components/sections/News';
import Timeline from './components/sections/Timeline';
import Access from './components/sections/Access';
import Footer from './components/layout/Footer';
import AuthForm from './pages/AuthForm';
import Dashboard from './pages/Dashboard';
import Pay from './pages/Pay';
import Admin from './pages/Admin';

const Home = () => (
  <>
    <Tape />
    <Hero />
    <Terminal />
    <Portfolio />
    <Calculator />
    <Why />
    <News />
    <Timeline />
    <Access />
  </>
);

const App = () => {
  const location = useLocation();

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [location.pathname]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AuthForm mode="login" />} />
        <Route path="/register" element={<AuthForm mode="register" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pay" element={<Pay />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
