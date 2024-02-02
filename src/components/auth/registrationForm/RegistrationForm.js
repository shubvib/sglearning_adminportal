/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef } from "react";
import { Form, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { Api } from "../../../services";
import { UrlConfig } from "../../../config";
import { UserAction, UserAuthenticationAction } from "../../../reduxManager";
import { FiArrowRightCircle } from 'react-icons/fi'
import OtpInput from 'react-otp-input';
import './ButtonAnimations.css'
import CommonFunctions from '../../../utils/CommonFunctions';
import TermsPrivacyPolicy from '../../../views/termsPrivacyPolicy/TermsPrivacyPolicy';
import ParticlesBg from 'particles-bg'
const RegistrationForm = (props) => {
  // UseHistory

  const history = useHistory();
  // Local States
  const [isLoaderShow, setloader] = useState(false);
  const [registerUser, setRegisterUser] = useState({
    // fName: "",
    // lName: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    // otp: "",
  });
  const [hide, setHide] = useState(true);
  const [functionDecider, setFunctionDecider] = useState("OTPHandle");
  const [otp, setotp] = useState(new Array(4).fill(""));

  const [flagg, setflagg] = useState(1);
  // For new Register Flow
  const [customShow, setCustomShow] = useState(true);
  const [flag, setFlag] = useState(0);
  // useEffect
  useEffect(() => {
    console.log(functionDecider)

  }, [functionDecider])

  const [InputFields, setInputFields] = useState(false)
  // RegisterUser manipulation function
  const updateUser = (element) => {
    if (element.name === "password" || element.name === "confirmPassword") {
      if (isNaN(element.value)) return false;
    }
    setRegisterUser({
      ...registerUser,
      [element.name]: element.value,
    });


  };


  // OnSubmit handling
  const handleFormSubmit = (event) => {
    event.preventDefault();
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (emailPattern.test(registerUser.email) === 0) {
      return false;
    } else {
      functionDecider === "OTPHandle" ? OtpGeneration() : handleSignUp();
    }

  };

  // generate and handleOTP
  const OtpGeneration = async () => {
    setloader(true)
    const payload = {
      emailOrPhone: registerUser.email.toLowerCase()
    }
    console.log('payload', payload);
    Api.postApi(UrlConfig.apiUrls.getOTPUrl, payload)
      .then((response) => {
        setloader(false)
        console.log('**** response', response);
        setHide(false);
        setFunctionDecider("SignUp");
        setInputFields(true);
        toast.success(`${response.message}`)
      }
      )
      .catch((error) => {
        setloader(false)
        console.log('********Error request ', error.request);
        console.log('********error response ', error.response);
        if (error.response !== undefined && error.response.status === 400) {
          console.log(error.response.data.errors[0].message)
          if (error.response.data.errors[0].message === "Email already exists") {
            toast.error(`${error.response.data.errors[0].message} Login with Credentials`)
          } else {
            toast.error
              (`${error.response.data.errors[0].message}`)
          }
        } else {
          toast.info("Check your Internet connection")
        }

      });
  };
  // const handelotp = val => {
  //   setRegisterUser({ ...registerUser, otp: val });
  //   // setFlag(0);
  //   // return val;

  // }

  // SignUp

  const handleSignUp = async () => {

    const finalOTP = otp.join('');
    setloader(true)
    const userName = (registerUser.fullName).toUpperCase()
    if (flag === 0) {
      registerUser.password = finalOTP;
    }
    const payload = {
      name: userName,
      emailOrPhone: registerUser.email.toLowerCase(),
      password: registerUser.password,
      otp: finalOTP
    }
    console.log('payload', payload);
    Api.postApi(UrlConfig.apiUrls.registerUrl, payload)
      .then((response) => {
        console.log('**** response', response);
        return response.data
      })
      .then(data => {
        setloader(false);
        if (data && data.length > 0) {
          const userSet = CommonFunctions.setUserAccountDetails(data);
          if (userSet) {
            toast.success("Congratulations, successfully registered !!")
            history.push(UrlConfig.routeUrls.dashboard);
          }
        }
      })
      .catch((error) => {
        setloader(false)
        console.log('********Error request ', error.request);
        console.log('********error response ', error.response);
        if (error.response !== undefined && error.response.status === 400) {
          toast.error(`${error.response.data.errors[0].message}`)
        } else {
          toast.info("Check your Internet connection")
        }
      });
  };
  //AD Work
  let dummyFlag = 1;
  const handleChange = (element, index) => {

    if (isNaN(element.value)) return false;

    setotp([...otp.map((d, idx) => (idx === index ? element.value === d ? d : element.value : d))]);

  }

  const checkKeyPress = (element, key, index) => {

    if (key === `Tab`) {
      return 0;
    } else { if (isNaN(key)) return false; }
    if (dummyFlag === 0) { dummyFlag = 1; }
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  }
  const removeElement = (element) => {

    if (element.previousSibling) {
      element.previousSibling.focus();
      dummyFlag = 0;
    }


  }


  // Views
  const Email = () => {
    return (
      <div>
        <div className="form-group">
          <input
            readOnly={!hide}
            type="email"
            name="email"
            id="email"
            value={registerUser.email}
            onChange={e => updateUser(e.target)}
            required
            className="form-control"
          />
          <label className="form-control-placeholder">Email<sup>*</sup></label>
        </div>


        {/* <Form.Group className="d-flex search-field">
          <Form.Control
          hidden={hide}
            type="otp"
            name={"otp"}
            id="otp"
            placeholder="Enter your OTP"
            value={registerUser.otp}
            onChange={updateUser}
            required
          />
        </Form.Group> */}
      </div>
    )
  }


  const NextInputs = () => {
    return (
      <div>
        <div>

          {/* Full Name */}

          <div className="form-group">
            <input
              className="form-control"
              required
              type="fullName"
              name="fullName"
              id="fullName"
              value={registerUser.fullName}
              onChange={e => updateUser(e.target)}
            />
            <label className="form-control-placeholder">Full Name<sup>*</sup></label>
          </div>

          {/*  */}
          {/* <div className="form-group">
            <input
              className="form-control"
              required
              type="fName"
              name="fName"
              id="fName"
              value={registerUser.fName}
              onChange={updateUser}
            />
            <label className="form-control-placeholder">First Name<sup>*</sup></label>
          </div>

          <div className="form-group">
            <input
              className="form-control"
              required
              type="lName"
              name="lName"
              id="lName"
              value={registerUser.lName}
              onChange={updateUser}
            />
            <label className="form-control-placeholder" >Last Name<sup>*</sup></label>
          </div> */}

          <div className="form-group">
            {/* <input
              className="form-control"
              required
              type="otp"
              name="otp"
              id="otp"
              value={registerUser.otp}
              onChange={updateUser}
              maxLength={4}
              datatype="number"
            />
            <label className="form-control-placeholder">4-digit OTP<sup>*</sup></label> */}
            {/* <Otp HandelOtp={setOTP} /> */}
            <div className="otp-container">
              {otp.map((data, index) => {
                return (<input
                  className="input-field"
                  type="text"
                  name="otp"
                  key={index}
                  value={data}
                  maxLength="1"
                  autoComplete="off"
                  onChange={e => handleChange(e.target, index)}
                  onKeyUp={event => event.key === `Backspace` ? removeElement(event.target) : checkKeyPress(event.target, event.key, index)}
                  onFocus={e => e.target.select()}
                />

                );
              })
                //AD Work End
              }
            </div>
          </div>
          <div className="passcodeText">
            <span>Use same OTP as pass-code</span>
            <h3 className="separator">OR</h3>
          </div>
          <div className="set-passcode-box">
            <Link to="#" className="text-primary"
              onClick={() => {
                setFlag(!flag)
                setCustomShow(!customShow)

              }}
              >Set pass-code</Link>
          </div>


          <div className="form-group">
            <input
              disabled={customShow}
              hidden={customShow}
              className="form-control"
              type="password"
              name="password"
              id="password"
              maxLength="4"
              minLength="4"
              value={registerUser.password}
              onChange={e => updateUser(e.target)}
              required
            />
            <label className="form-control-placeholder" hidden={customShow}>4-digit pass-code<sup>*</sup></label>
          </div>

          <div className="form-group">
            <input
              disabled={customShow}
              hidden={customShow}
              className="form-control"
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              maxLength="4"
              minLength="4"
              value={registerUser.confirmPassword}
              onChange={e => updateUser(e.target)}
              required
            />
            <label className="form-control-placeholder" hidden={customShow}>Confirm pass-code<sup>*</sup></label>
          </div>
          {/*  */}
          <div className="mt-3">
            {registerUser.confirmPassword === "" ||
              registerUser.password === "" ? (
                ""
              ) : isNaN(registerUser.password) ? (
                <div className="col-sm-12">
                  <p className="text-danger text-right">
                    Password must be 4-digit number{" "}
                  </p>
                </div>
              ) : registerUser.confirmPassword === registerUser.password ? (
                <div className="col-sm-12">
                  <p className="text-success text-right">Password matched</p>
                </div>
              ) : (
                    <div className="col-sm-12">
                      <p className="text-danger text-right">
                        Confirm your password
                  </p>
                    </div>
                  )}
            {/* <hr /> */}
          </div>
        </div>
        <div className="text-left mt-3 mb-2 font-weight-light text-muted terms-privacy-box">
          <span> By creating account, you are agree to our <Link to={{
            pathname: "/termsPrivacyPolicy/1",
          }} className="text-primary" target="_blank">Terms & conditions</Link> and
          <Link to={{
              pathname: "/termsPrivacyPolicy/2",
            }} className="text-primary" target="_blank"> Privacy Policy.</Link>
          </span>
        </div>
      </div >
    )
  }

  const CommonButton = () => {
    return (
      <div>
        {/* GetOTP button */}

        <div className="submit-button0">
          <div className="cta" >
            <button hidden={!hide} disabled={!hide} type="submit" className="otp-button btn btn-dark btn-rounded float float-right">
              Get OTP {isLoaderShow && <Spinner size="sm" animation="grow" variant="info" />}
              <span className="arrow primera next"></span>
              <span className="arrow segunda next ml-3"></span>
            </button>
            <br />
          </div>
        </div>

        {/*  */}
        <div className="mt-1">
          <button
            hidden={hide}
            id="submit-button"
            type="submit"
            block="true"
            // block
            className="btn btn-block btn-lg font-weight-medium auth-form-btn hvr-underline-from-left">Register{isLoaderShow && <Spinner size="sm" animation="grow" variant="info" />}</button>
        </div>
        <div className="text-center mt-4 font-weight-light text-muted">
          Already have an account? <Link to="/login" className="text-primary">Login</Link>
        </div>
      </div>
    )
  }
  return (
    <div>
      <ParticlesBg type="cobweb" bg={true} color="#18dcff" />
      <div className="d-flex align-items-center auth px-0">
        <div className="row w-100 mx-0">
          <div className="col-lg-7 px-0">
            <div className="left-side-img-bx">
              <img src={require("../../../assets/images/auth/register-bg.jpg")} className="login-half-bg" alt="Login Page Image" />
            </div>
          </div>
          <div className="col-lg-5 login-section-wrapper">
            <div className="auth-form-light">
              <div className="brand-logo">
                <img src={require("../../../assets/images/SG_Logo.png")} alt="logo" />
              </div>
              <h4 className="title-learning-app">LearningApp</h4>
              <Form className="pt-3" onSubmit={handleFormSubmit}>

                {/* Step 1 Inputs */}
                {Email()}
                {/* Step 1 Inputs End */}

                {/* Step 2 Inputs */}
                {InputFields && NextInputs()}
                {/* {NextInputs()} */}
                {/* Step 2 Inputs End */}

                {/* Common Functionality Button */}
                {CommonButton()}
                {/*  */}
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default RegistrationForm;
