
import { AccountListAction, UserAction, UserAuthenticationAction, ExplorerDataAction, SubjectListAction, CourseListAction, ExamListAction } from '../reduxManager';
import { Network } from '../services';
import moment from 'moment';


/**************** Set user, accounts(institute) token details on login, register *************/
const setUserAccountDetails = (data) => {
    const { accountUser, token, refreshToken } = data[0];
    const { user } = accountUser;
    const tokenDetails = { token: token, refreshToken: refreshToken };
    UserAction.setUserDetails(user);
    UserAuthenticationAction.setTokenDetails(tokenDetails);
    console.log('**** response token', token);
    console.log('**** response user', user);
    let accountList = [];
    data.map((dt) => {
        const { accountUser, token, refreshToken } = dt;
        const { account, accountUserType } = accountUser;
        const accountObj = { ...account, toke: token, refreshToken: refreshToken, accountUserType: accountUserType }
        return accountList.push(accountObj);
    });
    AccountListAction.setAccountList(accountList);
    Network.setToken(token);

    console.log('accountUser', accountList)

    return true;
    // history.push(UrlConfig.routeUrls.dashboard);
}

const apiErrorMessage = (error) => {
    let errorMessage = 'Something went wrong!';
    if (error && error.request) {
        if (error.request.status !== 0) {
            if (error.response && error.response.data && error.response.data.errors) {
                const { message } = error.response.data.errors[0];
                errorMessage = message ? message : errorMessage;
            }
        } else {
            errorMessage = 'Please check your internet connection!';
        }
    }
    return errorMessage;
}

/*** reset redux and token details after  */
const resetStorage = () => {
    Network.setToken('');
    UserAction.resetUserDetails();
    UserAuthenticationAction.resetTokenDetails();
    AccountListAction.resetAccountList();
    ExplorerDataAction.resetExplorerData();
    SubjectListAction.resetSubjectList();
    CourseListAction.resetCourseList();
    ExamListAction.resetExamList();
    return true;
}

/**get checked data array by object (branches, batches etc) */
const getCheckedExplorerdData = (entireObj, keyToFind) => {
    // console.log('entireObj', entireObj);
    // console.log('keyToFind', keyToFind);
    let foundObj = [];
    JSON.stringify(entireObj, (key, nestedValue) => {
        if (nestedValue && key === keyToFind) {
            let res = nestedValue.filter(val => {
                return val.checked || val.partialChecked;
            });
            res.length > 0 && foundObj.push(res);
        }
        return nestedValue;
    });
    // console.log('foundObj', foundObj)
    return foundObj;
}


/** reset checkbox selection of file explorer by object (branches, batches etc) */
function resetCheckboxSelection(entireObj, keyToFind) {
    let foundObj = [];
    JSON.stringify(entireObj, (key, nestedValue) => {
        if (nestedValue && key === keyToFind) {
            let res = nestedValue.filter(val => {
                if (val.checked) {
                    val.checked = false;
                }
                if (val.partialChecked) {
                    val.partialChecked = false;
                }
                return val.checked;
            });
            res.length > 0 && foundObj.push(res);
        }
        return nestedValue;
    });
    return foundObj;
};

const fortmatTwoDigit = (value) => {
    const formattedNumber = value > 9 ? value : `0${value}`;
    console.log(formattedNumber);
    return formattedNumber;
}

/**conver exam json to current array of array format. */
export const convertJSON = (examQueObject) => {
    let result = [];
    let newResult = [];
    if (examQueObject) {
        let newArray = [];
        newArray.push(examQueObject); //convert json to array
        result = newArray.map((que) => {
            /** separate array subject wise */
            return Object.values(que.questions).reduce(function (r, o) {
                const k = o.qs_subject_name   // unique `loc` key
                if (r[k] || (r[k] = [])) r[k].push({ ...o });
                return r;
            }, {});
        })
        let newArr = []
        /**convert questions array into current format array of */
        for (let [key, value] of Object.entries(result[0])) {
            const subjectJSON = JSON.parse(value[0].subject)
            let extraKeyArr = [];
            value.map((item, index) => {
                const { q_answer, id, q_explanation, q_question, q_type, subject, options } = item;
                let optionArray = [];
                options.map((opt) => {
                    const label = opt.qo_options['1'];
                    const optObj = { optionValue: opt.id, label, isChcked: false, ...opt };
                    optionArray.push(optObj);
                })
                const obj = {
                    questionId: fortmatTwoDigit(index + 1), questionText: q_question['1'], answer: q_answer, explanation: q_explanation['1'], selectedOption: -1, optionType: q_type, isVisited: 0, rightAnswer: 0, isBookmarked: 0, isChcked: false,
                    isAns: 0, ...item, options: optionArray,
                }
                extraKeyArr.push(obj)
            });
            newArr.push({ subject: key, SubId: subjectJSON.id, quastions: [...extraKeyArr] })
        }
        console.log('my new arr', newArr)
        return newArr;
    }
}


