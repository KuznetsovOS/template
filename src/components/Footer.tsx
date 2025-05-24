import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-links">
          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Last.fm</a></li>
              <li><a href="#">Contact us</a></li>
              <li><a href="#">Jobs</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Help</h4>
            <ul>
              <li><a href="#">Track my music</a></li>
              <li><a href="#">Community support</a></li>
              <li><a href="#">Community guidelines</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>Last.fm</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 