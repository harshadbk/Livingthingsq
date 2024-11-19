import React from 'react'
import './breadcrums.css'
import arrow_icon from '../Assets/dd.jpg'

const breadcrums = (props) => {
    const {product}= props;
  return (
    <div className='breadcrum'>
      HOME <img src={arrow_icon} alt="" /> SHOP <img src={arrow_icon} alt="" /> {product.category} <img src={arrow_icon} alt="" /> {product.name} <img src={arrow_icon} alt="" />
    </div>
  )
}

export default breadcrums
