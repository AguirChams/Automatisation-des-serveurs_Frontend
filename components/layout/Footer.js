import React from 'react';
import { Row, Col } from 'antd';
import {
  FacebookOutlined,
  InstagramOutlined,
  LinkedinOutlined,
} from '@ant-design/icons';

const Footer = () => {
  return (
    <footer className="text-center text-lg-start bg-light text-muted">
      {/* Section: Social media */}
      <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
        {/* Left */}
        <div className="me-5 d-none d-lg-block" style={{ fontSize: 'larger' }}>
          <span style={{ fontSize: 'larger' }}>Get connected with us on social networks:</span>
        </div>
   
        <div>
          <a href="https://www.facebook.com/mobelite.fr/?locale=fr_FR" className="me-4 text-reset">
            <FacebookOutlined />
          </a>
          <a href="https://www.instagram.com/mobelite.com.mx/?hl=fr" className="me-4 text-reset">
            <InstagramOutlined />
          </a>
          <a href="https://tn.linkedin.com/company/mobelite-tunisie" className="me-4 text-reset">
            <LinkedinOutlined />
          </a>
        </div>
        {/* Right */}
      </section>
      {/* Section: Social media */}

    
          {/* Copyright */}
          <div className="text-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', fontSize: 'larger' }}>
        <span style={{ color: '#fff' }}>© {new Date().getFullYear()} Mobelite Labs. All rights reserved. </span>
        <a className="text-reset fw-bold" href="https://mdbootstrap.com/">
          <span>https://mobelite.fr/fr</span>
        </a>
      </div>
      {/* Copyright */}
    </footer>
  );
};

export default Footer;
