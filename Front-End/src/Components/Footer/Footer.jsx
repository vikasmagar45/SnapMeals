import React from 'react'
import './Footer.css'
import { assets } from '../../../assets/assets'

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img className="footer-logo" src={assets.LogoNew} alt="" />
          <p>
            amet consectetur adipisicing elit. Deserunt iste dolorum dolores
            maiores illum, quis explicabo vel facilis voluptates, voluptatem,
            earum officia eveniet repellat.
          </p>
           <div className="footer-social-icons">
            <a
              href="https://facebook.com"
              className="hover:text-gray-400"
              aria-label="Facebook"
            >
              <img src={assets.facebook_icon} alt="" />
            </a>
            <a
              href="https://twitter.com"
              className="hover:text-gray-400"
              aria-label="Twitter"
            >
              <img src={assets.twitter_icon} alt="" />
            </a>
            <a
              href="https://linkedin.com"
              className="hover:text-gray-400"
              aria-label="LinkedIn"
            >
              <img src={assets.linkedin_icon} alt="" />
            </a>
          </div>
        </div>
        <div className="footer-content-center">
            <h2>COMPANY</h2>
            <ul>
                <li>Home</li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Privacy Policy</li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>GET IN TOUCH</h2>
            <ul>
                <li>Phone: 123-456-7890</li>
                <li>Contact@example.com</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        © 2024 SnapMeals.com - All rights reserved.
      </p>
    </div>
  )
}

export default Footer