const replaceTag = (str) => {
    if ((str === null) || (str === ''))
        return false;
    else
        str = str.toString();
    // return str.replace(/(?:\ r\n|\r|\n)/g, '<br>') //replace \n to br
    // return str.replace(/(?:\\r\\n|\\r|\\n)/g, '') //replace \n\r to null
    // .replace(/\//g, '')
    return str;
}
function removeTags(str) {
    if ((str === null) || (str === ''))
        return false;
    else
        str = str.toString();
    return str.replace(/(<([^>]+)>)/ig, '')
        .replace(/(?:\\r\\n|\\r|\\n)/g, '')
        .replace(/:\s*/g, '.')
        .replace(/["']/g, "")


}

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

function toCamaleCase(str) {
    return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}


const filterMarkup = (markupString) => {
    const replaceString = markupString.replace(/mml:/g, "");

    // console.log('replaseString==' + replaceString);
    return replaceString;
}
const wrapMathjax = (content) => {
    return `
 <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
 <script type="text/x-mathjax-config">
 MathJax.Hub.Config();
 
 MathJax.Hub.Queue(function() {
 var height = document.documentElement.scrollHeight;
 
 window.postMessage(String(height));
 });
 </script>
 <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js?config=TeX-AMS-MML_HTMLorMML"></script>
 ${content}
 `;
}
const commonInstructions = () => {
    let formattedString = "";
    const instructions = 'For MHT-CET each correct answer carries +2 for maths, +1 for chemistry & physics each and for wrong answer 0 marks.For JEE each correct answer +4 and for wrong answer -1 marks.For NEET each correct answer +4 and for wrong answer -1 marks.For K-CET each correct answer carries +2 for maths, +1 for chemistry and physics each and for wrong answer 0 marks.Exam will get automatically submitted after exam set duration.During exam, on click of back button, a pop-up will ask to Discard the exam.'
    formattedString = instructions.replace(/\./g, ".\n");
    return formattedString;
}

const timeDifferanceInSecond = (startDateTime, endDateTime) => {
    const startDate = new Date(startDateTime)
    const endDate = new Date(endDateTime)
    const startTime = moment(startDate, 'MM-DD-YYYY hh:mm:ss a'); // another date
    const endTime = moment(endDate, 'MM-DD-YYYY hh:mm:ss a'); // another date
    const timeTaken = endTime.diff(startTime, 'seconds');
    return timeTaken;
}

const removeDuplicateRecod = async (dataArray) => {
    let newUserArray = [];
    const ms = await dataArray.map(async (data) => {
        const existingData = newUserArray.find((newData) => newData.studentId === data.studentId);
        const existingDataIndex = newUserArray.findIndex((newData) => newData.studentId === data.studentId);
        if (existingData) {
            const { score, attemptStartDateTime, attemptEndDateTime } = data;
            const { scoredMarks } = score;
            const existingScore = existingData.score;
            const existingScoredMarks = existingScore.scoredMarks;
            const existingAttemptedStartDateTime = existingData.attemptStartDateTime;
            const existingAttemptEndDateTime = existingData.attemptEndDateTime;
            const timeTaken = await timeDifferanceInSecond(attemptStartDateTime, attemptEndDateTime);
            const existingTimeTaken = await timeDifferanceInSecond(existingAttemptedStartDateTime, existingAttemptEndDateTime);
            if (scoredMarks === existingScoredMarks) {
                if (timeTaken > existingTimeTaken) {
                    newUserArray[existingDataIndex] = data;
                } else {
                    newUserArray[existingDataIndex] = existingData;
                }
            } else if (scoredMarks < existingScoredMarks) {
                newUserArray[existingDataIndex] = existingData;
            } else {
                newUserArray[existingDataIndex] = data;
            }
        } else {
            newUserArray.push(data);
        }
        return true;

    });
    return newUserArray;
}



export default {
    setUserAccountDetails,
    resetStorage,
    fortmatTwoDigit,
    toTitleCase,
    apiErrorMessage,
    resetCheckboxSelection,
    getCheckedExplorerdData,
    filterMarkup,
    commonInstructions,
    wrapMathjax,
    toCamaleCase,
    removeDuplicateRecod

}