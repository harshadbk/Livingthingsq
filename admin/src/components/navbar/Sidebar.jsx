import React from 'react';
import './sidebar.css';
import { Link } from 'react-router-dom';
import list_product_icon from '../../assets/list_product.jpg';
import add_user from '../../assets/add_user.jpeg';
import list_user from '../../assets/list_user.jpeg';
import my_pending from '../../assets/pend.jpg';
import my_Complete from '../../assets/complete.jpg';
import Unsubscribe from '../../assets/unsubscribe.jpg';

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <Link style={{ textDecoration: 'none' }} to={'/Listproduct'}>
        <div className="sidebar-item">
          <img src={list_product_icon} alt="List Product" />
          <p>List Products</p>
        </div>
      </Link>
      <Link style={{ textDecoration: 'none' }} to={'/adduser'}>
        <div className="sidebar-item">
          <img src={add_user} alt="Add Product" />
          <p>Add Users</p>
        </div>
      </Link>
      <Link style={{ textDecoration: 'none' }} to={'/listuser'}>
        <div className="sidebar-item">
          <img src={list_user} alt="List Users" />
          <p>List Users</p>
        </div>
      </Link>
      <Link style={{ textDecoration: 'none' }} to={'/Pending'}>
        <div className="sidebar-item">
          <img src={my_pending} alt="pend"/>
          <p>Pending Orders</p>
        </div>
      </Link>
      <Link style={{ textDecoration: 'none' }} to={'/unsubscribe'}>
        <div className="sidebar-item">
          <img src={Unsubscribe} alt="unsubs"/>
          <p>Subscribers</p>
        </div>
      </Link>
      <Link style={{ textDecoration: 'none' }} to={'/complete'}>
        <div className="sidebar-item">
          <img src={my_Complete} alt="complete"/>
          <p>Complete Orders</p>
        </div>
      </Link>
    </div>
  );
}

export default Sidebar;
