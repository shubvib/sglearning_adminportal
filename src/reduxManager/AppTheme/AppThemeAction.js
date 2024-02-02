import { getStore } from '../store/store';
const store = getStore();
export const ActionTypes = {
    SET_APP_THEME: 'SET_APP_THEME',
    RESET_APP_THEME: 'RESET_APP_THEME',
}

const setAppTheme = (theme) => {
    // console.log('dark them', theme)
    store.dispatch({ type: ActionTypes.SET_APP_THEME, payload: theme });
    // setThemeMode(themeMode === "contrast" ? "dark" : themeMode === "dark" ? "light" : "contrast")

}

const resetAppTheme = () => {
    store.dispatch({ type: ActionTypes.RESET_APP_THEME });
}
export default {
    setAppTheme,
    resetAppTheme,
}