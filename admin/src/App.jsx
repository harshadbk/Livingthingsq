import React from 'react';
import Navbar from './components/navbar/Navbar';
import Admin from './pages/admin/Admin';
import './App.css';

const App = () => {
  return ( 
    <div>
      <Navbar /> 
      <Admin />
    </div>
  );
}

export default App;
