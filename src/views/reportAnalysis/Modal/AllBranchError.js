import React, { useEffect, useState } from 'react';
import { Button, Modal, Accordion, Spinner, Card } from 'react-bootstrap';
import { UrlConfig } from '../../../config';
import { Api } from '../../../services';
import CommonFunctions from '../../../utils/CommonFunctions';
import { toast } from 'react-toastify';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import { IoIosArrowDropupCircle } from "react-icons/io";
import 'chartjs-plugin-datalabels';

const QuestionWiseErrorAnalysis = (props) => {
    const { showErrorListModal, resetErrorListModal, examScheduleId } = props;
    const [subjectQuestionsData, setSubjectQuestionsData] = useState(null);

    const [loader, setLoader] = useState(false);

    const [colorSelection, setColorSelection] = useState({
        rightAnswerColor: '#228B22',
        WrongAnswersColor: '#FF0000',
        NotAttendedColor: '#ff5805',
    });


    useEffect(() => {

    })
    useEffect(() => {
        setLoader(true);
        getQuestList();
    }, [examScheduleId])
    const getDougnutChart = (questionData, index, tag) => {
        // questionData = { correctAnswer: 10, wrongAnswer: 30, unattemptAnswer: 60 }

        let dict = {
            datasets: [{
                data: [questionData.correctAnswer, questionData.wrongAnswer, questionData.unattemptAnswer],
                backgroundColor: [colorSelection.rightAnswerColor, colorSelection.WrongAnswersColor, colorSelection.NotAttendedColor],
            }],
            labels: [
                `Right Answers: ${questionData.correctAnswer}% (${questionData.rightAnswerCount})`,
                `Wrong Answers: ${questionData.wrongAnswer}% (${questionData.wrongAnswerCount})`,
                `Not Attempted: ${questionData.unattemptAnswer}% (${questionData.unAttemptAnswerCount})`
            ],
        };
        let option1 = {
            legend: {
                display: false,
            },
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        var dataset = data.datasets[tooltipItem.datasetIndex];
                        var meta = dataset._meta[Object.keys(dataset._meta)[0]];
                        var total = meta.total;
                        var currentValue = dataset.data[tooltipItem.index];
                        var percentage = parseFloat((currentValue / total * 100).toFixed(1));
                        return '';

                    },
                    title: function (tooltipItem, data) {
                        return data.labels[tooltipItem[0].index];
                    }
                }
            },
            plugins: {
                datalabels: {
                    display: true,
                    // color: 'white'

                    color: function (context) {
                        var index = context.dataIndex;
                        var value = context.dataset.data[index];
                        return value <= 0 ? 'transparent' :  // draw negative values in red
                            index % 2 ? 'white' :    // else, alternate values in blue and green
                                'white';
                    },
                    formatter: function (value, context) {
                        return Math.round(value) + '%';
                    },
                    font: function (context) {
                        var index = context.dataIndex;
                        var value = context.dataset.data[index];
                        return { size: value < 10 ? "3" : "8", weight: '400' }
                    }
                }
            },
            // responsive: true, hover: false
        }
        let option = {
            legend: {
                display: true,
                // position: "right",
                labels: {
                    // fontColor: 'rgb(255, 99, 132)',
                },
            },
            scaleLabel: {
                display: true
            },
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        var dataset = data.datasets[tooltipItem.datasetIndex];
                        var meta = dataset._meta[Object.keys(dataset._meta)[0]];
                        var total = meta.total;
                        var currentValue = dataset.data[tooltipItem.index];
                        var percentage = parseFloat((currentValue / total * 100).toFixed(1));
                        return '';

                    },
                    title: function (tooltipItem, data) {
                        return data.labels[tooltipItem[0].index];
                    }
                }
            },
            plugins: {
                datalabels: {
                    display: true,
                    // color: 'white'

                    color: function (context) {
                        var index = context.dataIndex;
                        var value = context.dataset.data[index];
                        return value <= 0 ? 'transparent' :  // draw negative values in red
                            index % 2 ? 'white' :    // else, alternate values in blue and green
                                'white';
                    },
                    formatter: function (value, context) {
                        return Math.round(value) + '%';
                    },

                    font: function (context) {
                        var index = context.dataIndex;
                        var value = context.dataset.data[index];
                        return { size: value < 10 ? "8" : "18", weight: '400' }
                    }

                }
            },
            scaleShowLabels: true
        }
        // Doughnut.defaults.global.title.display = true;


        return tag === 0 ? <div>


            <Doughnut
                width="15%"
                height="6%"
                data={dict}
                options={option1}
            />
        </div> : <Doughnut
                width="20%"
                height="5%"
                data={dict}
                options={option}
                scaleShowLabels={true}
            />;
    }

    const questionTypeChecker = (questionType) => {
        switch (questionType) {
            case 0:
                return "Not Defined"
            case 1:
                return "Single Choice";
            case 2:
                return "Multiple Choice";
            case 3:
                return "Subjective";
            case 4:
                return "Comprehensive";
            case 5:
                return "Numeric";
            default:
                break;
        }
    }

    const getQuestList = () => {
        var payload = { ExamScheduleId: examScheduleId }
        Api.getApi(UrlConfig.apiUrls.allBranchErrorList, payload)
            .then((response) => {
                console.log("responseee of error list", response)
                if (response) {
                    setLoader(false);
                    const { data } = response;
                    // const { questionSubject } = data;
                    setSubjectQuestionsData(data);
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
    const Loadder = () => {
        return <Spinner animation="border" role="status">
            <span className="sr-only" > Loading...</span >
        </Spinner>
    }
    return (
        <Modal show={showErrorListModal} onHide={() => { resetErrorListModal(); }} size="lg" className="modal-dark all-branches-error-modal-dark" centered backdrop="static">
            <Modal.Header closeButton>
                {subjectQuestionsData && <div className="header-popup-title-Wrapper"><div className="modal-title-box">
                    <h3>{subjectQuestionsData.examName}</h3>
                </div>
                    <div className="all-Branches-Header">
                        <span className="all-Branches-Header-Title">No.of Questions: <span className="all-Branches-Header-Title-sub">{subjectQuestionsData.noOfQuestions}</span></span>
                        <span className="all-Branches-Header-Title">Total Students: <span className="all-Branches-Header-Title-sub">{subjectQuestionsData.noOfStudents}</span></span>
                        <span className="all-Branches-Header-Title">Present Students: <span className="all-Branches-Header-Title-sub">{subjectQuestionsData.noOfPresentStudents}</span></span>
                    </div>
                </div>}
            </Modal.Header>

            <Modal.Body>

                <div className="allBranchesErrorContentWrapper">

                    <div style={{ textAlign: 'center' }}>
                        {loader && Loadder()}
                    </div>
                    <Accordion>
                        {subjectQuestionsData && subjectQuestionsData.questionSubject.map((subjects, subjectIndex) => {
                            return <div><Accordion.Toggle eventKey={subjectIndex} >
                                <span>{subjects.subjectName}<span>[{subjects.questionStats.length}]</span></span>
                            </Accordion.Toggle>

                                <Accordion.Collapse eventKey={subjectIndex}>
                                    <div className="accoridan-content-wrapper-allbranches">
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div className="allbranches-boxes-instrustion">
                                                    <div className="allbranches-boxes-instrustion-sub right-ans">
                                                        <p><span></span><label>Right Answers</label></p>
                                                    </div>
                                                    <div className="allbranches-boxes-instrustion-sub wrong-ans">
                                                        <p><span></span><label>Wrong Answers</label></p>
                                                    </div>
                                                    <div className="allbranches-boxes-instrustion-sub not-attended">
                                                        <p><span></span><label>Not Attempted</label></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="allbranches-combine-boxes">
                                            {/* <div className="row">
                                                <div className="col-sm-3">
                                                    <div className="allbranches-boxes"></div>
                                                </div>
                                            </div> */}
                                            <div className="row">
                                                {subjects.questionStats.map((question, index) => {
                                                    return <div className="col-sm-2">
                                                        <Link>
                                                            <div className="allbranches-boxes">
                                                                <div className="allbranches-boxes-header">
                                                                    <span>Q.{index + 1}</span>
                                                                    <span className="choise-span">{questionTypeChecker(question.questionType)}</span>
                                                                </div>
                                                                {getDougnutChart(question, index, 0)}
                                                            </div>
                                                        </Link>
                                                    </div>
                                                })
                                                }
                                            </div>
                                        </div>
                                        {subjects.questionStats.map((question, index) => {

                                            return <div className="question-paper-preview-content">
                                                <label>{questionTypeChecker(question.questionType)}</label>
                                                <div className="question-text-bx">
                                                    <span className="question-number">{index + 1}. </span>

                                                    <span className="question-text" dangerouslySetInnerHTML={{ __html: CommonFunctions.filterMarkup(question.questionText) }} />
                                                </div>
                                                <div className="correct-answer">
                                                    <p><span className="options-text">Correct Answer: </span><span className="options-number">{question.answerKey[0]}</span></p>
                                                </div>
                                                <div className="options-box-wrapper">
                                                    <div className="options-box">
                                                        {
                                                            question.optionVM.map((options, optionIndex) => {
                                                                return <p><span className="options-number">({options.key}) </span><span className="options-text" dangerouslySetInnerHTML={{ __html: CommonFunctions.filterMarkup(options.value) }} /></p>
                                                            })
                                                        }
                                                        {/* <p><span className="options-number">(A) </span><span className="options-text">Double of its first value</span></p>
                                                        <p><span className="options-number">(B) </span><span className="options-text">Double of its first value</span></p>
                                                        <p><span className="options-number">(C) </span><span className="options-text">Double of its first value</span></p>
                                                        <p><span className="options-number">(D) </span><span className="options-text">Double of its first value</span></p> */}
                                                    </div>
                                                    <div className="analysis-chart-box">
                                                        {getDougnutChart(question, index, 1)}
                                                    </div>
                                                </div>
                                            </div>
                                        })
                                        }
                                        {/* <div className="go-to-top">
                                            <Link><IoIosArrowDropupCircle /></Link>
                                        </div> */}
                                    </div>

                                </Accordion.Collapse>

                            </div>
                        })
                        }
                    </Accordion>
                    {/* <Accordion >
                        <Accordion.Toggle eventKey="0">
                            <span>Physics<span>[01]</span></span>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <div className="accoridan-content-wrapper-allbranches">
                                <div className="question-paper-preview-content">
                                    <label>Single Choice</label>
                                    <div className="question-text-bx">
                                        <span className="question-number">1.</span>
                                        <span className="question-text">
                                            Two identical positive charges are fixed on the 𝑦 -axis at equal distances from the origin 𝑂 . A negatively charged particle starts on the 𝑥 -axis, at a large distance from 𝑂 , moves along the 𝑥 - axis, passes through 𝑂 and moves far away from 𝑂 . Its acceleration 𝑎 is taken as positive along its direction of motion. The best graph between the particle’s acceleration and its 𝑥 - coordinate is represented by</span>
                                    </div>
                                    <div className="correct-answer">
                                        <p><span className="options-text">Correct Answer: </span><span className="options-number">C</span></p>
                                    </div>
                                    <div className="options-box-wrapper">
                                        <div className="options-box">
                                            <p><span className="options-number">(A) </span><span className="options-text">Double of its first value</span></p>
                                            <p><span className="options-number">(B) </span><span className="options-text">Double of its first value</span></p>
                                            <p><span className="options-number">(C) </span><span className="options-text">Double of its first value</span></p>
                                            <p><span className="options-number">(D) </span><span className="options-text">Double of its first value</span></p>
                                        </div>
                                        <div className="analysis-chart-box"></div>
                                    </div>
                                </div>
                            </div>
                        </Accordion.Collapse>
                    </Accordion> */}

                    {/* <Accordion >
                        <Accordion.Toggle eventKey="1">
                            <span>Physics<span>[01]</span></span>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="1">
                            <div className="accoridan-content-wrapper-allbranches">
                                <div className="question-paper-preview-content">
                                    <label>Single Choice</label>
                                    <div className="question-text-bx">
                                        <span className="question-number">1.</span>
                                        <span className="question-text">
                                            Two identical positive charges are fixed on the 𝑦 -axis at equal distances from the origin 𝑂 . A negatively charged particle starts on the 𝑥 -axis, at a large distance from 𝑂 , moves along the 𝑥 - axis, passes through 𝑂 and moves far away from 𝑂 . Its acceleration 𝑎 is taken as positive along its direction of motion. The best graph between the particle’s acceleration and its 𝑥 - coordinate is represented by</span>
                                    </div>
                                    <div className="correct-answer">
                                        <p><span className="options-text">Correct Answer: </span><span className="options-number">C</span></p>
                                    </div>
                                    <div className="options-box-wrapper">
                                        <div className="options-box">
                                            <p><span className="options-number">(A) </span><span className="options-text">Double of its first value</span></p>
                                            <p><span className="options-number">(B) </span><span className="options-text">Double of its first value</span></p>
                                            <p><span className="options-number">(C) </span><span className="options-text">Double of its first value</span></p>
                                            <p><span className="options-number">(D) </span><span className="options-text">Double of its first value</span></p>
                                        </div>
                                        <div className="analysis-chart-box"></div>
                                    </div>
                                </div>
                                <div className="question-paper-preview-content">
                                    <label>Single Choice</label>
                                    <div className="question-text-bx">
                                        <span className="question-number">1.</span>
                                        <span className="question-text">
                                            Two identical positive charges are fixed on the 𝑦 -axis at equal distances from the origin 𝑂 . A negatively charged particle starts on the 𝑥 -axis, at a large distance from 𝑂 , moves along the 𝑥 - axis, passes through 𝑂 and moves far away from 𝑂 . Its acceleration 𝑎 is taken as positive along its direction of motion. The best graph between the particle’s acceleration and its 𝑥 - coordinate is represented by</span>
                                    </div>
                                    <div className="correct-answer">
                                        <p><span className="options-text">Correct Answer: </span><span className="options-number">C</span></p>
                                    </div>
                                    <div className="options-box-wrapper">
                                        <div className="options-box">
                                            <p><span className="options-number">(A) </span><span className="options-text">Double of its first value</span></p>
                                            <p><span className="options-number">(B) </span><span className="options-text">Double of its first value</span></p>
                                            <p><span className="options-number">(C) </span><span className="options-text">Double of its first value</span></p>
                                            <p><span className="options-number">(D) </span><span className="options-text">Double of its first value</span></p>
                                        </div>
                                        <div className="analysis-chart-box"></div>
                                    </div>
                                </div>
                            </div>
                            
                        </Accordion.Collapse>
                    </Accordion> */}
                </div>
            </Modal.Body>
            {/* <Modal.Footer>
                <Button onClick={resetErrorListModal} className="closeBtn" variant='secondary'>Close</Button>
            </Modal.Footer> */}
        </Modal>
    );
}

export default QuestionWiseErrorAnalysis;