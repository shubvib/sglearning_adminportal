import React, { Component } from 'react';
import moment from 'moment';
import assets from '../../assets'
class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <div className="container-fluid">
          <div className="d-sm-flex justify-content-center justify-content-sm-between">
            <span className=" text-center text-sm-left d-block d-sm-inline-block">Copyright © {moment(Date.now()).format("YYYY")} <a href="#" target="_blank" rel="noopener noreferrer">SG Learning</a>. All rights reserved.</span>
            {/* <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center">made with <i className="mdi mdi-heart text-danger"></i></span> */}
            <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center footer-shree">
              <img className="img-sm" src={assets.images.shree} alt="shree" />
            </span>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;