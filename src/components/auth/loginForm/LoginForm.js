/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { Form, Spinner } from 'react-bootstrap';
import { toast } from "react-toastify";
// import { GoogleLogin } from "react-google-login";
import { AiOutlineQuestion, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { useHistory} from "react-router-dom";
//import { HOST, API } from '../../../config/config';
 import { UrlConfig } from '../../../config';
 import { Api, Network } from '../../../services';

import { UserAction, UserAuthenticationAction, AccountListAction } from '../../../reduxManager';
import CommonFunctions from '../../../utils/CommonFunctions';
import ParticlesBg from 'particles-bg'

const LoginForm = () => {
  // Router Functions
  const history = useHistory();
  
  // useStates
  const [isLoaderShow, setloader] = useState(false);
  const [userInput, setUserInput] = useState({
    email: "",
    password: ""
  });
  const [loginFailed, setLoginFailed] = useState(false);
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // useState Manipulator
  const updateUser = (e) => {
    if (e.target.name === "password") {
      if (isNaN(e.target.value)) return false;
    }
    setUserInput({
      ...userInput,
      [e.target.name]: e.target.value,
    });
  };

  // Prevent Form Submit
  const handleFormSubmit = (event) => {
    event.preventDefault();
    console.log(userInput.email + userInput.password);
    //console.log(UrlConfig.routeUrls.dashboard)
    handleLogin();
  };


  // Functions
  // Login with Email Function
   const handleLogin = () => {
     setloader(true);
     const payload = {
       emailOrPhone: userInput.email.toLowerCase(),
       password: userInput.password,
     };
     console.log('payload', payload);
     Api.postApi(UrlConfig.apiUrls.emailLoginUrl, payload)
       .then((response) => {
         console.log('**** response data', response.data);
         return response.data
       })
       .then(data => {
         setloader(false)
        if (data && data.length > 0) {
           const userSet = CommonFunctions.setUserAccountDetails(data);
           console.log(userSet)
          if (userSet) {
            history.push(UrlConfig.routeUrls.dashboard);
           }
           // setUserAccountDetails(data);
         } else {
           (toast(`User data does not found `, {
             type: "error",
           }));
         }
       })
       .catch(error => {
         setloader(false)
        console.log('********Error request ', error.request);
        console.log('********error response ', error.response);
         if (error && error.request) {
           if (error.request.status !== 0) {
             if (error.response && error.response.data && error.response.data.errors) {
               console.log('********Response response ', error.response);
               const { message } = error.response.data.errors[0];
               message === "Invalid Credentials" ? (toast(`${message}`, {
                 type: "error",
               })) :
                 (toast(`User does not exist`, {
                   type: "error",
                 }))
              console.log('********Response request ', message);
             }
           }
         }

       });
   }

  // const responseGoogle = (response) => {
  //   setloader(true)
  //   const tokenId = response.tokenId;
  //   console.log(response)
  //   console.log(tokenId)
  //   Api.postApi(UrlConfig.apiUrls.loginWithGoogle, { providerToken: tokenId })
  //     .then((response) => {
  //       console.log('**** response', response);
  //       return response.data;
  //     }).then(data => {
  //       setloader(false)
  //       if (data && data.length > 0) {
  //         const userSet = CommonFunctions.setUserAccountDetails(data);
  //         if (userSet) {
  //           history.push(UrlConfig.routeUrls.dashboard);
  //         }
  //       }
  //     })
  //     .catch((error) => {
  //       setloader(false)
  //       console.log('********Error request ', error.request);
  //       console.log('********error response ', error.response);
  //       if (error && error.request) {
  //         if (error.request.status !== 0) {
  //           if (error.response && error.response.data && error.response.data.errors) {
  //             console.log('********Response response ', error.response);
  //             const { message } = error.response.data.errors[0];
  //             console.log('********Response request ', message);
  //           }
  //         }
  //       }
  //     })
  // };


  /**************** Set user account token details *************/
   const setUserAccountDetails = (data) => {
     const { accountUser, token, refreshToken } = data[0];
     const { user } = accountUser;
     const tokenDetails = { token: token, refreshToken: refreshToken };
     UserAction.setUserDetails(user);
     UserAuthenticationAction.setTokenDetails(tokenDetails);
     console.log('**** response token', token);
     console.log('**** response user', user);
     let accountList = [];
     data.map((dt) => {
       const { accountUser, token, refreshToken } = dt;
       const { account, accountUserType } = accountUser;
      const accountObj = { ...account, toke: token, refreshToken: refreshToken, }
       accountList.push(accountObj);
     });
     AccountListAction.setAccountList(accountList);
     Network.setToken(token);
     history.push(UrlConfig.routeUrls.dashboard);
   }


  // handle ResetPassword & GetOtp
   const handleResetPassword = () => {
     setloader(true)
    const payload = { emailOrPhone: userInput.email.toLowerCase() };
     Api.postApi(UrlConfig.apiUrls.resetPassword, payload)
      .then((response) => {
        console.log(response);
         toast.success(`${response.message} ! Check your email`, {});
       })
         setloader(false)
       .catch((error) => {
         console.log(error.request.status);
         if (error.request.status !== 0) {
           console.log(error.response);
           console.log(error.response.data.errors[0].message);
           toast.error(error.response.data.errors[0].message, {});
        } else {
        toast.info("check your internet", {});
         }
       });
   };

  // View Functions
  // const googleLoginView = () => {
  //   return (
  //     <GoogleLogin
  //       // clientId="873054166059-n92de7p8dh1pochjl508edvpcq12hufc.apps.googleusercontent.com" //dev
  //       clientId="914586267151-d31mhpppvpbnee43j5kmb6asgo7qcnrj.apps.googleusercontent.com" //staging
  //       buttonText="Log in with google"
  //       onSuccess={responseGoogle}
  //       onFailure={responseGoogle}
  //       cookiePolicy={"single_host_origin"}
  //       theme="light"
  //       className="google-button hvr-float-shadow"
  //     />
  //   )
  // }
  //-------------------------------------------------------------------------------------------------------- 
  return (
    <div>
      <div className="d-flex align-items-center auth px-0">
        <ParticlesBg type="cobweb" bg={true} color="#18dcff" />
        <div className="row w-100 mx-0">
          <div className="col-lg-7 px-0">
            <div className="left-side-img-bx">
              <img src={require("../../../assets/images/auth/login-bg.jpg")} className="login-half-bg" alt="Login Page Image" />
            </div>
          </div>
          <div className="col-lg-5 login-section-wrapper">
            <div className="auth-form-light">
              <div className="brand-logo">
                <img src={require("../../../assets/images/SG_Logo.png")} alt="logo" />
              </div>
              <h4 className="title-learning-app">LearningApp</h4>
              <Form className="pt-3" onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <input
                    required
                    type="email"
                    name="email"
                    id="email"
                    value={userInput.email}
                    onChange={updateUser} size="lg" className="form-control"
                  />
                  <label className="form-control-placeholder" htmlFor="email">Email address<sup>*</sup></label>
                </div>
                {/* <Form.Group className="d-flex search-field">
                  <Form.Control
                    required
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email address"
                    value={userInput.email}
                    onChange={updateUser} size="lg" className="h-auto"
                  />
                </Form.Group> */}
                <div className="form-group" style={{ display: "flex", flexDirection: "row" }}>
                  <input
                    required
                    type={showPassword === true ? "text" : "password"}
                    // type="password"
                    name="password"
                    id="password"
                    maxLength="4"
                    minLength="4"
                    placeholder=""
                    value={userInput.password}
                    onChange={updateUser}
                    className="form-control"
                  />
                  <label className="form-control-placeholder" htmlFor="email">4-digit Pass-Code<sup>*</sup></label>
                  <div className="show-password-eye" style={{ alignSelf: "center", position: "absolute", right: "0" }}
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  ><span>{showPassword === true ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}</span></div>
                </div>
                {/* <Form.Group className="d-flex search-field">
                  <Form.Control
                    required
                    type="password"
                    name="password"
                    id="password"
                    maxLength="4"
                    minLength="4"
                    placeholder="4-digit Pass-Code"
                    value={userInput.password}
                    onChange={updateUser}
                  />
                </Form.Group> */}
                <div className="mt-3">
                  <button
                    type="submit"
                    id="submit-button"
                   
                    disabled={
                      userInput.email === "" || userInput.password === "" || isLoaderShow === true
                        ? true
                        : false
                    }
                    // block
                    className="btn btn-block btn-lg font-weight-medium auth-form-btn hvr-underline-from-left">Log In  {isLoaderShow && <Spinner size="sm" animation="grow" variant="success" />}</button>
                </div>

                <div className="my-3 d-flex justify-content-between align-items-center">
                   <Link to="#" className="text-primary" onClick={() => {
                    if (userInput.email !== "") {
                      handleResetPassword(email);
                    } else {
                      toast("Enter your email", {
                        type: "error"
                      })
                    }

                  }} 
                   >Don't have a pass-code<AiOutlineQuestion size={15} />  Get OTP 
                   </Link>
                </div>
                {/* <div className="mb-2">
                  <button type="button" className="btn btn-block btn-facebook">
                    <i className="mdi mdi-facebook mr-2"></i>Connect using facebook
                    </button>
                </div> */}
                {/* <div className="mb-2">
                  <div className="loginWithGoogle">
                    {googleLoginView()}
              </div>*/}
                
                <div className="text-center mt-4 font-weight-light text-muted">
                  {/* Don't have an account? */}
                  {/* <Link to="/register" className="text-primary">Sign up</Link> */}
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

}

export default LoginForm;
