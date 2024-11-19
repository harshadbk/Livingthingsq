import React from 'react';
import './Hero.css';
import arrow from '../Assets/arrow.jpg';
import heroimg from '../Assets/heroimg.jpg';

const Hero = () => {
    return (
        <div className='hero'>
            <div className="hero-left">
                <h2>
                Empowering Farmers, Nurturing Growth
                </h2>
                    <div>
                    <div className="hero-hand-icon">
                    </div>
                    <p>we are committed to supporting farmers with the tools, resources, and community they need to thrive</p>
                   </div>
                <div className="hero-latest-button">
                    <button>
                        Latest Collection
                    </button>
                    <img src={arrow} alt="Arrow icon" />
                </div>
            </div>
            <div className="hero-right">
               <img src={heroimg} alt="Hero" />
            </div>
        </div>
    );
}

export default Hero;
