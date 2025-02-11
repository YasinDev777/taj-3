import React from 'react';
import MainPage from "./pages/mainPage"
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';
const App = () => {
  return (
    <div className="app">
      <MainPage/>
      <ToastContainer />
    </div>
  );
};

export default App;
