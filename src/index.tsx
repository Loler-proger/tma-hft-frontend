import React from 'react';
import { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router';
import NewOrderPage from './pages/NewOrderPage.tsx';
import { init, isTMA } from "@telegram-apps/sdk-react";
import MyOrdersPage from './pages/MyOrdersPage.tsx';
import { WelcomePage } from './pages/WelcomePage.tsx';

// import dotenv from 'dotenv';
console.log(isTMA())
import('./mock.ts');
// if(!isTMA()){
//   init();
// } else{
//   console.warn('Not TMA');
// }
const vh = window.innerHeight / 100;
const vw = window.innerWidth / 100;
// Для использования в CSS
document.documentElement.style.setProperty('--i-vh', `${vh}px`);
document.documentElement.style.setProperty('--i-vw', `${vw}px`);




const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/tma-hft-frontend/' element={ <WelcomePage /> }/>
        <Route path='/tma-hft-frontend/new-order' element={ <NewOrderPage /> }/>
        <Route path='/tma-hft-frontend/my-orders' element={ <MyOrdersPage /> }/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
