import { getStore } from '../store/store';
const store = getStore();
export const ActionTypes = {
    SET_EXPLORER_DATA: 'SET_EXPLORER_DATA',
    RESET_EXPLORER_DATA: 'RESET_EXPLORER_DATA',
}

const setExplorerData = (explorerData) => {
    console.log('explorer data in action', explorerData)
    store.dispatch({ type: ActionTypes.SET_EXPLORER_DATA, payload: explorerData });
}

const resetExplorerData = () => {
    store.dispatch({ type: ActionTypes.RESET_EXPLORER_DATA });
}
export default {
    setExplorerData,
    resetExplorerData,
}