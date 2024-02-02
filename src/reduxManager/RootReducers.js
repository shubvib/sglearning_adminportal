import { combineReducers } from 'redux';
import UserReducer from './User/UserReducer';
import UserAuthenticationReducer from './UserAuthentication/UserAuthenticationReducer';
import CourseListReducer from './CourseList/CourseListReducer';
import AccountListReducer from './AccountList/AccountListReducer';
import ExplorerDataReducer from './ExplorerData/ExplorerDataReducer';
import SubjectListReducer from './SubjectList/SubjectListReducer';
import ExamListReducer from './ExamList/ExamListReducer';
import AppThemeReducer from './AppTheme/AppThemeReducer';
import UserPresetsReducer from './UserPresets/UserPresetsReducer';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import localForage from 'localforage';

import createEncryptor from 'redux-persist-transform-encrypt'

const encryptor = createEncryptor({
    secretKey: 'SG$oft3ch',
    onError: function (error) {
        // Handle the error.
    }
});

const reducers = combineReducers({
    userData: UserReducer,
    authDetails: UserAuthenticationReducer,
    courseList: CourseListReducer,
    accountList: AccountListReducer,
    explorerData: ExplorerDataReducer,
    subjectList: SubjectListReducer,
    examList: ExamListReducer,
    appTheme: AppThemeReducer,
    userPresets: UserPresetsReducer
});

const persistConfig = {
    key: 'root',
    storage: localForage,
    transforms: [encryptor]

    // whitelist: ['searchHistories', 'appConfiguration']
}

const appReducer = persistReducer(persistConfig, reducers)

export default appReducer