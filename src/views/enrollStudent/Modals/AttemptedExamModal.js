import React, { useRef, useState, useEffect } from 'react';
import { Button, Modal, Card, Accordion, Spinner } from 'react-bootstrap';
import DetailsReportModal from '../Modals/DetailsReportModal';
import moment from 'moment';
import { Api, CommonApiCall } from '../../../services';
import { toast, ToastContainer } from 'react-toastify';
import CommonFunctions from '../../../utils/CommonFunctions';
import { BsCheckCircle, BsCircle } from "react-icons/bs";
import Axios from 'axios'

const AttemptedExamModal = (props) => {

    const { showAttemptedExamModal, closeAttemptedExamModal, userGivenTestList } = props;

    const [showDetailsReport, setShowDetailsReportModal] = useState(false);
    const closeDetailsReportModal = () => setShowDetailsReportModal(false);
    const [reportList, setReportList] = useState([]);
    const [detailedReport, setDetailedReport] = useState({});
    const [selectedReport, setSelectedReport] = useState({})
    const [showLoader, setLoader] = useState(false);
    const [ID, setId] = useState(null);
    //****************Main View**************************************/




    const getReportbyScheduleID = (id) => {
        Api.getApi('studentExamSubmission/' + id + '/reports')
            .then((response) => {
                console.log(response);
                const { data } = response;
                if (data && data.length != 0) {
                    data.reverse();
                    setReportList(data)
                } else {
                    toast('Something goes wrong..!', {
                        type: "error",
                    });
                }
            }).catch((error) => {
                const errorMessage = CommonFunctions.apiErrorMessage(error);
                console.log('errorMessage', errorMessage)
                // setAddPopupLoader(false);
                toast(errorMessage, {
                    type: "error",
                });
            });
    }

    const getDetailedReport = (id, data) => {
        getQuestionPaper(data)
        // Api.getApi('studentExamSubmission/' + id + '/detailReport')
        //     .then((response) => {
        //         console.log(response);
        //         const { data } = response;
        //         debugger
        //         if (data) {
        //             console.log(data)
        //             setDetailedReport(data);
        //             setLoader(false);
        //             setShowDetailsReportModal(true)
        //         } else {
        //             setLoader(false);
        //             toast('Something goes wrong..!', {
        //                 type: "error",
        //             });
        //         }
        //     }).catch((error) => {
        //         setLoader(false);
        //         const errorMessage = CommonFunctions.apiErrorMessage(error);
        //         console.log('errorMessage', errorMessage)
        //         // setAddPopupLoader(false);
        //         toast(errorMessage, {
        //             type: "error",
        //         });
        //     });

    }

    const getQuestionPaper = (data) => {
        // const questionSetDataUrl = " https://sglearningfilestorage-dev-cdn.azureedge.net/questionsetdatafiles/51b6bd1a-790e-4449-a735-084a92e39b65%2Feb129bae-41c4-4057-8741-7ae0edd843b9";
        // const questionSetDataUrl = " https://sglearningfilestorage.blob.core.windows.net/questionsetdatafiles/51b6bd1a-790e-4449-a735-084a92e39b65%2Fc14fae53-2c31-49e5-8a2f-1b863d0bca2b";
        const { questionSetDataUrl } = data;
        // Axios.get(questionSetDataUrl)
        Axios({
            method: 'GET',
            url: questionSetDataUrl,
            // timeout: 420000,
            headers: {
                'Content-Type': 'application/json',
                accept: 'application/json',
                crossDomain: true,
                'cache-control': 'no-cache',

            }
        })
            .then((response) => {
                console.log('CDN json data', response);
                const { answers } = data;
                const { subjectwizeQuestions } = response;
                if (subjectwizeQuestions && subjectwizeQuestions.length > 0) {
                    subjectwizeQuestions.map((subQue, idx) => {
                        const { questions } = subQue;
                        questions.map((que, index) => {
                            const answerObj = answers.find((ans) => ans.questionId === que.id)
                            if (answerObj) {
                                que = { ...que, ...answerObj, studentAnswer: answerObj.optionKeys };
                            }
                            questions[index] = que;
                            return true;
                        });
                        // subjectwizeQuestions[idx] = { ...subQue, questions };
                        return true;
                    });
                    const detailReportData = { ...data, subjectwizeQuestions };
                    setDetailedReport(detailReportData);
                    setShowDetailsReportModal(true)
                }
                setLoader(false);
            })
            .catch((error) => {
                setLoader(false);
                const errorMessage = CommonFunctions.apiErrorMessage(error);
                toast(errorMessage, {
                    type: "error",
                });
            })
    }

    return (

        <div className="modal-main-dark">
            {showDetailsReport && <DetailsReportModal showDetailsReportModal={showDetailsReport}
                closeDetailsReportModal={closeDetailsReportModal}
                detailedReport={detailedReport}
                reportList={selectedReport}
            />}
            <Modal show={showAttemptedExamModal} onHide={() => closeAttemptedExamModal()} centered size="md" className="modal-dark attempted-exam-modal" backdrop="static" >
                <ToastContainer autoClose={5000} position="top-right" className="tost-dark-container" style={{ borderRadius: 5, fontFamily: 'GOTHIC' }} />
                <Modal.Header closeButton>
                    {userGivenTestList && userGivenTestList.length > 0 && <div className="modal-title-box">
                        <span>Assigned Exam</span>
                        <span>Total assigned count: {userGivenTestList.length}</span>
                    </div>}
                </Modal.Header>

                <Modal.Body>
                    {userGivenTestList && userGivenTestList.length > 0 && <div className="attempted-exam-list">
                        <Accordion>{userGivenTestList.map((e, i) => {
                            console.log('e', e)
                            if (!e) return null;
                            const { exam, examName } = e;
                            return <div>{<div><Accordion.Toggle as={Card.Header} eventKey={i}
                                onClick={() => {
                                    if (e.isSubmitted === true) {
                                        getReportbyScheduleID(e.id);
                                    } else {
                                        setReportList([])
                                        toast('Not attempted exam yet.', {
                                            type: "error",
                                        });
                                    }
                                }}>



                                <span>{examName && examName}</span>
                                <span>
                                    {e.isSubmitted === true && <span className="checkbox-right-margin"><BsCheckCircle /></span>}
                                    {moment(e.startDateTime).format('DD MMM YYYY, hh:mm a')}

                                </span>

                            </Accordion.Toggle>
                                <Accordion.Collapse eventKey={i}>
                                    <div className="attempted-list-content">
                                        {reportList && reportList.length != 0 && reportList.map((r, index) => {
                                            return <div className={(index % 2 === 0) ? "attempted-list-content-inner sub-even" : "attempted-list-content-inner sub-odd"}>
                                                <span>{index + 1}</span>
                                                <span>{moment(r.dateCreated).format('DD MMM YYYY, hh:mm a')}</span>
                                                <span> {
                                                    r.score.subjectwizeScore.map((sub, subIndex) => {
                                                        return <span className="subject-marks">
                                                            <span><label>{sub.subjectName} :</label> {sub.scoredMarks},</span>
                                                        </span>
                                                    })
                                                }
                                                    <span className="total-count"><label> Total Marks : </label> {r.score.scoredMarks}.</span>
                                                </span>
                                                <span>
                                                    <Button id={r.id} variant="secondary" className="uploadeBtn" onClick={(event) => {
                                                        setId(event.target.id);
                                                        if (e.isSubmitted === true) {
                                                            setLoader(true);
                                                            setSelectedReport(r)
                                                            getDetailedReport(r.id, r);
                                                        }
                                                    }}>
                                                        {ID === r.id && showLoader ? <Spinner size="sm" animation="grow" variant="info" /> : "Detail Report"}

                                                    </Button>
                                                </span>
                                            </div>
                                        })
                                        }
                                        {e.isSubmitted === false && <div className="no-data-found-explorer">
                                            <h3>No data found</h3>
                                        </div>}
                                    </div>
                                </Accordion.Collapse>
                            </div>}</div>
                        })}
                        </Accordion>
                        {/* {
                            showLoader && <div className="loader">
                                <Spinner animation="border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </Spinner>
                            </div>
                        } */}
                    </div>}

                </Modal.Body>
                {/* <Modal.Footer>
                    <Button variant="secondary" className="closeBtn">
                        Cancel
                    </Button>
                    <Button variant="secondary" className="uploadeBtn">
                        Detail Report
                    </Button>

                </Modal.Footer> */}
            </Modal>
        </div>
    )
}
export default AttemptedExamModal