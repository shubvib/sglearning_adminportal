import { getStore } from '../store/store';
const store = getStore();
export const ActionTypes = {
    SET_EXAM_LIST: 'SET_EXAM_LIST',
    RESET_EXAM_LIST: 'RESET_EXAM_LIST',
}

const setExamList = (examList1) => {
    console.log('examListFromActions', examList1);
    store.dispatch({ type: ActionTypes.SET_EXAM_LIST, payload: examList1 });
}

const resetExamList = () => {
    store.dispatch({ type: ActionTypes.RESET_EXAM_LIST });
}
export default {
    setExamList,
    resetExamList,

}