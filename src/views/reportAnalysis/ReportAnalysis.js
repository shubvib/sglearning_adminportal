import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { UrlConfig } from '../../config';
import { Api } from '../../services';
import SheduledExamList from './Modal/SheduledExamList';
import ExportAnalysis from './Modal/exportAnalysis';
import CommonFunctions from '../../utils/CommonFunctions';
import { toast } from 'react-toastify';
import PagesHeader from '../../components/shared/Pageheader';
// import { HiOutlineDocumentReport } from "react-icons/hi";
import { GrPieChart } from "react-icons/gr";
import { FaFileExcel } from "react-icons/fa";

const ReportAnalysis = (props) => {
    const [exportDataList, setExportDataList] = useState(null);
    const [loader, setLoader] = useState(false);
    const [moadlHeader, setModalHeader] = useState(null);
    const [modalHeaderShortName, setModalHeaderShortName] = useState(null);
    const [isDataPresent, setIsDataPresent] = useState(false);
    const resetIsDataPresent = () => setIsDataPresent(false);
    const startLoader = () => setLoader(true);
    const resetExportDataList = () => setExportDataList(null);
    // *********************************************************************************exam Wise API Call Start******************************************************
    const examWiseAnalysis = (id) => {
        const payload = { examId: id }
        Api.getApi(UrlConfig.apiUrls.examWiseHighestMarks, payload)
            .then((response) => {
                console.log("responseeee", response);
                setExportDataList(null);
                if (response) {
                    const { data } = response;
                    setExportDataList(data);

                    if (data.studentExamSubmissionVM.length > 0) {
                        setIsDataPresent(true);
                        toast.success('Sheet is ready to download');
                    }
                    else {
                        setIsDataPresent(false);
                        toast.error('Exam data not available');
                    }
                    setLoader(false);
                }
                else {
                    setLoader(false);
                }

            })
            .catch((err) => {
                setLoader(false);
                const errorMessage = CommonFunctions.apiErrorMessage(err);
                toast(errorMessage, {
                    type: "error",
                });
            })
    };
    // *********************************************************************************exam Wise API Call End******************************************************

    // *********************************************************************************wrongUnattempted Wise API Start******************************************************
    const wrongUnAttempted = (examsheduleID) => {

        Api.getApi(UrlConfig.apiUrls.wrongUnAttempted + `/{${examsheduleID}}`)
            .then((response) => {
                console.log("responseee of wrong unattempted", response)
                setExportDataList(null);
                if (response) {
                    const { data } = response;
                    setExportDataList(data);

                    if (data.subjectWiseWrongUnAttemptedQuestions && data.subjectWiseWrongUnAttemptedQuestions[0].wrongUnattemptedQuestions.length > 0) {
                        setIsDataPresent(true);
                        toast.success('Sheet is ready to download');
                    } else {
                        setIsDataPresent(false);
                        toast.error('Exam data not available');
                    }
                    setLoader(false);
                }
                else {
                    setLoader(false);
                }
            })
            .catch((err) => {
                setLoader(false);
                const errorMessage = CommonFunctions.apiErrorMessage(err);
                toast(errorMessage, {
                    type: "error",
                });
            })
    }
    // *********************************************************************************wrongUnattempted Wise API End******************************************************

    // *********************************************************************************test-to-test API Start******************************************************
    const testToTestAPI = (examsheduleID1, examsheduleID2) => {
        var payload = {
            ExamScheduleId1: examsheduleID1,
            ExamScheduleId2: examsheduleID2
        }
        Api.getApi(UrlConfig.apiUrls.testToTest, payload)
            .then((response) => {
                console.log('responseeee', response);
                setExportDataList(null);
                if (response) {
                    const { data } = response;
                    setExportDataList(data);
                    if (data.testToTestComparisonDetailsVM.length > 0) {
                        setIsDataPresent(true);
                        toast.success('Sheet is ready to download');
                    } else {
                        setIsDataPresent(false);
                        toast.error('Exam data not available');
                    }
                    setLoader(false);
                } else {
                    setLoader(false);
                }
            })
            .catch((err) => {
                setLoader(false);
                const errorMessage = CommonFunctions.apiErrorMessage(err);
                toast(errorMessage, {
                    type: "error",
                });
            })
    }
    // *********************************************************************************test-to-test API End******************************************************

    // *********************************************************************************Export-Analysis-View Component Start*********************************************


    // *********************************************************************************Export-Analysis-View Component End************************************************

    const [analysisFlag, setAnalysisTypeFlag] = useState(null);
    const [showExamListModal, setShowExamListModal] = useState(false);
    const CloseExamListModal = () => {
        setExportDataList(null);
        setShowExamListModal(false);
        setIsDataPresent(false);
    }
    return (
        <div>
            <PagesHeader headerText={"Report Analysis"} />
            <div className="common-dark-box reportAnalysisMainWrapper">
                <div className="reportAnalysisButtonWrapper">
                    <div className="row">
                        <div className="col-sm-4">
                            <div className="analysisBtnBox" onClick={() => {
                                setModalHeaderShortName(null);
                                setModalHeader(null);
                                setAnalysisTypeFlag(1);
                                setShowExamListModal(true);
                                setModalHeader('Branch Wise Analysis');
                                setModalHeaderShortName('E_W_A');
                            }}>
                                <div className="hexagon-wrapper">
                                    <div className="hexagon branchWiseAnalysishexa">
                                        <FaFileExcel />
                                    </div>
                                </div>
                                <Button className="reportAnalysisCommonBtn branchWiseAnalysisBtn">Branch Wise Analysis</Button>
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <div className="analysisBtnBox" onClick={() => {
                                setModalHeaderShortName(null);
                                setModalHeader(null);
                                setAnalysisTypeFlag(2);
                                setShowExamListModal(true);
                                setModalHeader('Wrong-UnAttempted Analysis');
                                setModalHeaderShortName('W_Un_A');
                            }}>
                                <div className="hexagon-wrapper">
                                    <div className="hexagon wrongUnAttemptedhexa">
                                        <FaFileExcel />
                                    </div>
                                </div>
                                <Button className="reportAnalysisCommonBtn wrongUnAttemptedBtn">Wrong UnAttempted</Button>
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <div className="analysisBtnBox" onClick={() => {
                                setModalHeaderShortName(null);
                                setModalHeader(null);
                                setAnalysisTypeFlag(3);
                                setShowExamListModal(true);
                                setModalHeader('Exam-To-Exam Analysis');
                                setModalHeaderShortName('E_2_E');
                            }}>
                                <div className="hexagon-wrapper">
                                    <div className="hexagon testToTesthexa">
                                        <FaFileExcel />
                                    </div>
                                </div>
                                <Button className="reportAnalysisCommonBtn testToTestBtn">Exam To Exam</Button>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-4">
                            <div className="analysisBtnBox" onClick={() => {
                                setModalHeader(null);
                                setAnalysisTypeFlag(4);
                                setShowExamListModal(true);
                                setModalHeader('Graphical Analysis');
                            }}>
                                <div className="hexagon-wrapper">
                                    <div className="hexagon allBranchesErrorhexa">
                                        <GrPieChart />
                                    </div>
                                </div>
                                <Button className="reportAnalysisCommonBtn allBranchesErrorBtn">Graphical Analysis</Button>
                            </div>
                        </div>
                    </div>
                </div>

                {
                    showExamListModal && <SheduledExamList
                        showExamListModal={showExamListModal}
                        resetExamListModal={CloseExamListModal}
                        exportDataList={exportDataList}
                        ModalHeader={moadlHeader}
                        ModalHeaderShortName={modalHeaderShortName}
                        IsDataPresent={isDataPresent}
                        ResetIsDataPresent={resetIsDataPresent}
                        setExportDataList={resetExportDataList}
                        examWiseAnalysisAPI={(id) => examWiseAnalysis(id)}
                        wrongUnAttemptedAPI={(examsheduleID) => wrongUnAttempted(examsheduleID)}
                        testToTestAPI={(examsheduleID1, examsheduleID2) => testToTestAPI(examsheduleID1, examsheduleID2)}
                        analysisTypeFlag={analysisFlag}
                        Loader={loader}
                        startLoader={() => startLoader()}
                    />
                }
            </div>

        </div>
    );

}

export default ReportAnalysis;


