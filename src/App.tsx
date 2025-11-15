import React from 'react';
import logo from './logo.svg';
import './App.css';
import Toolbar from './components/Toolbar';

function App() {
  return (
    <div className='h-[calc(100*var(--i-vh))] w-[calc(100*var(--i-vw))] bg-dark-bg'>
      <Toolbar />
    </div>
  );
}

export default App;
