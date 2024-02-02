import React from "react";
import RegistrationForm from '../../components/auth/registrationForm/RegistrationForm';
import { connect } from 'react-redux';

const Registration = (props) => {
  console.log('authDetails', props.authDetails.token);
  return (
    <RegistrationForm />
  );
};

// export default Registration;
const mapPropsToState = (state) => {
  return {
    userProfile: state.userData,
    authDetails: state.authDetails
  }
}
export default connect(mapPropsToState)(Registration)