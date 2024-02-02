const initialState = [];
const ExamListReducer = (
    state = initialState,
    action
) => {
    switch (action.type) {
        case 'SET_EXAM_LIST':
            if (Array.isArray(action.payload) && action.payload.length > 0) {
                return action.payload
            }
            return state;
        case 'RESET_EXAM_LIST':
            return initialState
        default:
            return state;
    }
}

export default ExamListReducer;
