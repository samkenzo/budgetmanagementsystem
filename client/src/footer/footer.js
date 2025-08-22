import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import './footer.css';

const Footer = () => {
  return (
   <footer style={{backgroundColor: '#27374d'}} className="text-white py-2">
      <div className="container">
        <div className="row mt-2">
          <div className="col-12 text-left ">
          <span>&copy; Budget Allocation IIT Indore. All rights reserved.</span>
           <span className="mx-4"></span>
           <a href="/aboutus" className="text-white hover:text-blue-300 transition duration-300 ease-in-out">About Developers</a>
          </div>
        </div>
        <div className="row">
          <div className="col-md-2 d-flex align-items-centre ">
            <div className="d-flex justify-content-start ml-5">
              <a href="#" className="text-white mr-3">
                <FaFacebookF />
              </a>
              <a href="#" className="text-white mr-3">
                <FaTwitter />
              </a>
              <a href="#" className="text-white mr-3">
                <FaLinkedinIn />
              </a>
              <a href="#" className="text-white">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;