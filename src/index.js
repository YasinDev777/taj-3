import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
const root = ReactDOM.createRoot(document.getElementById('root'));

document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "F12" || 
      (e.ctrlKey && e.shiftKey && e.key === "I") || 
      (e.ctrlKey && e.key === "U")) {
    e.preventDefault();
  }
});




root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
);