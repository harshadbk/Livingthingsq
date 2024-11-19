import React from 'react';
import './admin.css';
import Sidebar from '../../components/navbar/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Listproducts from '../../components/listproduct/Listproduct';
import Adduser from '../../components/adduser/adduser';
import ListUser from '../../components/listuser/listuser';
import Pending_order from '../../components/navbar/Pending';
import Complete_order from '../../components/navbar/complete';
import Subscribers from '../../components/unsubscribe/unsubscribe';

const Admin = () => {
  return (
    <div className='admin'>
      <Sidebar />
      <div className='content'>
        <Routes>
          <Route path='/Listproduct' element={<Listproducts />} />
          <Route path='/adduser' element={<Adduser/>}/>
          <Route path='/listuser' element={<ListUser/>} />
          <Route path='/Pending' element={<Pending_order/>} />
          <Route path='/complete' element={<Complete_order/>} />
          <Route path='/unsubscribe' element={<Subscribers/>} />
        </Routes>
      </div>
    </div>
  );
}

export default Admin;
