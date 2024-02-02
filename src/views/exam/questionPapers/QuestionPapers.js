import React, { useState, useEffect } from "react";
import PagesHeader from "../../../components/shared/Pageheader";
import { BsCloudUpload } from "react-icons/bs";
import {
  FaUserEdit,
  FaUserClock,
  FaUserTimes,
  FaRegPlayCircle,
} from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { BsFilterRight } from "react-icons/bs";
import { GoReport } from "react-icons/go";
import {
  Tooltip,
  OverlayTrigger,
  Form,
  Accordion,
  Spinner,
  Button,
} from "react-bootstrap";
import { UrlConfig } from "../../../config";
import { toast } from "react-toastify";
import { CreateTestModal, AssingModal, SubjectMappingModal,DemoModal } from "./Modals";
import { connect, batch } from "react-redux";
import { Api, CommonApiCall, Network } from "../../../services";
import {
  CourseListAction,
  SubjectListAction,
  ExamListAction,
} from "../../../reduxManager";
import { QuetionPapersTableRow } from "./Component";
import CommonFunctions from "../../../utils/CommonFunctions";
import moment from "moment";
import { ExamQuestionPreviewModal, AkcBkcPreviewModal } from "../commonModal";
import FilterMenu from "../commonModal/filterMenu";
import EditTestModal from "./Modals/EditTestModal";
const QuestionPapers = (props) => {
  const [examLists, setExamLists] = useState([]);
  const [accountData, setAccountData] = useState([]);
  const [selectedTest, setSelectedtest] = useState();
  const [counter, setCounter] = useState(1);
  const [listLoader, setListLoader] = useState(false);
  const [clickedExamId, setClickedExamId] = useState();
  const [show, setShow] = useState(false);
  const [showfileExplorerModel, setshowfileExplorerModel] = useState(false);
  const [isFileExploere, setFileExploere] = useState(true);
  const [showAkcBkcPreviewModal, setShowAkcBkcPreviewModal] = useState(false);
  const [isMultiExpand, setMultiExpand] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [demoShowModal,setDemoShowModal] = useState(false);

  const [examPreviewSubj, setExamPreviewSubj] = useState();
  const [scrollPosition, setScrollPosition] = useState();
  const [tempScrollPosition, setTempScrollPosition] = useState(1000);
  const [documentSubjects, setDocumentSubjects] = useState([]); //state used for set document subject on upload;
  const [mappedSubjects, setMappedSubjects] = useState([]); //set here mapped subject on mapping click
  const [createTestJSON, setcreateTest] = useState({
    id: "",
    name: "",
    description: "",
    price: Number,
    discount: "",
    examType: "1",
    applicableFor: "",
    duration: "",
    positiveMarks: "",
    negativeMarks: "",
    totalMarks: "",
    numberOfSubject: "",
    subjects: [],
    questionsPerSubject: "",
    totalQuestions: "",
    attempts: 1,
    // commonInstruction: true,
    isSpecificInstructions: false,
    testInstructions: "",
    importDocumentId: null,
    free: true,
  });
  const [showSubjectMappingModal, setShowSubjectMappingModal] = useState(false);
  const [isSubjectMappingRequire, setIsubjectMappingRequire] = useState(false);
  const [showOverlayOncreate, setShowOverlayOncreate] = useState(true);
  const [mappingError, setMappingError] = useState(null);
  const [selectedExamFile, setSelectedExamFile] = useState(null);
  const [showCreateTestLoader, setCreateTestLoader] = useState(false);
  const [isValidCreateData, setCreateDataValid] = useState(false);
  const [showLoader, setLoader] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [condition, setCondition] = useState(false);
  const [responseIsNull, setResponseIsNull] = useState(false);
  // ****************************************************For Filter Menu*********************************
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [courseListForExamFilters, setCourseListForExamFilters] =
    useState(null);
  const [specialFlag, setSpecialFlag] = useState(false);
  const [xyCoordinates, setXYCoordinates] = useState({
    x: "",
    y: "",
  });
  const [filterParams, setFilterParams] = useState({
    isCurrentDateSelected: false,
    currentDate: new Date(Date.now()),
    isDateRangeSelected: false,
    dateRange: {
      startDate: new Date(Date.now()),
      endDate: new Date(Date.now()),
    },
    applicableFor: [],
  });
  const [appliedFilters, setAppliedFilters] = useState(null);
  const UpdateFilterParams = (filterParams) => {
    setFilterParams(filterParams);
  };
  const clearFilters = () => {
    setAppliedFilters(null);
    setFilterParams({
      isCurrentDateSelected: false,
      currentDate: null,
      isDateRangeSelected: false,
      dateRange: { startDate: null, endDate: new Date(Date.now()) },
      applicableFor: [],
    });
    setAppliedFilters(null);
    setCourseListForExamFilters(props.courseList);
    getCourseList();
    if (specialFlag === true) {
      setTimeout(() => {
        getExamList(true, "fromClearFilter");
      }, 100);
      setSpecialFlag(false);
    }
    setUpdater(!updater);
  };
  const applyFilters = () => {
    setSpecialFlag(true);
    getExamList(true, "fromApplyFilters");
  };

  const checkFilterStatus = () => {
    if (
      appliedFilters &&
      (appliedFilters.isCurrentDateSelected === true ||
        appliedFilters.isDateRangeSelected === true ||
        appliedFilters.applicableFor.length > 0)
    ) {
      return true;
    } else {
      return false;
    }
  };
  useEffect(() => {
    console.log("showFilterMenu", showFilterMenu);
  }, [showFilterMenu]);

  useEffect(() => {
    console.log("filterParams", filterParams);
  }, [filterParams]);
  // ****************************************************Filter Menu End******************************************

  // ****************************************************Edit Menu Start********************************************
  const [showEditModal, setShowEditModal] = useState(false);
  const [examDataForEdit, setExamDataForEdit] = useState();
  const [editLoader, setEditLoader] = useState(false);
  const [updater, setUpdater] = useState(false);

  const handleCloseEditModal = () => {
    setExamDataForEdit([]);
    setShowEditModal(false);
    console.log("examLists", examLists);
  };
  const handleEdit = (
    examData,
    dataForUpdateExamDetails,
    applicableForArray
  ) => {
    setEditLoader(true);
    console.log("dataForUpdateExamDetails", dataForUpdateExamDetails);
    console.log("newApplicableForArray", applicableForArray);
    console.log("examData", examData);
    let name = dataForUpdateExamDetails.name
      ? dataForUpdateExamDetails.name
      : examData[0].name;
    let description = dataForUpdateExamDetails.description
      ? dataForUpdateExamDetails.description
      : examData[0].description;
    let duration = dataForUpdateExamDetails.duration
      ? dataForUpdateExamDetails.duration
      : examData[0].duration;
    let courseIds = [];
    applicableForArray.map((id) => {
      courseIds.push(`${id}`);
    });
    const payload = {
      id: `${examData[0].id}`,
      courseIds,
      name: `${name}`,
      description: `${description}`,
      duration: `${duration}`,
    };
    console.log("payload", payload);
    Api.putApi(
      `${UrlConfig.apiUrls.editExamDetails}/${examData[0].id}`,
      payload
    )
      .then((response) => {
        console.log("response", response);
        const { data } = response;
        let updatedData = examLists;
        let index = examData[1].currentIndex;
        updatedData[index] = data;
        setExamLists(updatedData);
        setShowEditModal(false);
        toast.success("Exam Details Updated Successfully !");
        setUpdater(!updater);
        setEditLoader(false);
      })
      .catch((error) => {
        const errorMessage = CommonFunctions.apiErrorMessage(error);
        console.log("errorMessage", errorMessage);
        toast(errorMessage, {
          type: "error",
        });
        setEditLoader(false);
      });
  };
  // ****************************************************Edit Menu End******************************************

  // ****************************************************Delete Feature******************************************
  const [deleteActionLoader, setDeleteActionLoader] = useState(false);
  const [deleteExamIndex, setDeleteExamIndex] = useState(-1);
  useEffect(() => {
    console.log("UpdatedExamLists", examLists);
  }, [examLists]);
  const handleDeleteExam = (index, examData) => {
    // setDeleteActionLoader(true);
    console.log("index", index);
    console.log("examData", examData);
    Api.deleteApi(`${UrlConfig.apiUrls.deleteExam}/${examData.id}`)
      .then((response) => {
        console.log("response", response);
        toast.success(`${examData.name} deleted Successfully!`);
        console.log("examLists", examLists);
        let OldList = examLists;
        console.log("OldList", OldList);
        OldList[index].hadRemoved = true;
        console.log("newList", OldList);
        setExamLists(OldList);
        setDeleteActionLoader(false);
        setUpdater(!updater);
        // getExamList(true, "fromClearFilter");
      })
      .catch((error) => {
        const errorMessage = CommonFunctions.apiErrorMessage(error);
        console.log("errorMessage", errorMessage);
        toast(errorMessage, {
          type: "error",
        });
        setDeleteActionLoader(false);
      });
  };
  // ****************************************************Delete Feature End**************************************

  // *******************************For ExamPreview Modal*********************************************************
  const [showExamPreviewModal, setShowExamPreviewModal] = useState(false);
  const [examPreviewData, setExamPreviewData] = useState(null);
  const [showExamPreviewLoader, setExamPreviewLoader] = useState(false);
  const [showAkcBkcPreviewLoader, setAkcBkcPreviewLoader] = useState(false);
  const [disabledUpload, setDisabledUpload] = useState(false);
  // ****************************************************************************************
  useEffect(() => {
    getInstituteData();
    getCourseList();
    getSubjectList();
    // ****************************************For Exam List************************************************
    if (!examLists || examLists.length === 0) {
      setLoader(true);
      getExamList(false, "fromUseEffect");
    }
    return () => {
      setCondition(false);
      setLoader(false);
      setIsLoading(false);
      setListLoader(false);
      setExamLists([]);
      setCounter(1);
    };
    // ****************************************************************************************
  }, []);

  function getInstituteData() {
    Api.getApi(UrlConfig.apiUrls.branchesClassesBatches)
        .then((response) => {
          let Data = response.data.accounts[0].courses
            setAccountData(Data);
            console.log('**** account data', response);
            // console.log('**** account data', accountData);
            // return response.data;
        })
        .catch((error) => {
            console.log('********Error request ', error);
            if (error && error.request) {
                if (error.request.status !== 0) {
                    if (error.response && error.response.data && error.response.data.errors) {
                        console.log('********Response response ', error.response);
                        const { message } = error.response.data.errors[0];
                        console.log('********Response request ', message);
                    }
                }
            }
            return error;
        });
}


  /*********** start create test modal functionality *****************************/
  /**get course list */
  const getCourseList = () => {
    Api.getApi(UrlConfig.apiUrls.getCourseTypes)
      .then((response) => {
        console.log("CoursesCoursesCoursesCoursesCourses",response.data);
        if (response) {
          const { data } = response;
          CourseListAction.setCourseList(data);
          setCourseListForExamFilters(data);
        } else {
          CourseListAction.setCourseList([]);
        }

      })
      .catch((error) => {
        console.log(error, "Err");
      });
  };
  

  /**get subject list and store to redux .. Todo: get subject list by course id in next sprint */
  const getSubjectList = () => {
    Api.getApi(UrlConfig.apiUrls.getSubjects)
      .then((response) => {
        if (response) {
          const { data } = response;
          SubjectListAction.setSubjectList(data);
        } else {
          SubjectListAction.setSubjectList([]);
        }
      })
      .catch((error) => {
        const errorMessage = CommonFunctions.apiErrorMessage(error);
        console.log("errorMessage", errorMessage);
        toast(errorMessage, {
          type: "error",
        });
      });
  };

  // ************************************Exam List****************************************************
  const getExamList = (loadFirstPage = false, from = "fromUseEffect") => {
    setIsLoading(true);
    setResponseIsNull(false);
    // For Filter Purpose----------------------------------------------------------
    if (from === "fromClearFilter" || from === "fromApplyFilters") {
      setLoader(true);
      setExamLists([]);
      setCounter(1);
      if (from === "fromClearFilter") {
        setUpdater(!updater);
      }
      let scrollTop = document.getElementById("myscroll").scrollTop;
      let scrollHeight = document.getElementById("myscroll").scrollHeight;
      let clientHeight = document.getElementById("myscroll").clientHeight;
      console.log("scrollTop", scrollTop);
      console.log("scrollHeight", scrollHeight);
      console.log("clientHeight", clientHeight);
      document.getElementById("myscroll").scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    if (showFilterMenu) {
      setShowFilterMenu(false);
    }
    let fromDate = "";
    let toDate = "";
    // For Filter Purpose----------------------------------------------------------
    counter > 1 && !loadFirstPage && setListLoader(true);
    const pageNumber = loadFirstPage ? 1 : counter;
    if (loadFirstPage) {
      setTempScrollPosition(1000);
    }

    // For Filter Purpose----------------------------------------------------------
    var params = new URLSearchParams();
    if (from === "fromApplyFilters" || specialFlag) {
      fromDate =
        filterParams.isCurrentDateSelected === true
          ? moment(filterParams.currentDate).format("YYYY-MM-DD")
          : filterParams.isDateRangeSelected === true
          ? moment(filterParams.dateRange.startDate).format("YYYY-MM-DD")
          : "";
      toDate =
        filterParams.isDateRangeSelected === true
          ? moment(filterParams.dateRange.endDate).format("YYYY-MM-DD")
          : "";
      params.append("FromDateTime", fromDate);
      params.append("ToDateTime", toDate);
      filterParams.applicableFor.map((id) => {
        params.append("CourseIds", id);
        return true;
      });
      params.append("Page", pageNumber);
      params.append("PageSize", 20);
    } else if (from === "fromClearFilter") {
      params.append("Page", pageNumber);
      params.append("PageSize", 20);
    } else {
      params.append("Page", pageNumber);
      params.append("PageSize", 20);
    }
    // For Filter Purpose----------------------------------------------------------
    setLoader(false);
    Api.getApi(UrlConfig.apiUrls.getExamList, params)
      .then((response) => {
        if (response) {
          console.log("examResponse", response);
          const { data } = response;
          if (examLists && examLists.length > 0 && !loadFirstPage) {
            let newExamListArray = examLists.concat(data);
            setExamLists(newExamListArray);
          } else {
            setExamLists(data);
          }
          setCondition(true);
          setCounter(pageNumber + 1);
        } else {
          setResponseIsNull(true);
        }
        if (from === "fromApplyFilters") {
          setAppliedFilters(filterParams);
        }
        setListLoader(false);
        setIsLoading(false);
      })
      .catch((error) => {
        setListLoader(false);
        setLoader(false);
        setIsLoading(false);
        setResponseIsNull(true);
        const errorMessage = CommonFunctions.apiErrorMessage(error);
        console.log("errorMessage", errorMessage);
        toast(errorMessage, {
          type: "error",
        });
      });
  };

  // ****************************************************************************************

  const handleShow = () => {
    setShow(true);
  };
  const demoFunction = () => {
    setDemoShowModal(true);
  };
  const handleClose = () => {
    setShow(false);
    resetCreateExam();
  };
  const handleDemoClose = () =>{
    setDemoShowModal(false);
    
  }
  const upatecreateJSON = (e) => {
    if (e.target.name === "isSpecificInstructions") {
      setcreateTest({
        ...createTestJSON,
        [e.target.name]: !createTestJSON.isSpecificInstructions,
      });
    } else if (e.target.name === "examType") {
      setcreateTest({
        ...createTestJSON,
        [e.target.name]: createTestJSON.examType == 1 ? 0 : 1,
      });
    } else {
      setcreateTest({
        ...createTestJSON,
        [e.target.name]: e.target.value,
      });
    }
  };
  useEffect(() => {
    console.log("ffffffffffffff", createTestJSON);
  }, [createTestJSON]);
  const [courseWiseSubjects, setCourseWiseSubjects] = useState([]);

  const handleExamUpload = (e) => {
    console.log("event file", e.target.files);
    if (e && e.target && e.target.files && e.target.files.length > 0) {
      let tempJson = createTestJSON;
      const selectedFile = e.target.files[0];
      console.log(selectedFile);
      const fileNameWithExtension = selectedFile.name;
      const searchTerm = ".";
      const fileName = fileNameWithExtension.slice(
        0,
        fileNameWithExtension.lastIndexOf(searchTerm)
      );
      tempJson.name = fileName;
      setcreateTest(tempJson);
      console.log(fileName);
      // createTestJSON.name = fileName
      setSelectedExamFile(selectedFile);
      console.log("firsttttttttttttt");
      setDisabledUpload(true);
      let payload = new FormData();
      payload.append("file", selectedFile);
      setCreateTestLoader(true);
      Api.postApi(UrlConfig.apiUrls.uploadExam, payload)
        .then((response) => {
          if (response) {
            const { data } = response;
            setExamPreviewData(data);
            console.log("exam data", data);
            const { isSubjectMappingRequired, importDocumentId, subjects } =
              data;
            setCreateTestLoader(false);
            if (
              !isSubjectMappingRequired ||
              (isSubjectMappingRequired && mappedSubjects.length > 0)
            ) {
              setShowOverlayOncreate(false);
              setSubjects(subjects);
              setShowExamPreviewModal(true);
            } else {
              setMappingError("Subject mapping required.");
              setIsubjectMappingRequire(isSubjectMappingRequired);
              const { applicableFor } = createTestJSON;
              const { subjectList } = props;
              let courseWiseSubjectsArray = [];
              subjectList.map((sub) => {
                const { courses } = sub;
                const isExists = courses.find(
                  (course) => course.id === applicableFor
                );
                if (isExists) {
                  courseWiseSubjectsArray.push(sub);
                }
              });
              setCourseWiseSubjects(courseWiseSubjectsArray);
              console.log("applicableForapplicableFor", applicableFor);
              setDocumentSubjects(subjects);
              setShowSubjectMappingModal(isSubjectMappingRequired);
              setSubjects(subjects);
            }
            setcreateTest({
              ...createTestJSON,
              importDocumentId: importDocumentId,
              // name: fileName
            });
            console.log(
              data,
              "allCourseListallCourseListallCourseListallCourseListallCourseList"
            );
          }
        })
        .catch((error) => {
          console.log("Error", error);
          setCreateTestLoader(false);
          const errorMessage = CommonFunctions.apiErrorMessage(error);
          console.log("errorMessage", errorMessage);
          toast(errorMessage, {
            type: "error",
          });
        });
    }
  };

  const handelCloseFile = () => {
    setSelectedExamFile(null);
    setDisabledUpload(false);
    setExamPreviewData(null);
    setIsubjectMappingRequire(true);
    setMappedSubjects([]);
    setDocumentSubjects([]);
    setCreateDataValid(false);
    setMappingError(null);
    setShowOverlayOncreate(true);
  };
  const onSubjectMapingSubmit = (mappedSub) => {
    console.log("mappedSub", mappedSub);

    if (mappedSub && mappedSub.length > 0) {
      setMappedSubjects(mappedSub);
      setShowOverlayOncreate(false);
      setIsubjectMappingRequire(false);
      setShowExamPreviewModal(true);
    }
    closeSubjectMappingModal();
  };

  useEffect(() => {
    handleCreateTestValidation();
  }, [createTestJSON]);
  const handleCreateTestValidation = () => {
    const {
      name,
      description,
      importDocumentId,
      applicableFor,
      duration,
      attempts,
    } = createTestJSON;
    if (
      !name ||
      !importDocumentId ||
      !applicableFor ||
      (applicableFor && applicableFor.length === 0) ||
      !duration ||
      !attempts
    ) {
      setCreateDataValid(false);
      return false;
    }
    setCreateDataValid(true);
    return true;
  };

  const handleCreateSubmit = () => {
    // let comm
    const {
      name,
      description,
      duration,
      applicableFor,
      testInstructions,
      importDocumentId,
      attempts,
    } = createTestJSON;
    let commonInstructions = "";
    commonInstructions = CommonFunctions.commonInstructions();
    if (testInstructions) {
      // let formattedTestInstructions = testInstructions.replace(/\./g, ".\n");
      let formattedTestInstructions = testInstructions;
      commonInstructions = commonInstructions.concat(formattedTestInstructions);
    }
    const intDuration = parseInt(duration);
    const payload = {
      name,
      description,
      duration: intDuration,
      courseIds: [applicableFor],
      instructions: commonInstructions,
      importDocumentId,
      DocumentSubjects: documentSubjects,
      CorrectedSubjects: mappedSubjects,
    };
    console.log("submitted", payload);
    setCreateTestLoader(true);
    Api.postApi(UrlConfig.apiUrls.createExam, payload)
      .then((response) => {
        setCreateTestLoader(false);
        if (response) {
          const { data } = response;
          const { questions } = data;
          console.log("create exam", data);
          toast.success(`Test "${name}" Created Successfully`);
          getExamList(true);
          setShow(false);
          resetCreateExam();
          setUpdater(!updater);
        }
      })
      .catch((error) => {
        setCreateTestLoader(false);
        const errorMessage = CommonFunctions.apiErrorMessage(error);
        console.log("errorMessage", errorMessage);
        toast(errorMessage, {
          type: "error",
        });
      });
  };

  const resetCreateExam = () => {
    setDocumentSubjects([]);
    setMappedSubjects([]);
    setcreateTest({
      id: "",
      name: "",
      description: "",
      price: "",
      discount: "",
      examType: "1",
      applicableFor: "",
      duration: "",
      positiveMarks: "",
      negativeMarks: "",
      totalMarks: "",
      numberOfSubject: "",
      subjects: [],
      questionsPerSubject: "",
      totalQuestions: "",
      attempts: 1,
      // commonInstruction: true,
      isSpecificInstructions: false,
      testInstructions: "",
      importDocumentId: null,
      // free: true
    });
    setShowSubjectMappingModal(false);
    setIsubjectMappingRequire(false);
    setShowOverlayOncreate(true);
    setMappingError(null);
    setSelectedExamFile(null);
    setExamPreviewData(null);
    setDisabledUpload(false);
    setCreateTestLoader(false);
    setCreateDataValid(false);
    setShowExamPreviewModal(false);
    setMappedSubjects([]);
    setDocumentSubjects([]);
  };

  const columwiseFormat = (option, i, from) => {
    return (
      <div
        className={
          from === "filterMenu"
            ? "form-check form-check-neonWhite"
            : "form-check "
        }
      >
        {from === "filterMenu" ? (
          <label className="form-check-label">
            <input
              type="checkbox"
              className="form-check-input"
              value={option.name}
              defaultChecked={
                option.isChecked && option.isChecked === true ? true : false
              }
              checked={option.isChecked ? true : false}
              name={"checkBox" + i}
              key={option.name}
              onChange={(e) => {
                var list = [];
                list = filterParams.applicableFor;
                // setFilterParams({
                //     ...filterParams,
                //     ['applicableFor']: [],
                // });

                let isFind = list.indexOf(option.id);
                if (isFind != -1) {
                  option.isChecked = false;
                  list.splice(isFind, 1);
                } else {
                  option.isChecked = true;
                  list.push(option.id);
                }
                setFilterParams({
                  ...filterParams,
                  ["applicableFor"]: list,
                });
              }}
            />
            <i className="input-helper"></i>
            {option.name}
          </label>
        ) : (
          <label className="form-check-label">
            <input
              type="radio"
              className="form-check-input"
              value={option.name}
              defaultChecked={option.selected}
              name={"checkBox"}
              key={option.name}
              onChange={(e) => {
                // var list = [];
                // list = createTestJSON.applicableFor;
                setcreateTest({
                  ...createTestJSON,
                  ["applicableFor"]: "",
                });
                // let isFind = list.indexOf(option.id);
                // if (isFind != -1) { list.splice(isFind, 1) } else { list.push(option.id) }
                // console.log("optionn", isFind);
                setcreateTest({
                  ...createTestJSON,
                  ["applicableFor"]: option.id,
                });
              }}
            />
            <i className="input-helper"></i>
            {option.name}
          </label>
        )}
      </div>
    );
  };
  /***************************** end create test modal functionality *****************************/

  const headerRightComponenet = () => {
    return (
      <div className="import-btn-main-box">
        <OverlayTrigger
          placement="bottom"
          overlay={
            <Tooltip id="tooltip-bottom" className="common-tooltip">
              Import question paper.
            </Tooltip>
          }
        >
          <button
            type="button"
            onClick={() => {
              handleShow();
            }}
            className="common-btn-import "
          >
            <BsCloudUpload size={20} />
            Import
          </button>
        </OverlayTrigger>
      </div>
    );
  };

  const handledemofunction = () => {
    return (
        <div className="import-btn-main-box">
        <OverlayTrigger
          placement="bottom"
          overlay={
            <Tooltip id="tooltip-bottom" className="common-tooltip">
              Demo Tooltip
            </Tooltip>
          }
        >
          <button
            type="button"
            onClick={() => {
              demoFunction();
            }}
            className="common-btn-import "
          >
            <BsCloudUpload size={20} />
             Demo Modal
          </button>
        </OverlayTrigger>
      </div>
    )
        
    };

  /*********** start file explorer modal functionality *****************************/
  const handelScrollPosition = async (e) => {
    // let tempScroll = tempScrollPosition;
    let scrollTop = document.getElementById("myscroll").scrollTop;
    let scrollHieght = document.getElementById("myscroll").scrollHeight;
    let clientHeight = document.getElementById("myscroll").clientHeight;
    if (responseIsNull) {
      scrollHieght = scrollHieght + 50;
    }

    if (scrollTop + clientHeight >= scrollHieght - 5) {
      // if (scrollPosition >= tempScrollPosition) {
      let check = counter + 1;
      console.log("counterrrrrrr", counter);
      setListLoader(true);
      if (check !== counter) {
        // setTempScrollPosition(tempScroll + 1300);
        getExamList();
      }
    }
  };
  const Loadder = () => {
    return (
      <Spinner animation="border" role="status" className="spinnerquesionpaper">
        <span className="sr-only"> Loading...</span>
      </Spinner>
    );
  };
  const handleshowforFileExploere = (examData) => {
    console.log(examData);
    setSelectedtest(examData);
    setFileExploere(true);
    setshowfileExplorerModel(true);
  };
  const onPreviousClick = () => {
    !isFileExploere ? setFileExploere(true) : handleCloseforFileExploere();
  };
  const onSubmitFileExplorer = () => {
    isFileExploere ? setFileExploere(false) : handleCloseforFileExploere();
  };
  const handleCloseforFileExploere = () => {
    setshowfileExplorerModel(false);
    setExamPreviewLoader(false);
    setExamPreviewData(null);
  };
  /*********** end file explorer modal functionality *****************************/

  const editClick = () => {
    // alert('edit');
  };
  const deleteClick = () => {
    //alert('delete');
  };

  /*********** start question paper preview on exam list item functionality *****************************/
  /*********** get question paper details *****************************/
  const getExamPreview = (examId, isKeyCorrection = false) => {
    isKeyCorrection ? setAkcBkcPreviewLoader(true) : setExamPreviewLoader(true);
    Api.getApi(`${UrlConfig.apiUrls.getExamList}/${examId}`)
      .then((response) => {
        if (response) {
          const { data } = response;
          console.log("examPreviewReport", response);
          setExamPreviewData(data);
          setExamPreviewSubj(data.subjects);
          isKeyCorrection
            ? setShowAkcBkcPreviewModal(true)
            : setShowExamPreviewModal(true);
        } else {
          toast("No data found", {
            type: "error",
          });
        }
        isKeyCorrection
          ? setAkcBkcPreviewLoader(false)
          : setExamPreviewLoader(false);
      })
      .catch((error) => {
        isKeyCorrection
          ? setAkcBkcPreviewLoader(false)
          : setExamPreviewLoader(false);
        const errorMessage = CommonFunctions.apiErrorMessage(error);
        toast(errorMessage, {
          type: "error",
        });
      });
  };
  /*********** start question paper preview on exam list item functionality *****************************/

  /*********** start scheduled test modal functionality *****************************/

  const setExamId = (id) => {
    setClickedExamId(id);
  };
  const showAkcBkcPreviewClick = () => setShowAkcBkcPreviewModal(true);
  const closeAkcBkcPreviewModal = () => setShowAkcBkcPreviewModal(false);
  const CloseExamPreviewModal = () => setShowExamPreviewModal(false);
  const showSubjectMappingClick = () => setShowSubjectMappingModal(true);
  const closeSubjectMappingModal = () => setShowSubjectMappingModal(false);
  /*********** end scheduled test modal functionality *****************************/

  // let i = 0;
  const examListTable = () => {
    return (
      <div>
        {examLists &&
          examLists.map((examData, index) => {
            return (
              !examData.isDeleted && (
                <QuetionPapersTableRow
                  index={index + 1}
                  key={`examList_${examData.id}`}
                  listKey={`examList_quetion_papers_tableRow${examData.id}`}
                  examData={examData}
                  assignLabel={"Assign"}
                  onAssignIcon={<FaUserEdit />}
                  examId={examData.id}
                  isMultiExpand={isMultiExpand}
                  handlePreviewClick={() => getExamPreview(examData.id)}
                  showExamPreviewLoader={showExamPreviewLoader}
                  setCurrentExamId={setExamId}
                  handleAssignClick={() => {
                    console.log("examData", examData);
                    handleshowforFileExploere(examData);
                  }}
                  handleEditExam={() => {
                    console.log("examData", examData);
                    let tempArray = [];
                    tempArray.push(examData);
                    let tempObj = { currentIndex: index };
                    tempArray.push(tempObj);
                    setExamDataForEdit(tempArray);
                    setShowEditModal(true);
                  }}
                  handleDeleteExamClick={() => {
                    setDeleteActionLoader(true);
                    setDeleteExamIndex(index);
                    handleDeleteExam(index, examData);
                  }}
                  hadRemoved={
                    examData.hadRemoved &&
                    examData.hadRemoved === true &&
                    examData.hadRemoved
                  }
                  deleteActionLoader={
                    deleteActionLoader === true && index === deleteExamIndex
                      ? true
                      : false
                  }
                />
              )
            );
          })}
        <div style={{ textAlign: "center", padding: 10 }}>
          {listLoader && Loadder()}
        </div>
      </div>
    );
  };
  return (
    <div>
      <PagesHeader
        headerText={"Question Papers"}
        customElementsComponent={headerRightComponenet}
        dropDownItem={[
          "questionPaperTemplate_Word",
          "questionPaperTemplate_Word_SampleData",
        ]}
      />
      <PagesHeader headerText = {"Demo Question paper"} 
        customElementsComponent = {handledemofunction}
      />
      <div className="common-dark-box">
        <div className="common-title-wrapper-dark">
          <div className="common-dark-box-title">
            {appliedFilters && (
              <div
                hidden={
                  appliedFilters.isCurrentDateSelected === false &&
                  appliedFilters.isDateRangeSelected === false &&
                  appliedFilters.applicableFor.length === 0 &&
                  true
                }
                className="appliedFilters"
              >
                {appliedFilters.isCurrentDateSelected === true && (
                  <div className="appliedFilters-sub">
                    <div className="sub-boxes">
                      <span className="filter-item">
                        {appliedFilters.currentDate !== ""
                          ? `${moment(appliedFilters.currentDate).format(
                              "DD-MM-YYYY"
                            )}`
                          : ""}
                      </span>
                      <span
                        className="cancel-button-icon"
                        onClick={() => {
                          if (
                            appliedFilters.isDateRangeSelected === false &&
                            appliedFilters.applicableFor.length === 0
                          ) {
                            clearFilters();
                          }
                          setFilterParams(
                            (filterParams.currentDate = ""),
                            (filterParams.isCurrentDateSelected = false)
                          );
                          UpdateFilterParams(filterParams);
                          applyFilters();
                        }}
                      >
                        <MdCancel />
                      </span>
                    </div>
                  </div>
                )}

                {appliedFilters.isDateRangeSelected === true && (
                  <div className="appliedFilters-sub">
                    <div className="sub-boxes">
                      <span className="filter-item">
                        {appliedFilters.dateRange.startDate !== ""
                          ? `${moment(
                              appliedFilters.dateRange.startDate
                            ).format("DD-MM-YYYY")}-to-${moment(
                              appliedFilters.dateRange.endDate
                            ).format("DD-MM-YYYY")}`
                          : ""}
                      </span>
                      <span
                        className="cancel-button-icon"
                        onClick={() => {
                          if (
                            appliedFilters.isCurrentDateSelected === false &&
                            appliedFilters.applicableFor.length === 0
                          ) {
                            clearFilters();
                          }
                          setFilterParams(
                            (filterParams.dateRange.startDate = ""),
                            (filterParams.dateRange.endDate = ""),
                            (filterParams.isDateRangeSelected = false)
                          );
                          UpdateFilterParams(filterParams);
                          applyFilters();
                        }}
                      >
                        <MdCancel />
                      </span>
                    </div>
                  </div>
                )}
                {appliedFilters.applicableFor.length > 0 &&
                  appliedFilters.applicableFor.map((course) => {
                    const courseObj = props.courseList.find(
                      (c) => c.id === course
                    );
                    return (
                      <div className="appliedFilters-sub">
                        <div className="sub-boxes">
                          <span className="filter-item">{courseObj.name}</span>
                          <span
                            className="cancel-button-icon"
                            onClick={() => {
                              if (
                                appliedFilters.isCurrentDateSelected ===
                                  false &&
                                appliedFilters.isDateRangeSelected === false &&
                                appliedFilters.applicableFor.length === 1
                              ) {
                                clearFilters();
                              }
                              let courseList = [];
                              courseList = courseListForExamFilters;
                              let ind = courseListForExamFilters.findIndex(
                                (cou) => cou.id === course
                              );
                              courseList[ind].isChecked = false;
                              setCourseListForExamFilters(courseList);
                              let filters = appliedFilters;
                              let list = [];
                              list = appliedFilters.applicableFor;
                              let findIndex = list.indexOf(course);
                              if (findIndex !== -1) {
                                list.splice(findIndex, 1);
                                filters.applicableFor = list;
                                setAppliedFilters(filters);
                              }
                              setFilterParams(appliedFilters);
                              applyFilters();
                              // setUpdater(!updater);
                            }}
                          >
                            <MdCancel />
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          <div className="multiexpand-box Multi-Wrap">
            <div className="filter-popup-icon-box">
              <button
                className="glow-on-hover"
                type="button"
                onClick={(e) => {
                  let CoOrdinates = xyCoordinates;
                  CoOrdinates.x = `${e.pageX}px`;
                  CoOrdinates.y = `${e.pageY}px`;
                  console.log("mouseX", xyCoordinates);
                  setShowFilterMenu(!showFilterMenu);
                  setXYCoordinates(CoOrdinates);
                }}
              >
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip
                      id="quetion-paper-filter-tooltip"
                      className="common-tooltip"
                    >
                      Filters
                    </Tooltip>
                  }
                >
                  <BsFilterRight size={20} style={{ color: "black" }} />
                </OverlayTrigger>
              </button>
              {showFilterMenu && xyCoordinates.x && xyCoordinates.y && (
                <div className="filterMenu">
                  <FilterMenu
                    showFilterMenu={showFilterMenu}
                    filterParam={filterParams}
                    UpdateFilterParams={UpdateFilterParams}
                    courseList={courseListForExamFilters}
                    columnWiseFormat={columwiseFormat}
                    clearFilters={() => {
                      clearFilters();
                    }}
                    applyFilters={() => {
                      applyFilters();
                    }}
                    closeHandle={() => {
                      setShowFilterMenu(false);
                    }}
                  />
                </div>
              )}
            </div>
            <div className="multi-switch-btn-box">
              <Form.Check
                type="switch"
                id="custom-switch"
                label="Multi Expand"
                className="label-switch"
                onChange={() => setMultiExpand(!isMultiExpand)}
              />
            </div>
          </div>
        </div>
        {
          <div
            id="myscroll"
            onScroll={(e) => {
              setScrollPosition(e.target.scrollTop);
              if (
                document.getElementById("myscroll").scrollTop +
                  document.getElementById("myscroll").scrollHeight >=
                document.getElementById("myscroll").clientHeight - 20
              ) {
                handelScrollPosition(e);
              }
            }}
            className={
              condition
                ? " card-box-main-wrapper scroll-hide-show"
                : "card-box-main-wrapper "
            }
          >
            {showLoader && (
              <div className="loader">
                <Spinner animation="border" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              </div>
            )}
            {examLists.length === 0 && !showLoader && (
              <div className="no-data-found">
                {checkFilterStatus() ? (
                  <h3>No Question papers found for Applied filters.</h3>
                ) : (
                  <h3>
                    No question papers found, please
                    <OverlayTrigger
                      placement="bottom"
                      overlay={
                        <Tooltip id="tooltip-bottom" className="common-tooltip">
                          Import question paper{" "}
                        </Tooltip>
                      }
                    >
                      <button
                        type="button"
                        onClick={() => {
                          handleShow();
                        }}
                        className="common-btn-import  "
                      >
                        <BsCloudUpload size={20} />
                        Import
                      </button>
                    </OverlayTrigger>
                  </h3>
                )}
              </div>
            )}
            {isMultiExpand ? (
              examListTable()
            ) : (
              <Accordion style={{ paddingTop: 20 }}>
                {examListTable()}
              </Accordion>
            )}
          </div>
        }
      </div>
      {/*************** Modal  ************************/}
      {/* Create test modal */}
      <CreateTestModal
        show={show}
        courseList={props.courseList}
        subjectList={props.subjectList}
        handleClose={handleClose}
        handleCreateSubmit={handleCreateSubmit}
        handleExamUpload={handleExamUpload}
        createTestJSON={createTestJSON}
        upatecreateJSON={upatecreateJSON}
        columwiseFormat={columwiseFormat}
        isSubjectMappingRequire={isSubjectMappingRequire}
        mappingError={mappingError}
        showMappingPopup={() => setShowSubjectMappingModal(true)}
        showLoader={showCreateTestLoader}
        isValidCreateData={isValidCreateData}
        showOverlayOncreate={showOverlayOncreate}
        selectedFile={selectedExamFile}
        CloseFile={handelCloseFile}
        Disabled={disabledUpload}
        updateExamList={getExamList}
        accountCourses={accountData}
      />
      <DemoModal 
        show = {demoShowModal}
        courseList={props.courseList}
        handleDemoClose={handleDemoClose}
      />
      {/* Edit Test Modal  */}
      {showEditModal && (
        <EditTestModal
          showEditModal={showEditModal}
          examDataForEdit={examDataForEdit}
          courseList={props.courseList}
          handleCloseEditModal={handleCloseEditModal}
          handleEdit={handleEdit}
          editLoader={editLoader}
        />
      )}
      {/* File explorer modal */}
      <AssingModal
        showfileExplorerModel={showfileExplorerModel}
        handleCloseforFileExploere={handleCloseforFileExploere}
        isFileExploere={isFileExploere}
        selectedTest={selectedTest}
        onPreviousClick={onPreviousClick}
        onSubmitFileExplorer={onSubmitFileExplorer}
        createTestJSON={createTestJSON}
        upatecreateJSON={upatecreateJSON}
        explorerData={props.explorerData}
        updateExamList={getExamList}
      />
      {/* Subject Mapping modal */}
      <SubjectMappingModal
        showSubjectMappingModal={showSubjectMappingModal}
        closeSubjectMappingModal={closeSubjectMappingModal}
        onSubjectMapingSubmit={onSubjectMapingSubmit}
        documentSubjects={documentSubjects}
        subjectList={props.subjectList}
        courseWiseSubjects={courseWiseSubjects}
      />
      {/*************** end Modal section  ************************/}

      {/* Exam Preview Modal */}
      {examPreviewData && mappedSubjects && (
        <ExamQuestionPreviewModal
          showExamPreviewModal={showExamPreviewModal}
          CloseExamPreviewModal={CloseExamPreviewModal}
          examPreviewData={examPreviewData}
          mappedSubjects={mappedSubjects}
          DocumentSubjects={documentSubjects}
          Subjects={subjects}
        />
      )}
      {/*************** end Exam Preview Modal ********************/}
    </div>
  );
};
const mapPropsToState = (state) => {
  return {
    //examList: state.examList,
    accountList: state.accountList,
    explorerData: state.explorerData,
    courseList: state.courseList,
    subjectList: state.subjectList,
  };
};

export default connect(mapPropsToState)(QuestionPapers);
