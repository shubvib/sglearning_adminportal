import { getStore } from '../store/store';
const store = getStore();
export const ActionTypes = {
    SET_SUBJECT_LIST: 'SET_SUBJECT_LIST',
    RESET_SUBJECT_LIST: 'RESET_SUBJECT_LIST',
}

const setSubjectList = (subjectList) => {
    store.dispatch({ type: ActionTypes.SET_SUBJECT_LIST, payload: subjectList });
}

const resetSubjectList = () => {
    store.dispatch({ type: ActionTypes.RESET_SUBJECT_LIST });
}
export default {
    setSubjectList,
    resetSubjectList,
}