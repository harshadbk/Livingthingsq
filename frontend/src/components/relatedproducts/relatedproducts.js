import React, { useEffect, useState } from 'react';
import './relatedproducts.css';
import Item from '../item/Item';


const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const RelatedProducts = () => {
  const [products, setProducts] = useState([]);
 
  const fetchRelatedProducts = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/allproducts');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();

      const shuffledData = shuffleArray(data).slice(0,7);
      setProducts(shuffledData);

    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to load related products. Please try again later.');
    }
  };

  useEffect(() => {
    fetchRelatedProducts();
  }, []);

  return (
    <div className='relatedproducts'>
      <h1>Related Products</h1>
      <hr />
      <div className="relatedproducts-item">
        {products.map((item, i) => (
          <Item
            key={item.id}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
