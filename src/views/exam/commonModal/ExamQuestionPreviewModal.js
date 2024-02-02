import React, { useState, useEffect } from 'react';
import { Accordion, Card, Modal, Spinner } from 'react-bootstrap';
import { GrDocumentUser } from 'react-icons/gr';
import { AiOutlineDoubleRight } from 'react-icons/ai'
import { ToastContainer, toast } from 'react-toastify';
import { FaMarkdown } from 'react-icons/fa';
import CommonFunctions from '../../../utils/CommonFunctions';
import { Api } from '../../../services';
import Axios from 'axios';
import { API } from '../../../config/UrlConfig';
// import { MathComponent } from 'mathjax-react';
//const MathJax = require('@matejmazur/react-mathjax')
// import MathJax from '@matejmazur/react-mathjax'

const ExamQuestionPreviewModal = (props) => {
    const { showExamPreviewModal, CloseExamPreviewModal, examPreviewData, mappedSubjects, DocumentSubjects, Subjects } = props;
    const [questionList, setQuestionList] = useState([]);
    const [subList, setSubList] = useState([]);
    // let i = 0;
    const [showLoader, setLoader] = useState(false);
    const [previewSubj, setPreviewSubj] = useState();
    const [loaderForPreview, setLoaderForPreview] = useState(false);
    const [rawQuestionsArray, setRawQuestionsArray] = useState(null)
    // const [show, setShow] = useState(false);
    // const handleClose = () => setShow(false);
    // const handleShow = () => setShow(true);

    // *****************************************UseEffects************************************************************************
    useEffect(() => {
        if ((examPreviewData) && showExamPreviewModal) {
            if (!examPreviewData.rawQuestionSetDataUrl) {
                setLoaderForPreview(true);
                examPreviewData && getQuestionList(examPreviewData.questionSetDataUrl);
                setPreviewSubj(examPreviewData.subjects);
            } else {
                setLoaderForPreview(true);
                examPreviewData && getQuestionList(examPreviewData.rawQuestionSetDataUrl);
                setPreviewSubj(examPreviewData.subjects);
            }
        }
        return () => {
            setPreviewSubj([]);
            setQuestionList([]);
            setRawQuestionsArray(null);
        }

    }, [examPreviewData, showExamPreviewModal])


    // ***********************************************Functions********************************************
    const getQuestionList = (dataURL) => {
        // Api.getApi(dataURL)
        // Axios.get(dataURL)
        Axios({
            method: 'GET',
            url: dataURL,
            // timeout: 420000,
            headers: {
                'Content-Type': 'application/json',
                accept: 'application/json',
                crossDomain: true,
                'cache-control': 'no-cache',

            }
        })
            .then((response) => {
                console.log("response of question list", response);
                const { subjectwizeQuestions } = response;
                if (response) {
                    if (subjectwizeQuestions) {
                        setQuestionList(subjectwizeQuestions);
                        setLoaderForPreview(false);
                    } else {
                        generateQuestioList(response)
                    }
                }
                else {
                    setLoaderForPreview(false);
                    const errorMessage = 'No data found.';
                    toast(errorMessage, {
                        type: "error",
                    });
                }
                setLoaderForPreview(false);
            })
            .catch((error) => {
                const errorMessage = CommonFunctions.apiErrorMessage(error);
                toast(errorMessage, {
                    type: "error",
                });
                setLoaderForPreview(false);
            })
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
    function renameKeys(obj) {
        const keyValues = Object.keys(obj).map(key => {
            const newKey = CommonFunctions.toCamaleCase(key);
            return { [newKey]: obj[key] };
        });
        return Object.assign({}, ...keyValues);
    }

    const generateQuestioList = (rawQuestionsData) => {
        if (!rawQuestionsData) {
            setLoaderForPreview(false);
            return null
        };
        // const { rawQuestions, questions } = examPreviewData;
        console.log(rawQuestionsData);
        let generatedArray = [];
        let queList = [];
        if (rawQuestionsData) {
            let rawQuestions = []
            rawQuestionsData.map((rawQue) => {
                const renamedObj = renameKeys(rawQue);
                rawQuestions.push(renamedObj);
            });
            setRawQuestionsArray(rawQuestions)
            //To Find Unique Subjects
            let SubListarr = [];
            mappedSubjects && mappedSubjects.length > 0 ? SubListarr.push(mappedSubjects.filter((x, i, a) => a.indexOf(x) === i)) : SubListarr.push(Subjects.filter((x, i, a) => a.indexOf(x) === i))
            SubListarr[0].map((d, i) => {
                subList.push(d);
            })
            let generatedSubIdx = [];
            //To Find Mapping Relation
            subList && subList.map((uniqueSub, idx) => {
                let subidx = [];
                //when mapping required
                mappedSubjects && mappedSubjects.length > 0 ? mappedSubjects.map((d, i) => {
                    if (uniqueSub === d) {
                        subidx.push(i);
                    }

                }) :
                    //when mapping not required
                    Subjects && Subjects.map((d, i) => {
                        if (uniqueSub === d) {
                            subidx.push(i);
                        }

                    })

                generatedSubIdx.push(subidx);
            });
            console.log("subject Listtts", subList);

            //To Find Unique Subjects Question List
            subList && subList.length > 0 && subList.map((uniqueSub, idx) => {
                let obj = [];
                generatedSubIdx && generatedSubIdx[idx].map((subIndx, i) => {
                    rawQuestions.map((que, ind) => {
                        //when mapping done
                        if (mappedSubjects && mappedSubjects.length > 0) {
                            if (DocumentSubjects[subIndx] === que.subject) {
                                obj.push(que);
                            }
                        }
                        //when no mapping is done
                        else {
                            (que.subject && que.subject === uniqueSub) && obj.push(que);
                        }
                    })
                })
                generatedArray.push(obj);
                return true;
            })
            queList.push(generatedArray);
            setQuestionList(queList);
        }
        setLoaderForPreview(false);
        // if (questions) {
        //     examPreviewData && examPreviewData.subjects.map((sub, ind) => {
        //         console.log("generated array of questionsss", generatedArray);
        //         let obj = [];
        //         questions.map((que, i) => {
        //             (que.subjects[0] && que.subjects[0].name === sub.name) && obj.push(que);
        //         });
        //         generatedArray.push(obj);
        //         return true;
        //     });
        // }



    }

    // ***************************************************Main View************************************************************
    return (
        <div>
            {
                (window && window.MathJax) &&
                window.MathJax.Hub.Queue(
                    ["Typeset", window.MathJax.Hub, 'math-panel']
                )
            }
            {examPreviewData &&
                <Modal show={showExamPreviewModal}
                    onHide={() => CloseExamPreviewModal()}
                    size="lg" className="modal-dark exam-question-preview-modal-dark" backdrop="static">
                    <ToastContainer autoClose={5000} position="top-right" className="tost-dark-container" style={{ borderRadius: 5, fontFamily: 'GOTHIC' }} />
                    {showLoader &&
                        <div className="loader">
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </div>
                    }
                    {examPreviewData.rawQuestionSetDataUrl &&
                        <div className="modal-title-box">
                            <h3><GrDocumentUser />Question Paper Preview</h3>
                        </div>
                    }
                    {examPreviewData.questionSetDataUrl &&
                        <div className="modal-title-box">
                            <h3><GrDocumentUser />Question Paper Preview</h3>
                        </div>
                    }
                    <Modal.Header closeButton>
                    </Modal.Header>
                    {!loaderForPreview ? <Modal.Body>
                        <div className="exam-question-preview-box">
                            {examPreviewData && examPreviewData.rawQuestionSetDataUrl &&
                                <div className="exam-question-preview-header">
                                    <span>{examPreviewData.name}</span><span>No.of Questions: {(rawQuestionsArray) ? rawQuestionsArray.length : ''}</span>
                                </div>
                            }
                            {examPreviewData && examPreviewData.questionSetDataUrl &&
                                <div className="exam-question-preview-header">
                                    <span>{examPreviewData.name}</span><span>No.of Questions: {examPreviewData.noOfQuestion}</span>
                                </div>
                            }
                            <div className="accordian-preview-box">
                                <Accordion>
                                    {questionList && questionList.length > 0 && (examPreviewData.rawQuestionSetDataUrl ? questionList[0] : questionList).map((d, i) => {
                                        return <div key={`queKey_${i}`}>
                                            {<div >
                                                <Accordion.Toggle eventKey={i} as={Card.Header}>
                                                    {(examPreviewData && examPreviewData.subjects && examPreviewData.rawQuestionSetDataUrl) && <span dangerouslySetInnerHTML={{ __html: subList[i] }} />}
                                                    {examPreviewData && previewSubj && previewSubj.length > 0 && <span
                                                        dangerouslySetInnerHTML={{ __html: previewSubj[i].name }} />}
                                                    {<span>{`(${examPreviewData.rawQuestionSetDataUrl ? d.length : d.questionCount})`}</span>}
                                                </Accordion.Toggle>
                                                <Accordion.Collapse eventKey={i}>
                                                    <div className="accordian-content-box">
                                                        {(examPreviewData.rawQuestionSetDataUrl ? d : d.questions).map((sub, idx) => {
                                                            if (!sub) return null;
                                                            let questionType = questionTypeChecker(sub.questionType)
                                                            const questionText = sub.questionText ? sub.questionText : sub.question ? sub.question : '';

                                                            let qText = questionText ? CommonFunctions.filterMarkup(questionText) : ''

                                                            return <div className="question-box" key={`subjKey_${idx}`}>
                                                                <p className="question-type">{examPreviewData && examPreviewData.rawQuestionSetDataUrl ? sub.questionType : questionType}</p>
                                                                <div className="question-wrapper">
                                                                    <div>
                                                                        <span className="question-number">{idx + 1}.</span>
                                                                    </div>
                                                                    <div className="question-text">
                                                                        {qText && <p> <span className="options-text" dangerouslySetInnerHTML={{ __html: qText ? qText : 'blank' }} /></p>}
                                                                    </div>
                                                                </div>

                                                                {(sub.answerKey || sub.answer) &&
                                                                    <div className="question-options-selected-final">
                                                                        <p style={{ alignItems: "center" }}>
                                                                            <span className="options-text">Correct Answer: </span>
                                                                            <span className="options-number">{examPreviewData && examPreviewData.rawQuestionSetDataUrl ? sub.answer : sub.answerKey}</span> </p>
                                                                    </div>
                                                                }
                                                                {(sub.questionType !== 3 || sub.questionType !== 5) && sub.options.map((o, i) => {
                                                                    let oText = CommonFunctions.filterMarkup(o.value)
                                                                    return (
                                                                        <div className="question-options-selected" key={`optioKey_${i}`}>
                                                                            {oText && <p><span className="options-number">({o.key})</span><span className="options-text" dangerouslySetInnerHTML={{ __html: oText ? oText : 'blank' }} /></p>}
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        })}
                                                    </div>
                                                </Accordion.Collapse>
                                            </div>}
                                        </div>
                                    })}
                                </Accordion>
                            </div>
                        </div>
                    </Modal.Body> : <div style={{ textAlign: "center", padding: 10 }}><Spinner animation="border" role="status" style={{ color: '#fff' }}>
                        <span className="sr-only" > Loading...</span >
                    </Spinner ></div>}
                </Modal>}
        </div >
    )
}

export default ExamQuestionPreviewModal;