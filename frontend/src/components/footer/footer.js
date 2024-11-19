import React from 'react'
import './footer.css';
import footer_logo from '../Assets/footer_logo.jpg'
import pin_img from '../Assets/pin.jpg'
import whatsapp_img from '../Assets/whatsapp.jpg'
import insta_img from '../Assets/insta.jpg'

const footer = () => {
  return (
    <div className='footer'>
      <div className="footer-logo">
        <img src={footer_logo} alt="" />
        <p>VISHWA_AGRO SERVICES</p>
      </div>
      <ul className="footer-links">
        <li>Compony</li>
        <li>Products</li>
        <li>Offices</li>
        <li>About</li>
        <li>Contacts</li>
        <li>Farm</li>
      </ul>
      <div className="footer-social-icons">
        <div className="footer-icon-container">
            <img src={insta_img} alt="" />
        </div>
        <div className="footer-icon-container">
            <img src={pin_img} alt="" />
        </div>
        <div className="footer-icon-container">
            <img src={whatsapp_img} alt="" />
        </div>
      </div>
      <div className="footer-copyright">
        <hr />
        <p>Copyright @ 2024 App Right Reserved</p>
      </div>
    </div>
  )
}

export default footer
