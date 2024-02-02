import React, { useEffect, useState } from 'react';
import { Dropdown, Media, Image, Modal, Button, Form } from 'react-bootstrap';
import { UserAction, UserAuthenticationAction, AppThemeAction, SubjectListAction } from '../../reduxManager';
//import {useDispatch,useSelect} from 'react-redux';
//import {setUserDetails} from '../../reduxManager/User/UserAction'
import { UrlConfig } from '../../config';
import { getStore } from '../../reduxManager';
import { useHistory } from "react-router-dom";
import { connect } from 'react-redux';
import { Api, Network } from '../../services';
import CommonFunctions from '../../utils/CommonFunctions';
import AppTheme from './AppTheme';
import assets from '../../assets';
import PasswordChange from '../../views/admin/PasswordChange';
import UpdateProfile from '../../views/admin/UpdateProfile'
import SettingsModal from './SettingsModal';
import { API } from '../../config/UrlConfig';
import { toast } from 'react-toastify';

const Navbar = (props) => {
  // --------------------props
  const { accountList,userData,userDetails,subjectList } = props
  // useEffect(() => {
  // }, [props.accountList])

  // --------------------------useStates--------------------------
  const [showChangePassword, setChangePasswordShow] = useState(false);
  const [showSettingsModal, setSettingsModalShow] = useState(false);
  const [showUpdateProfile, setUpdateProfile] = useState(false);
  const [CloseSettingsModal, setCloseSettingsModal] = useState(false);
  //const dispatch = useDispatch();

  // ------------------------external function calls--------------------------
  const history = useHistory();

  useEffect(() => {
    if (props.appTheme) {
      const { currentTheme } = props.appTheme;
      const setTheme = (currentTheme && currentTheme === 'dark') ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', setTheme);
    } else {
      const appTheme = 'light';
      setAppTheme(appTheme)
      document.documentElement.setAttribute('data-theme', appTheme);
    }


  }, [])

  useEffect(() => {
    console.log('appThemeappTheme', props.appTheme);

  }, [props.appTheme])

  const toggleOffcanvas = () => {
    document.querySelector('.sidebar-offcanvas').classList.toggle('active');

  }

  // --------------------------functions----------------------------------------------------
  const logout = () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    const resetData = CommonFunctions.resetStorage();
    if (resetData) {
      history.push(UrlConfig.routeUrls.loginUrl);
    }
  }

  const changeTheme = () => {
    const { currentTheme } = props.appTheme;
    const setTheme = currentTheme === 'dark' ? 'light' : 'dark';
    // AppThemeAction.setAppTheme(setTheme);
    setAppTheme(setTheme);
    document.documentElement.setAttribute('data-theme', setTheme);
  }

  const setAppTheme = (setTheme) => {
    const payload = { currentTheme: setTheme }
    AppThemeAction.setAppTheme(payload);
    // document.documentElement.setAttribute('data-theme', setTheme);
  }

  //const setUserData = () =>{
   // const payload = {fullName,email}
   // UserAction.setUserData(payload);
  //}

  const handleChangePassword = (currentPassword, newPassword) => {
    console.log('currentPassword, newPassword', currentPassword, newPassword);
    const payload = {
      "oldPassword": currentPassword,
      "newPassword": newPassword
    }
    Api.postApi(UrlConfig.apiUrls.changeAdminPassCode, payload)
      .then((response) => {
        console.log('response', response);
        setChangePasswordShow(false);
        toast.success('Password Changed Successfully');
      })
      .catch((error) => {
        console.log('error', error)
        const errorMessage = CommonFunctions.apiErrorMessage(error);
        console.log('errorMessage', errorMessage)
        toast.error(errorMessage);
      })
  }
  const updateProfileModal = () =>{
    setUpdateProfile(true);
  }
  const handleSettingsModal = () => {
    setSettingsModalShow(true);
  }
  
  return (
    <div>
      <nav className="navbar col-lg-12 col-12 p-lg-0 fixed-top d-flex flex-row">
        {/* <nav className="navbar col-lg-12 col-12 p-lg-0 fixed-top d-flex flex-row" style={{ backgroundColor: `${currentTheme ? currentTheme.backgroundColor : '#fff'}` }}> */}
        <div className="navbar-menu-wrapper d-flex align-items-center justify-content-between">
          <span className="navbar-brand brand-logo-mini align-self-center d-lg-none" onClick={evt => evt.preventDefault()}><img src={require("../../assets/images/SGlearningapp-mini-logo.png")} alt="logo" /></span>
          <button className="navbar-toggler navbar-toggler align-self-center" type="button" onClick={() => document.body.classList.toggle('sidebar-icon-only')}>
            <i className="mdi mdi-menu"></i>
          </button>
          <div className="institute-name-logo-box">
            <Media>
              <span className="institute-logo mr-3" onClick={evt => evt.preventDefault()}>
                <Image rounded className="img-xs" src={props.accountList && props.accountList.profileImage ? `${props.accountList.profileImage}` : props.appTheme && props.appTheme.currentTheme === 'dark' ? assets.images.instituteDefaultImage : assets.images.instituteDefaultImage} alt="Profile" />
              </span>
              <Media.Body>
                <span className="btn-shine">
                  {props.accountList && <span> {props.accountList.shortName} {(props.accountList && props.accountList.name) &&
                    <span>({props.accountList.name})</span>}</span>}

                </span>
              </Media.Body>
            </Media>

          </div>
          <ul className="navbar-nav navbar-nav-right ml-lg-auto">
            <li className="nav-item  nav-profile border-0 pl-4">
              <div className="toggleWrapper">
                <input type="checkbox" className="dn" id="dn" onChange={() => {
                  changeTheme();
                }}
                  checked={(props.appTheme && props.appTheme.currentTheme) === 'dark'}
                />
                <label htmlFor="dn" className="toggle-switcher">
                  <span className="toggle__handler">
                    <span className="crater crater--1"></span>
                    <span className="crater crater--2"></span>
                    <span className="crater crater--3"></span>
                  </span>
                  <span className="star star--1"></span>
                  <span className="star star--2"></span>
                  <span className="star star--3"></span>
                  <span className="star star--4"></span>
                  <span className="star star--5"></span>
                  <span className="star star--6"></span>
                </label>
              </div>
            </li>
            <li className="nav-item  nav-profile border-0 pl-4">
              <Dropdown alignRight>
                {/* <Dropdown.Toggle className="nav-link count-indicator p-0 toggle-arrow-hide bg-transparent">
                  <i className="mdi mdi-bell-outline"></i>
                  <span className="count danger">4</span>
                </Dropdown.Toggle> */}
                {/* <Dropdown.Menu className="navbar-dropdown preview-list">
                <Dropdown.Item className="dropdown-item py-3 d-flex align-items-center" href="!#" onClick={evt => evt.preventDefault()}>
                  <p className="mb-0 font-weight-medium float-left">You have 4 new notifications </p>
                  <span className="badge badge-pill badge-primary float-right">View all</span>
                </Dropdown.Item>
                <div className="dropdown-divider"></div>
                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center" href="!#" onClick={evt => evt.preventDefault()}>
                  <div className="preview-thumbnail">
                    <i className="mdi mdi-alert m-auto text-primary"></i>
                  </div>
                  <div className="preview-item-content py-2">
                    <h6 className="preview-subject font-weight-normal text-dark mb-1">Application Error</h6>
                    <p className="font-weight-light small-text mb-0"> Just now </p>
                  </div>
                </Dropdown.Item>
                <div className="dropdown-divider"></div>
                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center" href="!#" onClick={evt => evt.preventDefault()}>
                  <div className="preview-thumbnail">
                    <i className="mdi mdi-settings m-auto text-primary"></i>
                  </div>
                  <div className="preview-item-content py-2">
                    <h6 className="preview-subject font-weight-normal text-dark mb-1">Settings</h6>
                    <p className="font-weight-light small-text mb-0"> Private message </p>
                  </div>
                </Dropdown.Item>
                <div className="dropdown-divider"></div>
                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center" href="!#" onClick={evt => evt.preventDefault()}>
                  <div className="preview-thumbnail">
                    <i className="mdi mdi-airballoon m-auto text-primary"></i>
                  </div>
                  <div className="preview-item-content py-2">
                    <h6 className="preview-subject font-weight-normal text-dark mb-1">New user registration</h6>
                    <p className="font-weight-light small-text mb-0"> 2 days ago </p>
                  </div>
                </Dropdown.Item>
              </Dropdown.Menu> */}
              </Dropdown>
            </li>
            <li className="nav-item  nav-profile border-0">
              <Dropdown alignRight>
                <Dropdown.Toggle className="nav-link count-indicator bg-transparent">
                  <span className="profile-text">{props.userData && `${props.userData.name}`}</span>
                  <Image roundedCircle className="img-xs" src={props.userData && props.userData.profileImage ? `${props.userData.profileImage}` : assets.images.studentDefaultImage} alt="Profile" />
                  {/* <img className="img-xs " src={props.userData && props.userData.profileImage ? { uri: props.userData.profileImage } : assets.images.instituteDefaultImage} alt="Profile" /> */}
                </Dropdown.Toggle>
                <Dropdown.Menu className="preview-list navbar-dropdown pb-3">
                  <div className="d-flex">
                    <Dropdown.Item className="dropdown-item p-0 preview-item d-flex align-items-center border-bottom" href="!#" onClick={evt => evt.preventDefault()}>
                      <div className="py-3 px-4 d-flex align-items-center justify-content-center">
                        <i className="mdi mdi-bookmark-plus-outline mr-0"></i>
                      </div>
                    </Dropdown.Item>
                    <Dropdown.Item className="dropdown-item p-0 preview-item d-flex align-items-center border-bottom" href="!#" onClick={updateProfileModal}>
                      <div className="py-3 px-4 d-flex align-items-center justify-content-center border-left border-right">
                        <i className="mdi mdi-account-outline mr-0"></i>
                      </div>
                    </Dropdown.Item>
                    <Dropdown.Item className="dropdown-item p-0 preview-item d-flex align-items-center border-bottom" onClick={handleSettingsModal}>
                      <div className="py-3 px-4 d-flex align-items-center justify-content-center">
                        <i className="mdi mdi-settings mr-0"></i>
                      </div>
                    </Dropdown.Item>
                  </div>
                  <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center border-0 mt-2" onClick={() => {
                    setChangePasswordShow(true);
                  }}>
                    Manage Accounts
                  </Dropdown.Item>
                  {/* <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center border-0" onClick={evt => evt.preventDefault()}>
                  Change Password
                  </Dropdown.Item>
                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center border-0" onClick={evt => evt.preventDefault()}>
                  Check Inbox
                  </Dropdown.Item> */}
                  <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center border-0" onClick={evt => logout()}>
                    Sign Out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </li>
          </ul>
          <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" onClick={toggleOffcanvas}>
            <span className="mdi mdi-menu"></span>
          </button>
        </div>
      </nav>
      <PasswordChange
        show={showChangePassword}
        handleClose={() => setChangePasswordShow(false)}
        handleChangePassword={handleChangePassword}
      />
      <UpdateProfile
        showUpdateProfile={showUpdateProfile}
        closeUpdateModal={()=>setUpdateProfile(false)}
        updateProfileModal={setUpdateProfile}
      />
      <SettingsModal
        showSettingsModal={showSettingsModal}
        CloseSettingsModal={() => setSettingsModalShow(false)}
        handleSettingsModal={setSettingsModalShow}
      />
    </div>
  );

}

const mapPropsToState = (state) => {
  return {
    userData: state.userData,
    accountList: state.accountList[0],
    appTheme: state.appTheme,
    userDetails : state.userDetails
  }
}
export default connect(mapPropsToState)(Navbar);

// export default Navbar;
