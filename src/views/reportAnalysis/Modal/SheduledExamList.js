import React, { useEffect, useState } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import ReactHtmlTableToExcel from 'react-html-table-to-excel';
import { BsCheckCircle, BsChevronDoubleRight } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify';
import { UrlConfig } from '../../../config';
import { Api } from '../../../services';
import moment from 'moment';
import CommonFunctions from '../../../utils/CommonFunctions';
import ExportAnalysis from './exportAnalysis';
import QuestionWiseErrorAnalysis from './AllBranchError';
import { Bar } from 'react-chartjs-2';


const SheduledExamList = (props) => {
    const { showExamListModal, resetExamListModal, examWiseAnalysisAPI, wrongUnAttemptedAPI, testToTestAPI, analysisTypeFlag, Loader, startLoader, exportDataList, setExportDataList, ModalHeader, IsDataPresent, ResetIsDataPresent, ModalHeaderShortName } = props;
    const [selectedExam, setSelectedExam] = useState(null);
    const [selectedExam2, setSelectedExam2] = useState(null);
    const [loader, setLoader] = useState(false);
    // *********************************************************************************useEffect Start**********************************************
    useEffect(() => {
        setLoader(true);
        getExamList();
    }, []);


    // *********************************************************************************useEffect End**********************************************
    const getCallAnalysisType = (analysisFlag) => {
        switch (analysisFlag) {
            case 1: {
                examWiseAnalysisAPI(selectedExam);
                break;
            }
            case 2: {
                wrongUnAttemptedAPI(selectedExam);
                break;
            }
            case 3: {
                testToTestAPI(selectedExam, selectedExam2);
                break;
            }
            default:
                break;
        }
    }


    const [examList, setExamList] = useState(null);

    // *********************************************************************************examList API Call Start**********************************************
    const getExamList = () => {
        var params = new URLSearchParams();
        params.append("PageSize", 500);
        Api.getApi(UrlConfig.apiUrls.getExamSchedule, params)
            .then((response) => {
                console.log("responseeee", response);
                if (response) {
                    const { data } = response;
                    setExamList(data);
                }
                setLoader(false);
            })
            .catch((err) => {
                setLoader(false);
                const errorMessage = CommonFunctions.apiErrorMessage(err);
                toast(errorMessage, {
                    type: "error",
                });
            })
    }
    // *********************************************************************************examList API Call End**********************************************
    const Loadder = () => {
        return <Spinner animation="border" role="status">
            <span className="sr-only" > Loading...</span >
        </Spinner>
    }

    const [selectedExambatchList, setSelectedExambatchList] = useState([]);
    const [relatedBatchExamlList, setRelatedBatchExamList] = useState(null);


    const dependentExamList = (selectedExam) => {
        selectedExam.batchExamSchedules.map((batch) => {
            selectedExambatchList.push(batch.batch.id);
        })
        console.log("selected exam", selectedExam);
        var newExamListArray = [];
        newExamListArray.push(selectedExam);
        selectedExambatchList && selectedExambatchList.map((selectedExamid) => {
            examList && examList.map((exam, idx) => {

                const { batchExamSchedules } = exam;
                const isExist = batchExamSchedules.find((e) => e.batch.id === selectedExamid);
                if (isExist) {

                    const isAlreadyExamPresent = newExamListArray.find((e) => e.id === exam.id);
                    if (!isAlreadyExamPresent) {
                        let diffBetweenExams = null;
                        if (selectedExam) {
                            let selectedExamDateTime = moment(selectedExam.exam.lastScheduleDate);
                            let matchedExamdDateTime = moment(exam.exam.lastScheduleDate);
                            diffBetweenExams = selectedExamDateTime.diff(matchedExamdDateTime, 'seconds');

                        }
                        if (diffBetweenExams > 0) {
                            newExamListArray.push(exam);
                            console.log('diff seconds', diffBetweenExams);
                        }
                    }

                }

            })
        })
        setRelatedBatchExamList(newExamListArray);
        console.log("selected Exam", newExamListArray);
        setSelectedExambatchList([]);
    }

    const exportAnalysisComponent = () => {
        return (
            <ExportAnalysis
                analysisTypeFlag={analysisTypeFlag}
                exportDataList={exportDataList}
                examName={examName.name}
                dependentExamName={dependentExamName}
                show={true}
                reset={false}
            />
        );
    }

    const [examName, setExamName] = useState({
        name: null,
        date: null
    });

    const examListView1 = () => {
        return (
            <div className="explorerColContentListWrap" style={{ width: analysisTypeFlag === 3 ? '50%' : '100%' }}>{examList && examList.map((examList, idx) => {
                let lastScheduled = moment(examList.exam.lastScheduleDate).format('MM-DD-YYYY');
                return (
                    <div className={(idx % 2 === 0) ? "select-report-content-box select-report-content-box-even" : "select-report-content-box select-report-content-box-odd"}>
                        <div className="form-check ">
                            <label className="form-check-label text-muted">
                                <input type="radio" className="form-check-input"
                                    name="exam-List"
                                    value={examList.examName}
                                    key={examList.id}
                                    onChange={() => {
                                        setSelectedExam(null);
                                        setExamName({ ...examName, name: null, date: null });
                                        if (analysisTypeFlag === 1) {
                                            setSelectedExam2(null);
                                            setSelectedExam(examList.exam.id);
                                        }
                                        else {
                                            if (analysisTypeFlag === 3) {
                                                setSelectedExam2(null);
                                                setRelatedBatchExamList(null)
                                                dependentExamList(examList);

                                            }
                                            setSelectedExam(examList.id);
                                        }
                                        ResetIsDataPresent();
                                        setExportDataList(null);
                                        setExamName({ ...examName, name: examList.examName, date: lastScheduled });
                                    }}
                                />
                                <i className="input-helper"></i>
                                <div className="select-single-report-content-wrapper">
                                    <div className="select-single-report-content">
                                        <span className="select-single-report-content-text">
                                            {lastScheduled}
                                            <BsChevronDoubleRight size={14} />
                                            {examList.examName}
                                        </span>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>
                );
            })}</div>
        );
    }

    const [dependentExamName, setDependentExamName] = useState(null);
    const dependentExamlList = () => {
        return (<div className="explorerColContentListWrap" style={{ width: '50%' }}>
            {(analysisTypeFlag === 3) && <div>{relatedBatchExamlList && relatedBatchExamlList.map((exams, idx) => {
                let lastScheduled = moment(exams.exam.lastScheduleDate).format('MM-DD-YYYY');
                return <div className={(idx % 2 === 0) ? "select-report-content-box select-report-content-box-even" : "select-report-content-box select-report-content-box-odd"}>
                    {idx !== 0 && <div className="form-check ">
                        <label className="form-check-label text-muted">
                            <input type="radio" className="form-check-input"
                                name="dependent-exam-List"
                                value={exams.examName}
                                key={exams.id}
                                onChange={() => {
                                    setDependentExamName(null);
                                    setSelectedExam2(exams.id);
                                    setExportDataList(null);
                                    setDependentExamName(exams.examName);
                                    ResetIsDataPresent();
                                }}
                            />
                            <i className="input-helper"> </i>
                            <div className="select-single-report-content-wrapper">
                                <div className="select-single-report-content">
                                    <span className="select-single-report-content-text">
                                        {lastScheduled}
                                        <BsChevronDoubleRight size={14} />
                                        {exams.examName}
                                    </span>
                                </div>
                            </div>
                        </label>
                    </div>}
                </div>
            })}</div>}
        </div>
        );
    }
    // (exportDataList) && (IsDataPresent ? toast.success('Sheet isready for export.') : toast.info('data not present.'))
    const [showErrorListModal, setShowErrorListModal] = useState(false);
    const closeErrorModal = () => setShowErrorListModal(false);
    return (
        <div className="modal-main-dark">
            {(analysisTypeFlag === 4 && showErrorListModal) && <QuestionWiseErrorAnalysis
                showErrorListModal={showErrorListModal}
                resetErrorListModal={closeErrorModal}
                examScheduleId={selectedExam}
            />}

            {exportDataList && exportAnalysisComponent()}
            <Modal show={showExamListModal} onHide={() => { resetExamListModal(); }} centered size="md" className="modal-dark reportAnalysis-Modal" backdrop="static">
                <ToastContainer autoClose={5000} position="top-right" className="tost-dark-container" style={{ borderRadius: 5, fontFamily: 'GOTHIC' }} />
                <Modal.Header closeButton>
                    <div className="modal-title-box">
                        <h3>{ModalHeader && ModalHeader}</h3>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className="reportAnalysis-Content-Main-wrapper">
                        <div className="student-file-explorer-view">
                            <div className="explorerMainWrapper">
                                <div className="explorerInnerWrapper">
                                    <div className="explorerMainRowWrapper">
                                        <div className="explorerScrollableWrapper">
                                            <div className="explorerHorizontalWrapper">
                                                <div className="explorerRowWrapper">
                                                    {(analysisTypeFlag === 3) && <div className="explorerRowWrapper-Label"><span>Select Recent Exams</span>{relatedBatchExamlList && <span>Select Previous Exams</span>}</div>}
                                                    <div className="explorerRowContentListWrap" >
                                                        {loader && <div style={{ textAlign: "center", padding: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                                            {loader ?
                                                                Loadder()
                                                                :
                                                                !examList ? <div className="no-data-found-explorer">
                                                                    <h3>No data found</h3>
                                                                </div>
                                                                    : ''}
                                                        </div>}

                                                        {examList && examListView1()}

                                                        {(analysisTypeFlag === 3 && relatedBatchExamlList) && dependentExamlList()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>

                    <Button onClick={resetExamListModal} className="closeBtn" variant='secondary'>Close</Button>

                    {IsDataPresent ? <div className="download-report-btn-box "  >
                        <ReactHtmlTableToExcel
                            table={(analysisTypeFlag === 1) ? 'exam-wise-analysis' : (analysisTypeFlag === 2) ? 'wrong-unattempted-analysis' : (analysisTypeFlag === 3) ? 'test-to-test-analysis' : ''}
                            sheet="sheet 1"
                            filename={`${examName.date}_${ModalHeaderShortName}_(${examName.name})`}
                            buttonText="Download"
                            className={exportDataList ? "previousBtn btn" : "previousBtn btn disabled"}
                        />
                    </div> :
                        <Button onClick={() => {

                            if (analysisTypeFlag === 4) {
                                setShowErrorListModal(true);

                            } else {
                                startLoader();
                                getCallAnalysisType(analysisTypeFlag);
                            }

                        }} className={(!Loader) && (analysisTypeFlag === 3) ? (selectedExam2 && selectedExam) ? "uploadeBtn " : "uploadeBtn disabled" : (selectedExam) ? "uploadeBtn " : "uploadeBtn disabled"} variant='primary'>
                            {(!Loader) && "Ok"} {Loader && <Spinner size="sm" animation="grow" variant="info" />}</Button>}
                </Modal.Footer>
            </Modal>
        </div >
    );

}
export default SheduledExamList;


