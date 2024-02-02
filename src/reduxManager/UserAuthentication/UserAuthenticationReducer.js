const initialState = { token: null, refreshToken: null };
const UserAuthenticationReducer = (
    state = initialState,
    action
) => {
    switch (action.type) {
        case 'SET_TOKEN_DETAILS':
            // if (Array.isArray(action.payload) && action.payload.length > 0) {
            //     return action.payload
            // }
            if (action.payload) {
                return { token: action.payload.token, refreshToken: action.payload.refreshToken }
            }
            return state;
        case 'RESET_TOKEN_DETAILS':
            return { initialState }
        default:
            return state;
    }
}

export default UserAuthenticationReducer;
