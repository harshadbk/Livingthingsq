import React from 'react'
import './descriptionbox.css'

const descriptionbox = (props) => {

  const { product } = props;

  return (
    <div className='descriptionbox'>
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-navbox">
            Description
        </div>
        <div className="descriptionbox-navbox-fade">
           reviwes(122)
        </div>
        <div className="descriptionbox-description">
          <p>
            {product.description || "This design ensures that all product images are consistently sized and provides a visually appealing, interactive experience for users. The combination of clean lines, smooth animations, and subtle effects should make the ProductDisplay component delightful to use."}
          </p>
        </div>
      </div>
    </div>
  )
}

export default descriptionbox
