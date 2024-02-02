import React, { useState, useEffect } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { BsChevronDoubleDown, BsPeople, } from 'react-icons/bs';
import { key } from 'localforage';
import { toast } from 'react-toastify';
import { UrlConfig } from '../../../../config';
import { Api } from '../../../../services';
import CommonFunctions from '../../../../utils/CommonFunctions';



const AssignPreviewModal = (props) => {
    //**********************************************Props****************************************************** */
    const { selectedTest, createTestJSON, upatecreateJSON, assignedData, batchData, disableSubmitButton, scheduleSubmit, onPreviousClick, handleCloseforFileExploere, updateExamList, resetExplorerSelection, ExamScheduleId, dataForExtraBatchSchedule } = props;

    //*********************************************local states****************************************************** */
    const [previewData, setPreviewData] = useState([]);
    const [shuffleQuestionState, setShuffleQuestionState] = useState(true);
    const [mandatoryQuestionState, setMandatoryQuestionState] = useState(false);
    const [disableSubmit, setSubmitDisable] = useState(true);
    const [showLoader, setLoader] = useState(false);
    const [examMeta, setExamMeta] = useState({
        startDateTime: "",
        bufferTime: 0
    })

    const [applyAction, setApplyAction] = useState(false);
    const [assignedExamName, setAssignedExamdName] = useState(null);


    const resetLocalState = () => {

        setShuffleQuestionState(true);
        setMandatoryQuestionState(false);
        setSubmitDisable(true);
        setLoader(false);
        setExamMeta({
            startDateTime: "",
            bufferTime: 0
        });
        setApplyAction(false);
        JSON.stringify(localStorage.setItem('stateShuffle', true));
        JSON.stringify(localStorage.setItem('stateMandatory', false));
        previewData.map((data) => {
            data.startDateTime = '';
        });
        setPreviewData([]);
    }

    // ****************For extra batch Add Feature*************************************************
    useEffect(() => {
        console.log('ExamScheduleId', ExamScheduleId);
    }, [ExamScheduleId])


    // ****************extra batch Add Feature End*************************************************

    //**********************************************UseEffects****************************************************** */
    useEffect(() => {
        //**********************************************maintaining states****************************************************** */
        let shuffleQue = JSON.parse(localStorage.getItem('stateShuffle'));
        let mandatoryQue = JSON.parse(localStorage.getItem('stateMandatory'));
        if (shuffleQue == null || mandatoryQue == null) {
            setShuffleQuestionState(true);
            setMandatoryQuestionState(false);
            JSON.stringify(localStorage.setItem('stateShuffle', shuffleQuestionState));
            JSON.stringify(localStorage.setItem('stateMandatory', mandatoryQuestionState));

        } else {
            setShuffleQuestionState(shuffleQue);
            setMandatoryQuestionState(mandatoryQue);
        }
        if (selectedTest) {
            const { name } = selectedTest;
            name && setAssignedExamdName(name);
        }


        //**********************************************Call to Generate Preview Data****************************************************** */
        generateSubmitData();
    }, []);
    //**************************************************************************************************** */
    const generateSubmitData = () => {
        let generatedArray = [];
        assignedData.map((institute, index) => {
            const { id, name } = institute;
            // let batchDaata = findNestedObj(institute, 'batches');
            let batchDaata = CommonFunctions.getCheckedExplorerdData(institute, 'batches');
            if (batchDaata && batchDaata.length > 0) {
                console.log(batchDaata)
                batchDaata = [].concat.apply([], batchDaata, { "isShuffle": true, "isMand": true });
                console.log(batchDaata);
                batchDaata = { batches: batchDaata, name: name, id: id };
                generatedArray.push(batchDaata);
            }
        });
        setPreviewData(generatedArray);
        console.log('selectedTest', selectedTest)
    }

    const addFieldsToObject = () => {
        previewData.map((b) => {
            console.log('previewData', b);
            const { batches } = b
            batches.map((v) => {
                if (!v.shuffleQuestions || !v.isMandatory) {
                    v.shuffleQuestions = shuffleQuestionState;
                    v.isMandatory = mandatoryQuestionState;
                    v.bufferTime = parseInt(examMeta.bufferTime);
                    v.startDateTime = examMeta.startDateTime;
                }
                else {
                    v.shuffleQuestions = shuffleQuestionState;
                    v.isMandatory = mandatoryQuestionState;
                    v.bufferTime = parseInt(examMeta.bufferTime);
                    v.startDateTime = examMeta.startDateTime;
                }
                setPreviewData({ ...b })
            });
        });
        setPreviewData(previewData);
        validatedData()
    }

    const updateMeta = (e) => {
        if (e.target.name === "bufferTime") {
            if (isNaN(e.target.value) || parseInt(e.target.value) > 9999) {
                return false;
            }
        }
        setExamMeta({
            ...examMeta,
            [e.target.name]: e.target.value
        });

    }

    const validatedData = () => {
        let disableSubmit;
        if (!assignedData) disableSubmit = true;
        previewData.map((data, index) => {
            const { batches } = data
            disableSubmit = batches.find((batch) => {
                if (batch.startDateTime === '' || !batch.startDateTime) { return true } else { return false }
            })
        })
        setSubmitDisable(disableSubmit);
    }

    const scheduleExam = () => {
        console.log('previewData', previewData);
        let batchArray = [];
        previewData.map((data) => {
            console.log('data', data);
            const { batches } = data;
            batches.map((batch) => {
                const { startDateTime, id, bufferTime, shuffleQuestions, isMandatory, checked, partialChecked, students } = batch;
                let formattedStartDate = `${startDateTime}:00+05:30`
                let obj = {};
                if (checked && checked === true) {
                    obj = { batchId: id, startDateTime: formattedStartDate, bufferTimeInMinutes: bufferTime, shuffleQuestions, mandatoryQuestion: isMandatory };
                    batchArray.push(obj);
                }
                if (partialChecked && partialChecked === true) {
                    const studentIdArray = []
                    students.map((student) => {
                        const { userInfo, id } = student;
                        const { name, email } = userInfo;
                        console.log('student', student);
                        student.checked && student.checked === true && studentIdArray.push(`${id}`);
                    })
                    console.log('studentIdArray', studentIdArray);
                    obj = { batchId: id, startDateTime: formattedStartDate, bufferTimeInMinutes: bufferTime, shuffleQuestions, mandatoryQuestion: isMandatory, studentIds: studentIdArray }
                    batchArray.push(obj);
                }
            });
            console.log('batchArray', batchArray);
        });
        const payload = ExamScheduleId ?
            { examName: assignedExamName, examId: selectedTest.id, examScheduleId: ExamScheduleId, scheduleExamBatchDetails: batchArray } :
            { examName: assignedExamName, examId: selectedTest.id, scheduleExamBatchDetails: batchArray, };
        console.log('payload', payload);
        console.log('selectedTest', selectedTest);
        setLoader(true);
        const ApiToExecute = ExamScheduleId ? Api.putApi(UrlConfig.apiUrls.scheduleExam, payload) : Api.postApi(UrlConfig.apiUrls.scheduleExam, payload)
        // if (ExamScheduleId) {
        // Api.putApi(UrlConfig.apiUrls.scheduleExam, payload)
        ApiToExecute
            .then((response) => {
                if (response) {
                    console.log('response', response);
                    const { data } = response;
                    toast.success('Exam assigned successfully');
                    handleCloseforFileExploere(data.batchExamSchedules);
                    resetExplorerSelection();
                    resetLocalState();
                    updateExamList();
                    console.log(data, 'allCourseListallCourseListallCourseListallCourseListallCourseList');
                }
                setLoader(false);
            })
            .catch(error => {
                setLoader(false);
                const errorMessage = CommonFunctions.apiErrorMessage(error);
                console.log('errorMessage', errorMessage)
                toast(errorMessage, {
                    type: "error",
                });
            });
        // }
        //  else {
        //     Api.postApi(UrlConfig.apiUrls.scheduleExam, payload)
        //         .then((response) => {
        //             if (response) {
        //                 const { data } = response;
        //                 const { message } = data;
        //                 toast.success('Exam assigned successfully, please check in Assinged Exams.');
        //                 handleCloseforFileExploere();
        //                 resetExplorerSelection();
        //                 resetLocalState();
        //                 updateExamList();
        //                 console.log(data, 'allCourseListallCourseListallCourseListallCourseListallCourseList');
        //             }
        //             setLoader(false);
        //         })
        //         .catch(error => {
        //             setLoader(false);
        //             const errorMessage = CommonFunctions.apiErrorMessage(error);
        //             console.log('errorMessage', errorMessage)
        //             toast(errorMessage, {
        //                 type: "error",
        //             });
        //         });
        // }

    }


    return (
        <div>
            {showLoader && <div className="loader">
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </div>}
            <div className="modal-contemt-wrapper modalAssignPreviewWrap">
                <div className="accordian-wrapper-main">
                    <div className="student-list-box ">
                        <div className="filter-main-wrapper">
                            <div className="name-field-box">
                                <div className="row">
                                    <div className="col-sm-6">

                                    </div>
                                    <div className="col-sm-6"></div>
                                </div>

                            </div>
                            <div className="filter-right-box">

                                <div className="row">

                                    <div className="col-md-4">
                                        <div>
                                            <div className="form-group">
                                                <input type="text" id="name" className="form-control"
                                                    readOnly={ExamScheduleId ? true : false}
                                                    name="name" value={ExamScheduleId ? dataForExtraBatchSchedule.examName : assignedExamName} onChange={(e) => setAssignedExamdName(e.target.value)}
                                                />
                                                <label className="form-control-placeholder" htmlFor="name">Name</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="date-time-box">
                                            <div className="form-group">
                                                <input type="datetime-local"
                                                    name="startDateTime"
                                                    id="startDateTime"
                                                    value={examMeta.startDateTime}
                                                    onChange={updateMeta}
                                                    className="form-control" />
                                                <label className="form-control-placeholder"
                                                    for="startdatetime"
                                                >Start Date/Time</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="buffer-time-box">
                                            <div className="form-group buffer-time-text-box">
                                                <label className="form-control-placeholder-stick" for="buffertime">Buffer Time</label>
                                                <input
                                                    name="bufferTime"
                                                    type='bufferTime'
                                                    id="bufferTime"
                                                    className="form-control"
                                                    readOnly={ExamScheduleId ? true : false}
                                                    value={ExamScheduleId ? dataForExtraBatchSchedule.batchExamSchedules[0].bufferTimeInMinutes : examMeta.bufferTime}
                                                    onChange={updateMeta}
                                                    required placeholder="Min" />
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="col-md-4" style={{ visibility: 'hidden' }}>
                                        <div className="question-box-check-box">
                                            <div className="shuffle-questions-box">
                                                <div className="form-check form-check-neonWhite">
                                                    <label className="form-check-label">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            name="shuffleque"
                                                            checked={shuffleQuestionState}
                                                            value={shuffleQuestionState}
                                                            onChange={() => {
                                                                setShuffleQuestionState(!shuffleQuestionState);
                                                                JSON.stringify(localStorage.setItem('stateShuffle', !shuffleQuestionState));
                                                            }}
                                                        />
                                                        <i className="input-helper"></i>
                                                 Shuffle Question
                                                </label>
                                                </div>
                                            </div>
                                            <div className="mandatory-questions-box" style={{ visibility: 'hidden' }} >
                                                <div className="form-check form-check-neonWhite">
                                                    <label className="form-check-label">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            name="mandatoryQue"
                                                            checked={mandatoryQuestionState}
                                                            value={mandatoryQuestionState}
                                                            onChange={() => {
                                                                setMandatoryQuestionState(!mandatoryQuestionState)
                                                                JSON.stringify(localStorage.setItem('stateMandatory', !mandatoryQuestionState));
                                                            }}
                                                        />
                                                        <i className="input-helper"></i>
                                                     Mandatory Question
                                                     </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                                    <div className="col-md-2">
                                        <div className="apply-button-box ">
                                            <Button variant="primary"
                                                disabled={examMeta.startDateTime === "" ? true : false}
                                                className={(examMeta.startDateTime === "" || !assignedExamName) ? "uploadeBtn disabled" : "uploadeBtn"}
                                                onClick={() => { addFieldsToObject(); setApplyAction(!applyAction) }}>
                                                Apply
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="shedule-preview-box">
                            {/* <h3 className="student-list-box-title"><RiFileUserLine /> Student List</h3> */}
                            <div className="shedule-preview-inner-box">
                                <div className="shedule-preview-header-box">
                                    <div className="shedule-preview-header-sub">
                                        <div className="shedule-preview-header align-left" style={{ width: "10%" }}>
                                            <span className="shedule-preview-header-title"> <BsChevronDoubleDown size={15} /></span>
                                        </div>
                                        <div className="shedule-preview-header align-left" style={{ width: "30%" }}>
                                            <span className="shedule-preview-header-title">Branch</span>
                                        </div>
                                        <div className="shedule-preview-header" style={{ width: "20%" }}>
                                            <span className="shedule-preview-header-title">Class</span>
                                        </div>
                                        <div className="shedule-preview-header" style={{ width: "10%" }}>
                                            <span className="shedule-preview-header-title"> Batch</span>
                                        </div>
                                        <div className="shedule-preview-header" style={{ width: "30%" }}>
                                            <span className="shedule-preview-header-title"> Date/Time</span>
                                        </div>

                                    </div>
                                </div>

                                <div className="shedule-preview-content-box-scroll">
                                    {previewData.map((institute, index) => {
                                        const { batches } = institute;
                                        const instituteName = institute.name;
                                        const instituteId = institute.id;

                                        return <div className="shedule-preview-content-box" key={`institute_${instituteId}`}>
                                            <div className="shedule-preview-content-sub" style={{ borderBottom: 0 }}>
                                                <div className="shedule-preview-content align-left" style={{ width: "100%", padding: 0 }}>
                                                    <span className="instituteNm">{instituteName}</span>
                                                </div>
                                            </div>

                                            {
                                                batches.map((batch, i) => {
                                                    const { id, branchName, className, name, startDateTime } = batch;
                                                    return (
                                                        <div className="shedule-preview-content-sub" key={`branch_${id}`}>
                                                            <div className="shedule-preview-content align-left" style={{ width: "10%" }}>
                                                                <span className="shedule-preview-content-text">{i + 1}</span>
                                                            </div>
                                                            <div className="shedule-preview-content align-left" style={{ width: "20%" }}>
                                                                <span className="shedule-preview-content-text">{batch.branch.name}</span>
                                                            </div>
                                                            <div className="shedule-preview-content" style={{ width: "20%" }}>
                                                                <span className="shedule-preview-content-text">{batch.class.name}</span>
                                                            </div>
                                                            <div className="shedule-preview-content" style={{ width: "20%" }}>
                                                                <span className="shedule-preview-content-text">{batch.name}</span>
                                                            </div>
                                                            <div className="shedule-preview-content" style={{ width: "30%" }}>
                                                                <div className="form-group">
                                                                    <input key={id}
                                                                        value={(applyAction !== false && examMeta.startDateTime !== "") ? examMeta.startDateTime : startDateTime}
                                                                        type="datetime-local"
                                                                        className="form-control"
                                                                        name="startDateTime"
                                                                        onChange={(e) => {
                                                                            setExamMeta({
                                                                                ...examMeta,
                                                                                [e.target.name]: ""
                                                                            });
                                                                            setApplyAction(!applyAction)

                                                                            previewData.map((data) => {
                                                                                console.log('previewData', data);
                                                                                const { batches } = data
                                                                                batches.map((batch) => {
                                                                                    if (batch.id === id) {
                                                                                        console.log(`batch.id: ${batch.id}`, `id: ${id}`)
                                                                                        batch.startDateTime = e.target.value;
                                                                                    }
                                                                                    setPreviewData({ ...data })
                                                                                })
                                                                            });
                                                                            setPreviewData(previewData);
                                                                            validatedData();
                                                                        }}
                                                                        id={id}
                                                                    />
                                                                </div>
                                                            </div>

                                                        </div>
                                                    )
                                                })}
                                            <div className="disable-overlay">
                                                {/* <h3>Disable Content</h3> */}
                                            </div>
                                        </div>
                                    })}
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
            <Modal.Footer>
                <Button variant="secondary" className="previousBtn" onClick={() => {
                    onPreviousClick();
                }}>
                    Previous
                    </Button>
                <Button variant="secondary" className="closeBtn" onClick={() => {
                    handleCloseforFileExploere();
                    resetLocalState();
                    resetExplorerSelection();
                }}>
                    Cancel
                    </Button>
                <Button variant="primary" className={`uploadeBtn ${disableSubmit ? 'disabled' : ''}`}
                    onClick={() => {
                        scheduleExam();
                    }}>
                    Submit
                </Button>
            </Modal.Footer>
        </div >)
}

export default AssignPreviewModal;