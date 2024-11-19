import React, { useState } from 'react';
import './earning.css'
import AddMyEarning from './addearning/addearning';
import Myearning from './myearning/myearning';
import Myinvest from './investment/myinvest';

const Earning = () => {
  const [activeComponent, setActiveComponent] = useState(''); // State to manage which component to show

  const handleShowComponent = (component) => {
    setActiveComponent(component);
  };

  return (
    <div className='earning-container'>

      <div className='button-container'>
        <button onClick={()=>{handleShowComponent('invest')}}>Add My Investment</button>
        <button onClick={() => handleShowComponent('add')}>Add My Earning</button>
        <button onClick={() => handleShowComponent('myEarnings')}>My Current Earnings</button>
      </div>

      <div className='component-display'>
        {activeComponent === 'invest' && <Myinvest/>}
        {activeComponent === 'add' && <AddMyEarning />}
        {activeComponent === 'myEarnings' && <Myearning />}
      </div>
    </div>
  );
};

export default Earning;
