const initialState = [];
const AccountListReducer = (
    state = initialState,
    action
) => {
    switch (action.type) {
        case 'SET_ACCOUNT_LIST':
            if (Array.isArray(action.payload) && action.payload.length > 0) {
                return action.payload
            }
            return state;
        case 'RESET_ACCOUNT_LIST':
            return initialState
        default:
            return state;
    }
}

export default AccountListReducer;
