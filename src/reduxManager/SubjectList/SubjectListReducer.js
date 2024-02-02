const initialState = [];
const CourseListReducer = (
    state = initialState,
    action
) => {
    switch (action.type) {
        case 'SET_SUBJECT_LIST':
            if (Array.isArray(action.payload) && action.payload.length > 0) {
                return action.payload
            }
            return state;
        case 'RESET_SUBJECT_LIST':
            return initialState
        default:
            return state;
    }
}

export default CourseListReducer;
