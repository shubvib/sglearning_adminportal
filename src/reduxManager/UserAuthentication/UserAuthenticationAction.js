import { getStore } from '../store/store';
const store = getStore();
export const ActionTypes = {
    SET_TOKEN_DETAILS: 'SET_TOKEN_DETAILS',
    RESET_TOKEN_DETAILS: 'RESET_TOKEN_DETAILS'
}

const setTokenDetails = (tokenDetails) => {
    store.dispatch({ type: ActionTypes.SET_TOKEN_DETAILS, payload: tokenDetails });
}

const resetTokenDetails = () => {
    store.dispatch({ type: ActionTypes.RESET_TOKEN_DETAILS });
}
export default {
    setTokenDetails,
    resetTokenDetails,
}