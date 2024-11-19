import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './navbar2.css';

const Navbar2 = () => {  
  const [menu, setMenu] = useState("Shop");
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('user-name');

  const menuItems = [
    { role: 'Farmer', items: [{ name: 'Add Product', path: '/faddproduct' },{ name: 'Add Work', path: '/addwork' },{ name: 'Remote Merchants', path: '/rmerchants' },{name:'Remote Workers',path:'/rworkers'},{name:'Talk With AI',path:'/ai'},{name:'Community',path:'/FCommunity'},{name:'Remote Shopkeepers',path:'/rshopkeeper'},{name:'Add Feedback',path:'/feedback'}]},
    { role: 'Admin', items: [{ name: 'Deliveries', path: '/' }, { name: 'Pickup Points', path: '/' }] },
    { role: 'Worker', items: [{ name: 'Works Near Me', path: '/' }, { name: 'Works History', path: '/' }] },
    { role: 'Shopkeeper',items:[{name:'Add Product',path:'/addproduct'},{name:'List Product',path:'/shopkeeper'},{name:'Pending Orders',path:'/Pending'},{name:'Complete Orders',path:'/complete'},{name:'Your Earning',path:'/'},{name:'Delivery Boys',path:'/'},{name:'Remote Farmers',path:'/rfarmers'},{name:'Products Availability',path:'/'},{name:'Community',path:'/FCommunity'},{name:'Farmers Feedback',path:'/'}]},
    { role: 'Merchant',items:[{name:'Buy Product',path:'/'},{name:'Farmers Near Me',path:'/rfarmers'},{name:'Purchased Products',path:'/'},{name:'Community',path:'/FCommunity'},{name:'Farmers Feedback',path:'/'}]}
  ];

  const roleItems = menuItems.find(item => item.role === role)?.items || [];

  return (
    <div className='navbar2'>
      <ul className="nav2-menu">
        {roleItems.map((item, index) => (
          <li key={index} onClick={() => setMenu(item.name)}>
            <Link style={{ textDecoration: 'none' }} to={item.path}>{item.name}</Link>
            {menu === item.name && <><hr /></>}
          </li>
        ))}
      </ul>
      <div className="nav2-name">
        {username && <p className="nav2-menu"><h4>Hello, {username}</h4><hr /></p>}
      </div>
    </div>
  );
};

export default Navbar2;
