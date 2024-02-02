const initialState = [];
const ExplorerDataReducer = (
    state = initialState,
    action
) => {
    switch (action.type) {
        case 'SET_EXPLORER_DATA':
            if (Array.isArray(action.payload) && action.payload.length > 0) {
                return action.payload
            }
            return state;
        case 'RESET_EXPLORER_DATA':
            return initialState
        default:
            return state;
    }
}
export default ExplorerDataReducer;
