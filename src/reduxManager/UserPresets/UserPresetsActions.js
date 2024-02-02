import { getStore } from '../store/store';
const store = getStore();

export const UserPresetsActions = {
    SET_USER_PRESETS_FOR_QUESTION_PAPERS: 'SET_USER_PRESETS_FOR_QUESTION_PAPERS',
    RESET_USER_PRESETS_FOR_QUESTION_PAPERS: 'RESET_USER_PRESETS_FOR_QUESTION_PAPERS'
}

const setQuestionPaperPreset = (presets) => {
    store.dispatch({ type: UserPresetsActions.SET_USER_PRESETS_FOR_QUESTION_PAPERS, payload: presets });
}
const resetQuestionPaperPreset = () => {
    store.dispatch({ type: UserPresetsActions.RESET_USER_PRESETS_FOR_QUESTION_PAPERS });
}

export default {
    setQuestionPaperPreset,
    resetQuestionPaperPreset

}