import React from 'react';
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

const App = () => {
  return (
    <>
      <Tape />
      <Header />
      <Hero />
      <Terminal />
      <Portfolio />
      <Calculator />
      <Why />
      <News />
      <Timeline />
      <Access />
      <Footer />
    </>
  );
};

export default App;