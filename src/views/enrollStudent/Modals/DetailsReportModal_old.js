import React, { useRef, useState, useEffect } from 'react';
import { Button, Modal, Tab, Nav, Accordion, Card } from 'react-bootstrap';
import CommonFunctions from '../../../utils/CommonFunctions';
import { BsCheckCircle, BsCircle } from "react-icons/bs";
import { MdCancel } from "react-icons/md";
import moment from 'moment';
import { Doughnut, Bar } from 'react-chartjs-2';

const DetailsReportModal = (props) => {

    const options = {
        responsive: true,
        legend: {
            display: false,
        },

    }

    const { showDetailsReportModal, closeDetailsReportModal, detailedReport, reportList } = props;
    //*************************************************chart states declaration start ******************************************************/
    const [flag, setFlag] = useState(false);
    const [timeTaken, setTimeTaken] = useState({
        hours: 0,
        min: 0,
        sec: 0,
    });
    //*************************************************Dynamic color selection states start *************************************************/
    const [colorSelection, setColorSelection] = useState({
        rightAnswerColor: '#228B22',
        WrongAnswersColor: '#FF0000',
        NotAttendedColor: '#FFFF00',
    });

    //*************************************************Dynamic color selection states end *************************************************/

    const [doughnutData, setDoughnutData] = useState({
        datasets: [{
            data: [""],
            backgroundColor: [""]
        }],
        labels: [
            'Right Answers',
            'Wrong Answers',
            'Not Attended'
        ]

    })


    const [barData, setBarData] = useState({
        datasets: [
            {
                label: 'My First dataset',
                borderColor: colorSelection.rightAnswerColor,
                borderWidth: 1,
                hoverBackgroundColor: colorSelection.rightAnswerColor,
                hoverBorderColor: colorSelection.rightAnswerColor,
                data: []
            },
            {
                label: 'My second dataset',
                borderColor: colorSelection.WrongAnswersColor,
                borderWidth: 1,
                hoverBackgroundColor: colorSelection.WrongAnswersColor,
                hoverBorderColor: colorSelection.WrongAnswersColor,
                data: []
            }, {
                label: 'My third dataset',
                borderColor: colorSelection.NotAttendedColor,
                borderWidth: 1,
                hoverBackgroundColor: colorSelection.NotAttendedColor,
                hoverBorderColor: colorSelection.NotAttendedColor,
                data: []
            }
        ],
        labels: [""]
    })

    //*************************************************chart states declaration End *******************************************************/

    useEffect(() => {
        console.log(detailedReport, 'detailedReport');
        if (detailedReport) {
            let endTime = moment(detailedReport.attemptEndDateTime).format("LTS");
            let startTime = moment(detailedReport.attemptStartDateTime).format("LTS");
            let time;
            endTime = moment(endTime, ["hh:mm:ss A"]).format("HH:mm:ss");
            startTime = moment(startTime, ["hh:mm:ss A"]).format("HH:mm:ss");
            let splitTime1 = endTime.split(':');
            let splitTime2 = startTime.split(':');

            endTime = (splitTime1[0] * 60 * 60) + (splitTime1[1] * 60) + (splitTime1[2] * 1);
            startTime = (splitTime2[0] * 60 * 60) + (splitTime2[1] * 60) + (splitTime2[2] * 1);
            time = endTime - startTime;
            console.log("hours", (splitTime1[2] * 1) - (splitTime2[2] * 1));
            let duration = moment.duration(time, "second");
            const { _data } = duration;
            const { seconds, minutes, hours } = _data;
            setTimeTaken({
                ...timeTaken,
                hours: hours,
                min: minutes,
                sec: seconds,
            });
        }

    }, [detailedReport])

    //*************************************************chart useEffect start*********************************************************/

    useEffect(() => {
        detailedReport && counts && setDoughnutData({ ...doughnutData, datasets: [{ data: [counts.rightAnswer, counts.wrongAnswers, counts.Unattended], backgroundColor: [colorSelection.rightAnswerColor, colorSelection.WrongAnswersColor, colorSelection.NotAttendedColor] }] });


        let subjects = [];
        reportList && reportList.score.subjectwizeScore.map((sub, idx) => {
            subjects.push(sub.subjectName);
        });


        subjects.length > 0 && setBarData({
            ...barData, labels: subjects,
        });
        detailedReport && detailedReport.subjectwizeQuestions.map((sub, subIndex) => {
            let notVisited = 0;
            let right = 0;
            let wrong = 0;
            sub.questions.map((que, i) => {
                if (que.studentAnswerStatus === 0 || 1 || 2) {
                    que.studentAnswerStatus === 1 && (right = right + 1);
                    que.studentAnswerStatus === 2 && (wrong = wrong + 1);
                    que.studentAnswerStatus === 0 && (notVisited = notVisited + 1);
                }
            });
            sub.rightQuestions = right;
            sub.wrongQuestions = wrong;
            sub.notVisitedQuestions = notVisited;

            barData.datasets[0].data.push(sub.rightQuestions);
            barData.datasets[1].data.push(sub.wrongQuestions);
            barData.datasets[2].data.push(sub.notVisitedQuestions);
            if (subIndex === (detailedReport.subjectwizeQuestions.length - 1)) {
                setFlag(true);
            }
        });

    }, [])


    useEffect(() => {
        doughnutData.datasets[0].backgroundColor = [colorSelection.rightAnswerColor, colorSelection.WrongAnswersColor, colorSelection.NotAttendedColor]
    }, [colorSelection])


    //*************************************************chart useEffect End *******************************************************/

    //****************Main View**************************************/
    console.log(reportList, 'reportList');
    console.log(detailedReport, 'detailedReport');
    if (!reportList && !detailedReport) {
        return false;
    }
    let counts = {
        rightAnswer: 0,
        wrongAnswers: 0,
        Unattended: 0,
        totalQuations: 0,

    }

    detailedReport.subjectwizeQuestions.map((sub, subIndex) => {
        let notVisited = 0;
        let right = 0;
        let wrong = 0;
        sub.questions.map((que, i) => {
            if (que.studentAnswerStatus === 0 || 1 || 2) {
                counts.totalQuations = counts.totalQuations + 1;
                que.studentAnswerStatus === 1 && (counts.rightAnswer = counts.rightAnswer + 1);
                que.studentAnswerStatus === 2 && (counts.wrongAnswers = counts.wrongAnswers + 1);
                que.studentAnswerStatus === 0 && (counts.Unattended = counts.Unattended + 1);
                // for quastion conut
                que.studentAnswerStatus === 1 && (right = right + 1);
                que.studentAnswerStatus === 2 && (wrong = wrong + 1);
                que.studentAnswerStatus === 0 && (notVisited = notVisited + 1);
            }
        });
        sub.rightQuestions = right;
        sub.wrongQuestions = wrong;
        sub.notVisitedQuestions = notVisited;


    });
    //****************************************************Chart Functionality start *****************************************************/



    const getDougnutChart = () => {
        return <div>
            <Doughnut
                width="20%"
                height="5%"
                data={doughnutData} />

        </div>
    }
    const getGroupBarData = () => {
        return <Bar
            width="20%"
            height="5%"
            data={barData} options={options} />
    }
    //****************************************************Chart Functionality End *****************************************************/

    //********************************************Chart Functionality of Dynamic color start ************************************************/
    const getColor = () => {

        return <div className="color-selection-main-wrapper">
            <label className="common-label-for-color-selection" htmlFor="Right Answer">Right Answer<input id="Right Answer" type="color" name="rightAnswerColor" value={colorSelection.rightAnswerColor} onChange={e => setColor(e, 0)} /></label>

            <label className="common-label-for-color-selection" htmlFor="Wrong Answer">Wrong Answer<input id="Wrong Answer" type="color" name="WrongAnswersColor" value={colorSelection.WrongAnswersColor} onChange={e => setColor(e, 1)} /></label>

            <label className="common-label-for-color-selection" htmlFor="Not Attended">Not Attended<input id="Not Attended" type="color" name="NotAttendedColor" value={colorSelection.NotAttendedColor} onChange={e => setColor(e, 2)} /></label>

        </div>
    }


    const setColor = (e, i) => {
        doughnutData.datasets[0].backgroundColor[i] = e.target.value;

        barData.datasets[i].hoverBorderColor = e.target.value;

        barData.datasets[i].hoverBackgroundColor = e.target.value;

        barData.datasets[i].borderColor = e.target.value;

        setColorSelection({ ...colorSelection, [e.target.name]: e.target.value });

    }
    //********************************************Chart Functionality of Dynamic color End **************************************************/

    return (
        <div className="modal-main-dark">
            {window.MathJax.Hub.Queue(
                ["Typeset", window.MathJax.Hub, 'math-panel']
            )}
            <Modal show={showDetailsReportModal} onHide={() => closeDetailsReportModal()} centered size="md" className="modal-dark details-report-modal" backdrop="static" >
                <Modal.Header closeButton>
                    <div className="modal-title-box">
                        <span>Details Report for {detailedReport.exam.name}</span>
                    </div>
                </Modal.Header>

                <Modal.Body>
                    <div className="details-report-tab">
                        <Tab.Container defaultActiveKey="first">
                            <Nav variant="pills" className="header-main-nav">
                                <Nav.Item>
                                    <Nav.Link eventKey="first">Analysis</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="second">Right Answer</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="third">Wrong Answer</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="fourth">Not Attempted</Nav.Link>
                                </Nav.Item>
                                
                            </Nav>
                            <Tab.Content>
                                <Tab.Pane eventKey="first">
                                    <div className="answer-box">
                                        {detailedReport && <div className="user-Data-report" style={{ display: "flex", justifyContent: "space-between" }}>
                                            <div className="user-Data-report-sub">
                                                <div>
                                                    <span> {(detailedReport.exam.organizerAccountShortName).toUpperCase()}</span>
                                                </div>
                                                <div>
                                                    <span style={{ textTransform: "capitalize" }}>{(detailedReport.exam.name).toLowerCase()}</span>
                                                </div>
                                                <div>
                                                    <span style={{ textTransform: "capitalize" }}>{(detailedReport.student.userInfo.name).toLowerCase()}</span>
                                                    <span style={{ marginLeft: "5px" }}>[{detailedReport.student.code}]</span>
                                                </div>
                                            </div>
                                            <div className="user-Data-report-sub">
                                                <div>
                                                    <span>{moment(detailedReport.attemptEndDateTime).format("DD MMM YYYY")}</span>
                                                </div>
                                                <div>
                                                    <span>{moment(detailedReport.attemptEndDateTime).format("LT")}</span>
                                                </div>
                                            </div>
                                        </div>}
                                        <table style={{ padding: 20 }} className="common-table-report" cellspacing="0" width="100%">
                                            <thead>
                                                <tr>
                                                    <th width="20%">
                                                        <p>Subjects</p>
                                                    </th>
                                                    <th width="20%">
                                                        <p >Out of Marks</p>
                                                    </th>
                                                    <th width="20%">
                                                        <p>Positive</p>
                                                    </th>
                                                    <th width="20%">
                                                        <p>Negative</p>
                                                    </th>
                                                    <th width="20%">
                                                        <p>Total</p>
                                                    </th>
                                                </tr>
                                                {reportList && reportList.score.subjectwizeScore.map((sub, subIndex) => {
                                                    console.log(sub,"sub")
                                                    return <tr>
                                                        <td width="20%">
                                                            <p>{sub.subjectName}</p>
                                                        </td>
                                                        <td width="20%">
                                                            <p>{sub.outOfMarks}</p>
                                                        </td>
                                                        <td width="20%">
                                                            <p>{sub.positiveMarks}</p>
                                                        </td>
                                                        <td width="20%">
                                                            <p>{sub.negativeMarks}</p>
                                                        </td>
                                                        <td width="20%">
                                                            <p>{sub.scoredMarks}</p>
                                                        </td>
                                                    </tr>
                                                })
                                                }

                                            </thead>
                                        </table>

                                        <table className="total-marks-table" cellspacing="0" width="100%">
                                            <tr>
                                                <td width="20%">
                                                    <p></p>
                                                </td>
                                                <td className="amt-td-center"
                                                    width="60%">
                                                    <p>Total Marks = {reportList && reportList.score.scoredMarks} </p>
                                                </td>
                                                <td className="amt-td-right"
                                                    width="0%">
                                                    <p>   </p>
                                                </td>
                                                <td width="20%">
                                                    <p></p>
                                                </td>
                                            </tr>
                                        </table>
                                        <div>
                                            {/* {getColor()} */}
                                            {getDougnutChart()}
                                        </div>


                                        <table className="table-report-3" cellspacing="0">
                                            <thead>
                                                <tr>
                                                    <td className="table-report-3-td-1">
                                                        <p className="top-p">{counts.totalQuations}</p>
                                                        <p className="bottom-p">Questions</p>
                                                    </td>
                                                    <td className="table-report-3-td-1">
                                                        <p className="top-p">{counts.rightAnswer}</p>
                                                        <p className="bottom-p">Right</p>
                                                    </td>
                                                    <td className="table-report-3-td-2" >
                                                        <p className="top-p">{counts.wrongAnswers}</p>
                                                        <p className="bottom-p">Wrong</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="table-report-3-td-1">
                                                        <p className="top-p">{counts.Unattended}</p>
                                                        <p className="bottom-p">Unattended</p>
                                                    </td>
                                                    <td className="table-report-3-td-1">
                                                        <p className="top-p"> {reportList && reportList.score.percentage.toFixed(2)}%</p>
                                                        <p className="bottom-p">Accuracy</p>
                                                    </td>
                                                    <td className="table-report-3-td-2">
                                                        <p className="top-p">{`${timeTaken.hours.toString().padStart(2, '0')}:${timeTaken.min.toString().padStart(2, '0')}:${timeTaken.sec.toString().padStart(2, '0')}`} </p>
                                                        <p className="bottom-p">Time Taken</p>
                                                    </td>
                                                </tr>
                                            </thead>
                                        </table>
                                        <div>
                                            {flag && getGroupBarData()}
                                        </div>
                                        <table className="table-report-4" cellspacing="0" width="100%">
                                            <thead>
                                                <tr>
                                                    <th className="table-report-th-1" width="25%">
                                                        <p>Subjects</p>
                                                    </th>
                                                    <th className="table-report-th-2" width="25%">
                                                        <p>Out of Marks</p>
                                                    </th>
                                                    <th className="table-report-th-2" width="25%">
                                                        <p>Score</p>
                                                    </th>
                                                    <th className="table-report-th-2" width="25%">
                                                        <p>Accuracy</p>
                                                    </th>
                                                    <th className="table-report-th-1" width="25%">
                                                        <p>Remarks</p>
                                                    </th>
                                                </tr>
                                            </thead>
                                            {reportList && reportList.score.subjectwizeScore.map((sub, subIndex) => {

                                                return <tr>
                                                    <td className="table-report-td-1" width="25%">
                                                        <p>{sub.subjectName}</p>
                                                    </td>
                                                    <td className="table-report-td-2" width="25%">
                                                        <p>{sub.outOfMarks}</p>
                                                    </td>
                                                    <td className="table-report-td-2" width="25%">
                                                        <p>{sub.scoredMarks}</p>
                                                    </td>
                                                    <td className="table-report-td-2" width="25%">
                                                        <p>{sub.percentage}%</p>
                                                    </td>
                                                    <td className="table-report-td-2" width="25%">
                                                        <p>{(sub.percentage < 30 ? 'Poor' : (sub.percentage > 60 ? 'Excellent' : 'Good'))}</p>
                                                    </td>
                                                </tr>
                                            })
                                            }

                                        </table>
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey="second">
                                    <div className="answer-box">
                                        <Accordion>

                                            {detailedReport.subjectwizeQuestions.map((sub, i) => {
                                                return <div>{<div><Accordion.Toggle as={Card.Header} eventKey={i}>
                                                    <span>{sub.subjectName} [ {sub.rightQuestions} ]</span>
                                                </Accordion.Toggle>
                                                    <Accordion.Collapse eventKey={i}>
                                                        <>
                                                            {sub.rightQuestions != 0 && <div className="details-report-content-accordian">
                                                                {
                                                                    sub.questions.map((que, queIndex) => {
                                                                        if (que.studentAnswerStatus != 1) return;
                                                                        let qText = CommonFunctions.filterMarkup(que.questionText);
                                                                        let qExp = CommonFunctions.filterMarkup(que.explanation);

                                                                        return <div className="question-box">
                                                                            <p>
                                                                                <span className="question-number">{queIndex + 1}.</span>
                                                                                <span className="question-text">
                                                                                    {qText && <span dangerouslySetInnerHTML={{ __html: qText ? qText : 'blank' }} />}
                                                                                </span>
                                                                            </p>
                                                                            <p>
                                                                                {que.questionType === 5 && <span> {que.answerKey[0]}</span>}
                                                                            </p>
                                                                            {
                                                                                que.options.map((option, opIndex) => {
                                                                                    let oText = CommonFunctions.filterMarkup(option.value);
                                                                                    console.log(que, 'queastions');
                                                                                    let ansKey = '-1';
                                                                                    if (que.questionType === 1) {
                                                                                        que.answerKey && que.answerKey.length === 1 && (ansKey = que.answerKey[0]);
                                                                                    } else {
                                                                                        if (que.answerKey && que.answerKey.length > 0) {
                                                                                            que.answerKey.map(ak => {
                                                                                                ak === option.key && (ansKey = option.key);
                                                                                            })
                                                                                        }
                                                                                    }

                                                                                    console.log(option, 'option');

                                                                                    return <ul>
                                                                                    
                                                                                        {que.studentAnswerStatus === 5 || 0 ?
                                                                                            <span className="option-number">{que.answerKey && que.answerKey.length && que.answerKey[0]}</span>

                                                                                            : < li >
                                                                                                {option.key.trim() === ansKey.trim() ?
                                                                                                    <span className="right-check"><BsCheckCircle /></span> :
                                                                                                    <span className="empty-check"><BsCircle /></span>
                                                                                                }
                                                                                                <span className="option-number">({option.key})</span>
                                                                                                <span className="option-text">
                                                                                                    {oText && <span dangerouslySetInnerHTML={{ __html: oText ? oText : 'blank' }} />}
                                                                                                </span>
                                                                                            </li>}
                                                                                    </ul>
                                                                                })
                                                                            }
                                                                            <p>
                                                                                <span className="solution"> Solution :</span>  {qExp && <span dangerouslySetInnerHTML={{ __html: qExp ? qExp : 'blank' }} />}
                                                                            </p>
                                                                        </div>
                                                                    })
                                                                }
                                                            </div>
                                                            }
                                                        </>
                                                    </Accordion.Collapse>
                                                </div>}</div>
                                            })
                                            }
                                        </Accordion>
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey="third">
                                    <div className="answer-box">
                                        <Accordion>
                                            {detailedReport.subjectwizeQuestions.map((sub, i) => {
                                                return <div>{<div><Accordion.Toggle as={Card.Header} eventKey={i}>
                                                    <span>{sub.subjectName} [ {sub.wrongQuestions} ]</span>
                                                </Accordion.Toggle>
                                                    <Accordion.Collapse eventKey={i}>
                                                        <>
                                                            {sub.wrongQuestions != 0 && <div className="details-report-content-accordian">
                                                                {
                                                                    sub.questions.map((que, queIndex) => {
                                                                        if (que.studentAnswerStatus != 2) return;
                                                                        let qText = CommonFunctions.filterMarkup(que.questionText);
                                                                        let qExp = CommonFunctions.filterMarkup(que.explanation);
                                                                        return <div className="question-box">
                                                                            <p>
                                                                                <span className="question-number">{queIndex + 1}.</span>
                                                                                <span className="question-text">
                                                                                    {qText && <span dangerouslySetInnerHTML={{ __html: qText ? qText : 'blank' }} />}
                                                                                </span>
                                                                            </p>
                                                                            <p>
                                                                                {que.questionType === 5 && <span> {que.answerKey[0]}</span>}
                                                                            </p>
                                                                            {
                                                                                que.options.map((option, opIndex) => {
                                                                                    let oText = CommonFunctions.filterMarkup(option.value);
                                                                                    let ansKey = '-1';
                                                                                    let userAns = '-2';
                                                                                    // studentAnswer
                                                                                    if (que.questionType === 1) {
                                                                                        if (que.answerKey && que.answerKey.length === 1) {
                                                                                            (ansKey = que.answerKey[0]);
                                                                                            if (que.studentAnswer && que.studentAnswer.length === 1) {
                                                                                                userAns = que.studentAnswer[0];
                                                                                            }

                                                                                        }

                                                                                    } else if (que.questionType === 5 || 0) {
                                                                                        //

                                                                                    } else {

                                                                                        if (que.answerKey && que.answerKey.length > 0) {
                                                                                            que.answerKey.map(ak => {
                                                                                                ak === option.key && (ansKey = option.key);
                                                                                            });
                                                                                            if (que.studentAnswer && que.studentAnswer.length > 0) {
                                                                                                que.studentAnswer.map((ansKey) => {
                                                                                                    if (option.key === ansKey) {
                                                                                                        userAns = ansKey;
                                                                                                    }
                                                                                                });
                                                                                            }
                                                                                        }
                                                                                    }

                                                                                    return <ul>

                                                                                        <li>
                                                                                            {userAns.trim() === option.key.trim() ?
                                                                                                <span className="wrong-check"><MdCancel /></span> : ansKey.trim() === option.key.trim() ? <span className="right-check"><BsCheckCircle /></span> : <span className="empty-check"><BsCircle /></span>
                                                                                            }



                                                                                            <span className="option-number">({option.key})</span>
                                                                                            <span className="option-text">
                                                                                                {oText && <span dangerouslySetInnerHTML={{ __html: oText ? oText : 'blank' }} />}
                                                                                            </span>
                                                                                        </li>

                                                                                    </ul>
                                                                                })
                                                                            }
                                                                            <p>
                                                                                <span className="solution"> Solution :</span> {qExp && <span dangerouslySetInnerHTML={{ __html: qExp ? qExp : 'blank' }} />}
                                                                            </p>
                                                                        </div>
                                                                    })
                                                                }
                                                            </div>
                                                            }
                                                        </>
                                                    </Accordion.Collapse>
                                                </div>}</div>
                                            })
                                            }
                                        </Accordion>
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey="fourth">
                                    <div className="answer-box">
                                        <Accordion>
                                            {detailedReport.subjectwizeQuestions.map((sub, i) => {
                                                return <div>{<div><Accordion.Toggle as={Card.Header} eventKey={i}>
                                                    <span>{sub.subjectName} [ {sub.notVisitedQuestions} ] </span>
                                                </Accordion.Toggle>
                                                    <Accordion.Collapse eventKey={i}>
                                                        <>
                                                            {sub.notVisitedQuestions != 0 && <div className="details-report-content-accordian">
                                                                {
                                                                    sub.questions.map((que, queIndex) => {
                                                                        if (que.studentAnswerStatus != 0) return;
                                                                        let qText = CommonFunctions.filterMarkup(que.questionText);
                                                                        let qExp = CommonFunctions.filterMarkup(que.explanation);
                                                                        return <div className="question-box">
                                                                            <p>
                                                                                <span className="question-number">{queIndex + 1}.</span>
                                                                                <span className="question-text">
                                                                                    {qText && <span dangerouslySetInnerHTML={{ __html: qText ? qText : 'blank' }} />}
                                                                                </span>
                                                                            </p>
                                                                            <p>
                                                                                {que.questionType === 5 && <span> {que.answerKey[0]}</span>}
                                                                            </p>

                                                                            {
                                                                                que.options.map((option, opIndex) => {
                                                                                    let oText = CommonFunctions.filterMarkup(option.value);
                                                                                    let ansKey = '-1';
                                                                                    if (que.questionType === 1) {
                                                                                        que.answerKey && que.answerKey.length === 1 && (ansKey = que.answerKey[0]);
                                                                                    } else {
                                                                                        if (que.answerKey && que.answerKey.length > 0) {
                                                                                            que.answerKey.map(ak => {
                                                                                                ak === option.key && (ansKey = option.key);
                                                                                            })
                                                                                        }
                                                                                    }
                                                                                    return <ul>
                                                                                        <li>
                                                                                            {
                                                                                                option.key.trim() === ansKey.trim() ?
                                                                                                    <span className="right-check"><BsCheckCircle /></span> :
                                                                                                    <span className="empty-check"><BsCircle /></span>
                                                                                            }
                                                                                            <span className="option-number">({option.key})</span>
                                                                                            <span className="option-text">

                                                                                                {oText && <span dangerouslySetInnerHTML={{ __html: oText ? oText : 'blank' }} />}
                                                                                            </span>
                                                                                        </li>
                                                                                    </ul>
                                                                                })
                                                                            }
                                                                            <p>
                                                                                <span className="solution"> Solution:</span> {qExp && <span dangerouslySetInnerHTML={{ __html: qExp ? qExp : 'blank' }} />}
                                                                            </p>
                                                                        </div>
                                                                    })
                                                                }

                                                            </div>

                                                            }
                                                        </>
                                                    </Accordion.Collapse>
                                                </div>}</div>
                                            })
                                            }
                                        </Accordion>
                                    </div>
                                </Tab.Pane>
                            </Tab.Content>
                        </Tab.Container>
                    </div>
                </Modal.Body >
                {/* <Modal.Footer>
                    <Button variant="secondary" className="closeBtn">
                        Cancel
                    </Button>
                    <Button variant="secondary" className="uploadeBtn">
                        Detail Report
                    </Button>

                </Modal.Footer> */}
            </Modal >
        </div >
    )
}
export default DetailsReportModal