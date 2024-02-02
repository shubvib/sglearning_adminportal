import React, { useState, useEffect } from 'react';
import { Accordion, Card, Modal, Spinner, Dropdown, Button, InputGroup, FormControl, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { GrDocumentVerified } from 'react-icons/gr';
import { ToastContainer, toast } from 'react-toastify';
import CommonFunctions from '../../../utils/CommonFunctions';
import SelectableContext from "react-bootstrap/SelectableContext";
import { Api } from '../../../services';
import { UrlConfig } from '../../../config';
import { TiStar } from 'react-icons/ti';
import moment from 'moment';

const AkcBkcPreviewModal = (props) => {
    const { showAkcBkcPreviewModal, closeAkcBkcPreviewModal, examPreviewData, ExamScheduleId, MetaDetaForAkcBkc } = props;
    const [questionList, setQuestionList] = useState([]);
    const [showLoader, setLoader] = useState(false);
    const [correctedKeys, setCorrectedKeys] = useState(0);
    const [correctedKey, setCorrectedKey] = useState(null)
    const [isEnableWrongAnswerChk, setEnableWrongAnswerChk] = useState(false);
    const [showWrongKeyConfirmation, setShowWrongKeyConfirmation] = useState(false);
    const [subPopUpLoader, setSubPopUpLoader] = useState(false);
    let interval;
    // **********************************************************************Use Effect*********************************************
    useEffect(() => {
        if ((examPreviewData) && showAkcBkcPreviewModal) {
            generateQuestionList();
            enableDisableWrongAnswerCheckbox();
        }
        let script;
        if (showAkcBkcPreviewModal) {
            script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/mathjax@3.0.1/es5/tex-mml-chtml.js";
            script.id = 'MathJax-script';
            script.async = true;
            document.body.appendChild(script);
        } else {
            setQuestionList([])
            // document.getElementById("MathJax-script").remove();
        }
        console.log('MetaDetaForAkcBkc', MetaDetaForAkcBkc);
    }, [examPreviewData, showAkcBkcPreviewModal, MetaDetaForAkcBkc])

    useEffect(() => {
        console.log('ExamScheduleId', ExamScheduleId);
    }, [ExamScheduleId])

    useEffect(() => {
        // let examPeriod = new Date(MaxTimeSchedule);
        // console.log('examPeriod1', examPeriod);
        console.log('MetaDetaForAkcBkc', MetaDetaForAkcBkc)
    }, [MetaDetaForAkcBkc])
    // *************************************************************************generate Question List**************************************************************//
    const generateQuestionList = () => {
        if (!examPreviewData) return null;
        const { questions } = examPreviewData;
        let generatedArray = [];
        let queList = [];
        if (questions) {
            examPreviewData && examPreviewData.subjects.map((sub, ind) => {
                let obj = [];
                questions.map((que, i) => {
                    (que.subjects[0] && que.subjects[0].name === sub.name) && obj.push(que);
                });
                generatedArray.push(obj);
                return true;
            });
        }
        queList.push(generatedArray);
        setQuestionList(queList);
    }

    const enableDisableWrongAnswerCheckbox = () => {
        if (!examPreviewData) return null;
        const { duration, lastScheduleDate } = examPreviewData;
        let bufferTimeInMinutes = MetaDetaForAkcBkc.bufferTimeInMinutes;
        let currentDateTime = new Date();
        let examPeriod = new Date(MetaDetaForAkcBkc.MaxTimeSchedule);
        examPeriod.setMinutes(examPeriod.getMinutes() + duration + bufferTimeInMinutes);
        let availableTime = moment(examPeriod).diff(moment(currentDateTime), 'minutes');
        if (availableTime <= 0) {
            setEnableWrongAnswerChk(true);
        } else {
            // interval = setInterval(autoEnable, 1 * 60 * 1000);
        }
        console.log('MaxTimeSchedule', MetaDetaForAkcBkc.MaxTimeSchedule);
        console.log('availableTime', availableTime * 60 * 1000);
    }

    const autoEnable = () => {
        console.log('interval')
        // if (showAkcBkcPreviewModal && availableTime <= 0) {
        //     clearInterval(interval);
        //     alert('enalbed');
        //     setEnableWrongAnswerChk(true);
        //     console.log('test over after 10 sec');
        // }
    }

    // ****************************************Clear States**********************************
    const [keyCorrectionLoader, setKeyCorrectionLoader] = useState(false);
    const clearStates = () => {
        setQuestionList([]);
        setCorrectedKey("");
        setCorrectedKeys(0);
        clearInterval(interval);
    }

    const handleKeyCorrection = (qType, examId, questionId, subjectIndex, questionIndex) => {
        setKeyCorrectionLoader(true);
        console.log('Fields', qType, examId, correctedKey, questionId)
        const AnswerKey = correctedKey;
        let finalAnswer = null;
        if (qType === 2) {
            finalAnswer = AnswerKey.split('');
            console.log('finalAnswer', finalAnswer);
        } else {
            finalAnswer = [AnswerKey];
        }
        setCorrectedKey('');
        const payload = {
            "examScheduleId": `${ExamScheduleId}`,
            "examId": `${examId}`,
            "questions": [
                {
                    "id": `${questionId}`,
                    "answerKey":
                        finalAnswer

                }
            ]
        }
        finalAnswer && Api.postApi(UrlConfig.apiUrls.answerKeyCorrection, payload)
            .then((response) => {
                console.log('response', response);
                // setCorrectedKey('');
                toast.success('Key Updated Successfully !');
                let a = questionList;
                // a[0][subjectIndex][questionIndex].newAnswerKey = [finalAnswer];
                a[0][subjectIndex][questionIndex].isCorrected = false;
                setQuestionList(a);
                setCorrectedKeys(correctedKeys + 1);
                setShowWrongKeyConfirmation(false);
                setKeyCorrectionLoader(false);
            })
            .catch((error) => {
                const errorMessage = CommonFunctions.apiErrorMessage(error);
                console.log('errorMessage', errorMessage)
                toast(errorMessage, {
                    type: "error",
                });
                setKeyCorrectionLoader(false);
            })

    }

    const handleWrongQuetion = (examId, questionId, subjectIndex, questionIndex) => {
        const payload = {
            "examScheduleId": `${ExamScheduleId}`,
            "examId": `${examId}`,
            "questionIds": [questionId]
        }
        setSubPopUpLoader(true);
        Api.postApi(UrlConfig.apiUrls.markQuestionsAsWrong, payload)
            .then((response) => {
                console.log('response', response);
                setCorrectedKey('');
                toast.error('Marked as Wrong !');
                console.log('questionList', questionList);
                questionList[0][subjectIndex][questionIndex].isMarkedAsWrong = true;
                questionList[0][subjectIndex][questionIndex].isWrongCorrected = false;
                setShowWrongKeyConfirmation(false);
                setSubPopUpLoader(false);
            })
            .catch((error) => {
                const errorMessage = CommonFunctions.apiErrorMessage(error);
                console.log('errorMessage', errorMessage)
                toast(errorMessage, {
                    type: "error",
                });
                setSubPopUpLoader(false);
            });
    }


    const WrongKeyConfirmation = (examId, questionId, i, idx, queMarks) => {
        console.log('examId', examId);
        console.log('questionId', questionId);
        return (
            <div className="modal-main-dark">
                <Modal show={showWrongKeyConfirmation} onHide={() => setShowWrongKeyConfirmation(false)} size="sm" className="modal-dark confirmation-modal-dark" centered>
                    {
                        subPopUpLoader && <div className="loader">
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </div>
                    }
                    <ToastContainer autoClose={5000} position="top-right" className="tost-dark-container" style={{ borderRadius: 5, fontFamily: 'GOTHIC' }} />
                    <div className="modal-title-box">
                        <h3>Confirmation Pop-Up</h3>
                    </div>
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="confirmation-content">
                            <p>You have marked This Question/Option as a Wrong !</p>
                            <p>All students will get +{`${queMarks}`} marks.</p>
                            <span><label><sup><TiStar /></sup>Note: </label>This action can not be rollbacked.</span>
                            <div className="final-confirm-box">
                                <h4>Do you want To Continue</h4>
                                <Button variant="secondary" className="closeBtn" onClick={() => setShowWrongKeyConfirmation(false)} >No</Button>
                                <Button variant="primary" className="uploadeBtn update-que-btn" onClick={() => {
                                    handleWrongQuetion(examId, questionId, i, idx);
                                }} >Yes</Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
    // ********************************************************************************Main Return **********************************************************************
    return (
        <div>

            {window.MathJax.Hub.Queue(
                ["Typeset", window.MathJax.Hub, 'math-panel']
            )}
            <Modal show={showAkcBkcPreviewModal} onHide={() => {
                clearStates();
                closeAkcBkcPreviewModal();
            }} size="lg" className="modal-dark akc-bkc-preview-modal-dark">
                <ToastContainer autoClose={5000} position="top-right" className="tost-dark-container" style={{ borderRadius: 5, fontFamily: 'GOTHIC' }} />
                {showLoader &&
                    <div className="loader">
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </div>
                }
                <div className="modal-title-box">
                    <h3><GrDocumentVerified />Key Corrections</h3>
                </div>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <div className="akc-bkc-preview-box">
                        {/* *******************Actual Preview Data********************* */}
                        <div className="akc-bkc-accordian-preview-box">
                            <div className="bkc-akc-header">{examPreviewData && <span>{examPreviewData.name}</span>}
                                {/* <span>Last Updated On:12/08/2020 </span> */}
                            </div>
                            <Accordion defaultActiveKey="">
                                {questionList && questionList.length > 0 && questionList[0].map((d, i) => {
                                    return <div key={`queKey_${i}`}>
                                        {
                                            <div>
                                                <Accordion.Toggle eventKey={i} as={Card.Header}>
                                                    {(examPreviewData && examPreviewData.subjects && examPreviewData.questions) && <span dangerouslySetInnerHTML={{ __html: examPreviewData.subjects[i].name }} />}
                                                </Accordion.Toggle>
                                                <Accordion.Collapse eventKey={i}>
                                                    <div className="accordian-content-box">
                                                        <div className="akc-bkc-filter-box">
                                                            <div className="row">
                                                                <div className="col-sm-5">
                                                                    <div className="count-box">
                                                                        <p><label>Total Corrected Keys: </label> <span>{correctedKeys}</span></p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <table className="common-table-dark">
                                                            <tbody>
                                                                <tr>
                                                                    <div className="header-box">
                                                                        <tr>
                                                                            <th style={{ width: "5%" }}>
                                                                                <span>Sr.No</span>
                                                                            </th>
                                                                            <th style={{ width: "55%" }}>
                                                                                <span>Questions</span>
                                                                            </th>

                                                                            <th style={{ width: "10%", textAlign: 'center' }}>
                                                                                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-bottom" className="common-tooltip black-toolip">Original Answer</Tooltip>}>
                                                                                    <span>BKC</span>
                                                                                </OverlayTrigger>
                                                                            </th>

                                                                            <th style={{ width: "10%", textAlign: 'center' }}>
                                                                                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-bottom" className="common-tooltip black-toolip">Corrected Answer</Tooltip>}>
                                                                                    <span>AKC</span>
                                                                                </OverlayTrigger>
                                                                            </th>
                                                                            <th style={{ width: "10%", textAlign: 'center' }}>
                                                                                <span>Wrong Question/Options</span>
                                                                            </th>

                                                                            <th style={{ width: "10%", textAlign: 'center' }}>

                                                                            </th>


                                                                        </tr>
                                                                    </div>
                                                                    <div className="scroll-body">
                                                                        {d.map((sub, idx) => {
                                                                            let backgroundColor = sub.isMarkedAsWrong === true ? '#ecc0c0' : '';
                                                                            if (!sub) return null;
                                                                            let qText = CommonFunctions.filterMarkup(sub.questionText);
                                                                            return (

                                                                                <div key={`subjKey_${idx}`}>

                                                                                    <tr color="#ecc0c0" style={{ backgroundColor: `${backgroundColor}` }}>
                                                                                        <td width="5%">
                                                                                            <span className="td-span">{idx + 1}.</span>
                                                                                        </td>
                                                                                        <td width="55%">
                                                                                            <div className="question-box">
                                                                                                {qText && <p style={{ display: "flex", flexDirection: "column", color: "darkcyan", marginTop: "3px" }}><span> {sub.questionType === 0 ? "Not Defined" : sub.questionType === 1 ? "Single Choice" :
                                                                                                    sub.questionType === 2 ? "Multiple Choice" : sub.questionType === 3 ? "Subjective" :
                                                                                                        sub.questionType === 4 ? "Comprehensive" : "Numeric"
                                                                                                }</span> <span className="question-text" dangerouslySetInnerHTML={{ __html: qText }} /></p>}
                                                                                                {/* questionType */}

                                                                                                {(sub.questionType === 1 || sub.questionType === 2 || sub.questionType === 4) && <ul className="question-options-box">
                                                                                                    {sub.options.map((o, i) => {
                                                                                                        let oText = CommonFunctions.filterMarkup(o.value)
                                                                                                        return (
                                                                                                            <>
                                                                                                                <li key={`optionKey_${i}`}>{oText && <p>
                                                                                                                    <span className="options-text" dangerouslySetInnerHTML={{ __html: oText }} /></p>}</li>
                                                                                                            </>
                                                                                                        )
                                                                                                    })}
                                                                                                </ul>}
                                                                                            </div>
                                                                                        </td>
                                                                                        <td width="10%" style={{ textAlign: 'center' }}>
                                                                                            <span className="option-selected">[{sub.answerKey}]</span>
                                                                                        </td>
                                                                                        <td width="10%" style={{ textAlign: 'center' }}>
                                                                                            {(sub.questionType === 1 || sub.questionType === 4) ?
                                                                                                (
                                                                                                    // For Single Choice and Comprehensive
                                                                                                    <div className="drop-down-box">
                                                                                                        <SelectableContext.Provider value={false}>
                                                                                                            <Dropdown>
                                                                                                                {/*  */}
                                                                                                                <Dropdown.Toggle variant="btn btn-primary"
                                                                                                                    disabled={sub.isMarkedAsWrong === true ? true : false}
                                                                                                                >
                                                                                                                    {sub.correctedAnswerKey ? sub.correctedAnswerKey : sub.answerKey}
                                                                                                                </Dropdown.Toggle>
                                                                                                                <Dropdown.Menu>
                                                                                                                    {sub.options.map((o, i) => {
                                                                                                                        // let oText = CommonFunctions.filterMarkup(o.value)
                                                                                                                        return (
                                                                                                                            <>
                                                                                                                                <Dropdown.Item
                                                                                                                                    value={o.key}
                                                                                                                                    key={`$optionAkc_${i}`}
                                                                                                                                    disabled={sub.isMarkedAsWrong === true ? true : false}
                                                                                                                                    onSelect={() => {
                                                                                                                                        console.log('AnswerKey', sub.answerKey)
                                                                                                                                        sub.correctedAnswerKey = o.key;
                                                                                                                                        console.log('correctedAnswerKey', sub.correctedAnswerKey)
                                                                                                                                        if (sub.correctedAnswerKey !== sub.answerKey[0]) {
                                                                                                                                            sub.isCorrected = true;
                                                                                                                                            setCorrectedKey(o.key);
                                                                                                                                            setCorrectedKeys(correctedKeys + 0)
                                                                                                                                        } else if (sub.correctedAnswerKey === sub.answerKey[0]) {
                                                                                                                                            sub.isCorrected = false;
                                                                                                                                            setCorrectedKey('');
                                                                                                                                            setCorrectedKeys(correctedKeys - 0)
                                                                                                                                        }
                                                                                                                                        setQuestionList({ ...d })
                                                                                                                                        setQuestionList(questionList)
                                                                                                                                    }}
                                                                                                                                >{o.key}</Dropdown.Item>
                                                                                                                            </>
                                                                                                                        )
                                                                                                                    })}
                                                                                                                </Dropdown.Menu>
                                                                                                            </Dropdown>
                                                                                                        </SelectableContext.Provider>
                                                                                                    </div>) : (sub.questionType === 2) ?
                                                                                                    (
                                                                                                        // For Multiple Choice Question
                                                                                                        <div>
                                                                                                            {sub.options.map((option, i) => {
                                                                                                                return (
                                                                                                                    <div key={`optionDiv${i}`} className="form-check form-check-neonBlack form-check-akc-bkc">
                                                                                                                        <label className="form-check-label">
                                                                                                                            <input type="checkbox"
                                                                                                                                className="form-check-input"
                                                                                                                                key={`$optionAkc_${i}`}
                                                                                                                                disabled={sub.isMarkedAsWrong === true ? true : false}
                                                                                                                                value={option.key}
                                                                                                                                onClick={(e) => {
                                                                                                                                    if (correctedKey.includes(e.target.value)) {
                                                                                                                                        let a = correctedKey;
                                                                                                                                        let s = e.target.value;
                                                                                                                                        let p = a.replace(s, '');
                                                                                                                                        setCorrectedKey(p);
                                                                                                                                        console.log('correct1', correctedKey);
                                                                                                                                    } else {
                                                                                                                                        let a = correctedKey.concat(e.target.value);
                                                                                                                                        setCorrectedKey(a);
                                                                                                                                        console.log('correct', correctedKey);
                                                                                                                                        if (!sub.isWrongCorrected && !sub.isCorrected || sub.isCorrected === false) {
                                                                                                                                            setCorrectedKeys(correctedKeys + 0)
                                                                                                                                            sub.isCorrected = true;
                                                                                                                                        }
                                                                                                                                    }

                                                                                                                                }}

                                                                                                                            />
                                                                                                                            <i className="input-helper"></i>
                                                                                                                            <span className="option-key"> {option.key}</span>
                                                                                                                        </label>
                                                                                                                    </div>

                                                                                                                )
                                                                                                            })}
                                                                                                        </div>
                                                                                                    )
                                                                                                    :
                                                                                                    (
                                                                                                        // For Subjective And Numeric Question
                                                                                                        <div className="question-input-box">
                                                                                                            <div className="form-group">
                                                                                                                <input type="answerKey" id="answerKey" className="form-control"
                                                                                                                    name="answerKey"
                                                                                                                    value={correctedKey}
                                                                                                                    disabled={sub.isMarkedAsWrong === true ? true : false}
                                                                                                                    onChange={(e) => {
                                                                                                                        if (e.target.value === '') {
                                                                                                                            sub.correctedAnswerKey = e.target.value;
                                                                                                                            sub.isCorrected = false;
                                                                                                                            setCorrectedKey(sub.correctedAnswerKey)
                                                                                                                        } else {
                                                                                                                            sub.correctedAnswerKey = e.target.value
                                                                                                                            sub.isCorrected = true;
                                                                                                                            setCorrectedKey(sub.correctedAnswerKey)
                                                                                                                        }
                                                                                                                    }}
                                                                                                                    onBlur={(e) => {

                                                                                                                    }}
                                                                                                                />
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    )
                                                                                            }
                                                                                        </td>

                                                                                        <td width="10%" style={{ textAlign: 'center' }}>
                                                                                            <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-bottom" className="common-tooltip black-toolip">{sub.isWrongCorrected ? "Marked as a Wrong Question/Option" :
                                                                                                "Mark if Question/Option is Wrong"}</Tooltip>}>
                                                                                                <div className={`${isEnableWrongAnswerChk ? 'form-check form-check-neonBlack' : 'form-check form-check-neonBlack disabled'}`} >
                                                                                                    <label className="form-check-label text-muted">


                                                                                                        <input id={sub.id} key={sub.id}
                                                                                                            defaultChecked={sub.isMarkedAsWrong}
                                                                                                            type="checkbox" className="form-check-input"
                                                                                                            disabled={sub.isMarkedAsWrong === true ? true : false}
                                                                                                            value={sub.isWrongCorrected ? sub.isWrongCorrected : false}
                                                                                                            onChange={(e) => {
                                                                                                                if (sub.isWrongCorrected) {
                                                                                                                    sub.isWrongCorrected = !sub.isWrongCorrected;
                                                                                                                } else {
                                                                                                                    sub.isWrongCorrected = true;
                                                                                                                }
                                                                                                                if (sub.isWrongCorrected === true) {
                                                                                                                    setCorrectedKeys(correctedKeys + 1);
                                                                                                                } else if (sub.isWrongCorrected === false) {
                                                                                                                    // sub.isWrongCorrected = false;
                                                                                                                    setCorrectedKeys(correctedKeys - 1);
                                                                                                                }
                                                                                                                setQuestionList({ ...sub });
                                                                                                                setQuestionList(questionList);
                                                                                                            }}
                                                                                                        />

                                                                                                        <i className="input-helper"></i>
                                                                                                    </label>
                                                                                                </div>
                                                                                            </OverlayTrigger>
                                                                                        </td>

                                                                                        <td width="10%" style={{ textAlign: 'center' }}>
                                                                                            {((sub.isCorrected || sub.isWrongCorrected) && keyCorrectionLoader === false) ?
                                                                                                <Button id={sub.id} variant="primary" className=" uploadeBtn update-que-btn"
                                                                                                    onClick={() => {

                                                                                                        console.log('Fields', examPreviewData.id, sub.answerKey, sub.id);
                                                                                                        sub.isWrongCorrected === true ? setShowWrongKeyConfirmation(true) : handleKeyCorrection(sub.questionType, examPreviewData.id, sub.id, i, idx);
                                                                                                        // sub.isCorrected = false;
                                                                                                    }}
                                                                                                >
                                                                                                    Update Question
                                                                                                 </Button> :
                                                                                                ((sub.isCorrected || sub.isWrongCorrected) && keyCorrectionLoader === true) ?
                                                                                                    <Spinner size="sm" animation="grow" variant="error" /> :
                                                                                                    <div></div>
                                                                                            }
                                                                                        </td>
                                                                                        {sub.isWrongCorrected && showWrongKeyConfirmation &&
                                                                                            WrongKeyConfirmation(examPreviewData.id, sub.id, i, idx, sub.positiveMarks)}
                                                                                    </tr>
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </Accordion.Collapse>
                                            </div>
                                        }
                                    </div>
                                })}

                            </Accordion>
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" className="closeBtn" onClick={() => {
                        clearStates();
                        closeAkcBkcPreviewModal();
                    }}>
                        Close
            </Button>
                    {/* <Button variant="primary" className="uploadeBtn">
                Update
            </Button> */}
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default AkcBkcPreviewModal;