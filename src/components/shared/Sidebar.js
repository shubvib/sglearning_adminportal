import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';
import { Dropdown } from 'react-bootstrap';
import { SideMenuList } from '../../utils';
import { UrlConfig } from '../../config';
import { getStore } from '../../reduxManager';
import { connect } from 'react-redux';
import assets from '../../assets';
import { GrDocumentVerified } from "react-icons/gr";

class Sidebar extends Component {
  state = { name: null, email: null, profileImage: null, };
  constructor() {
    super()
  }

  toggleMenuState(menuState) {
    if (this.state[menuState]) {
      this.setState({ [menuState]: false });
    } else if (Object.keys(this.state).length === 0) {
      this.setState({ [menuState]: true });
    } else {
      Object.keys(this.state).forEach(i => {
        this.setState({ [i]: false });
      });
      this.setState({ [menuState]: true });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    document.querySelector('#sidebar').classList.remove('active');
    Object.keys(this.state).forEach(i => {
      this.setState({ [i]: false });
    });

    const dropdownPaths = [
      { path: '/basic-ui', state: 'basicUiMenuOpen' },
      { path: '/form-elements', state: 'formElementsMenuOpen' },
      { path: '/tables', state: 'tablesMenuOpen' },
      { path: '/icons', state: 'iconsMenuOpen' },
      { path: '/charts', state: 'chartsMenuOpen' },
      { path: '/user-pages', state: 'userPagesMenuOpen' },
    ];

    dropdownPaths.forEach((obj => {
      if (this.isPathActive(obj.path)) {
        this.setState({ [obj.state]: true })
      }
    }));

  }

  headerLogoBar() {
    return (
      <div className="text-center sidebar-brand-wrapper d-flex align-items-center">
        <a className="sidebar-brand brand-logo" href="/">
          <img src={this.props.appTheme && this.props.appTheme.currentTheme === 'dark' ? assets.images.darkLogo : assets.images.lightLogo} alt="logo" />
        </a>
        <a className="sidebar-brand brand-logo-mini pt-3" href="/"><img src={assets.images.miniLogo} alt="logo" /></a>
      </div>
    )
  }

  headerProfileBar() {
    //const { name, email, profileImage, accountUserType } = this.props.userData;
    return (
      <li className="nav-item nav-profile not-navigation-link">
        <div className="nav-link profile-nav-link">
          <Dropdown>
            <Dropdown.Toggle className="nav-link user-switch-dropdown-toggler p-0 toggle-arrow-hide bg-transparent border-0 w-100">
              {/* <div className="d-flex justify-content-between align-items-start">
                <div className="profile-image">
                  <img src={profileImage ? { uri: profileImage } : assets.images.profileImg} alt="profile" />
                </div>
                <div className="text-left ml-3">
                  <p className="profile-name">{`${name}`}</p>
                  <small className="designation desiganation-text text-small" style={{ display: 'block' }}>{accountUserType !== 1 ? 'Owner' : 'Manager / Member'}<span className="status-indicator online" style={{marginLeft:5}}></span></small>
                  <small className="designation text-muted text-small">{email}</small>

                </div>
              </div> */}
            </Dropdown.Toggle>
          </Dropdown>

        </div>
      </li>
    )
  }

  menuItems() {
    return (
      <>
        <li className={this.isPathActive(UrlConfig.routeUrls.dashboard) ? 'nav-item active' : 'nav-item'}>
          <Link className="nav-link dash-board-link" to={UrlConfig.routeUrls.dashboard}>
            <i className="mdi mdi-television menu-icon"></i>
            <span className="menu-title">Dashboard</span>
          </Link>
        </li>
        <li className={this.isPathActive(UrlConfig.routeUrls.questionpapers) ? 'nav-item active' : 'nav-item'}>
          <Link className="nav-link exam-link" to={UrlConfig.routeUrls.questionpapers}>
            <i className="fa fa-file-text-o menu-icon"></i>
            <span className="menu-title">Question Papers</span>
          </Link>
        </li>
        <li className={this.isPathActive(UrlConfig.routeUrls.assignedexams) ? 'nav-item active' : 'nav-item'}>
          <Link className="nav-link exam-link" to={UrlConfig.routeUrls.assignedexams}>
            <i className="fa fa-clipboard menu-icon"></i>
            <span className="menu-title">Assigned Exams</span>
          </Link>
        </li>
        <li className={this.isPathActive(UrlConfig.routeUrls.reportAnalysis) ? 'nav-item active' : 'nav-item'}>
          <Link className="nav-link enroll-student-link" to={UrlConfig.routeUrls.reportAnalysis}>
            <i className="mdi mdi-file-chart menu-icon"></i>
            <span className="menu-title">Exam Analysis</span>
          </Link>
        </li>
        <li className={this.isPathActive(UrlConfig.routeUrls.enrollstudent) ? 'nav-item active' : 'nav-item'}>
          <Link className="nav-link enroll-student-link" to={UrlConfig.routeUrls.enrollstudent}>
            <i className="mdi mdi-format-list-bulleted menu-icon"></i>
            <span className="menu-title">Enroll Student</span>
          </Link>
        </li>
        <li className={this.isPathActive(UrlConfig.routeUrls.demopage) ? 'nav-item active' : 'nav-item'}>
          <Link className="nav-link enroll-student-link" to={UrlConfig.routeUrls.demopage}>
            <i className="mdi mdi-format-list-bulleted menu-icon"></i>
            <span className="menu-title">Demopage</span>
          </Link>
        </li>
        
        {/* <li className={this.isPathActive(UrlConfig.routeUrls.enrollfaculty) ? 'nav-item active' : 'nav-item'}>
          <Link className="nav-link enroll-faculty-link" to={UrlConfig.routeUrls.enrollfaculty}>
            <i className="fa fa-list-alt menu-icon"></i>
            <span className="menu-title">Enroll Faculty</span>
          </Link>
        </li> */}
        {/* <li className={this.isPathActive(UrlConfig.routeUrls.reports) ? 'nav-item active' : 'nav-item'}>
          <Link className="nav-link report-link" to={UrlConfig.routeUrls.reports}>
            <i className="mdi mdi-chart-line menu-icon"></i>
            <span className="menu-title">Report</span>
          </Link>
        </li> */}
        {/* <li className={this.isPathActive(UrlConfig.routeUrls.liveLecture) ? 'nav-item active' : 'nav-item'}>
          <Link className="nav-link liveLecture-link" to={UrlConfig.routeUrls.liveLecture}>
            <i className="fa fa-file-video-o menu-icon"></i>
            <span className="menu-title">Live Lecture</span>
          </Link>
        </li> */}
        {/* <li className={this.isPathActive(UrlConfig.routeUrls.trash) ? 'nav-item active' : 'nav-item'}>
        <Link className="nav-link liveLecture-link" to={UrlConfig.routeUrls.trash}>
          <i className="fa fa-recycle menu-icon"></i>
          <span className="menu-title">Trash</span>
        </Link>
      </li> */}

      </>

    )
  }
  render() {
    return (
      <nav className="sidebar sidebar-offcanvas" id="sidebar">
        <div className="night">
          <div className="shooting_star"></div>
          <div className="shooting_star"></div>
          <div className="shooting_star"></div>
          <div className="shooting_star"></div>
          <div className="shooting_star"></div>
          <div className="shooting_star"></div>
          <div className="shooting_star"></div>
          <div className="shooting_star"></div>
          <div className="shooting_star"></div>
          <div className="shooting_star"></div>
          <div className="shooting_star"></div>
          <div className="shooting_star"></div>
          <div className="shooting_star"></div>
          <div className="shooting_star"></div>
          <div className="shooting_star"></div>
          <div className="shooting_star"></div>
          <div className="shooting_star"></div>
          <div className="shooting_star"></div>
          <div className="shooting_star"></div>
          <div className="shooting_star"></div>
        </div>
        {this.headerLogoBar()}
        <ul className="nav">
          {this.headerProfileBar()}
          {this.menuItems()}
        </ul>
        <div className="trash-box">
          <ul className="nav">
            <li className={this.isPathActive(UrlConfig.routeUrls.trash) ? 'nav-item active' : 'nav-item'}>
              <Link className="nav-link liveLecture-link" to={UrlConfig.routeUrls.trash}>
                <i className="fa fa-recycle menu-icon"></i>
                <span className="menu-title">Trash</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }

  isPathActive(path) {
    return this.props.location.pathname.startsWith(path);
  }

  componentDidMount() {
    this.onRouteChanged();
    // add className 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
    const body = document.querySelector('body');
    document.querySelectorAll('.sidebar .nav-item').forEach((el) => {

      el.addEventListener('mouseover', function () {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');
        }
      });
      el.addEventListener('mouseout', function () {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');
        }
      });
    });
    // const { userData } = getStore().getState();
    // const { firstName, lastName, email, profileImage } = userData;
    // const name = `${firstName} ${lastName}`;
    // this.setState({ name, email, profileImage });
  }

}

// export default withRouter(Sidebar);
const mapPropsToState = (state) => {
  return {
    userData: state.userData,
    appTheme: state.appTheme
  }
}
export default connect(mapPropsToState)(withRouter(Sidebar));