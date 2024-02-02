import { getStore } from '../store/store';
const store = getStore();
export const ActionTypes = {
    SET_USER_DETAILS: 'SET_USER_DETAILS',
    RESET_USER_DETAILS: 'RESET_USER_DETAILS',
    // SET_GOOGLE_IMAGE: 'SET_GOOGLE_IMAGE'
}

const setUserDetails = (userDetails) => {
    console.log('user details in action', userDetails)
    store.dispatch({ type: ActionTypes.SET_USER_DETAILS, payload: userDetails });
}

const resetUserDetails = () => {
    store.dispatch({ type: ActionTypes.RESET_USER_DETAILS });
}

// const setGoogleProfileImage = (profileImage) => {
//     store.dispatch({ type: ActionTypes.SET_GOOGLE_IMAGE,payload: profileImage})
// }
export default {
    setUserDetails,
    resetUserDetails,
    // setGoogleProfileImage
}