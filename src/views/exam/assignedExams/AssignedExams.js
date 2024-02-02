import React, { useState, useEffect } from 'react';
import { FaUserEdit, FaUserClock, FaUserTimes, FaRegPlayCircle } from "react-icons/fa";
import { GrDocumentUser } from "react-icons/gr";
import { MdCancel } from 'react-icons/md'
import { GoReport } from "react-icons/go";
import { BsFilterRight } from "react-icons/bs";
import moment from 'moment';
import { Form, Accordion, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { UrlConfig } from '../../../config';
import { toast } from "react-toastify";
import { ScheduledTestModal, ExamReportModal, LiveExamReportModal, AssignedExamDetalisModal } from './Modals';
import { connect } from 'react-redux';
import { Api, CommonApiCall } from '../../../services';
import { CourseListAction, SubjectListAction } from '../../../reduxManager';
import { AssignedExamTableRow } from './Component';
import CommonFunctions from '../../../utils/CommonFunctions';
import { ExamQuestionPreviewModal, AkcBkcPreviewModal } from '../commonModal';
import { AssingModal } from '../questionPapers/Modals';
import FilterMenu from '../commonModal/filterMenu';
import { PagesHeader } from '../../../components';
import Axios from 'axios';
const AssignedExams = (props) => {
    const [examLists, setExamLists] = useState([]);
    const [counter, setCounter] = useState(1);
    const [listLoader, setListLoader] = useState(false);
    const [clickedExamId, setClickedExamId] = useState();
    const [show, setShow] = useState(false);
    const [showScheduledModal, setShowScheduledModal] = useState(false);// model View ongoing Test
    const [showExamReportModal, setExamReportModal] = useState(false);
    const [showLiveExamReportModal, setShowLiveExamReportModal] = useState(false);
    const [showAssignedExamDetalisModal, setShowAssignedExamDetalisModal] = useState(false);
    const [examdDataForModal, setExamDataForModal] = useState(null);
    const [showAkcBkcPreviewModal, setShowAkcBkcPreviewModal] = useState(false);
    const [isMultiExpand, setMultiExpand] = useState(false);
    const [scrollPosition, setScrollPosition] = useState();
    const [tempScrollPosition, setTempScrollPosition] = useState(1000);
    const [showLoader, setLoader] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [condition, setCondition] = useState(false);
    // ***********************************For ExamSchedule Modal*****************************************************
    const [examScheduleData, setExamScheduleData] = useState([]);
    // ****************************************************************************************

    // *******************************For ExamPreview Modal*********************************************************
    const [showExamPreviewModal, setShowExamPreviewModal] = useState(false);
    const [examPreviewData, setExamPreviewData] = useState(null);
    const [showExamPreviewLoader, setExamPreviewLoader] = useState(false);
    const [showAkcBkcPreviewLoader, setAkcBkcPreviewLoader] = useState(false);
    const [selectedExamSchedule, setSelectedExamSchedule] = useState(null);
    const [ExamScheduleId, setExamScheduleId] = useState(null);
    const [responseIsNull, setResponseIsNull] = useState(false);
    const [examData, setExamData] = useState(null);
    // ****************************************************************************************
    useEffect(() => {
        CommonApiCall.getInstituteData();
        getCourseList();
        // getSubjectList();
        // ****************************************For Exam List************************************************
        if (!examLists || examLists.length === 0) {
            setLoader(true);
            getExamList(false, "fromUseEffect");
        }
        return () => {
            setCondition(false)
            setLoader(false);
            setIsLoading(false);
            setListLoader(false);
            setExamLists([]);
            setCounter(1);
        }
        // ****************************************************************************************
    }, []);


    /*********** start create test modal functionality *****************************/
    /**get course list */
    const getCourseList = () => {
        Api.getApi(UrlConfig.apiUrls.getCourseTypes)
            .then((response) => {
                if (response) {
                    const { data } = response;
                    CourseListAction.setCourseList(data);
                    setCourseListForExamFilters(data);
                } else {
                    CourseListAction.setCourseList([]);
                }
            })
            .catch(error => {
                console.log(error, 'Err')
            });
    }

    /**get subject list and store to redux .. Todo: get subject list by course id in next sprint */
    const getSubjectList = () => {
        Api.getApi(UrlConfig.apiUrls.getSubjects)
            .then((response) => {
                if (response) {
                    const { data } = response;
                    SubjectListAction.setSubjectList(data);

                } else {
                    SubjectListAction.setSubjectList([]);
                }
            })
            .catch(error => {
                const errorMessage = CommonFunctions.apiErrorMessage(error);
                console.log('errorMessage', errorMessage)
                toast(errorMessage, {
                    type: "error",
                });
            });
    }

    // ************************************Exam List****************************************************
    const getExamList = (loadFirstPage = false, from = "fromUseEffect") => {
        setIsLoading(true);
        setResponseIsNull(false);
        // For Filter Purpose----------------------------------------------------------
        if (from === "fromClearFilter" || from === "fromApplyFilters") {
            setLoader(true);
            setExamLists([]);
            setCounter(1);
            if (from === "fromClearFilter") {
                setUpdater(!updater)
            }
            let scrollTop = document.getElementById("myscroll").scrollTop;
            let scrollHeight = document.getElementById("myscroll").scrollHeight;
            let clientHeight = document.getElementById("myscroll").clientHeight;
            console.log('scrollTop', scrollTop);
            console.log('scrollHeight', scrollHeight);
            console.log('clientHeight', clientHeight);
            document.getElementById('myscroll').scrollTo({
                top: 0,
                behavior: 'smooth'
            })

        }
        if (showFilterMenu) {
            setShowFilterMenu(false);
        }
        let fromDate = '';
        let toDate = '';
        // For Filter Purpose----------------------------------------------------------
        (counter > 1 && !loadFirstPage) && setListLoader(true);
        const pageNumber = loadFirstPage ? 1 : counter;
        if (loadFirstPage) { setTempScrollPosition(1000) }

        // For Filter Purpose----------------------------------------------------------
        var params = new URLSearchParams();
        if (from === "fromApplyFilters" || specialFlag) {
            fromDate = filterParams.isCurrentDateSelected === true ? moment(filterParams.currentDate).format("YYYY-MM-DD") : filterParams.isDateRangeSelected === true ? moment(filterParams.dateRange.startDate).format("YYYY-MM-DD") : '';
            toDate = filterParams.isDateRangeSelected === true ? moment(filterParams.dateRange.endDate).format("YYYY-MM-DD") : '';
            params.append("FromDateTime", fromDate);
            params.append("ToDateTime", toDate);
            filterParams.applicableFor.map((id) => {
                params.append("CourseIds", id);
                return true;
            })
            params.append("Page", pageNumber);
            params.append("PageSize", 20);
        } else if (from === "fromClearFilter") {
            params.append("Page", pageNumber);
            params.append("PageSize", 20);
        }
        else {
            params.append("Page", pageNumber);
            params.append("PageSize", 20);
        }
        // For Filter Purpose----------------------------------------------------------
        Api.getApi(UrlConfig.apiUrls.getExamSchedule, params)
            .then((response) => {
                if (response) {
                    console.log('examResponseAssigned', response);
                    const { data } = response;
                    if (examLists && examLists.length > 0 && !loadFirstPage) {
                        const newExamListArray = examLists.concat(data);
                        setExamLists(newExamListArray);
                    } else {
                        setExamLists(data);
                    }
                    setCondition(true);
                    setCounter(pageNumber + 1);
                }
                else {
                    setResponseIsNull(true);
                }
                if (from === "fromApplyFilters") {
                    setAppliedFilters(filterParams);
                }
                setListLoader(false);
                setLoader(false);
                setIsLoading(false);
            })
            .catch((error) => {
                setListLoader(false);
                setLoader(false);
                setIsLoading(false);
                setResponseIsNull(true);
                const errorMessage = CommonFunctions.apiErrorMessage(error);
                console.log('errorMessage', errorMessage)
                toast(errorMessage, {
                    type: "error",
                });
            })

    }

    // ****************************************************************************************

    // ************************************Exam-Schedule***************************************
    const getScheduledList = (examId) => {
        showModelOngoingTest();
        Api.getApi(`${UrlConfig.apiUrls.getExamSchedule}`, { examId })
            .then((response) => {
                console.log('examScheduleResponse', response)
                if (response) {
                    const { data } = response;
                    setExamScheduleData(data);
                }
            }).catch((error) => {
                const errorMessage = CommonFunctions.apiErrorMessage(error);
                console.log('errorMessage', errorMessage)
                toast(errorMessage, {
                    type: "error",
                });
            })
    }
    // ****************************************************************************************

    /*********** start file explorer modal functionality *****************************/

    const handelScrollPosition = async (e) => {
        // let tempScroll = tempScrollPosition;
        let scrollTop = document.getElementById("myscroll").scrollTop;
        let scrollHieght = document.getElementById("myscroll").scrollHeight;
        let clientHeight = document.getElementById("myscroll").clientHeight;
        if (responseIsNull) {
            scrollHieght = scrollHieght + 50;
        }

        if (((scrollTop) + (clientHeight)) >= (scrollHieght - 5)) {
            // if (scrollPosition >= tempScrollPosition) {
            let check = counter + 1;
            console.log("counterrrrrrr", counter);
            setListLoader(true);
            if (check !== counter) {
                // setTempScrollPosition(tempScroll + 1300);
                getExamList();
            }
        }
    }
    const Loadder = () => {
        return <Spinner animation="border" role="status" className="spinnerquesionpaper" >
            <span className="sr-only" > Loading...</span >
        </Spinner >
    }

    /*********** end file explorer modal functionality *****************************/
    const [subjectWiseQuestions, setQuestions] = useState(null)
    const getExamQuestionsFromCdn = (cdn) => {
        const oldCdnUrl = cdn;
        console.log('oldCdnUrl', oldCdnUrl);
        let isDev = oldCdnUrl.includes('https://sglearningfilestorage-dev-cdn.azureedge.net');
        console.log('isDev', isDev);
        const cdnUrl = isDev === true ? 'https://sglearningfilestorage-dev-cdn.azureedge.net' : 'https://sglearningfilestorage-prod-cdn.azureedge.net';
        console.log('cdnUrl', cdnUrl);
        const blobUrlToAdd = isDev === true ? 'https://sglearningfilestorage.blob.core.windows.net' : 'https://sglearningstorageprod.blob.core.windows.net';
        console.log('blobUrlToAdd', blobUrlToAdd);
        const blobUrl = oldCdnUrl.replace(cdnUrl, blobUrlToAdd);
        console.log('blobUrl', blobUrl);


        Axios({
            method: 'GET',
            url: blobUrl,
            // timeout: 420000,
            headers: {
                'Content-Type': 'application/json',
                accept: 'application/json',
                crossDomain: true,
                'cache-control': 'no-cache',

            }
        })  // Axios.get(blobUrl)
            .then((response) => {
                if (response) {
                    console.log('response', response);
                    const { subjectwizeQuestions } = response;
                    setQuestions(subjectwizeQuestions);
                    setAkcBkcPreviewLoader(false);
                    setShowAkcBkcPreviewModal(true);
                }
            })
            .catch((error) => {
                toast.error(`It's Loading please wait...`);
                console.log('error>>>>', error)
                // getExamQuestionsFromCdn(cdnUrl);
                setAkcBkcPreviewLoader(false);
            })
    }
    /*********** start question paper preview on exam list item functionality *****************************/
    /*********** get question paper details *****************************/
    const getExamPreview = (examId, isKeyCorrection = false) => {
        isKeyCorrection ? setAkcBkcPreviewLoader(true) : setExamPreviewLoader(true);
        Api.getApi(`${UrlConfig.apiUrls.getExamList}/${examId}`)
            .then((response) => {
                if (response) {
                    const { data } = response;
                    console.log('examPreviewReport', response)
                    setExamPreviewData(data);
                    isKeyCorrection ? getExamQuestionsFromCdn(data.questionSetDataUrl) : setShowExamPreviewModal(true);
                } else {
                    toast('No data found', {
                        type: "error",
                    });
                }
                // isKeyCorrection ? setAkcBkcPreviewLoader(false) : setExamPreviewLoader(false);
                !isKeyCorrection && setExamPreviewLoader(false);
            }).catch((error) => {
                isKeyCorrection ? setAkcBkcPreviewLoader(false) : setExamPreviewLoader(false);
                const errorMessage = CommonFunctions.apiErrorMessage(error);
                toast(errorMessage, {
                    type: "error",
                });
            })
    }
    /*********** start question paper preview on exam list item functionality *****************************/

    /*********** start scheduled test modal functionality *****************************/
    const showModelOngoingTest = () => setShowScheduledModal(true);

    const cloaseScheduledModal = () => setShowScheduledModal(false);
    const showExamReportClick = (e) => setExamReportModal(true);
    const setData = (data) => setExamDataForModal(data);

    const closeExamReportModal = () => { setExamReportModal(false); setSelectedExamSchedule(null); }

    const setExamId = (id) => { setClickedExamId(id) };
    const showLiveExamReportClick = () => setShowLiveExamReportModal(true);
    const closeLiveExamReportModal = () => {
        setShowLiveExamReportModal(false);
        setSelectedExamSchedule(null);
    }

    const showAssignedExamDetalisClick = () => setShowAssignedExamDetalisModal(true);
    const closeAssignedExamDetalisModal = () => setShowAssignedExamDetalisModal(false);
    const showAkcBkcPreviewClick = () => setShowAkcBkcPreviewModal(true);
    const closeAkcBkcPreviewModal = () => setShowAkcBkcPreviewModal(false);

    const CloseExamPreviewModal = () => setShowExamPreviewModal(false);

    // *****************calculateMaxTime*****************************
    const [MetaDetaForAkcBkc, setMetaDetaForAkcBkc] = useState(null);

    const calculateMaxTime = (batchExamSchedules, examData) => {
        let metaData;
        if (batchExamSchedules && batchExamSchedules.length > 0) {
            let scheduleArray = [];
            batchExamSchedules.map((schedule) => {
                scheduleArray.push(schedule.startDateTime);
                // console.log('a', a);
            })
            scheduleArray.sort();
            console.log('scheduleArray', scheduleArray);
            let max = scheduleArray.length - 1;
            metaData = {
                "MaxTimeSchedule": scheduleArray[max],
                "bufferTimeInMinutes": batchExamSchedules[0].bufferTimeInMinutes,
            }
        } else {
            metaData = {
                "MaxTimeSchedule": examData.startDateTime,
                "bufferTimeInMinutes": examData.bufferTimeInMinutes,
            }
        }

        setMetaDetaForAkcBkc(metaData);
        // const MaxTimeSchedule =  scheduleArray[max];
        // const bufferTimeInMinutes = batchExamSchedules[0].bufferTimeInMinutes;

    }
    /*********** end scheduled test modal functionality *****************************/


    // ******************************************Add New Batches to the schedule Functionality************************************************
    const [currentBatchIndex, setCurrentBatchIndex] = useState(null);
    const [selectedTest, setSelectedtest] = useState();
    const [isFileExplorer, setFileExplorer] = useState(true)
    const [showFileExplorerModal, setShowFileExplorerModal] = useState(false);
    const [dataForExtraBatchSchedule, setDataForExtraBatchSchedule] = useState(null);
    const handleShowForFileExplorer = (examData) => {
        console.log(examData,);
        setSelectedtest(examData)
        setFileExplorer(true);
        setShowFileExplorerModal(true)
    };

    const handleCloseforFileExploere = (newbatchExamSchedules) => {
        console.log('newbatchExamSchedules', newbatchExamSchedules);
        const updatedBatchList = [];
        updatedBatchList.push(newbatchExamSchedules);
        if (newbatchExamSchedules && newbatchExamSchedules.length > 0) {
            console.log('examLists[currentBatchIndex]', examLists[currentBatchIndex].batchExamSchedules);
            let updatedExamList = examLists;
            updatedExamList[currentBatchIndex].batchExamSchedules = newbatchExamSchedules;
            setExamLists(updatedExamList);
        }

        console.log('examList', examLists);

        setShowFileExplorerModal(false);
        setExamPreviewLoader(false);
        setExamPreviewData(null);
    };
    const onPreviousClick = () => {
        !isFileExplorer ? setFileExplorer(true) : handleCloseforFileExploere();
    }
    const onSubmitFileExplorer = () => {
        isFileExplorer ? setFileExplorer(false) : handleCloseforFileExploere();
    }

    const [createTestJSON, setcreateTest] = useState({
        id: "",
        name: "",
        description: "",
        price: Number,
        discount: "",
        examType: "1",
        applicableFor: [],
        duration: "",
        positiveMarks: "",
        negativeMarks: "",
        totalMarks: "",
        numberOfSubject: "",
        subjects: [],
        questionsPerSubject: "",
        totalQuestions: "",
        attempts: 1,
        // commonInstruction: true,
        isSpecificInstructions: false,
        testInstructions: "",
        importDocumentId: null,
        free: true
    });

    const upatecreateJSON = (e) => {
        if (e.target.name === 'isSpecificInstructions') {
            setcreateTest({
                ...createTestJSON,
                [e.target.name]: !createTestJSON.isSpecificInstructions,
            });

        } else if (e.target.name === 'examType') {
            setcreateTest({
                ...createTestJSON,
                [e.target.name]: createTestJSON.examType == 1 ? 0 : 1,
            });
        } else {
            setcreateTest({
                ...createTestJSON,
                [e.target.name]: e.target.value,
            })
        }

    };
    // ******************************************************************************************

    // ****((((((((((((((((((((((((((((((((((((((((((Delete ExamSchedule))))))))))))))))))))))))))))))))))))))))))
    // const [updater, setUpdater] = useState(false)
    const handleExamDeleteSchedule = (examData, index) => {
        const { id } = examData;
        console.log('examData', examData);
        console.log('index', index);
        Api.deleteApi(`${UrlConfig.apiUrls.deleteExamSchedule}/${id}`)
            .then((response) => {
                console.log('deleteScheduleResponse', response);
                toast.success('Exam Schedule Deleted Successfully.');
                let examListToUpdate = examLists;
                examListToUpdate[index].hadDeleted = true;
                setExamLists(examListToUpdate);
                setUpdater(!updater);
                console.log('examLists', examLists);
            })
            .catch((error) => {
                const errorMessage = CommonFunctions.apiErrorMessage(error);
                toast.error(errorMessage);
            })
    }
    // ****(((((((((((((((((((((((((((((((((((((((((((Delete ExamSchedule)))))))))))))))))))))))))))))))))))))))))))


    // ****((((((((((((((((((((((((((((((((((((((((((Exam List Table))))))))))))))))))))))))))))))))))))))))))
    const examListTable = () => {
        return (
            <span >
                {examLists && examLists.map((examData, index) => {
                    console.log(examData,"examData")
                    return (examData && !examData.isDeleted) &&
                        <AssignedExamTableRow
                            index={index + 1}
                            key={index + 1}
                            listKey={`examList_${examData.id}`}
                            examData={examData}
                            onGoingLabel={'Ongoing'}
                            handleOnGoingClick={() => {
                                getScheduledList(examData.id)
                            }}
                            onGoingIcon={<FaUserClock />}
                            examId={examData.id}
                            isMultiExpand={isMultiExpand}
                            examReportLabel={'Exam Report'}
                            handleExamReportClick={(batchExamSchedules) => {
                                calculateMaxTime(examData.batchExamSchedules, examData);
                                setSelectedExamSchedule(batchExamSchedules);
                                setExamScheduleId(examData.id);
                                setExamData(examData);
                                showExamReportClick();
                            }}
                            handleLiveExamReportClick={(batchExamSchedules) => {
                                setSelectedExamSchedule(batchExamSchedules);
                                setExamScheduleId(examData.id);
                                showLiveExamReportClick()
                            }}
                            setExamData={setData}
                            handleAssignedExamDetalisClick={showAssignedExamDetalisClick}
                            handleAkcBkcPreviewClick={() => {
                                getExamPreview(examData.exam.id, true);
                                console.log('examData', examData);
                                console.log('examData.id', examData.id);
                                setExamScheduleId(examData.id);
                                calculateMaxTime(examData.batchExamSchedules, examData)
                            }
                            }
                            showAkcBkcPreviewLoader={showAkcBkcPreviewLoader}
                            handlePreviewClick={() => getExamPreview(examData.exam.id)}
                            showExamPreviewLoader={showExamPreviewLoader}
                            setCurrentExamId={setExamId}

                            assignLabel={'Add Batches'}
                            handleAssignClick={() => {
                                setCurrentBatchIndex(index);
                                setExamScheduleId(examData.id);
                                setDataForExtraBatchSchedule(examData);
                                handleShowForFileExplorer(examData.exam);
                            }}
                            examReportIcon={<GoReport />}
                            liveExamIcon={<GrDocumentUser />}
                            liveExamLabel={'Live Student Count'}

                            handleDeleteExamClick={() => {
                                handleExamDeleteSchedule(examData, index);
                            }}
                            // -----After Delete Show----
                            hadDeleted={examData.hadDeleted && examData.hadDeleted}
                        />
                }
                )}
                <div style={{ textAlign: "center", padding: 10 }}>
                    {listLoader && Loadder()}
                </div>
            </span>
        )
    }
    // ****((((((((((((((((((((((((((((((((((((((((((Exam List Table))))))))))))))))))))))))))))))))))))))))))

    // ***************************For Assigned Exams Filter*************************************************************
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [courseListForExamFilters, setCourseListForExamFilters] = useState(null);
    const [specialFlag, setSpecialFlag] = useState(false);
    const [updater, setUpdater] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState(null);
    const [filterParams, setFilterParams] = useState({
        isCurrentDateSelected: false,
        currentDate: new Date(Date.now()),
        isDateRangeSelected: false,
        dateRange: { startDate: new Date(Date.now()), endDate: new Date(Date.now()) },
        applicableFor: []
    })

    const UpdateFilterParams = (filterParams) => {
        setFilterParams(filterParams);
    }

    const clearFilters = () => {
        console.log('fromClearFilter');
        setFilterParams({
            isCurrentDateSelected: false,
            currentDate: null,
            isDateRangeSelected: false,
            dateRange: { startDate: null, endDate: new Date(Date.now()) },
            applicableFor: []
        })
        setAppliedFilters(null);
        setCourseListForExamFilters(props.courseList);
        getCourseList();
        if (specialFlag === true) {
            setTimeout(() => {
                getExamList(true, "fromClearFilter");
            }, 100);
            setSpecialFlag(false);
        }
        setUpdater(!updater);
    }

    const applyFilters = () => {
        setSpecialFlag(true);
        getExamList(true, "fromApplyFilters");
    }

    const checkFilterStatus = () => {
        if (appliedFilters && (appliedFilters.isCurrentDateSelected === true || appliedFilters.isDateRangeSelected === true || appliedFilters.applicableFor.length > 0)) {
            return true;
        } else {
            return false;
        }
    }
    useEffect(() => {
        console.log('showFilterMenu', showFilterMenu)
    }, [showFilterMenu])

    useEffect(() => {
        console.log('filterParams', filterParams);
    }, [filterParams])
    const columwiseFormat = (option, i, from) => {
        return (
            <div className={from === "filterMenu" ? "form-check form-check-neonWhite" : "form-check form-check-neonBlack"}>
                {from === "filterMenu" &&
                    <label className="form-check-label">
                        <input type="checkbox"
                            className="form-check-input"
                            value={option.name}
                            defaultChecked={(option.isChecked && option.isChecked === true) ? true : false}
                            checked={option.isChecked ? true : false}
                            name={"checkBox" + i}
                            key={option.name}
                            onChange={(e) => {
                                var list = [];
                                list = filterParams.applicableFor;
                                let isFind = list.indexOf(option.id);
                                if (isFind != -1) {
                                    option.isChecked = false;
                                    list.splice(isFind, 1);
                                } else {
                                    option.isChecked = true;
                                    list.push(option.id);
                                }
                                setFilterParams({
                                    ...filterParams,
                                    ['applicableFor']: list,
                                });
                            }} />
                        <i className="input-helper"></i>
                        {option.name}
                    </label>
                }
            </div>
        )
    }


    useEffect(() => {
        console.log('showFilterMenu', showFilterMenu)
    }, [showFilterMenu])

    useEffect(() => {
        console.log('filterParams', filterParams);
    }, [filterParams])
    // ***************************Assigned Exams Filter End*************************************************************
    return (
        <div>
            <PagesHeader headerText={"Assigned Exams"} />
            <div className="common-dark-box">
                <div className="common-title-wrapper-dark">
                    <div className="common-dark-box-title">
                        {
                            appliedFilters
                            &&
                            <div
                                hidden={(appliedFilters.isCurrentDateSelected === false && appliedFilters.isDateRangeSelected === false && appliedFilters.applicableFor.length === 0) && true}
                                className="appliedFilters">
                                {
                                    appliedFilters.isCurrentDateSelected === true &&
                                    <div className="appliedFilters-sub">
                                        <div className="sub-boxes">
                                            <span className="filter-item">{appliedFilters.currentDate !== "" ? `${moment(appliedFilters.currentDate).format("DD-MM-YYYY")}` : ''}</span>
                                            <span className="cancel-button-icon" onClick={() => {
                                                setFilterParams(filterParams.currentDate = "", filterParams.isCurrentDateSelected = false)
                                                UpdateFilterParams(filterParams)
                                                applyFilters();
                                            }}><MdCancel /></span>
                                        </div>
                                    </div>
                                }

                                {
                                    appliedFilters.isDateRangeSelected === true &&
                                    <div className="appliedFilters-sub">
                                        <div className="sub-boxes">
                                            <span className="filter-item">{appliedFilters.dateRange.startDate !== "" ? `${moment(appliedFilters.dateRange.startDate).format("DD-MM-YYYY")}-to-${moment(appliedFilters.dateRange.endDate).format("DD-MM-YYYY")}` : ''}
                                            </span>
                                            <span className="cancel-button-icon"
                                                onClick={() => {
                                                    setFilterParams(filterParams.dateRange.startDate = "", filterParams.dateRange.endDate = "", filterParams.isDateRangeSelected = false)
                                                    UpdateFilterParams(filterParams)
                                                    applyFilters();
                                                }}
                                            ><MdCancel /></span>
                                        </div>
                                    </div>
                                }
                                {
                                    appliedFilters.applicableFor.length > 0 &&
                                    appliedFilters.applicableFor.map((course) => {
                                        const courseObj = props.courseList.find((c) => c.id === course);
                                        return (
                                            <div className="appliedFilters-sub">
                                                <div className="sub-boxes">
                                                    <span className="filter-item">{courseObj.name}</span>
                                                    <span className="cancel-button-icon"
                                                        onClick={() => {
                                                            if (appliedFilters.isCurrentDateSelected === false && appliedFilters.isDateRangeSelected === false && appliedFilters.applicableFor.length === 1) {
                                                                clearFilters();
                                                            }
                                                            let courseList = [];
                                                            courseList = courseListForExamFilters;
                                                            let ind = courseListForExamFilters.findIndex((cou) => cou.id === course);
                                                            courseList[ind].isChecked = false;
                                                            setCourseListForExamFilters(courseList);
                                                            let filters = appliedFilters;
                                                            let list = [];
                                                            list = appliedFilters.applicableFor;
                                                            let findIndex = list.indexOf(course);
                                                            if (findIndex !== -1) {
                                                                list.splice(findIndex, 1);
                                                                filters.applicableFor = list;
                                                                setAppliedFilters(filters);

                                                            }
                                                            setFilterParams(appliedFilters);
                                                            applyFilters();
                                                            // setUpdater(!updater);
                                                        }}><MdCancel /></span>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        }
                    </div>
                    <div className="multiexpand-box Multi-Wrap">
                        <div className="filter-popup-icon-box">
                            <button className="glow-on-hover" type="button"
                                onClick={(e) => {
                                    setShowFilterMenu(!showFilterMenu)
                                }}>
                                <OverlayTrigger placement="top" overlay={<Tooltip id="filter-tooltip" className="common-tooltip">Filters</Tooltip>}>
                                    <BsFilterRight size={20} style={{ color: "black" }} />
                                </OverlayTrigger>
                            </button>
                            {showFilterMenu && <div className="filterMenu">
                                <FilterMenu
                                    showFilterMenu={showFilterMenu}
                                    filterParam={filterParams}
                                    UpdateFilterParams={UpdateFilterParams}
                                    courseList={courseListForExamFilters}
                                    columnWiseFormat={columwiseFormat}
                                    clearFilters={clearFilters}
                                    applyFilters={() => {
                                        applyFilters()
                                    }}
                                    closeHandle={() => {
                                        setShowFilterMenu(false);
                                    }}
                                />
                            </div>}
                        </div>
                        <div className="multi-switch-btn-box">
                            <Form.Check
                                type="switch"
                                id="custom-switch"
                                label="Multi Expand"
                                className="label-switch"
                                onChange={() => setMultiExpand(!isMultiExpand)}
                            />
                        </div>
                    </div>

                </div>
                {<div id="myscroll"
                    onScroll={e => {
                        setScrollPosition(e.target.scrollTop);
                        if ((document.getElementById("myscroll").scrollTop + document.getElementById("myscroll").scrollHeight) >= (document.getElementById("myscroll").clientHeight - 20)) {
                            handelScrollPosition(e);
                        }
                    }} className={condition ? " card-box-main-wrapper scroll-hide-show" : "card-box-main-wrapper "}>
                    {showLoader &&
                        <div className="loader">
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </div>
                    }
                    {(examLists.length === 0 && !showLoader) && <div className="no-data-found">

                        {checkFilterStatus()
                            ?
                            <h3>No Assigned Exams found for Applied filters.</h3>
                            :
                            <h3> not found, please assign exams from
                           <Link className="nav-link exam-link" to={UrlConfig.routeUrls.questionpapers}>
                                    <span className="menu-title">Question Papers.</span>
                                </Link>
                            </h3>
                        }
                    </div>}
                    {isMultiExpand ? examListTable() : <Accordion style={{ paddingTop: 20 }}>
                        {examListTable()}
                    </Accordion>
                    }
                </div>}
            </div>
            {/*************** Modal  ************************/}



            {/* Ongoing test modal */}
            <ScheduledTestModal
                showScheduledModal={showScheduledModal}
                cloaseScheduledModal={cloaseScheduledModal}
                examScheduleData={examScheduleData}
            />

            {/* Exam Report modal */}
            {examData && <ExamReportModal
                showExamReportModal={showExamReportModal}
                closeExamReportModal={closeExamReportModal}
                examId={clickedExamId}
                selectedExamSchedule={selectedExamSchedule}
                ExamScheduleId={ExamScheduleId}
                MetaDetaForAkcBkc={MetaDetaForAkcBkc}
                examData={examData}
            />}
            {/* Live Exam Report modal */}
            <LiveExamReportModal
                showLiveExamReportModal={showLiveExamReportModal}
                closeLiveExamReportModal={closeLiveExamReportModal}
                examId={clickedExamId}
                selectedExamSchedule={selectedExamSchedule}
                ExamScheduleId={ExamScheduleId}
            />
            {/* Assigned Exams Detalis modal */}
            {examdDataForModal && <AssignedExamDetalisModal
                showAssignedExamDetalisModal={showAssignedExamDetalisModal}
                closeAssignedExamDetalisModal={closeAssignedExamDetalisModal}
                examData={examdDataForModal}
            />}

            {/*Akc Bkc preview modal */}
            {examPreviewData && subjectWiseQuestions && <AkcBkcPreviewModal
                showAkcBkcPreviewModal={showAkcBkcPreviewModal}
                closeAkcBkcPreviewModal={closeAkcBkcPreviewModal}
                examPreviewData={examPreviewData}
                ExamScheduleId={ExamScheduleId}
                MetaDetaForAkcBkc={MetaDetaForAkcBkc}
                subjectWiseQuestionList={subjectWiseQuestions}
            />}
            {/*************** end Modal section  ************************/}

            {examPreviewData && <ExamQuestionPreviewModal showExamPreviewModal={showExamPreviewModal} CloseExamPreviewModal={CloseExamPreviewModal} examPreviewData={examPreviewData} />}
            {/*************** end Exam Preview Modal ********************/}


            {/* *************************Assign Exam Extra Batches Modal */}
            <AssingModal
                showfileExplorerModel={showFileExplorerModal}
                handleCloseforFileExploere={handleCloseforFileExploere}
                isFileExploere={isFileExplorer}
                selectedTest={selectedTest}
                onPreviousClick={onPreviousClick}
                onSubmitFileExplorer={onSubmitFileExplorer}
                createTestJSON={createTestJSON}
                upatecreateJSON={upatecreateJSON}
                explorerData={props.explorerData}
                updateExamList={getExamList}
                ExamScheduleId={ExamScheduleId}
                dataForExtraBatchSchedule={dataForExtraBatchSchedule}
            />

            {/* *************************Assign Exam Extra Batches Modal */}
        </div>

    )
}
const mapPropsToState = (state) => {
    return {
        examList: state.examList,
        accountList: state.accountList,
        explorerData: state.explorerData,
        courseList: state.courseList,
        subjectList: state.subjectList
    }
}
export default connect(mapPropsToState)(AssignedExams);
