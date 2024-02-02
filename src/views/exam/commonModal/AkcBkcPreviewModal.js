import React, { useState, useEffect } from "react";
import {
  Accordion,
  Card,
  Modal,
  Spinner,
  Dropdown,
  Button,
  InputGroup,
  FormControl,
  Form,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { GrDocumentVerified } from "react-icons/gr";
import { ToastContainer, toast } from "react-toastify";
import CommonFunctions from "../../../utils/CommonFunctions";
import SelectableContext from "react-bootstrap/SelectableContext";
import { Api } from "../../../services";
import { UrlConfig } from "../../../config";
import { TiStar } from "react-icons/ti";
import moment from "moment";
import EnumConfig from "../../../config/EnumConfig";

const AkcBkcPreviewModal = (props) => {
  const {
    showAkcBkcPreviewModal,
    closeAkcBkcPreviewModal,
    examPreviewData,
    ExamScheduleId,
    MetaDetaForAkcBkc,
    subjectWiseQuestionList,
  } = props;
  const [questionList, setQuestionList] = useState([]);
  const [showLoader, setLoader] = useState(false);
  const [correctedKeys, setCorrectedKeys] = useState(0);
  const [correctedKey, setCorrectedKey] = useState("");
  const [isEnableWrongAnswerChk, setEnableWrongAnswerChk] = useState(false);
  const [showWrongKeyConfirmation, setShowWrongKeyConfirmation] =
    useState(false);
  const [subPopUpLoader, setSubPopUpLoader] = useState(false);
  const [subjectAndQustionIndex, setSubjectAndQustionIndex] = useState();
  const [textAnswer, setTextAnswer] = useState("");
  let interval;
  // **********************************************************************Use Effect*********************************************
  useEffect(() => {
    if (examPreviewData && showAkcBkcPreviewModal) {
      // generateQuestionList();
      enableDisableWrongAnswerCheckbox();
    }
    let script;
    if (showAkcBkcPreviewModal) {
      script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/mathjax@3.0.1/es5/tex-mml-chtml.js";
      script.id = "MathJax-script";
      script.async = true;
      document.body.appendChild(script);
    } else {
      setQuestionList([]);
      // document.getElementById("MathJax-script").remove();
    }
    console.log("MetaDetaForAkcBkc", MetaDetaForAkcBkc);
  }, [examPreviewData, showAkcBkcPreviewModal, MetaDetaForAkcBkc]);

  useEffect(() => {
    console.log("ExamScheduleId", ExamScheduleId);
  }, [ExamScheduleId]);

  useEffect(() => {
    console.log("MetaDetaForAkcBkc", MetaDetaForAkcBkc);
  }, [MetaDetaForAkcBkc]);

  const enableDisableWrongAnswerCheckbox = () => {
    if (!examPreviewData) return null;
    const { duration, lastScheduleDate } = examPreviewData;
    let bufferTimeInMinutes = MetaDetaForAkcBkc.bufferTimeInMinutes;
    let currentDateTime = new Date();
    let examPeriod = new Date(MetaDetaForAkcBkc.MaxTimeSchedule);
    examPeriod.setMinutes(
      examPeriod.getMinutes() + duration + bufferTimeInMinutes
    );
    let availableTime = moment(examPeriod).diff(
      moment(currentDateTime),
      "minutes"
    );
    if (availableTime <= 0) {
      setEnableWrongAnswerChk(true);
    } else {
      // interval = setInterval(autoEnable, 1 * 60 * 1000);
    }
    console.log("MaxTimeSchedule", MetaDetaForAkcBkc.MaxTimeSchedule);
    console.log("availableTime", availableTime * 60 * 1000);
  };

  // ****************************************Clear States**********************************
  const [keyCorrectionLoader, setKeyCorrectionLoader] = useState(false);
  const clearStates = () => {
    setQuestionList([]);
    setCorrectedKey("");
    setCorrectedKeys(0);
    setSubjectWiseQuestions(null);
    clearInterval(interval);
    setTextAnswer("");
  };

  const handleKeyCorrection = () => {
    console.log("This is handle key Correction Question Function ===>");
    setKeyCorrectionLoader(true);
    console.log("selectedQuestion", selectedQuestion);
    console.log("subjectAndQustionIndex", subjectAndQustionIndex);
    const AnswerKey = correctedKey;
    let finalAnswer = null;
    if (
      selectedQuestion.questionType ===
        EnumConfig.QuestionType.multipleChoice ||
      selectedQuestion.questionType === EnumConfig.QuestionType.singleChoice
    ) {
      finalAnswer = AnswerKey.split("").sort();
      console.log("finalAnswer", finalAnswer);
    } else {
      finalAnswer = [AnswerKey];
    }
    setCorrectedKey("");
    const payload = {
      examScheduleId: `${ExamScheduleId}`,
      examId: `${examPreviewData.id}`,
      questions: [
        {
          id: `${selectedQuestion.id}`,
          answerKey: finalAnswer,
        },
      ],
    };
    console.log("payload", payload);
    finalAnswer &&
      Api.postApi(UrlConfig.apiUrls.answerKeyCorrection, payload)
        .then((response) => {
          console.log("response", response);
          toast.success(
            "Key correction is being processed. Changes will reflect in 5 to 10 minutes !!"
          );
          let updateQuestions = subjectWiseQuestions;
          updateQuestions[subjectAndQustionIndex[0]].questions[
            subjectAndQustionIndex[1]
          ].isAnswerKeyCorrected = true;
          updateQuestions[subjectAndQustionIndex[0]].questions[
            subjectAndQustionIndex[1]
          ].newAnswerKey = [finalAnswer];
          updateQuestions[subjectAndQustionIndex[0]].questions[
            subjectAndQustionIndex[1]
          ].isCorrected = false;
          if (
            selectedQuestion.questionType ===
            EnumConfig.QuestionType.multipleChoice
          ) {
            updateQuestions[subjectAndQustionIndex[0]].questions[
              subjectAndQustionIndex[1]
            ].options.map((option, optionIndex) => {
              option.isChecked = false;
            });
          }
          setCorrectedKey("");
          setTextAnswer("");
          setSelectedQuestion(null);
          setCorrectedKeys(correctedKeys + 1);
          setShowWrongKeyConfirmation(false);
          setKeyCorrectionLoader(false);
          setSubjectWiseQuestions(updateQuestions);
        })
        .catch((error) => {
          const errorMessage = CommonFunctions.apiErrorMessage(error);
          console.log("errorMessage", errorMessage);
          toast(errorMessage, {
            type: "error",
          });
          setKeyCorrectionLoader(false);
        });
  };

  const handleWrongQuetion = () => {
    console.log("This is handle Wrong Question Function ===>");
    const payload = {
      examScheduleId: `${ExamScheduleId}`,
      examId: `${examPreviewData.id}`,
      questionIds: [selectedQuestion.id],
    };
    setSubPopUpLoader(true);
    Api.postApi(UrlConfig.apiUrls.markQuestionsAsWrong, payload)
      .then((response) => {
        console.log("response", response);
        setCorrectedKey("");
        toast.error("Marked as Wrong !");
        console.log("subjectWiseQuestionList", subjectWiseQuestionList);
        let updateQuestions = subjectWiseQuestions;
        updateQuestions[subjectAndQustionIndex[0]].questions[
          subjectAndQustionIndex[1]
        ].isMarkedAsWrong = true;
        updateQuestions[subjectAndQustionIndex[0]].questions[
          subjectAndQustionIndex[1]
        ].isWrongCorrected = false;
        setShowWrongKeyConfirmation(false);
        setCorrectedKey("");
        setSelectedQuestion(null);
        setSubjectWiseQuestions(updateQuestions);
        setSubPopUpLoader(false);
      })
      .catch((error) => {
        const errorMessage = CommonFunctions.apiErrorMessage(error);
        console.log("errorMessage", errorMessage);
        toast(errorMessage, {
          type: "error",
        });
        setSubPopUpLoader(false);
      });
  };

  const WrongKeyConfirmation = () => {
    console.log("examId");
    console.log("questionId");
    return (
      <div className="modal-main-dark">
        <Modal
          show={showWrongKeyConfirmation}
          onHide={() => setShowWrongKeyConfirmation(false)}
          size="sm"
          className="modal-dark confirmation-modal-dark"
          centered
        >
          {subPopUpLoader && (
            <div className="loader">
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </div>
          )}
          <ToastContainer
            autoClose={5000}
            position="top-right"
            className="tost-dark-container"
            style={{ borderRadius: 5, fontFamily: "GOTHIC" }}
          />
          <div className="modal-title-box">
            <h3>Confirmation Pop-Up</h3>
          </div>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <div className="confirmation-content">
              <p>You have marked This Question/Option as a Wrong !</p>
              <p>
                All students will get +{`${selectedQuestion.positiveMarks}`}{" "}
                marks.
              </p>
              <span>
                <label>
                  <sup>
                    <TiStar />
                  </sup>
                  Note:{" "}
                </label>
                This action can not be rollbacked.
              </span>
              <div className="final-confirm-box">
                <h4>Do you want To Continue</h4>
                <Button
                  variant="secondary"
                  className="closeBtn"
                  onClick={() => setShowWrongKeyConfirmation(false)}
                >
                  No
                </Button>
                <Button
                  variant="primary"
                  className="uploadeBtn update-que-btn"
                  onClick={() => {
                    handleWrongQuetion();
                  }}
                >
                  Yes
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  };

  const [subjectWiseQuestions, setSubjectWiseQuestions] = useState(null);
  useEffect(() => {
    console.log("subjectWiseQuestions", subjectWiseQuestions);
    setSubjectWiseQuestions(subjectWiseQuestionList);
  }, [subjectWiseQuestionList]);

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const questionTypeChecker = (questionType) => {
    // console.log('questionType', questionType);
    switch (questionType) {
      case 0:
        return "Not Defined";
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
  };
  useEffect(() => {
    console.log("correctedKey", correctedKey);
  }, [correctedKey]);

  useEffect(() => {
    console.log("selectedQuestion", selectedQuestion);
    console.log("examPreviewData", examPreviewData);
  }, [selectedQuestion]);
  // ********************************************************************************Main Return **********************************************************************
  return (
    <div>
      {window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, "math-panel"])}
      <Modal
        show={showAkcBkcPreviewModal}
        onHide={() => {
          clearStates();
          closeAkcBkcPreviewModal();
        }}
        size="lg"
        className="modal-dark akc-bkc-preview-modal-dark"
      >
        <ToastContainer
          autoClose={5000}
          position="top-right"
          className="tost-dark-container"
          style={{ borderRadius: 5, fontFamily: "GOTHIC" }}
        />
        {showLoader && (
          <div className="loader">
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
        )}
        <div className="modal-title-box">
          <h3>
            <GrDocumentVerified />
            Key Corrections
          </h3>
        </div>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="akc-bkc-preview-box">
            {/* *******************Actual Preview Data********************* */}
            <div className="akc-bkc-accordian-preview-box">
              <div className="bkc-akc-header">
                {examPreviewData && <span>{examPreviewData.name}</span>}
                {/* <span>Last Updated On:12/08/2020 </span> */}
              </div>
              <Accordion defaultActiveKey="">
                {subjectWiseQuestions &&
                  subjectWiseQuestions.length > 0 &&
                  subjectWiseQuestions.map((subjects, subjectIndex) => {
                    // console.log('subjectssssssssssssssss', subjects);
                    return (
                      <div key={`subjects_${subjectIndex}`}>
                        {
                          <div>
                            <Accordion.Toggle
                              eventKey={subjectIndex}
                              as={Card.Header}
                            >
                              {subjects && (
                                <span>
                                  {subjects.subjectName} (
                                  {subjects.questions.length})
                                </span>
                              )}
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey={subjectIndex}>
                              <div className="accordian-content-box">
                                {keyCorrectionLoader && (
                                  <div className="loader">
                                    <div className="loader-sub">
                                      {/* <Spinner animation="border" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </Spinner><br /> */}
                                      {/* <h3>Updating</h3> */}
                                      <div class="loader-under-accordion">
                                        <h3>Updating Answer Key...</h3>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                <div className="akc-bkc-filter-box">
                                  <div className="row">
                                    <div className="col-sm-12">
                                      <div
                                        className="count-box"
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <p>
                                          <label>Total Corrected Keys: </label>{" "}
                                          <span>{correctedKeys}</span>
                                        </p>
                                        <p>
                                          <svg height="10" width="10">
                                            <circle
                                              cx="4"
                                              cy="4"
                                              r="4"
                                              stroke="black"
                                              stroke-width="1"
                                              fill="greenyellow"
                                            />
                                          </svg>
                                          : Answer Key Corrected
                                        </p>
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
                                          <th style={{ width: "53%" }}>
                                            <span>Questions</span>
                                          </th>

                                          <th
                                            style={{
                                              width: "8%",
                                              textAlign: "center",
                                            }}
                                          >
                                            <OverlayTrigger
                                              placement="top"
                                              overlay={
                                                <Tooltip
                                                  id="tooltip-bottom"
                                                  className="common-tooltip black-toolip"
                                                >
                                                  Original Answer
                                                </Tooltip>
                                              }
                                            >
                                              <span>BKC</span>
                                            </OverlayTrigger>
                                          </th>

                                          <th
                                            style={{
                                              width: "10%",
                                              textAlign: "center",
                                            }}
                                          >
                                            <OverlayTrigger
                                              placement="top"
                                              overlay={
                                                <Tooltip
                                                  id="tooltip-bottom"
                                                  className="common-tooltip black-toolip"
                                                >
                                                  Corrected Answer
                                                </Tooltip>
                                              }
                                            >
                                              <span>AKC</span>
                                            </OverlayTrigger>
                                          </th>
                                          <th
                                            style={{
                                              width: "10%",
                                              textAlign: "center",
                                            }}
                                          >
                                            <span>Wrong Question/Options</span>
                                          </th>

                                          <th
                                            style={{
                                              width: "10%",
                                              textAlign: "center",
                                            }}
                                          ><span>Delete Question</span></th>

<th
                                            style={{
                                              width: "10%",
                                              textAlign: "center",
                                            }}
                                          ></th>
                                        </tr>
                                      </div>
                                      <div className="scroll-body">
                                        {subjects &&
                                          subjects.questions.map(
                                            (question, questionIndex) => {
                                              // console.log('questionss', questions);
                                              let backgroundColor =
                                                question.isMarkedAsWrong ===
                                                true
                                                  ? "#ecc0c0"
                                                  : "";
                                              if (!question) return null;
                                              let questionText =
                                                CommonFunctions.filterMarkup(
                                                  question.questionText
                                                );
                                              let questionType =
                                                questionTypeChecker(
                                                  question.questionType
                                                );
                                              if (
                                                questionType ===
                                                  EnumConfig.QuestionType
                                                    .numeric ||
                                                questionType ===
                                                  EnumConfig.QuestionType
                                                    .subjective ||
                                                questionType ===
                                                  EnumConfig.QuestionType
                                                    .notDefined
                                              ) {
                                                question.textAnswer = "aaa";
                                              }
                                              return (
                                                <div
                                                  key={`questionsKey${questionIndex}`}
                                                >
                                                  <tr
                                                    color="#ecc0c0"
                                                    style={{
                                                      backgroundColor: `${backgroundColor}`,
                                                    }}
                                                  >
                                                    <td width="5%">
                                                      <td
                                                        style={{
                                                          borderBottom: "none",
                                                        }}
                                                      >
                                                        <span className="td-span">
                                                          {questionIndex + 1}
                                                        </span>
                                                      </td>

                                                      {question.isAnswerKeyCorrected && (
                                                        <span
                                                          style={{
                                                            height: "20px",
                                                            width: "20px",
                                                            backgroundColor:
                                                              "greenyellow",
                                                            borderRadius: "50%",
                                                            display:
                                                              "inline-block",
                                                            borderStyle:
                                                              "solid",
                                                          }}
                                                        ></span>
                                                      )}
                                                    </td>

                                                    <td width="55%">
                                                      <div className="question-box">
                                                        {questionText && (
                                                          <p
                                                            style={{
                                                              display: "flex",
                                                              flexDirection:
                                                                "column",
                                                              color: "darkcyan",
                                                              marginTop: "3px",
                                                            }}
                                                          >
                                                            <span>
                                                              {questionType}
                                                            </span>
                                                            <span
                                                              className="question-text"
                                                              dangerouslySetInnerHTML={{
                                                                __html:
                                                                  questionText,
                                                              }}
                                                            />
                                                          </p>
                                                        )}
                                                        {/* questionType */}
                                                        {(question.questionType ===
                                                          EnumConfig
                                                            .QuestionType
                                                            .singleChoice ||
                                                          question.questionType ===
                                                            EnumConfig
                                                              .QuestionType
                                                              .multipleChoice ||
                                                          question.questionType ===
                                                            EnumConfig
                                                              .QuestionType
                                                              .comprehensive) && (
                                                          <ul className="question-options-box">
                                                            {question.options.map(
                                                              (
                                                                option,
                                                                optionsToShowIndex
                                                              ) => {
                                                                let oText =
                                                                  CommonFunctions.filterMarkup(
                                                                    option.value
                                                                  );
                                                                return (
                                                                  <>
                                                                    <li
                                                                      key={`optionKey_${optionsToShowIndex}`}
                                                                    >
                                                                      {oText && (
                                                                        <p>
                                                                          <span
                                                                            className="options-text"
                                                                            dangerouslySetInnerHTML={{
                                                                              __html:
                                                                                oText,
                                                                            }}
                                                                          />
                                                                        </p>
                                                                      )}
                                                                    </li>
                                                                  </>
                                                                );
                                                              }
                                                            )}
                                                          </ul>
                                                        )}
                                                      </div>
                                                    </td>

                                                    <td
                                                      width="10%"
                                                      style={{
                                                        textAlign: "center",
                                                      }}
                                                    >
                                                      <span className="option-selected">
                                                        [{question.answerKey}]
                                                      </span>
                                                    </td>

                                                    <td
                                                      width="10%"
                                                      style={{
                                                        textAlign: "center",
                                                      }}
                                                    >
                                                      {question.questionType ===
                                                      EnumConfig.QuestionType
                                                        .comprehensive ? (
                                                        <div className="drop-down-box">
                                                          <SelectableContext.Provider
                                                            value={false}
                                                          >
                                                            <Dropdown>
                                                              {/*  */}
                                                              <Dropdown.Toggle
                                                                variant="btn btn-primary"
                                                                disabled={
                                                                  question.isMarkedAsWrong ===
                                                                  true
                                                                    ? true
                                                                    : false
                                                                }
                                                              >
                                                                {question.correctedAnswerKey
                                                                  ? question.correctedAnswerKey
                                                                  : question.answerKey}
                                                              </Dropdown.Toggle>
                                                              <Dropdown.Menu>
                                                                {question.options.map(
                                                                  (o, i) => {
                                                                    return (
                                                                      <>
                                                                        <Dropdown.Item
                                                                          value={
                                                                            o.key
                                                                          }
                                                                          key={`$optionAkc_${i}`}
                                                                          disabled={
                                                                            question.isMarkedAsWrong ===
                                                                            true
                                                                              ? true
                                                                              : false
                                                                          }
                                                                          onSelect={() => {
                                                                            question.correctedAnswerKey =
                                                                              o.key;
                                                                            if (
                                                                              question.correctedAnswerKey !==
                                                                              question.answerKey
                                                                                .toString()
                                                                                .toUpperCase()
                                                                            ) {
                                                                              console.log(
                                                                                "correctedAnswerKey",
                                                                                question.correctedAnswerKey
                                                                              );
                                                                              question.isCorrected = true;
                                                                              setCorrectedKey(
                                                                                o.key
                                                                              );
                                                                              console.log(
                                                                                "questions",
                                                                                question
                                                                              );
                                                                              setSelectedQuestion(
                                                                                question
                                                                              );
                                                                            } else if (
                                                                              question.correctedAnswerKey ===
                                                                              question.answerKey
                                                                                .toString()
                                                                                .toUpperCase()
                                                                            ) {
                                                                              question.isCorrected = false;
                                                                              setCorrectedKey(
                                                                                ""
                                                                              );
                                                                              setSelectedQuestion(
                                                                                null
                                                                              );
                                                                              console.log(
                                                                                "question",
                                                                                question
                                                                              );
                                                                            }
                                                                          }}
                                                                        >
                                                                          {
                                                                            o.key
                                                                          }
                                                                        </Dropdown.Item>
                                                                      </>
                                                                    );
                                                                  }
                                                                )}
                                                              </Dropdown.Menu>
                                                            </Dropdown>
                                                          </SelectableContext.Provider>
                                                        </div>
                                                      ) : question.questionType ===
                                                          EnumConfig
                                                            .QuestionType
                                                            .multipleChoice ||
                                                        question.questionType ===
                                                          EnumConfig
                                                            .QuestionType
                                                            .singleChoice ? (
                                                        <div>
                                                          {question.options.map(
                                                            (option, i) => {
                                                              return (
                                                                <div
                                                                  key={`optionsDiv${i}`}
                                                                  className="form-check form-check-neonBlack form-check-akc-bkc"
                                                                >
                                                                  <label className="form-check-label">
                                                                    <input
                                                                      id={`multi${subjectIndex}_${questionIndex}_${i}`}
                                                                      type="checkbox"
                                                                      className="form-check-input"
                                                                      key={`$optionAkc_${i}`}
                                                                      disabled={
                                                                        question.isMarkedAsWrong ===
                                                                        true
                                                                          ? true
                                                                          : false
                                                                      }
                                                                      checked={
                                                                        option.isChecked
                                                                      }
                                                                      value={
                                                                        option.key
                                                                      }
                                                                      onChange={(
                                                                        e
                                                                      ) => {
                                                                        option.isChecked =
                                                                          !option.isChecked;
                                                                        if (
                                                                          correctedKey.includes(
                                                                            e
                                                                              .target
                                                                              .value
                                                                          )
                                                                        ) {
                                                                          let a =
                                                                            correctedKey;
                                                                          let s =
                                                                            e
                                                                              .target
                                                                              .value;
                                                                          let p =
                                                                            a.replace(
                                                                              s,
                                                                              ""
                                                                            );
                                                                          setCorrectedKey(
                                                                            p
                                                                          );
                                                                          console.log(
                                                                            "correct1",
                                                                            correctedKey
                                                                          );
                                                                        } else {
                                                                          let a =
                                                                            correctedKey.concat(
                                                                              e
                                                                                .target
                                                                                .value
                                                                            );
                                                                          setCorrectedKey(
                                                                            a
                                                                          );
                                                                          console.log(
                                                                            "correct",
                                                                            correctedKey
                                                                          );
                                                                          if (
                                                                            (!question.isWrongCorrected &&
                                                                              !question.isCorrected) ||
                                                                            question.isCorrected ===
                                                                              false
                                                                          ) {
                                                                            // setCorrectedKeys(correctedKeys + 0)
                                                                            question.isCorrected = true;
                                                                          }
                                                                        }
                                                                        setSelectedQuestion(
                                                                          question
                                                                        );
                                                                      }}
                                                                    />
                                                                    <i className="input-helper"></i>
                                                                    <span className="option-key">
                                                                      {" "}
                                                                      {
                                                                        option.key
                                                                      }
                                                                    </span>
                                                                  </label>
                                                                </div>
                                                              );
                                                            }
                                                          )}
                                                        </div>
                                                      ) : (
                                                        <div>
                                                          <div className="form-group">
                                                            <input
                                                              type="text"
                                                              id={`questionType_${question.id}`}
                                                              name="Answer"
                                                              className="form-control"
                                                              // style={{ background: 'rgb(0 0 0 / 14%)', borderColor: '#2196f3', color: '#000' }}
                                                              value={
                                                                question.studentAnswer
                                                              }
                                                              onChange={(e) => {
                                                                question.studentAnswer =
                                                                  e.target.value;
                                                                setTextAnswer(
                                                                  question.studentAnswer
                                                                );
                                                              }}
                                                              onBlur={() => {
                                                                if (
                                                                  textAnswer.length >
                                                                  0
                                                                ) {
                                                                  question.isCorrected = true;
                                                                  setCorrectedKey(
                                                                    textAnswer
                                                                  );
                                                                  setSelectedQuestion(
                                                                    question
                                                                  );
                                                                } else {
                                                                  question.isCorrected = false;
                                                                  setCorrectedKey(
                                                                    ""
                                                                  );
                                                                  setSelectedQuestion(
                                                                    null
                                                                  );
                                                                }
                                                              }}
                                                            />
                                                          </div>
                                                        </div>
                                                      )}
                                                    </td>
{/* -----------------------------------------Wrong question------------------------------------------------ */}
                                                    <td
                                                      width="10%"
                                                      style={{
                                                        textAlign: "center",
                                                      }}
                                                    >
                                                      <OverlayTrigger
                                                        placement="top"
                                                        overlay={
                                                          <Tooltip
                                                            id="tooltip-bottom"
                                                            className="common-tooltip black-toolip"
                                                          >
                                                            {question.isWrongCorrected
                                                              ? "Marked as a Wrong Question/Option"
                                                              : "Mark if Question/Option is Wrong"}
                                                          </Tooltip>
                                                        }
                                                      >
                                                        <div
                                                          className={`${
                                                            isEnableWrongAnswerChk
                                                              ? "form-check form-check-neonBlack"
                                                              : "form-check form-check-neonBlack disabled"
                                                          }`}
                                                        >
                                                          <label className="form-check-label text-muted">
                                                            <input
                                                              id={question.id}
                                                              key={question.id}
                                                              defaultChecked={
                                                                question.isMarkedAsWrong
                                                              }
                                                              type="checkbox"
                                                              className="form-check-input"
                                                              disabled={
                                                                question.isMarkedAsWrong ===
                                                                true
                                                                  ? true
                                                                  : false
                                                              }
                                                              value={
                                                                question.isWrongCorrected
                                                                  ? question.isWrongCorrected
                                                                  : false
                                                              }
                                                              onChange={(e) => {
                                                                debugger;
                                                                let tempQues =
                                                                  question;
                                                                if (
                                                                  tempQues.isWrongCorrected
                                                                ) {
                                                                  tempQues.isWrongCorrected =
                                                                    !tempQues.isWrongCorrected;
                                                                  tempQues.isWrongCorrected ===
                                                                  true
                                                                    ? setSelectedQuestion(
                                                                        tempQues
                                                                      )
                                                                    : setSelectedQuestion(
                                                                        null
                                                                      );
                                                                  if (
                                                                    tempQues.isWrongCorrected ===
                                                                    true
                                                                  ) {
                                                                    setSelectedQuestion(
                                                                      tempQues
                                                                    );
                                                                  } else if (
                                                                    tempQues.isWrongCorrected ===
                                                                      false &&
                                                                    correctedKey.length >
                                                                      0
                                                                  ) {
                                                                    setSelectedQuestion(
                                                                      tempQues
                                                                    );
                                                                  } else {
                                                                    setSelectedQuestion(
                                                                      null
                                                                    );
                                                                  }
                                                                } else {
                                                                  tempQues.isWrongCorrected = true;
                                                                  setSelectedQuestion(
                                                                    tempQues
                                                                  );
                                                                }
                                                                console.log(
                                                                  "question",
                                                                  question
                                                                );
                                                              }}
                                                            />
                                                            <i className="input-helper"></i>
                                                          </label>
                                                        </div>
                                                      </OverlayTrigger>
                                                    </td>
{/* -----------------------------------------Wrong question end------------------------------------------------ */}

{/* -----------------------------------------delete question------------------------------------------------ */}
                                                    <td
                                                      width="10%"
                                                      style={{
                                                        textAlign: "center",
                                                      }}
                                                    >
                                                      <OverlayTrigger
                                                        placement="top"
                                                        overlay={
                                                          <Tooltip
                                                            id="tooltip-bottom"
                                                            className="common-tooltip black-toolip"
                                                          >
                                                            {question.isWrongCorrected
                                                              ? "Marked as a Wrong Question/Option"
                                                              : "Mark if Question/Option is Wrong"}
                                                          </Tooltip>
                                                        }
                                                      >
                                                        <div
                                                          className={`${
                                                            isEnableWrongAnswerChk
                                                              ? "form-check form-check-neonBlack"
                                                              : "form-check form-check-neonBlack disabled"
                                                          }`}
                                                        >
                                                          <label className="form-check-label text-muted">
                                                            <input
                                                              id={question.id}
                                                              key={question.id}
                                                              defaultChecked={
                                                                question.isMarkedAsWrong
                                                              }
                                                              type="checkbox"
                                                              className="form-check-input"
                                                              disabled={
                                                                question.isMarkedAsWrong ===
                                                                true
                                                                  ? true
                                                                  : false
                                                              }
                                                              value={
                                                                question.isWrongCorrected
                                                                  ? question.isWrongCorrected
                                                                  : false
                                                              }
                                                              onChange={(e) => {
                                                                debugger;
                                                                let tempQues =
                                                                  question;
                                                                if (
                                                                  tempQues.isWrongCorrected
                                                                ) {
                                                                  tempQues.isWrongCorrected =
                                                                    !tempQues.isWrongCorrected;
                                                                  tempQues.isWrongCorrected ===
                                                                  true
                                                                    ? setSelectedQuestion(
                                                                        tempQues
                                                                      )
                                                                    : setSelectedQuestion(
                                                                        null
                                                                      );
                                                                  if (
                                                                    tempQues.isWrongCorrected ===
                                                                    true
                                                                  ) {
                                                                    setSelectedQuestion(
                                                                      tempQues
                                                                    );
                                                                  } else if (
                                                                    tempQues.isWrongCorrected ===
                                                                      false &&
                                                                    correctedKey.length >
                                                                      0
                                                                  ) {
                                                                    setSelectedQuestion(
                                                                      tempQues
                                                                    );
                                                                  } else {
                                                                    setSelectedQuestion(
                                                                      null
                                                                    );
                                                                  }
                                                                } else {
                                                                  tempQues.isWrongCorrected = true;
                                                                  setSelectedQuestion(
                                                                    tempQues
                                                                  );
                                                                }
                                                                console.log(
                                                                  "question",
                                                                  question
                                                                );
                                                              }}
                                                            />
                                                            <i className="input-helper"></i>
                                                          </label>
                                                        </div>
                                                      </OverlayTrigger>
                                                    </td>
{/* -----------------------------------------delete question end------------------------------------------------ */}
                                                    <td
                                                      width="10%"
                                                      style={{
                                                        textAlign: "center",
                                                      }}
                                                    >
                                                      {selectedQuestion &&
                                                        selectedQuestion.id ===
                                                          question.id &&
                                                        (correctedKey.length >
                                                          0 ||
                                                          selectedQuestion.isWrongCorrected ===
                                                            true) && (
                                                          <Button
                                                            id={question.id}
                                                            variant="primary"
                                                            className=" uploadeBtn update-que-btn"
                                                            onClick={() => {
                                                              let a = [];
                                                              a.push(
                                                                subjectIndex
                                                              );
                                                              a.push(
                                                                questionIndex
                                                              );
                                                              setSubjectAndQustionIndex(
                                                                a
                                                              );
                                                              console.log(a);
                                                              subjectAndQustionIndex &&
                                                                (selectedQuestion.isWrongCorrected ===
                                                                true
                                                                  ? setShowWrongKeyConfirmation(
                                                                      true
                                                                    )
                                                                  : handleKeyCorrection());
                                                            }}
                                                          >
                                                            Update Question
                                                          </Button>
                                                        )}
                                                      {/* {keyCorrectionLoader && (selectedQuestion && selectedQuestion.id === question.id) && < Spinner size="sm" animation="grow" variant="error" />} */}
                                                    </td>
                                                  </tr>
                                                </div>
                                              );
                                            }
                                          )}
                                      </div>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </Accordion.Collapse>
                          </div>
                        }
                      </div>
                    );
                  })}
              </Accordion>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="closeBtn"
            onClick={() => {
              clearStates();
              closeAkcBkcPreviewModal();
            }}
          >
            Close
          </Button>
        </Modal.Footer>
        {showWrongKeyConfirmation && <WrongKeyConfirmation />}
      </Modal>
    </div>
  );
};

export default AkcBkcPreviewModal;

// border: 2px solid green;
//     padding: 2px;
//     border-radius: 3px;
