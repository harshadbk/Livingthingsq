import React, { useContext } from 'react';
import './shopcategory.css';
import { shopContext } from '../context/shopcontext';
import Item from '../components/item/Item';
import drop_down from '../components/Assets/dd.jpg';

const ShopCategory = (props) => {
  const { allProduct } = useContext(shopContext);

  if (!allProduct || allProduct.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className='shopcategory'>
      <img className='shopcategory-banner' src={props.banner} alt="" />
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing 1-12 </span> Out of 36 products
        </p>
        <div className="shopcategory-sort">
          sort by <img src={drop_down} alt="" />
        </div>
      </div>
      <div className="shopcategory-products">
        {allProduct.map((item, i) => {
          if (props.category === item.category) {
            return (
              <Item
                key={i}
                id={item.id}
                name={item.name}
                image={item.image}
                new_price={item.new_price}
                old_price={item.old_price}
              />
            );
          } else {
            return null;
          }
        })}
      </div>
    </div>
  );
}

export default ShopCategory;
