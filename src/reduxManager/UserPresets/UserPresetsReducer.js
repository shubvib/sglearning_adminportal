const { actions } = require("react-table");

const initialState = [];

const UserPresetsReducer = (
    state = initialState,
    action
) => {
    switch (action.type) {
        case 'SET_USER_PRESETS_FOR_QUESTION_PAPERS':
            if (Array.isArray(action.payload) && action.payload.length > 0) {
                return action.payload
            }
            return state;
        case 'RESET_USER_PRESETS_FOR_QUESTION_PAPERS':
            return initialState
        default:
            return state;
    }
}

export default UserPresetsReducer;