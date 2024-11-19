import React from 'react'
import './offers.css'
import exclusive from '../Assets/exclusive.jpg'

const offers = () => {
    return (
        <div className='offers'>
            <div className="offers-left">
                <h1>
                    Exclusive
                </h1>
                <h1>
                    Offers For You
                </h1>
                <p>
                    Only On Best Sellers Products
                </p>
                <button>
                   Check Now
                </button>
            </div>
            <div className="offers-right">
            <img src={exclusive} alt="" />
            </div>
        </div>
    )
}

export default offers
