import { getStore } from '../store/store';
const store = getStore();
export const ActionTypes = {
    SET_ACCOUNT_LIST: 'SET_ACCOUNT_LIST',
    RESET_ACCOUNT_LIST: 'RESET_ACCOUNT_LIST',
}

const setAccountList = (accountDetails) => {
    console.log('user details in action', accountDetails)
    store.dispatch({ type: ActionTypes.SET_ACCOUNT_LIST, payload: accountDetails });
}

const resetAccountList = () => {
    store.dispatch({ type: ActionTypes.RESET_ACCOUNT_LIST });
}
export default {
    setAccountList,
    resetAccountList,
}