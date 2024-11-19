import React, { useEffect, useState } from 'react'
import remove_icon from '../../assets/remove.jpg'
import './listproduct.css'

const ListProduct = () => {

  const [allProducts, setAllProducts] = useState([]);

  const fetchInfo = async () => {
    await fetch('http://127.0.0.1:5000/allproducts')
      .then((resp) => resp.json())
      .then((data) => { setAllProducts(data) });
  }

  useEffect(() => {
    fetchInfo();
  }, [])

  const removeProduct = async (id) => {
    await fetch('http://127.0.0.1:5000/removeproduct', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id })
    })
    await fetchInfo();
  }

  return (
    <div className='listproduct'>
      <h1>All Products List</h1>
      <br />
      <div className="listproduct-format-main">
        <p>Product</p>
        <p>Shopkeeper</p>
        <p>Title</p>
        <p>Price</p>
        <p>Category</p>
        <p>Crop Type</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproduct">
        <hr />
        {allProducts.map((product, index) => {
          return (
            <React.Fragment key={index}>
              <div className="listproduct-format-main listproduct-format">
                <img className='listproduct-product-icon' src={product.image} alt="Product" />
                <p>{product.email ? product.email : "None"}</p>
                <p>{product.name}</p>
                <p>₹{product.new_price}</p>
                <p>{product.category}</p>
                <p>{product.crop_type ? product.crop_type : "NA"}</p>
                <img onClick={() => { removeProduct(product.id) }} className='listproduct-remove-icon' src={remove_icon} alt="Remove" />
              </div>
              <hr />
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default ListProduct;
