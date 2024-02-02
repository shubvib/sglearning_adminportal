const initialState = { currentTheme: null };
const AppThemeReducer = (
    state = initialState,
    action
) => {
    switch (action.type) {
        case 'SET_APP_THEME':
            if (action.payload) {
                return action.payload;
            }
            return state;
        case 'RESET_APP_THEME':
            return initialState
        default:
            return state;
    }
}

export default AppThemeReducer;
