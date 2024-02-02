import React, { useEffect } from 'react';
import moment from 'moment';
import { Table } from 'react-bootstrap';
import { IoIosArrowRoundUp } from 'react-icons/io';

const ExportAnalysis = (props) => {
    const { exportDataList, analysisTypeFlag, examName, dependentExamName } = props;

    const getCallAnalysisView = () => {
        switch (analysisTypeFlag) {
            case 1: {
                return examWiseAnalysisView();

            }
            case 2: {
                return wrongUnAttemptedView();

            }
            case 3: {
                return testToTestView();

            }
            default:
                break;
        }
    }
    // *********************************************************************************Wrong-UnAttempted View Start******************************************************
    const headerOfWrongUnAttemptedAnalysis = () => {
        return (<div>
            <tr><th colSpan="6" align="center" style={{ fontSize: 23, color: '#000', textAlign: 'center', fontFamily: "GOTHICB" }}>Wrong + UnAttempted Question</th></tr>
            <tr>
                <th colSpan="2" align="center" style={{ background: '#ccc', color: '#000', fontFamily: "GOTHICB", fontSize: 12, textAlign: 'center', textTransform: "capitalize" }}>
                    Exam Date <br />
                    ({moment(exportDataList.examDate).format(' MM-DD-YYYY')})
                </th>
                <th colSpan="2" align="center" style={{ background: '#ccc', color: '#000', fontFamily: "GOTHICB", fontSize: 12, textAlign: 'center', textTransform: "capitalize" }}>
                    Total Students<br />
                    {exportDataList.totalNumberOfStudents}
                </th>
                <th colSpan="2" align="center" style={{ background: '#ccc', color: '#000', fontFamily: "GOTHICB", fontSize: 12, textAlign: 'center', textTransform: "capitalize" }}>
                    Attempted Students<br />
                    {exportDataList.totalExamAttentedStudent}
                </th>
            </tr>
        </div>
        )
    }
    const wrongUnAttemptedView = () => {
        return <div className="table-responsive" style={{ width: '100%', border: 'transparent', visibility: "hidden" }}>
            <Table striped bordered hover variant="dark" className="dark-light-common-table" id='wrong-unattempted-analysis'>
                {headerOfWrongUnAttemptedAnalysis()}
                {exportDataList && exportDataList.subjectWiseWrongUnAttemptedQuestions.map((subjects) => {
                    return <div><tr>
                        <td align="center" rowSpan="2" style={{ fontSize: 12, color: '#000', fontWeight: 600, textAlign: 'center', fontFamily: "GOTHIC" }}>
                            {subjects.subject.name}
                        </td>
                        <td align="center" style={{ fontSize: 12, color: '#000', fontWeight: 600, textAlign: 'center', fontFamily: "GOTHIC" }}>Question No.
                        </td>
                        {subjects.wrongUnattemptedQuestions.map((questions) => {
                            return <td align="center" style={{ fontSize: 12, color: '#000', fontWeight: 400, textAlign: 'center', fontFamily: "GOTHIC" }}>{questions.questionNo}
                            </td>
                        })}
                    </tr>
                        <tr>
                            <td align="center" style={{ fontSize: 12, color: '#000', fontWeight: 600, textAlign: 'center', fontFamily: "GOTHIC" }}>%
                            </td>
                            {subjects.wrongUnattemptedQuestions.map((questions) => {
                                return <td align="center" style={{ fontSize: 12, color: '#000', fontWeight: 400, textAlign: 'center', fontFamily: "GOTHIC" }}>{questions.percentage}%
                                </td>
                            })}

                        </tr>
                    </div>
                })}
            </Table>
        </div>

    }
    // *********************************************************************************Wrong-UnAttempted View End******************************************************

    // *********************************************************************************Exam-Wise-Analysis View Start******************************************************
    const headerOfExamWiseAnalysisView = () => {
        return (
            <div>
                <tr>
                    <th colSpan="11" align="center" style={{ fontSize: 23, color: '#000', textAlign: 'center', fontFamily: "GOTHICB", textTransform: "capitalize" }}>{examName}</th>
                </tr>
                <tr>
                    <th align="center" style={{ background: '#ccc', color: '#000', fontFamily: "GOTHICB", fontSize: 12, textAlign: 'center', textTransform: "capitalize" }}>
                        Sr.No
                    </th>
                    <th align="center" style={{ background: '#ccc', color: '#000', fontFamily: "GOTHICB", fontSize: 12, textAlign: 'center', textTransform: "capitalize" }}>
                        Student Code
                    </th>
                    <th align="center" style={{ background: '#ccc', color: '#000', fontFamily: "GOTHICB", fontSize: 12, textAlign: 'center', textTransform: "capitalize" }}>
                        Student Name
                    </th>
                    {exportDataList && exportDataList.headers.map((headers, idx) => {
                        return (
                            <th align="center" style={{ background: '#ccc', color: '#000', fontFamily: "GOTHICB", fontSize: 12, textAlign: 'center', textTransform: "capitalize" }}>
                                {headers}
                            </th>
                        );
                    })}
                </tr>
            </div>
        );
    }


    const examWiseAnalysisView = () => {
        return <div className="table-responsive" style={{ width: '100%', border: 'transparent', visibility: "hidden" }}>
            <Table striped bordered hover variant="dark" id='exam-wise-analysis' className="dark-light-common-table">
                {headerOfExamWiseAnalysisView()}
                {exportDataList && exportDataList.studentExamSubmissionVM.map((students, idx) => {

                    return <tr>
                        <td align="center" style={{ fontSize: 12, color: '#000', fontWeight: 400, textAlign: 'center', fontFamily: "GOTHIC" }}>
                            {(idx + 1)}
                        </td>
                        <td align="center" style={{ fontSize: 12, color: '#000', fontWeight: 400, textAlign: 'center', fontFamily: "GOTHIC" }}>
                            {students.studentCode}
                        </td>
                        <td align="center" style={{ fontSize: 12, color: '#000', fontWeight: 400, textAlign: 'center', fontFamily: "GOTHIC" }}>
                            {students.studentName}
                        </td>
                        <td align="center " style={{ fontSize: 12, color: '#000', fontWeight: 400, textAlign: 'center', fontFamily: "GOTHIC" }}>
                            {students.branch.name}
                        </td>
                        {students.score.subjectwizeScore.map((subjects, ind) => {
                            return <div>
                                <td align="center" style={{ fontSize: 12, color: '#000', fontWeight: 400, textAlign: 'center', fontFamily: "GOTHIC" }}>
                                    {subjects.scoredMarks}
                                </td>
                                <td align="center" style={{ fontSize: 12, color: '#000', fontWeight: 400, textAlign: 'center', fontFamily: "GOTHIC" }}>
                                    {subjects.rank}
                                </td>
                            </div>
                        })}

                        <td align="center" style={{ fontSize: 12, color: '#000', fontWeight: 400, textAlign: 'center', fontFamily: "GOTHIC" }}>
                            {students.score.scoredMarks}
                        </td>
                        <td align="center" style={{ fontSize: 12, color: '#000', fontWeight: 400, textAlign: 'center', fontFamily: "GOTHIC" }}>
                            {students.score.rank}
                        </td>
                        <td align="center" style={{ fontSize: 12, color: '#000', fontWeight: 400, textAlign: 'center', fontFamily: "GOTHIC" }}>
                            04/04
                        </td>
                    </tr>
                })}
            </Table>
        </div>
    }
    // *********************************************************************************Exam-Wise-Analysis View End******************************************************

    // *********************************************************************************test-to-test View Start******************************************************

    const headerOfTestToTestAnalysisView = () => {
        let examDate1 = moment(exportDataList.examScheduleDate1).format('MM-DD-YYYY');
        let examDate2 = moment(exportDataList.examScheduleDate2).format('MM-DD-YYYY');
        return (<div>
            <tr><th colSpan="10" align="center" style={{ fontSize: 23, color: '#000', textAlign: 'center', fontFamily: "GOTHICB" }}>EXAM TO EXAM COMPARISON</th></tr>

            <tr>
                <th colSpan="10" align="left" style={{ fontSize: 12, color: '#000', textAlign: 'left', fontFamily: "GOTHIC", fontWeight: 400 }}><b>Recent Exam:</b> {examName + ` (${examDate1})`}
                </th>
            </tr>
            <tr>
                <th colSpan="10" align="left" style={{ fontSize: 12, color: '#000', textAlign: 'left', fontFamily: "GOTHIC", fontWeight: 400 }}><b>Previous Exam:</b> {dependentExamName + ` (${examDate2})`}
                </th>
            </tr>
            <tr>
                <th align="center" colSpan="3" style={{ background: '#ccc', color: '#000' }}>
                </th>
                <th align="center" colSpan="2" style={{ background: '#ccc', color: '#000', fontFamily: "GOTHICB", fontSize: 12, textAlign: 'center' }}>
                    Exam1:- {examDate1}
                </th>
                <th align="center" colSpan="2" style={{ background: '#ccc', color: '#000', fontFamily: "GOTHICB", fontSize: 12, textAlign: 'center' }}>
                    Exam2:- {examDate2}
                </th>
                <th align="center" colSpan="2" style={{ background: '#ccc', color: '#000', fontFamily: "GOTHICB", fontSize: 12, textAlign: 'center', textTransform: "capitalize" }}>DIFF
                </th>
                <th align="center" colSpan="1" style={{ background: '#ccc', color: '#000' }}>
                </th>
            </tr>

            <tr>
                <th align="center" style={{ background: '#ccc', color: '#000', fontFamily: "GOTHICB", fontSize: 12, textAlign: 'center', textTransform: "capitalize" }}>
                    Sr.No
                </th>
                {exportDataList && exportDataList.headers.map((header, idx) => {
                    return <th align="center" style={{ background: '#ccc', color: '#000', fontFamily: "GOTHICB", fontSize: 12, textAlign: 'center', textTransform: "capitalize" }}>
                        {header}
                    </th>
                })}
            </tr>
        </div>
        )
    }

    const testToTestView = () => {

        return (<div className="table-responsive" style={{ width: '100%', border: 'transparent', visibility: "hidden" }}>
            <Table striped bordered hover variant="dark" id='test-to-test-analysis' className="dark-light-common-table">

                {headerOfTestToTestAnalysisView()}

                {exportDataList && exportDataList.testToTestComparisonDetailsVM.map((student, idx) => {
                    const { marks, rank, studentCode, name, totalMarks1, rank1, totalMarks2, rank2, branch } = student;
                    return <tr>
                        <td align="center" style={{ fontSize: 12, color: '#000', fontWeight: 400, textAlign: 'center', fontFamily: "GOTHIC" }}>
                            {(idx + 1)}
                        </td>
                        <td align="center" style={{ fontSize: 12, color: '#000', fontWeight: 400, textAlign: 'center', fontFamily: "GOTHIC" }}>
                            {studentCode}
                        </td>
                        <td align="center" style={{ fontSize: 12, color: '#000', fontWeight: 400, textAlign: 'center', fontFamily: "GOTHIC" }}>
                            {name}
                        </td>
                        <td align="center" style={{ fontSize: 12, color: '#000', fontWeight: 400, textAlign: 'center', fontFamily: "GOTHIC" }}>
                            {totalMarks1}
                        </td>
                        <td align="center" style={{ fontSize: 12, color: '#000', fontWeight: 400, textAlign: 'center', fontFamily: "GOTHIC" }}>
                            {rank1}
                        </td>
                        <td align="center" style={{ fontSize: 12, color: '#000', fontWeight: 400, textAlign: 'center', fontFamily: "GOTHIC" }}>
                            {totalMarks2}
                        </td>
                        <td align="center" style={{ fontSize: 12, color: '#000', fontWeight: 400, textAlign: 'center', fontFamily: "GOTHIC" }}>
                            {rank2}
                        </td>
                        <td align="center" style={{ fontSize: 12, color: marks === 0 ? "#000" : '#000', fontWeight: 400, textAlign: 'center', fontFamily: "GOTHIC", background: marks < 0 ? '#fdd5d3' : marks === 0 ? 'transparent' : '#d8fecb' }}>
                            {marks}<IoIosArrowRoundUp />
                        </td>
                        <td align="center" style={{ fontSize: 12, color: rank === 0 ? "#000" : '#000', fontWeight: 400, textAlign: 'center', fontFamily: "GOTHIC", background: rank > 0 ? '#fdd5d3' : rank === 0 ? 'transparent' : '#d8fecb' }}>
                            {rank}
                        </td>
                        <td align="center" style={{ fontSize: 12, color: '#000', fontWeight: 400, textAlign: 'center', fontFamily: "GOTHIC" }}>
                            {branch.name}
                        </td>
                    </tr>
                })}

            </Table>
        </div>

        );
    }
    // *********************************************************************************test-to-test View End******************************************************


    return (

        <div>
            {analysisTypeFlag && getCallAnalysisView()}
        </div>

    );
}

export default ExportAnalysis;