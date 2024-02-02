import React, { useState, useEffect } from 'react';
import { Button, Modal, Tab, Nav, Spinner } from 'react-bootstrap';
import { GoReport } from "react-icons/go";
import { IoIosArrowRoundUp } from "react-icons/io";
import { Api } from '../../../../services';
import { BsChevronDoubleRight } from 'react-icons/bs';
import { UrlConfig } from '../../../../config';
import ReportResponse from '../../../../components/shared/ExamReportResponse';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import CommonFunctions from '../../../../utils/CommonFunctions';
import { connect, batch } from 'react-redux';
import moment from 'moment';
import { ToastContainer, toast } from "react-toastify";
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use';
let exportBtnRef = '';
let absentexportBtnRef = '';


const ExamReportModal = (props) => {
    const [indexes, setIndexes] = useState()
    const { width, height } = useWindowSize()
    const { showExamReportModal, closeExamReportModal, examId, selectedExamSchedule, ExamScheduleId, MetaDetaForAkcBkc, examData } = props;
    const [showReport, setShowReport] = useState(false);
    const [hideGenerate, setHideGenerate] = useState(true);
    const [hideExport, setHideExport] = useState(false);
    const [flag, setFlag] = useState(0);
    const [flagForExportPresent, setFlagForExportPresent] = useState(false);
    const [flagForExportAbsent, setFlagForExportAbsent] = useState(false);
    const [eexamReport, setExamReport] = useState();
    const [examName, setExamName] = useState();
    const [blankData, setBlankData] = useState();
    const [heading, setHeading] = useState();
    const [accountData, setAccountData] = useState(props.accountList);
    const [isDataPresent, setIsDataPresent] = useState();
    const [showFlag, setShowFlag] = useState();
    const [sortLoade, setSortLoader] = useState(false);
    const [listLaod, setListLoad] = useState(true);
    const [totalStudentsCountt, setTotalStudentsCount] = useState(null);
    // const [totalStudentCount, setTotalStudentCount] = useState(null);
    const [attemptedAndDiscardedCountt, setAttemptedAndDiscardedCount] = useState(null);
    const [attemptedButNotSubmittedCountt, setAttemptedButNotSubmittedCount] = useState(null);
    const [notAttemptedCountt, setNotAttemptedCount] = useState(null);
    const [examDate, setExamDate] = useState();
    const [absentStudentList, setAbsentStudentList] = useState();//array object
    const [attemptedAndDiscardedList, setAttemptedAndDiscardedList] = useState(null);
    const [attemptedButNotSubmittedList, setAttemptedButNotSubmittedList] = useState(null);
    const [notAttemptedList, setNotAttemptedList] = useState(null);
    const [isAbsentData, setIsAbsentData] = useState(false);
    const [isAbsentDataPresent, setIsAbsentDataPresent] = useState();
    const [showAbsentReport, setShowAbsentReport] = useState(true);
    const [loaderForAbsent, setLoaderForAbsent] = useState(true);
    const [batchArray, setBatchArray] = useState(null)
    const [selectAllBatches, setSelectAllBatches] = useState(false);
    const [scrollPosition, setScrollPosition] = useState();
    const [counterForPresent, setCounterForPresent] = useState(1);
    const [counterForAbsent, setCounterForAbsent] = useState(1);
    const [listLoader, setListLoader] = useState(false);
    const [responseIsNull, setResponseIsNull] = useState(false);
    // const [falgForConditionalAPI, setFalgForConditionalAPI] = useState(false);

    const resetExamReportModal = () => {
        console.log('reset called')

        if (selectedExamSchedule) {
            selectedExamSchedule.map((batch) => {
                batch.checked = false;
                return true;
            });
        }
        setFlag(2);
        setListLoad(true)
        setFlagForExportPresent(false);
        setFlagForExportAbsent(false);
        setIsDataPresent(false);
        setIndexes(0)
        setExamName("");
        setExamDate("");
        setShowReport(false);
        setIsAbsentData(false);
        setHideGenerate(false);
        setHideExport(false);
        setExamReport("");
        setBatchArray(null);
        setSelectAllBatches(false);
        closeExamReportModal();
        setCounterForPresent(1);
        setCounterForAbsent(1);
        setResponseIsNull(false);
        setScrollPosition(null);

        setAttemptedAndDiscardedList(null);
        setAttemptedButNotSubmittedList(null);
        setNotAttemptedList(null);
        setAttemptedAndDiscardedCount(null);
        setAttemptedButNotSubmittedCount(null);
        setNotAttemptedCount(null);

        exportBtnRef = '';
        absentexportBtnRef = '';
        setExamReportFull(null);
        setNotAttemptedListFull(null);
        setAttemptedAndDiscardedListFull(null);
        setAttemptedButNotSubmittedListFull(null);
        // setShowPresentReport(true);

    }
    useEffect(() => {
        return () => {
            exportBtnRef = '';
            absentexportBtnRef = '';
        }
    }, [])

    useEffect(() => {
        if (showExamReportModal && (selectedExamSchedule && selectedExamSchedule.length > 0)) {
            setBatchArray(sortSelectedBatch());
        }
    }, [showExamReportModal, selectedExamSchedule]);
    useEffect(() => {
        if (selectedExamSchedule && selectedExamSchedule.length > 0) {
            checkUnCheckAllBatches();
        }
    }, [showExamReportModal])

    /****************File explorer functionality end here **************************************/

    /****************Exam Report functionality start here **************************************/
    const sortSelectedBatch = () => {
        const sortedBatches = selectedExamSchedule.sort((a, b) => {
            let startdateTimeA = moment(a.startDateTime).format(" MM DD YYYY, hh:mm a");
            let startdateTimeB = moment(b.startDateTime).format(" MM DD YYYY, hh:mm a");

            startdateTimeA = Date.parse(new Date(startdateTimeA.split("/").reverse().join("-")));
            startdateTimeB = Date.parse(new Date(startdateTimeB.split("/").reverse().join("-")));
            const isResult = (startdateTimeA > startdateTimeB) ? 1 : -1;

            return isResult;
        })

        return sortedBatches;
    }


    const sortBy = (key, index, ind) => {
        if (eexamReport && eexamReport.length > 0) {
            const result = eexamReport.sort((a, b) => {

                if (key === "key") {
                    setShowFlag(index - 1);
                    setFlag(showFlag);

                    const isresult = (a.score.subjectwizeScore[(index - 1)].rank > b.score.subjectwizeScore[(index - 1)].rank) ? 1 : -1;

                    return isresult
                }
                else {
                    setShowFlag(7);
                    setFlag(showFlag);

                    const isresult = (a.score.rank > b.score.rank) ? 1 : -1;

                    return isresult
                }
            }

            );

            return result;
        }
    }
    // *************************************Exam Report For Present Student API Call Start**********************************************

    useEffect(() => {
        console.log('=>>', batchArray);
        if (batchArray && batchArray.length > 0) {
            validatedBatchArray();
        }
    }, [batchArray])


    const validatedBatchArray = () => {
        let selectedArray = [];
        batchArray.map((batch) => {
            batch.checked === true && selectedArray.push(batch);
        });
        if (selectedArray && selectedArray.length > 0) {
            setHideGenerate(false);
        } else {
            setHideGenerate(true);
        }
        // console.log('selectedArrayselectedArray', selectedArray);
    }

    const getReport = async (flag) => {

        var params = new URLSearchParams();
        const pageNumber = counterForPresent;
        if (!selectAllBatches && (batchArray && batchArray.length > 0)) {
            batchArray.map((batch) => {
                if (batch.checked) {
                    console.log('batch.checked', batch)
                    params.append("batchExamScheduleIds", batch.id);
                }
                return true;
            });
        }

        params.append("PageSize", 20);
        if (flag) {
            params.append("Page", 1);
        } else {
            params.append("Page", pageNumber);

        }

        // Api.getApi(UrlConfig.apiUrls.examReport, params)
        Api.getApi(`examSchedule/${ExamScheduleId}/report`, params)
            .then(async (response) => {
                (counterForPresent === 1 || flag) && generateAbsentReport(flag);
                console.log('responseeeee', response);

                if (!flag || counterForPresent === 1) {
                    setCounterForPresent(pageNumber + 1);
                }
                console.log("counterrrrrrr", counterForPresent);
                if (response) {
                    setResponseIsNull(false);
                    setListLoad(false);
                    setIsDataPresent(true);
                    const { startDateTime } = response.data;
                    const { examReport } = response.data;
                    const { examName } = response.data;
                    const { headers } = response.data;
                    setHeading(headers);
                    setFlagForExportPresent(true);
                    let len = headers.length - 7;
                    setBlankData(new Array(len).fill("-"));
                    if (eexamReport && eexamReport.length > 0 && !flag && counterForPresent !== 1) {
                        let newExamListArray = eexamReport.concat(examReport);
                        const newExamListArrayData = await CommonFunctions.removeDuplicateRecod(newExamListArray);
                        setExamReport(newExamListArrayData);
                    } else {
                        const newReportData = await CommonFunctions.removeDuplicateRecod(examReport);
                        setExamReport(newReportData);
                    }
                    setExamName(examName);
                    setExamDate(startDateTime);
                    setHideExport(true);
                    (counterForPresent === 1 && flag) && toast.success("Successfully Exam Report Generated.");
                    setFlag(5);
                }
                else {
                    setListLoad(false);
                    if (counterForPresent === 1 && flag) {
                        setIsDataPresent(false);
                        setFlagForExportPresent(false);
                        toast.info("No Data Found Of Present Report.");
                    }

                    setResponseIsNull(true);
                }
                setListLoader(false);
            })
            .catch((err) => {
                setListLoad(false);
                setListLoader(false);
                if (counterForPresent === 1 && flag) {
                    setIsDataPresent(false);
                    setFlagForExportPresent(false);
                }
                setResponseIsNull(true);

                if (err.response !== undefined && err.response.status === 400) {
                    toast.error("Invalid Batch Selection.");
                }
                else {
                    toast.info("Check Your Internet Connection.");
                }
            });

    }
    const resetOnGenerate = () => {
        setCounterForPresent(1);
        setCounterForAbsent(1);
        console.log(counterForAbsent, counterForAbsent);
        setAttemptedAndDiscardedList(null);
        setAttemptedButNotSubmittedList(null);
        setNotAttemptedList(null);
        setAttemptedAndDiscardedCount(null);
        setAttemptedButNotSubmittedCount(null);
        setNotAttemptedCount(null);
        setTotalStudentsCount(null);
        setShowReport(true);



    }

    // const returnForReset = () => {
    //     debugger
    //     if (counterForAbsent === 1 || counterForPresent === 1) {
    //         return true;
    //     }
    //     else {
    //         return false;
    //     }
    // }
    // *************************************Exam Report For Present Student API Call End**********************************************

    // *************************************Exam Report For Absent Student API Call Start**********************************************
    const generateAbsentReport = async (flag) => {
        var params = new URLSearchParams();
        const pageNumber = counterForAbsent;
        if (!selectAllBatches && (batchArray && batchArray.length > 0)) {
            batchArray.map((batch) => {
                if (batch.checked) {
                    console.log('batch.checked', batch)
                    params.append("batchExamScheduleIds", batch.id);
                }
                return true;
            });
        }

        params.append("PageSize", 20);
        if (flag) {
            params.append("Page", 1);
            // setFalgForConditionalAPI(false);
        } else {
            params.append("Page", pageNumber);
        }

        Api.getApi(`examSchedule/${ExamScheduleId}/absentStudents`, params)
            .then((response) => {

                setListLoader(false);

                if (!flag || counterForAbsent === 1) {
                    setCounterForAbsent(pageNumber + 1);
                }
                console.log("response for absent ", response);
                console.log("counterrrrrrr", counterForAbsent);
                if (response) {
                    const { data } = response;
                    const { pageSize } = response;
                    setResponseIsNull(false);
                    const { totalAbsentStudentsCount, totalStudentsCount, attemptedAndDiscardedCount, attemptedButNotSubmittedCount, notAttemptedCount } = response.data;
                    if ((data.attemptedAndDiscarded.length > 0 || data.attemptedButNotSubmitted.length > 0 || data.notAttempted.length > 0)) {
                        setIsAbsentData(true);
                        setIsAbsentDataPresent(true);
                        setLoaderForAbsent(false);
                        setHideExport(true);
                        setFlagForExportAbsent(true);

                        if (data.attemptedAndDiscarded.length > 0) {
                            setExamDate(data.attemptedAndDiscarded[0].startDateTime);
                            setExamName(data.attemptedAndDiscarded[0].examName);
                            if (attemptedAndDiscardedList && attemptedAndDiscardedList.length > 0 && !flag && counterForAbsent !== 1) {
                                let newExamListArray = attemptedAndDiscardedList.concat(data.attemptedAndDiscarded);
                                setAttemptedAndDiscardedList(newExamListArray);
                            } else {
                                setAttemptedAndDiscardedList(data.attemptedAndDiscarded);
                            }
                        }
                        if (data.attemptedButNotSubmitted.length > 0) {
                            setExamDate(data.attemptedButNotSubmitted[0].startDateTime);
                            setExamName(data.attemptedButNotSubmitted[0].examName);
                            if (attemptedButNotSubmittedList && attemptedButNotSubmittedList.length > 0 && !flag && counterForAbsent !== 1) {
                                let newExamListArray = attemptedButNotSubmittedList.concat(data.attemptedButNotSubmitted);
                                setAttemptedButNotSubmittedList(newExamListArray);
                            } else {
                                setAttemptedButNotSubmittedList(data.attemptedButNotSubmitted);
                            }

                        }
                        if (data.notAttempted.length > 0) {
                            setExamName(data.notAttempted[0].examName);
                            setExamDate(data.notAttempted[0].startDateTime);
                            if (notAttemptedList && notAttemptedList.length > 0 && !flag && counterForAbsent !== 1) {
                                let newExamListArray = notAttemptedList.concat(data.notAttempted);
                                setNotAttemptedList(newExamListArray);
                            } else {
                                setNotAttemptedList(data.notAttempted);
                            }
                        }

                    }

                    // !isDataPresent && toast.success("Successfully Absent Report Generated");
                    if ((attemptedAndDiscardedCount || attemptedButNotSubmittedCount || notAttemptedCount) && flag) {
                        setAttemptedButNotSubmittedCount(attemptedButNotSubmittedCount);
                        setAttemptedAndDiscardedCount(attemptedAndDiscardedCount);
                        setNotAttemptedCount(notAttemptedCount);
                        setTotalStudentsCount(totalAbsentStudentsCount);
                    }
                    if (data.attemptedAndDiscarded.length === 0 && data.attemptedButNotSubmitted.length === 0 && data.notAttempted.length === 0) {
                        setResponseIsNull(true);
                    }
                    setAbsentStudentList(data);
                }
                else {
                    setIsAbsentData(false);
                    setLoaderForAbsent(false);
                    if (counterForAbsent === 1 && flag) {
                        setIsAbsentDataPresent(false);
                        toast.info("No Data Found of Absent Report.")
                    }

                }

            })
            .catch((err) => {
                setIsAbsentData(false);
                setListLoader(false);
                setLoaderForAbsent(false);
                if (counterForAbsent === 1 && flag) {
                    setIsAbsentDataPresent(false);
                }
                setResponseIsNull(true);
                if (err.response !== undefined && err.response.status === 400) {
                    toast.error("Invalid Batch Selection.");
                }
                else {
                    toast.info("Check Your Internet Connection.");
                }

            });
    }

    // *************************************Exam Report For Absent Student API Call End**********************************************

    useEffect(() => {
        if ((eexamReport && eexamReport.length > 0) && (heading && heading.length > 0)) {
            subjectMap();
        }
    }, [eexamReport])

    const subjectMap = () => {
        if (!eexamReport || (eexamReport && eexamReport.length === 0)) return null;
        const { score } = eexamReport[0];
        if (score) {
            const { subjectwizeScore } = score;
            let newHeaders = [];
            heading.map((sub) => {
                let obj = sub;
                const sujbectObj = subjectwizeScore.find((e) => e.subjectName === sub);
                if (sujbectObj) {
                    obj = `${sub}(${sujbectObj.outOfMarks})`;
                } else {
                    if (sub === "Total Marks") {
                        obj = `${sub}(${score.outOfMarks})`;
                    }
                }
                newHeaders.push(obj);
                return true
            });
            setHeading(newHeaders);
        }
    }
    // *************************************Exam Report For Present Student MainHeader**********************************************
    const mainHeader = e => {
        return (
            <div className="examination-report-title" style={{ textAlign: "center", paddingBottom: 20, paddingTop: 0 }}>
                <h3 style={{ fontSize: 21, marginBottom: 15, marginTop: 15, color: '#2196f3', margin: 0, textAlign: 'center', fontFamily: 'GOTHIC' }}>{(accountData[0].name).toUpperCase() + ` ` + `(${accountData[0].shortName.toUpperCase()})`}</h3>
                <h4 style={{ textTransform: "capitalize", color: '#2196f3', margin: 0, textAlign: 'center', fontFamily: 'GOTHIC', fontSize: 16 }}>{examName}</h4>
                < h5 style={{ fontSize: 15, color: '#2196f3', margin: 0, textAlign: "center", fontFamily: 'GOTHIC' }}>{examDate === null ? " " : `(${moment(examDate).format('MMMM Do YYYY')})`}</h5>
            </div>
        );

    }

    // *************************************Exam Report For Present Student Header**********************************************

    const headerOfReport = e => {

        return <div> <tr className="exam-report-header-title" >
            {(eexamReport && eexamReport.length > 0) && heading.map((head, ind) => {

                return <th key={`${head}_` + ind} width="20%" style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 5, paddingRight: 5 }} >
                    <label htmlFor={head} className="common-exam-report-title stud-final-rank-title" style={{ cursor: 'pointer' }}>

                        {(head === "Rank") ? <label htmlFor={head} className="common-exam-report-title stud-final-rank-title" style={{ cursor: 'pointer' }}>{head} <Button
                            disabled={indexes === ind ? true : false}
                            className={indexes === ind ? 'sort-btn sort-btn-roation' : 'sort-btn'}
                            onClick={e => {

                                if (ind !== heading.length - 1) {
                                    setSortLoader(true);
                                    let index = ind - 5;
                                    index = (index + 1) / 2;
                                    setIndexes(ind)
                                    setExamReport(sortBy("key", index, ind))
                                    setSortLoader(false);

                                }
                                if (ind === heading.length - 1) {
                                    setSortLoader(true);
                                    setIndexes(ind)
                                    setExamReport(sortBy(ind))
                                    setSortLoader(false);
                                }

                            }

                            }
                            id={head}><IoIosArrowRoundUp /></Button> </label> : (head === "Total Time") ? head + `(sec)` : head}


                        {/* <Button className={`sort-btn sort-btn-roation`} id={head}><IoIosArrowRoundUp /></Button> */}
                    </label>
                </th>
            })}
        </tr></div>
    }
    /****************Exam Report API call End here **************************************/

    // *************************************Exam Report For Present pagination Start**********************************************
    const Loadder = () => {
        return <Spinner animation="border" role="status" style={{ color: '#fff' }}>
            <span className="sr-only" > Loading...</span >
        </Spinner >
    }

    const handelScrollPositionPresent = async (e) => {
        // let tempScroll = tempScrollPosition;
        let scrollTop = document.getElementById("myscrollPresent").scrollTop;
        let scrollHieght = document.getElementById("myscrollPresent").scrollHeight;
        let clientHeight = document.getElementById("myscrollPresent").clientHeight;
        if (responseIsNull) {
            scrollHieght = scrollHieght + 100;
        }

        if (((scrollTop) + (clientHeight)) >= (scrollHieght)) {
            // if (scrollPosition >= tempScrollPosition) {
            let check = counterForPresent + 1;
            console.log("counterrrrrrr", counterForPresent);
            setListLoader(true);
            if (check !== counterForPresent) {
                // setTempScrollPosition(tempScroll + 1300);
                getReport();
            }
        }
    }

    const handelScrollPositionAbsent = async (e) => {
        // let tempScroll = tempScrollPosition;
        let scrollTop = document.getElementById("myscrollAbsent").scrollTop;
        let scrollHieght = document.getElementById("myscrollAbsent").scrollHeight;
        let clientHeight = document.getElementById("myscrollAbsent").clientHeight;
        if (responseIsNull) {
            scrollHieght = scrollHieght + 100;
        }

        if (((scrollTop) + (clientHeight)) >= (scrollHieght)) {
            // if (scrollPosition >= tempScrollPosition) {
            let check = counterForAbsent + 1;
            console.log("counterrrrrrr", counterForAbsent);
            setListLoader(true);
            if (check !== counterForAbsent) {
                // setTempScrollPosition(tempScroll + 1300);
                generateAbsentReport();
            }
        }
    }
    // *************************************Exam Report For Present pagination End**********************************************

    // *************************************Exam Report For Present Student Start**********************************************
    const reportData = e => {
        let time1;
        let time2;
        let splitTime1;
        let splitTime2;
        let time;
        return (
            <div>

                <table id="tabel-to-xcl" style={{ width: '100%' }}>
                    {mainHeader()}
                    {console.log("exam nameeeeeeee")}
                    {headerOfReport()}
                    <div id="myscrollPresent"
                        onScroll={e => {
                            setScrollPosition(e.target.scrollTop);
                            if ((document.getElementById("myscrollPresent").scrollTop + document.getElementById("myscrollPresent").scrollHeight) >= (document.getElementById("myscrollPresent").clientHeight)) {
                                handelScrollPositionPresent(e);
                            }
                        }}
                        style={{ overflowY: 'auto', maxHeight: '60vh' }}>
                        {(eexamReport && eexamReport.length > 0) && eexamReport.map((data, idx) => {

                            time1 = `${moment(data.attemptEndDateTime).format("LTS")}`;
                            time2 = `${moment(data.attemptStartDateTime).format("LTS")}`;

                            time1 = moment(time1, ["hh:mm:ss A"]).format("HH:mm:ss");
                            time2 = moment(time2, ["hh:mm:ss A"]).format("HH:mm:ss");
                            splitTime1 = time1.split(':');
                            splitTime2 = time2.split(':');
                            time1 = (splitTime1[0] * 60 * 60) + (splitTime1[1] * 60) + (splitTime1[2] * 1);
                            time2 = (splitTime2[0] * 60 * 60) + (splitTime2[1] * 60) + (splitTime2[2] * 1);
                            time = time1 - time2;

                            return sortLoade ?
                                (<div className="loader">
                                    <Spinner animation="border" role="status" style={{ color: '#000', paddin: 25 }}>
                                        <span className="sr-only">Loading...</span>
                                    </Spinner>
                                </div>
                                )
                                :
                                (
                                    <tr key={data.studentId} className="exam-report-content-inner-box" >
                                        <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center' }}>{data.studentName}</td>

                                        <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center' }}>{data.studentCode}</td>

                                        <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center' }}>{data.branch.name}</td>

                                        <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center' }}>{data.class.name}</td>

                                        <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center' }}>{data.batch.name}</td>
                                        {
                                            data.score.subjectwizeScore.length > 0 ? data.score.subjectwizeScore.map((subjects, i) => {
                                                return <>
                                                    <td key={subjects.subjectId} width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center' }}>{subjects.scoredMarks}</td>
                                                    <td key={`${subjects.subjectId}_` + i} width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: '#6a008a', fontWeight: 'bold' }}>{subjects.rank}</td>

                                                </>

                                            }) : blankData.map((d, i) => {
                                                return <>
                                                    <td key={`${d}_` + i} width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center' }}>{d}</td>
                                                </>
                                            })

                                        }

                                        <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center' }}>{data.score.scoredMarks}</td>
                                        <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center' }}>{time}</td>
                                        <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: '#6a008a', fontWeight: 'bold' }}>{data.score.rank}</td>
                                    </tr>
                                )
                        })
                        }
                        <div style={{ textAlign: "center", padding: 10 }}>
                            {listLoader && Loadder()}
                        </div>
                    </div>
                </table>
            </div >
        )
    }

    // *************************************Exam Report For Present Student End**********************************************


    // *************************************Exam Report For Absent Student Start**********************************************
    const mainHeaderForAbsent = () => {
        return <table style={{ width: '100%', border: 'transparent' }}>
            <tr>
                <td width="33.33%" colSpan={3}>
                    <div className="live-count-label-box" style={{ textAlign: 'center' }}>
                        <label style={{ color: '#000' }}>Total no.of Absent student:
                        <span className="counter-flip-span" style={{ color: '#000', fontSize: 15, fontWeight: 'bold' }}>{totalStudentsCountt}</span>
                        </label>
                    </div>
                    <div className="live-count-label-box" style={{ textAlign: 'center' }}>
                        <label style={{ color: '#6610f2' }}>Exam attempted but not submitted:
                        <span className="counter-flip-span" style={{ color: '#6610f2', fontSize: 15, fontWeight: 'bold' }}>{attemptedButNotSubmittedCountt}</span>
                        </label>
                    </div>
                </td>

                <td width="33.33%" colSpan={2}>
                    <h3 style={{ fontSize: 21, marginBottom: 15, marginTop: 15, color: '#2196f3', margin: 0, textAlign: 'center', fontFamily: 'GOTHIC' }}>{(accountData[0].name).toUpperCase() + ` ` + `(${accountData[0].shortName.toUpperCase()})`}</h3>
                    <h4 style={{ textTransform: "capitalize", color: '#2196f3', margin: 0, textAlign: 'center', fontFamily: 'GOTHIC', fontSize: 16 }}>{examName}</h4>
                    < h5 style={{ fontSize: 15, color: '#2196f3', margin: 0, textAlign: "center", fontFamily: 'GOTHIC' }}>{examDate === null || examDate === "" ? " " : `(${moment(examDate).format('MMMM Do YYYY')})`}</h5>
                </td>

                <td width="33.33%" colSpan={3}>
                    <div className="live-count-label-box" style={{ textAlign: 'center' }}>
                        <label style={{ textAlign: 'center', color: "#41478a" }}>Exam discarded:
                    <span className="counter-flip-span" style={{ color: '#41478a', fontSize: 15, fontWeight: 'bold' }}>{attemptedAndDiscardedCountt}</span>
                        </label>
                    </div>
                    <div className="live-count-label-box" style={{ textAlign: 'center' }}>
                        <label style={{ textAlign: 'center', color: '#f00' }}>Exam not attempted:
                       <span className="counter-flip-span" style={{ color: '#f00', fontSize: 15, fontWeight: 'bold' }}>{notAttemptedCountt}</span>
                        </label>
                    </div>
                </td>

            </tr>
        </table>
    }


    const absentStudentReport = () => {

        let absentReport = [" Student Name", " Student Code", "Branch", "Class", "Batch", "Phone number", "Start Time", "End Time"];
        return <table id="tabel-to-xcl-absence" style={{ width: '100%', border: 'transparent' }}>
            <tr>
                <td width="100%">
                    {mainHeaderForAbsent()}
                </td>
            </tr>
            <tr>
                <td width="100%">
                    <table style={{ width: '100%' }}>
                        <tr className="exam-report-header-title">
                            {absentReport.map((headings, idx) => {
                                return <th key={`${headings}` + idx} width="20%" style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 5, paddingRight: 5 }} > <label className="common-exam-report-title stud-final-rank-title" style={{ cursor: 'pointer' }}>{headings}</label></th>

                            })}

                        </tr>
                        <div
                            id="myscrollAbsent"
                            onScroll={e => {
                                setScrollPosition(e.target.scrollTop);
                                if ((document.getElementById("myscrollAbsent").scrollTop + document.getElementById("myscrollAbsent").scrollHeight) >= (document.getElementById("myscrollAbsent").clientHeight)) {
                                    handelScrollPositionAbsent(e);
                                }
                            }}
                            style={{ overflowY: 'auto', maxHeight: '60vh' }}>
                            {attemptedAndDiscardedList && attemptedAndDiscardedList.length > 0 && attemptedAndDiscardedList.map((stud, idx) => {

                                let branchName = stud.student.branches[0].name;
                                let className = stud.student.classes[0].name;
                                let batchName = stud.student.batches[0].name;
                                let phoneNO = stud.student.userInfo.phone === null ? "-" : stud.student.userInfo.phone
                                let startTime = stud.inTimeAttemptStartDateTime === null ? "-" : moment(stud.inTimeAttemptStartDateTime).format("LTS");
                                let discardTime = stud.inTimeAttemptDiscardedDateTime === null ? "-" : moment(stud.inTimeAttemptDiscardedDateTime).format("LTS");


                                return <tr key={stud.userId} className="exam-report-content-inner-box" >
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: "#41478a" }}>{stud.student.userInfo.name}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: "#41478a" }}>{stud.student.code}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: "#41478a" }}>{branchName}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: "#41478a" }}>{className}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: "#41478a" }}>{batchName}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: "#41478a" }}>{phoneNO}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: "#41478a" }}>{startTime}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: "#41478a" }}>{discardTime}</td>

                                </tr>
                            })}

                            {attemptedButNotSubmittedList && attemptedButNotSubmittedList.length > 0 && attemptedButNotSubmittedList.map((stud, idx) => {

                                let branchName = stud.student.branches[0].name;
                                let className = stud.student.classes[0].name;
                                let batchName = stud.student.batches[0].name;
                                let phoneNO = stud.student.userInfo.phone === null ? "-" : stud.student.userInfo.phone
                                let startTime = stud.inTimeAttemptStartDateTime === null ? "-" : moment(stud.inTimeAttemptStartDateTime).format("LTS");
                                let endTime = stud.inTimeAttemptEndDateTime === null ? "-" : moment(stud.inTimeAttemptEndDateTime).format("LTS");

                                return <tr key={stud.userId} className="exam-report-content-inner-box" >
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: '#6610f2' }}>{stud.student.userInfo.name}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: '#6610f2' }}>{stud.student.code}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: '#6610f2' }}>{branchName}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: '#6610f2' }}>{className}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: '#6610f2' }}>{batchName}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: '#6610f2' }}>{phoneNO}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: '#6610f2' }}>{startTime}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: '#6610f2' }}>{endTime}</td>

                                </tr>
                            })}

                            {notAttemptedList && notAttemptedList.length > 0 && notAttemptedList.map((stud, idx) => {
                                let branchName = stud.student.branches[0].name;
                                let className = stud.student.classes[0].name;
                                let batchName = stud.student.batches[0].name;
                                let phoneNO = stud.student.userInfo.phone === null ? "N/A" : stud.student.userInfo.phone
                                let startTime = stud.inTimeAttemptStartDateTime === null ? "-" : moment(stud.inTimeAttemptStartDateTime).format("LTS");
                                let endTime = stud.inTimeAttemptEndDateTime === null ? "-" : moment(stud.inTimeAttemptDiscardedDateTime).format("LTS");



                                return <tr key={stud.userId} className="exam-report-content-inner-box" >
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: '#f00' }}>{stud.student.userInfo.name}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: '#f00' }}>{stud.student.code}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: '#f00' }}>{branchName}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: '#f00' }}>{className}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: '#f00' }}>{batchName}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: '#f00' }}>{phoneNO}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: '#f00' }}>{startTime}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: '#f00' }}>{endTime}</td>

                                </tr>
                            })}
                            <div style={{ textAlign: "center", padding: 10 }}>
                                {listLoader && Loadder()}
                            </div>
                        </div>

                    </table>
                </td>
            </tr>
        </table>

    }

    const [attemptedAndDiscardedListFull, setAttemptedAndDiscardedListFull] = useState(null);
    const [attemptedButNotSubmittedListFull, setAttemptedButNotSubmittedListFull] = useState(null);
    const [notAttemptedListFull, setNotAttemptedListFull] = useState(null);
    const [showExcelComponenet, setShow] = useState(false);
    const [examReportFull, setExamReportFull] = useState(null);

    const getFullAbsentReport = () => {
        setFileExportLoader(true);
        setListLoader(true);
        // exportBtnRef.click();
        var params = new URLSearchParams();
        if (!selectAllBatches && (batchArray && batchArray.length > 0)) {
            batchArray.map((batch) => {
                if (batch.checked) {
                    console.log('batch.checked', batch)
                    params.append("batchExamScheduleIds", batch.id);
                }
                return true;
            });
        }
        params.append('pageSize', 5000)
        Api.getApi(`examSchedule/${ExamScheduleId}/absentStudents`, params)
            .then((response) => {
                setListLoader(false);
                if (response) {
                    const { data } = response;
                    if (data) {
                        const { totalAbsentStudentsCount, totalStudentsCount, attemptedAndDiscardedCount, attemptedButNotSubmittedCount, notAttemptedCount, attemptedAndDiscarded, attemptedButNotSubmitted, notAttempted } = data;
                        setAttemptedAndDiscardedListFull(attemptedAndDiscarded);
                        setAttemptedButNotSubmittedListFull(attemptedButNotSubmitted);
                        setNotAttemptedListFull(notAttempted);
                        absentexportBtnRef.handleDownload();
                    }
                }
                setFileExportLoader(false);
            })
            .catch((error) => {
                setListLoader(false);
                const errorMessage = CommonFunctions.apiErrorMessage(error);
                console.log('errorMessage', errorMessage)
                toast(errorMessage, {
                    type: "error",
                });
                setFileExportLoader(false);
            });
    }

    const [fileExportLoader, setFileExportLoader] = useState(false);
    const getFullPresentReport = () => {
        setFileExportLoader(true);
        var params = new URLSearchParams();
        if (!selectAllBatches && (batchArray && batchArray.length > 0)) {
            batchArray.map((batch) => {
                if (batch.checked) {
                    console.log('batch.checked', batch)
                    params.append("batchExamScheduleIds", batch.id);
                }
                return true;
            });
        }
        params.append("PageSize", 5000);
        Api.getApi(`examSchedule/${ExamScheduleId}/report`, params)
            .then(async (response) => {
                if (response) {
                    const { examReport, headers } = response.data;
                    setHeading(headers);
                    const newReportData = await CommonFunctions.removeDuplicateRecod(examReport);
                    let result = newReportData.sort((a, b) => {
                        const isresult = (a.score.rank > b.score.rank) ? 1 : -1;
                        return isresult
                    });
                    setExamReportFull(result);
                    result = '';
                    exportBtnRef.handleDownload();
                }
                setListLoader(false);
                setFileExportLoader(false);
            })
            .catch((error) => {
                setListLoader(false);
                const errorMessage = CommonFunctions.apiErrorMessage(error);
                console.log('errorMessage', errorMessage)
                toast(errorMessage, {
                    type: "error",
                });
                setFileExportLoader(false);
            });
    }

    const absentStudentReportFull = () => {

        // attemptedAndDiscardedListFull attemptedButNotSubmittedListFull notAttemptedListFull

        let absentReport = [" Student Name", " Student Code", "Branch", "Class", "Batch", "Phone number", "Start Time", "End Time"];
        return <table id="tabel-to-xcl-absence_full" style={{ width: '100%', border: 'transparent', visibility: 'hidden' }}>
            <tr>
                <td width="100%">
                    {mainHeaderForAbsent()}
                </td>
            </tr>
            <tr>
                <td width="100%">
                    <table style={{ width: '100%' }}>
                        <tr className="exam-report-header-title">
                            {absentReport.map((headings, idx) => {
                                return <th key={`${headings}` + idx} width="20%" style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 5, paddingRight: 5 }} > <label className="common-exam-report-title stud-final-rank-title" style={{ cursor: 'pointer' }}>{headings}</label></th>

                            })}

                        </tr>
                        <div style={{ overflowY: 'auto', maxHeight: '60vh' }}>
                            {attemptedAndDiscardedListFull && attemptedAndDiscardedListFull.length > 0 && attemptedAndDiscardedListFull.map((stud, idx) => {

                                let branchName = stud.student.branches[0].name;
                                let className = stud.student.classes[0].name;
                                let batchName = stud.student.batches[0].name;
                                let phoneNO = stud.student.userInfo.phone === null ? "-" : stud.student.userInfo.phone
                                let startTime = stud.inTimeAttemptStartDateTime === null ? "-" : moment(stud.inTimeAttemptStartDateTime).format("LTS");
                                let discardTime = stud.inTimeAttemptDiscardedDateTime === null ? "-" : moment(stud.inTimeAttemptDiscardedDateTime).format("LTS");


                                return <tr key={`fullRpt_${stud.userId}`} className="exam-report-content-inner-box" >
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: "#41478a" }}>{stud.student.userInfo.name}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: "#41478a" }}>{stud.student.code}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: "#41478a" }}>{branchName}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: "#41478a" }}>{className}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: "#41478a" }}>{batchName}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: "#41478a" }}>{phoneNO}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: "#41478a" }}>{startTime}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: "#41478a" }}>{discardTime}</td>

                                </tr>
                            })}

                            {attemptedButNotSubmittedListFull && attemptedButNotSubmittedListFull.length > 0 && attemptedButNotSubmittedListFull.map((stud, idx) => {

                                let branchName = stud.student.branches[0].name;
                                let className = stud.student.classes[0].name;
                                let batchName = stud.student.batches[0].name;
                                let phoneNO = stud.student.userInfo.phone === null ? "-" : stud.student.userInfo.phone
                                let startTime = stud.inTimeAttemptStartDateTime === null ? "-" : moment(stud.inTimeAttemptStartDateTime).format("LTS");
                                let endTime = stud.inTimeAttemptEndDateTime === null ? "-" : moment(stud.inTimeAttemptEndDateTime).format("LTS");

                                return <tr key={`fullRpt_${stud.userId}`} className="exam-report-content-inner-box" >
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: '#6610f2' }}>{stud.student.userInfo.name}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: '#6610f2' }}>{stud.student.code}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: '#6610f2' }}>{branchName}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: '#6610f2' }}>{className}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: '#6610f2' }}>{batchName}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: '#6610f2' }}>{phoneNO}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: '#6610f2' }}>{startTime}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: '#6610f2' }}>{endTime}</td>

                                </tr>
                            })}

                            {notAttemptedListFull && notAttemptedListFull.length > 0 && notAttemptedListFull.map((stud, idx) => {
                                let branchName = stud.student.branches[0].name;
                                let className = stud.student.classes[0].name;
                                let batchName = stud.student.batches[0].name;
                                let phoneNO = stud.student.userInfo.phone === null ? "N/A" : stud.student.userInfo.phone
                                let startTime = stud.inTimeAttemptStartDateTime === null ? "-" : moment(stud.inTimeAttemptStartDateTime).format("LTS");
                                let endTime = stud.inTimeAttemptEndDateTime === null ? "-" : moment(stud.inTimeAttemptDiscardedDateTime).format("LTS");



                                return <tr key={`fullrpt_${stud.userId}`} className="exam-report-content-inner-box" >
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: '#f00' }}>{stud.student.userInfo.name}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: '#f00' }}>{stud.student.code}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: '#f00' }}>{branchName}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: '#f00' }}>{className}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: '#f00' }}>{batchName}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: '#f00' }}>{phoneNO}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: '#f00' }}>{startTime}</td>
                                    <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: '#f00' }}>{endTime}</td>

                                </tr>
                            })}
                            <div style={{ textAlign: "center", padding: 10 }}>
                                {listLoader && Loadder()}
                            </div>
                        </div>

                    </table>
                </td>
            </tr>
        </table>

    }

    const presentReportFull = () => {
        let time1;
        let time2;
        let splitTime1;
        let splitTime2;
        let time;
        return (
            <div>

                <table id="tabel-to-xcl-full" style={{ width: '100%', visibility: 'hidden' }}>
                    {mainHeader()}
                    {headerOfReport()}
                    <div
                        style={{ overflowY: 'auto', maxHeight: '60vh' }}>
                        {(examReportFull && examReportFull.length > 0) && examReportFull.map((data, idx) => {

                            time1 = `${moment(data.attemptEndDateTime).format("LTS")}`;
                            time2 = `${moment(data.attemptStartDateTime).format("LTS")}`;

                            time1 = moment(time1, ["hh:mm:ss A"]).format("HH:mm:ss");
                            time2 = moment(time2, ["hh:mm:ss A"]).format("HH:mm:ss");
                            splitTime1 = time1.split(':');
                            splitTime2 = time2.split(':');
                            time1 = (splitTime1[0] * 60 * 60) + (splitTime1[1] * 60) + (splitTime1[2] * 1);
                            time2 = (splitTime2[0] * 60 * 60) + (splitTime2[1] * 60) + (splitTime2[2] * 1);
                            time = time1 - time2;

                            return sortLoade ?
                                (<div className="loader">
                                    <Spinner animation="border" role="status" style={{ color: '#000', paddin: 25 }}>
                                        <span className="sr-only">Loading...</span>
                                    </Spinner>
                                </div>
                                )
                                :
                                (
                                    <tr key={data.studentId} className="exam-report-content-inner-box" >
                                        <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center' }}>{data.studentName}</td>

                                        <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center' }}>{data.studentCode}</td>

                                        <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center' }}>{data.branch.name}</td>

                                        <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center' }}>{data.class.name}</td>

                                        <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center' }}>{data.batch.name}</td>
                                        {
                                            data.score.subjectwizeScore.length > 0 ? data.score.subjectwizeScore.map((subjects, i) => {
                                                return <>
                                                    <td key={subjects.subjectId} width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center' }}>{subjects.scoredMarks}</td>
                                                    <td key={`${subjects.subjectId}_` + i} width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: '#6a008a', fontWeight: 'bold' }}>{subjects.rank}</td>

                                                </>

                                            }) : blankData.map((d, i) => {
                                                return <>
                                                    <td key={`${d}_` + i} width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center' }}>{d}</td>
                                                </>
                                            })

                                        }

                                        <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center' }}>{data.score.scoredMarks}</td>
                                        <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center' }}>{time}</td>
                                        <td width="20%" className="common-exam-report-content stud-nm-content" style={{ textAlign: 'center', color: '#6a008a', fontWeight: 'bold' }}>{data.score.rank}</td>
                                    </tr>
                                )
                        })
                        }
                        <div style={{ textAlign: "center", padding: 10 }}>
                            {listLoader && Loadder()}
                        </div>
                    </div>
                </table>
            </div >
        )
    }


    const checkUnCheckAllBatches = () => {
        const newSelectedBatchArray = (batchArray && batchArray.length > 0) ? batchArray.map(batch => ({ ...batch, checked: !selectAllBatches })) : selectedExamSchedule.map(batch => ({ ...batch, checked: !selectAllBatches }));
        setSelectAllBatches(!selectAllBatches);
        setBatchArray(newSelectedBatchArray);
    }
    const selectAllDecider = () => {
        let batchCount = 0;
        batchArray.map((batch, batchIndex) => {
            if (batch.checked === true) {
                batchCount = batchCount + 1;
            }
        })
        if (batchCount === batchArray.length) {
            setSelectAllBatches(true);
        } else {
            setSelectAllBatches(false);
        }
    }
    const BatchSelectionComponent = () => {
        return (
            <>
                <div className="select-all-box-wrapper">
                    <div className={`form-check form-check-neonWhite`} >
                        <label className="form-check-label">
                            <input type="checkbox" className="form-check-input" onChange={(e) => {
                                checkUnCheckAllBatches()
                            }}
                                checked={selectAllBatches}
                            />
                            <i className="input-helper"></i>
                            <div className="select-all-content">
                                <span className="select-all-content-text"> Select All</span>
                            </div>
                        </label>
                    </div>
                </div>
                <div className="scroll-select-report-box">
                    {batchArray && batchArray.map((batches, idx) => {
                        let newStartDate = new Date(batches.startDateTime);
                        newStartDate = moment(newStartDate).format("DD MMM YYYY, hh:mm a");
                        return <div className={(idx % 2 === 0) ? "select-report-content-box select-report-content-box-even" : "select-report-content-box select-report-content-box-odd"} key={"tblKey" + idx}><div className={`form-check form-check-neonWhite`} key={`batchCheckboxes_${batches.id}`} >
                            <label className="form-check-label">
                                <input type="checkbox" className="form-check-input"
                                    checked={batches.checked}
                                    index={`chk_${batches.id}`}
                                    onChange={() => {
                                        batches.checked = !batches.checked;
                                        const newBatchArray1 = batchArray.map(batch => ({ ...batch }));
                                        selectAllDecider();
                                        setCounterForPresent(1);
                                        setCounterForAbsent(1);
                                        setBatchArray(newBatchArray1);
                                    }}

                                />
                                <i className="input-helper"></i>
                                <div className="select-single-report-content-wrapper">
                                    <div className="select-single-report-content-text">
                                        <span className="select-single-report-content-text-number"> {++idx}</span>
                                    </div>
                                    <div className="select-single-report-content">
                                        <span className="select-single-report-content-text">
                                            {batches.branch.name}
                                            <BsChevronDoubleRight size={14} />
                                            {batches.class.name}
                                            <BsChevronDoubleRight size={14} />
                                            {batches.batch.name}
                                        </span>
                                        <span className="select-single-report-content-date">{newStartDate}</span>
                                    </div>
                                </div>
                            </label>
                        </div>
                        </div>
                    })}
                </div>
            </>

        )
    }
    const EmptyDataComponent = () => {
        return (
            <div className="no-data-found-explorer">
                <h3>No data found</h3>
            </div>
        )
    }

    // *((((((((((((((((((((((((((((((((((Rank Calculation))))))))))))))))))))))))))))))))))
    const [showConfirmation, setConfirmation] = useState(false);
    const [confirmationLoader, setConfirmationLoader] = useState(false);
    const [rankButton, setEnableRankButton] = useState(false);

    useEffect(() => {
        console.log('examData', examData);
        console.log('MetaDetaForAkcBkc', MetaDetaForAkcBkc);
        enableDisableRankButton();
    }, [examData, MetaDetaForAkcBkc])
    const enableDisableRankButton = () => {
        // if (!examPreviewData) return null;
        const { exam } = examData;
        let bufferTimeInMinutes = MetaDetaForAkcBkc.bufferTimeInMinutes;
        let currentDateTime = new Date();
        let examPeriod = new Date(MetaDetaForAkcBkc.MaxTimeSchedule);
        examPeriod.setMinutes(examPeriod.getMinutes() + exam.duration + bufferTimeInMinutes);
        let availableTime = moment(examPeriod).diff(moment(currentDateTime), 'minutes');
        if (availableTime <= 0) {
            setEnableRankButton(true);
        } else {
            // setInterval(() => {
            //     enableDisableRankButton();
            // }, 1000);
        }
        console.log('MaxTimeSchedule', MetaDetaForAkcBkc.MaxTimeSchedule);
        console.log('availableTime', availableTime * 60 * 1000);
    }
    const generateRank = () => {
        setConfirmationLoader(true);
        const payload = {
            examScheduleId: ExamScheduleId
        }
        Api.postApi(`${UrlConfig.apiUrls.generateRank}/${ExamScheduleId}/rankCalculation`, payload)
            .then((response) => {
                console.log('response', response);
                eexamReport && getReport(true);
                setConfirmationLoader(false);
                setConfirmation(false);
                toast.success('Ranks Calculated Successfully !!');
            })
            .catch((error) => {
                console.log('error', error)
                const errorMessage = CommonFunctions.apiErrorMessage(error);
                console.log('errorMessage', errorMessage);
                setConfirmationLoader(false);
                setConfirmation(false);
                toast.error(errorMessage);
            })
    }
    const ConfirmationBox = () => {
        return (
            <div className="modal-main-dark">
                <Modal show={showConfirmation} onHide={() => { setConfirmation(false); }}
                    size="sm" className="modal-dark exam-report-modal-dark" centered backdrop="static">
                    {confirmationLoader &&
                        <div className="loader">
                            <Spinner animation="border" role="status" style={{ color: '#fff', padding: 25 }}>
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </div>}
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <span className="rank-confirmation-span">
                                Do you want to Re-Calculate Rank ?
                            </span>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary"
                            onClick={e => {
                                setConfirmation(false);
                            }}
                            className="no-button"
                        >
                            No
                        </Button>
                        <Button variant="primary"
                            onClick={e => {
                                generateRank();
                            }}
                            className={"yes-button"}
                        >
                            Yes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }


    // *((((((((((((((((((((((((((((((((((Rank Calculation))))))))))))))))))))))))))))))))))
    // *************************************Exam Report For Absent Student End***********************************************

    /****************Exam Report functionality end here **************************************/
    return (
        <div className="modal-main-dark">
            {absentStudentReportFull()}
            {presentReportFull()}
            <Modal show={showExamReportModal} onHide={() => { resetExamReportModal(); }} size="lg" className="modal-dark exam-report-modal-dark" centered backdrop="static">
                {ConfirmationBox()}
                {isDataPresent && <Confetti
                    width={width}
                    height={height}
                    recycle={false}
                />}
                <ToastContainer autoClose={5000} position="top-right" className="tost-dark-container" style={{ borderRadius: 5, fontFamily: 'GOTHIC' }} />
                <div className="modal-title-box">
                    <h3><GoReport /> Exam Report</h3>
                </div>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <div className="exam-report-main-Wrapper">
                        {fileExportLoader && <div className="loader" style={{ backdropFilter: "blur(3px)", borderTopRightRadius: "35px" }}>
                            <div className="loader-sub">
                                <div class="loader-under-accordion">
                                    <h3>Exporting result sheet please wait...</h3>
                                </div>
                            </div>
                        </div>}
                        <div className="exam-report-file-explorer">
                            <div className="left-side-report">
                                {(batchArray && batchArray.length > 0) ? <BatchSelectionComponent /> : <EmptyDataComponent />}
                            </div>
                            <div className="right-side-report">
                                <div className="right-sticky-bar">
                                    <div className="generate-report-btn-box" style={{ marginTop: "10px" }}>
                                        <Button variant="primary"
                                            onClick={e => {
                                                setConfirmation(true);
                                            }}
                                            className={rankButton === true ? "generateReportBtn" : "generateReportBtn disabled"}
                                        >
                                            <div className="circle"></div>
                                            Generate Rank
                                        </Button>
                                    </div>
                                    <div className="generate-report-btn-box">
                                        <Button variant="primary"
                                            onClick={() => {
                                                resetOnGenerate()
                                                getReport(true);
                                            }}
                                            // className={hideGenerate ? "generateReportBtn disabled" : "generateReportBtn"}
                                            className="generateReportBtn"
                                        >
                                            <div className="circle"></div>
                                            Generate Report
                                             {(1 === 0) &&
                                                <Spinner animation="grow" variant="info" size='sm' />}
                                        </Button>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: 'center' }}>
                                        <div className="download-report-btn-box ">
                                            <Button className={hideExport && (flagForExportPresent) ? "download-Report-Btn" : "download-Report-Btn disabled"} onClick={() => getFullPresentReport()}>
                                                {/* {fileExportLoader ?
                                                    <Spinner style={{ height: "1rem", width: "1rem" }} animation="border" role="status">
                                                        <span className="sr-only">Loading...</span>
                                                    </Spinner> */}
                                                    Export Present
                                            </Button>
                                        </div>
                                        <div className="download-report-btn-box ">
                                            <Button className={hideExport && (flagForExportAbsent) ? "download-Report-Btn" : "download-Report-Btn disabled"} onClick={() => getFullAbsentReport()}>
                                                {/* {fileExportLoader ?
                                                    <Spinner style={{ height: "1rem", width: "1rem" }} animation="border" role="status">
                                                        <span className="sr-only">Loading...</span>
                                                    </Spinner> */}
                                                     Export Absent
                                            </Button>
                                        </div>
                                    </div>
                                    <div style={{ visibility: 'hidden' }}>
                                        <ReactHTMLTableToExcel
                                            table='tabel-to-xcl-full'
                                            filename={`${examName}(${moment(examDate).format('MMMM Do YYYY')})Present`}
                                            sheet="sheet 1"
                                            buttonText="Export"
                                            style={{ width: '100%', }}
                                            ref={(refs) => exportBtnRef = refs}
                                        />
                                    </div>
                                    <div style={{ visibility: 'hidden' }}>
                                        <ReactHTMLTableToExcel
                                            table='tabel-to-xcl-absence_full'
                                            filename={`${examName}(${moment(examDate).format('MMMM Do YYYY')})Absent`}
                                            sheet="sheet 1"
                                            buttonText="Export"
                                            style={{ width: '100%', }}
                                            ref={(refs) => absentexportBtnRef = refs}
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>
                        {showReport && <div className="report-tab-box-wrapper">
                            <Tab.Container defaultActiveKey="presentreport">
                                <Nav variant="pills" className="header-main-nav">
                                    <Nav.Item>
                                        <Nav.Link onClick={() => {
                                            setResponseIsNull(false);
                                            isDataPresent ? setFlagForExportPresent(true) : setFlagForExportPresent(false);
                                            setShowAbsentReport(true)

                                        }} eventKey="presentreport">Present student exam report</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link onClick={() => {
                                            setResponseIsNull(false);
                                            // generateAbsentReport();
                                            isAbsentDataPresent ? setFlagForExportAbsent(true) : setFlagForExportAbsent(false);
                                            setShowAbsentReport(false)
                                        }} eventKey="absencereport">Absent student exam report</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                                <Tab.Content>
                                    <Tab.Pane eventKey="presentreport">
                                        {showReport && <div className="exam-report-student-main-wrap">
                                            <div className="exam-report-content-box">
                                                {
                                                    listLaod ?
                                                        <div className="loader">
                                                            <Spinner animation="border" role="status" style={{ color: '#000', paddin: 25 }}>
                                                                <span className="sr-only">Loading...</span>
                                                            </Spinner>
                                                        </div>
                                                        :
                                                        !isDataPresent ?
                                                            <div className="no-data-found-explorer">
                                                                <h3 style={{ color: "black", fontSize: 25, textShadow: "3px 3px gray" }}>No data found</h3>
                                                            </div> :

                                                            (flag === showFlag) ? reportData() : reportData()

                                                }

                                            </div>
                                        </div>}
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="absencereport">
                                        <div className="exam-report-student-main-wrap">
                                            <div className="exam-report-content-box">
                                                {isAbsentData &&
                                                    loaderForAbsent ? <div className="loader">
                                                        <Spinner animation="border" role="status" style={{ color: '#000', paddin: 25 }}>
                                                            <span className="sr-only">Loading...</span>
                                                        </Spinner>
                                                    </div> :
                                                    !isAbsentDataPresent ?
                                                        <div className="no-data-found-explorer">
                                                            <h3 style={{ color: "black", fontSize: 25, textShadow: "3px 3px gray" }}>No data found</h3>
                                                        </div> :

                                                        absentStudentReport()

                                                }
                                            </div>
                                        </div>
                                    </Tab.Pane>
                                </Tab.Content>

                            </Tab.Container>

                        </div>}


                    </div>
                </Modal.Body>

            </Modal >
        </div >
    )
}
const mapPropsToState = (state) => {
    return {
        ExamList: state.examList,
        accountList: state.accountList,
    }
}

export default connect(mapPropsToState)(ExamReportModal);

