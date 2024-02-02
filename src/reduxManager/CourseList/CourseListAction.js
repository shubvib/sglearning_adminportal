import { getStore } from '../store/store';
const store = getStore();
export const ActionTypes = {
    SET_COURSE_LIST: 'SET_COURSE_LIST',
    RESET_COURSE_LIST: 'RESET_COURSE_LIST',
}

const setCourseList = (courseList) => {
    store.dispatch({ type: ActionTypes.SET_COURSE_LIST, payload: courseList });
}

const resetCourseList = () => {
    store.dispatch({ type: ActionTypes.RESET_COURSE_LIST });
}
export default {
    setCourseList,
    resetCourseList,
}