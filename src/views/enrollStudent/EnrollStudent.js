/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Tooltip, OverlayTrigger, Button, Modal, ListGroup, Form, InputGroup, FormControl, Spinner, Dropdown, FormGroup, Col, Image, Toast, Table } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { Api, CommonApiCall } from '../../services';
import { UrlConfig } from '../../config';
import moment from 'moment';
import { CSVReader, jsonToCSV } from 'react-papaparse';
import { DynamicAddPopUp, ConfirmationModal, PagesHeader } from '../../components';
import EditModal from './Modals/EditModal';
import { BsChevronDoubleDown, BsPeople, BsCloudUpload, BsThreeDots } from 'react-icons/bs'
import { GrClose } from 'react-icons/gr';
import { FcServices, FcUpload } from "react-icons/fc";
import CommonFunctions from '../../utils/CommonFunctions';
import StudentExportModal from './Modals/StudentExportModal';
import AttemptedExamModal from './Modals/AttemptedExamModal';
import ViewPasscodeModal from './Modals/ViewPasscodeModal';
import StudentCommonFunctions from './StudentCommonFunctions';
import { MdMail, MdDelete, MdEdit } from "react-icons/md";
import { FaUserCircle, FaPhoneAlt, FaUserEdit, FaCheck, FaRegWindowClose, FaKey } from "react-icons/fa";


import assets from '../../assets';
import StudentShiftModal from './Modals/StudentShiftModal';
const buttonRef = React.createRef()
const inputRef = React.createRef();
const EnrollStudent = (props) => {

  // FormData Object
  let formData = new FormData();

  //For Context Menu
  const [auxClickMenu1, setAuxClickMenu1] = useState(true)
  const [showBatches1, setSubShow1] = useState(true)

  // Bug Fixes
  const [showLoader, setLoader] = useState(false);
  const [LoaderForDetail, setLoaderForDetail] = useState(false);
  const [addPopupLoader, setAddPopupLoader] = useState(false);
  // For Add Functionality
  const [details, setDetails] = useState({
    InstituteName: "",
    BranchName: "",
    ClassName: "",
    DivisionName: "",
  });

  // student Report 
  const [display, setDisplay] = useState({

    BranchDisplay: false,
    ClassDisplay: false,
    DivisionDisplay: false,
    StudentDisplay: false

  })

  const [placeHolder, setPlaceHolder] = useState({
    InstituteHolder: false,
    BranchHolder: false,
    ClassHolder: false,
    DivisionHolder: false,
    StudentHolder: false
  });


  // *********************************************************For Explorer*********************************************************
  const [instituteIndex, setinstituteIndex] = useState(-1);
  const [branchIndex, setBranchIndex] = useState(-1);
  const [classIndex, setclassIndex] = useState(-1);
  const [divisionIndex, setdivisionIndex] = useState(-1);
  const [studentIndex, setStudentIndex] = useState(-1)
  const [activeMainIndex, setActiveIndex] = useState(-1);
  const [studentArray, setStudentArray] = useState([]);
  const [FileExplorerArray, setFileExplorerArray] = useState(props.explorerData);



  //********************************************************* for file preview*********************************************************
  let j = 0;
  let i = 0;
  const [fileColour, setFileNameColour] = useState("white");
  const [filePreviewData, setfilePreviewData] = useState([]);
  const [fileHeaders, setFileHeaders] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //********************************************************* For search student*********************************************************
  const [studentSearch, setStudentSearch] = useState("")
  const [formDataData, setFormDataData] = useState({})

  //********************************************************* For Edit student email*****************************************************
  const [emailText, setEmailTextOrInput] = useState(true);
  const [emailValue, setEmailValue] = useState("");
  useEffect(() => {
    console.log('emailText', emailText);
  }, [emailText])

  const updateStudentEmailAddress = (selectedStudent) => {
    console.log('selectedStudent', selectedStudent);

    const { id, userInfo } = selectedStudent;
    const payload = {
      "id": `${id}`,
      "emailOrPhone": `${emailValue}`,
    }

    console.log('payload', payload);
    Api.putApi(`${UrlConfig.apiUrls.updateStudentEmail}/${id}`, payload)
      .then((response) => {
        console.log('response', response);
        let updatedStudentData = studentArray;
        updatedStudentData[studentIndex].userInfo.userName = emailValue;
        updatedStudentData[studentIndex].userInfo.email = emailValue;
        setStudentArray(updatedStudentData);
        setEmailValue("");
        toast.success('Email Updated Successfully !')
        setEmailTextOrInput(true);
      })
      .catch((error) => {
        console.log('error==>', error);
        setAddPopupLoader(false);
        const errorMessage = CommonFunctions.apiErrorMessage(error);
        console.log('errorMessage', errorMessage)
        toast(errorMessage, {
          type: "error",
        });
      })
  }

  // ******************************************************** For Export Student Function************************************************
  const [showStudentExportModal, setShowStudentExportModal] = useState(false)
  const [dataForExportStudent, setDataForExportStudent] = useState([])
  const closeStudentExportModal = () => setShowStudentExportModal(false);

  const [showAttemptedExamModal, setShowAttemptedExamModal] = useState(false)
  const closeAttemptedExamModal = () => setShowAttemptedExamModal(false);
  // ********************************************Export Students***********************************
  const ExportHandle = (url, data) => {
    let url1 = url === "instituteId" ? 'instituteId' : url === "branchId" ? 'branchId' : url === 'classId' ? 'classId' : 'batchId'
    let rawDataArray = []
    rawDataArray.push(url1);
    rawDataArray.push(data.name)
    rawDataArray.push(data.id)
    rawDataArray.push(details)
    setDataForExportStudent(rawDataArray);
    console.log('dataFromClick', data);
    setShowStudentExportModal(true);
  }
  //Abhi Work // *******************************************Add functionality for Add Button+*******************************************
  const handelPopup = (event) => {
    setDetails({
      ...details,
      [event.target.name]: event.target.value,
    });
  };


  // ********************************************Setting UP ID's for + button***********************************
  const [instituteId, setInstituteId] = useState("")
  const [branchId, setBranchId] = useState("")
  const [classId, setClassId] = useState("")
  const [batchId, setBatchId] = useState("")
  const [studentId, setStudentId] = useState("")

  //*********************************** student Test List  */
  const [userGivenTestList, setTestList] = useState([]);

  // ********************************************Update Fields***********************************
  const [EmailFlag, setEmailFlag] = useState(false);
  const updateBranchInputs = (e) => {
    if (e.target.name === "postalCode") {
      if (isNaN(e.target.value)) {
        return false;
      }

    }
    if (e.target.name === "sortingIndex") {
      if (isNaN(e.target.value)) {
        return false;
      }
    }
    setBranchInputs({
      ...branchInputs,
      [e.target.name]: e.target.value,
    });
  }

  const updateclassInputs = (e) => {
    setClassInputs({
      ...classInputs,
      [e.target.name]: e.target.value,
    });
  }

  const updatebatchInputs = (e) => {
    setBatchInputs({
      ...batchInputs,
      [e.target.name]: e.target.value,
    });
  }

  const updateStudentInputs = (e) => {
    if (e.target.name === "code") {
      if (isNaN(e.target.value)) return false;
    }
    setStudentInputs({
      ...studentInputs,
      [e.target.name]: e.target.value,
    });
  }

  const [addUpdateModalView, setAddUpdateModalView] = useState(null);

  const handleCreateSubmit = (value) => {
    let payload = {};
    switch (value) {
      // *******************************BRANCH ADD******************************************************
      case 1:
        console.log('instituteId', instituteId);
        payload = {
          "name": `${branchInputs.name}`,
          "description": `${branchInputs.description}`,
          "address": `${branchInputs.address}`,
          "city": "",
          "postalCode": `${branchInputs.postalCode}`,
          // "email": `${branchInputs.email}`,
          "phone": `${branchInputs.phone}`
        }
        setAddPopupLoader(true);
        Api.postApi(UrlConfig.apiUrls.createBranch, payload)
          .then((response) => {
            console.log('***************** ' + response);
            setAddPopupLoader(false);
            toast.success(`Branch: ${branchInputs.name} created`)
            resetDynamicPopupFields(1);
            CommonApiCall.getInstituteData();
          }).catch((error) => {
            const errorMessage = CommonFunctions.apiErrorMessage(error);
            console.log('errorMessage', errorMessage)
            setAddPopupLoader(false);
            toast(errorMessage, {
              type: "error",
            });
          })
        break;

      // *******************************CLASS ADD******************************************************
      case 2:
        console.log(branchId);
        payload = {
          name: `${classInputs.name}`,
          branchId: `${branchId}`,
        }
        setAddPopupLoader(true);
        Api.postApi(UrlConfig.apiUrls.createClass, payload)
          .then((response) => {
            console.log('***************** ' + response);
            setAddPopupLoader(false);
            toast.success(`Class: ${classInputs.name} created`)
            resetDynamicPopupFields(2);
            CommonApiCall.getInstituteData();
          }).catch((error) => {
            const errorMessage = CommonFunctions.apiErrorMessage(error);
            console.log('errorMessage', errorMessage)
            setAddPopupLoader(false);
            toast(errorMessage, {
              type: "error",
            });
          })
        break;

      // *******************************BATCH ADD******************************************************
      case 3:
        console.log(classId);
        payload = {
          name: `${batchInputs.name}`,
          classId: `${classId}`,
        }
        setAddPopupLoader(true);
        Api.postApi(UrlConfig.apiUrls.createBatch, payload)
          .then((response) => {
            console.log('***************** ' + response);
            setAddPopupLoader(false);
            toast.success(`Batch: ${batchInputs.name} Created`)
            resetDynamicPopupFields(3);
            CommonApiCall.getInstituteData();
          }).catch((error) => {
            const errorMessage = CommonFunctions.apiErrorMessage(error);
            console.log('errorMessage', errorMessage)
            setAddPopupLoader(false);
            toast(errorMessage, {
              type: "error",
            });
          })
        break;

      // *******************************STUDENT ADD******************************************************
      case 4:
        console.log('student');
        payload = {
          studentCode: `${studentInputs.code}`,
          name: `${studentInputs.name}`,
          EmailOrPhone: `${studentInputs.email.toLowerCase()}`,
          phone: "",
          postalCode: "",
          batchId: `${batchId}`
        }
        setAddPopupLoader(true);
        Api.postApi(UrlConfig.apiUrls.createStudent, payload)
          .then((Response) => {
            console.log('***************** ' + Response);

            FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].batches[divisionIndex].students = [];
            getStudentList(divisionIndex);
            resetDynamicPopupFields(4);
            setAddPopupLoader(false);
            toast.success(`${studentInputs.name} Added Successfully !`)
          }).catch((error) => {
            const errorMessage = CommonFunctions.apiErrorMessage(error);
            console.log('errorMessage', errorMessage)
            setAddPopupLoader(false);
            toast(errorMessage, {
              type: "error",
            });
          })
        break;
      default:
        break;
    }
  }

  // *******************************************Branch View*******************************************
  const [branchInputs, setBranchInputs] = useState(
    {
      name: "",
      description: "",
      email: "",
      phone: "",
      address: "",
      postalCode: "",
      city: ""
    });
  const BranchView = (id) => {
    return (
      <Form onSubmit={event => event.preventDefault()}>
        <div className="form-group">
          <input id="name" className="form-control" required
            name="name"
            value={branchInputs.name}
            type="name"
            onChange={updateBranchInputs}
            autoComplete="off"
          />
          <label className="form-control-placeholder">Branch Name</label>
        </div>
        <div className="form-group">
          <input id="postalCode" className="form-control" required
            name="postalCode"
            minLength="6"
            maxLength="6"
            value={branchInputs.postalCode}
            type="postalCode"
            onChange={updateBranchInputs}
            autoComplete="off"
          />
          <label className="form-control-placeholder">PostalCode</label>
        </div>
        {display.isUpdate && <div className="form-group">
          <input id="sortingIndex" className="form-control" required
            name="sortingIndex"
            minLength="1"
            value={branchInputs.sortingIndex}
            type="sortingIndex"
            onChange={updateBranchInputs}
            autoComplete="off"
          />
          <label className="form-control-placeholder">Sorting Index</label>
        </div>}
      </Form>
    )
  }

  // *******************************************Class View*******************************************
  const [classInputs, setClassInputs] = useState({ "name": "", "branchId": "" })
  const ClassView = (id) => {
    return (
      <Form onSubmit={event => event.preventDefault()}>
        <div className="form-group">
          <input id="name" className="form-control" required
            name="name"
            value={classInputs.name}
            type="name"
            onChange={updateclassInputs}
            autoComplete="off"
          />
          <label className="form-control-placeholder">Class Name</label>
        </div>
        {display.isUpdate && <div className="form-group">
          <input id="sortingIndex" className="form-control" required
            name="sortingIndex"
            minLength="1"
            value={classInputs.sortingIndex}
            type="sortingIndex"
            onChange={updateclassInputs}
            autoComplete="off"
          />
          <label className="form-control-placeholder">Sorting Index</label>
        </div>}
      </Form>
    )
  }

  // *******************************************batch View*******************************************
  const [batchInputs, setBatchInputs] = useState({
    "name": "", "classId": ""
  })
  const BatchView = (id) => {
    return (
      <Form onSubmit={event => event.preventDefault()}>
        <div className="form-group">
          <input id="name" className="form-control" required
            name="name"
            value={batchInputs.name}
            type="name"
            autoComplete="on"
            onChange={updatebatchInputs}
          />
          <label className="form-control-placeholder">Batch Name</label>
        </div>
        {display.isUpdate && <div className="form-group">
          <input id="sortingIndex" className="form-control" required
            name="sortingIndex"
            minLength="1"
            value={batchInputs.sortingIndex}
            type="sortingIndex"
            onChange={updatebatchInputs}
            autoComplete="off"
          />
          <label className="form-control-placeholder">Sorting Index</label>
        </div>}
      </Form>
    )
  }


  // *******************************************Student View*******************************************
  const [studentInputs, setStudentInputs] = useState({
    "batchId": "",
    "name": "",
    "email": "",
    "phone": "",
    "code": ""
  })
  const StudentView = () => {
    return (
      <div >
        <Form onSubmit={event => event.preventDefault()}>
          <div className="student-popup-main-wrapper">
            <div className="row">
              <div className="col-sm-2">
                <div className="form-group">
                  <input id="code" className="form-control" required
                    name="code"
                    value={studentInputs.code}
                    onChange={updateStudentInputs}
                    type="code"
                    autoComplete="on"
                  />
                  <label className="form-control-placeholder">Code<sup>*</sup></label>
                </div>
              </div>
              <div className="col-sm-5">
                <div className="form-group">
                  <input id="name" className="form-control" required
                    name="name"
                    value={studentInputs.name}
                    onChange={updateStudentInputs}
                    type="name"
                    autoComplete="on"
                  />
                  <label className="form-control-placeholder">Student Name<sup>*</sup></label>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="form-group">
                  <input id="email" className="form-control" required
                    name="email"
                    value={studentInputs.email}
                    onChange={updateStudentInputs}
                     placeholder=" "
                    onBlur={(e) => {
                      // if(e.target.value)
                      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(e.target.value)) {
                        setEmailFlag(false);
                        return (true)
                      } else {
                        // alert("You have entered an invalid email address!")
                        setEmailFlag(true);
                        return (false)
                      }

                    }}
                    type="email"
                    autoComplete="on"
                  />
                  {/* <span className="highlight"></span> */}
                  <label className="form-control-placeholder">Email<sup>*</sup></label>
                  <span hidden={EmailFlag ? false : true} style={{ letterSpacing: "1px", color: "red", fontSize: "12px", textShadow: "2px 2px 10px red" }}>* Enter Correct Email</span>
                </div>
              </div>
            </div>
          </div>
        </Form>
      </div>
    )
  }

  // ****************************************************Edit Student View**********************************

  const [showModal, setShowModal] = useState(false);
  const EditStudentView = (studentData) => {
    return (
      <div onMouseOver={() => { inputRef.current.focus() }}>
        <Form onSubmit={event => event.preventDefault()}>
          <div className="student-popup-main-wrapper">
            <div className="row">
              <div className="col-sm-6">
                <div className="form-group">
                  <input id="code1" className="form-control"
                    readOnly
                    name="code1"
                    value={studentData && studentData.code}
                    type="code1"
                  />
                  <label className="form-control-placeholder"> Old Code<sup>*</sup></label>
                </div>
              </div>

              <div className="col-sm-6">
                <div className="form-group">
                  <input id="code" className="form-control" required
                    minLength="1"
                    ref={inputRef}
                    name="code"
                    value={studentInputs.code}
                    onChange={updateStudentInputs}
                    type="code"
                    autoComplete="on"
                  />
                  <label className="form-control-placeholder">New Code<sup>*</sup></label>
                </div>
              </div>

            </div>
          </div>
        </Form>
      </div>
    )
  }
  // *******************************************************************************************************

  useEffect(() => {
    if ((!props.explorerData || props.explorerData.length === 0) && (props.accountList && props.accountList.length > 0)) {
      CommonApiCall.getInstituteData();
    }
  }, []);

  useEffect(() => {
    // console.log('explorerDataassss', explorerData)
    // if (!FileExplorerArray || FileExplorerArray.length === 0) setFileExplorerArray(props.explorerData)
    setFileExplorerArray(props.explorerData)
  }, [props.explorerData]);

  // ***********************************************Get Students List*******************************************************
  const getStudentList = (di) => {
    const selectedBatch = FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].batches[di];
    if (selectedBatch) {
      console.log('selectedBatch', selectedBatch)
      const { id } = selectedBatch;
      setLoader(true);
      Api.getApi(`${UrlConfig.apiUrls.getStudentList}`, { batchId: id, OrderBy: "name", PageSize: 500 })
        .then((response) => {
          let studentArray = [];
          if (response) {
            const { data } = response;
            if (data && data.length > 0) {
              console.log('studentDataResponse', data);
              data.map((student, index) => {
                const obj = { ...student, userId: student.userInfo.id, name: student.userInfo.name, code: student.code };
                studentArray.push(obj);
                setLoader(false);
              });
            }
          }
          setLoader(false);
          FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].batches[di].students = studentArray;
          setStudentArray(studentArray);
        })
        .catch(error => {
          setLoader(false);
          const errorMessage = CommonFunctions.apiErrorMessage(error);
          toast(errorMessage, {
            type: "error",
          });
        });
    }
  }

  //*********************************************************/ Import file Handles**************************************************************
  useEffect(() => {
    console.log('fileHeaders', fileHeaders);
  }, [fileHeaders])

  const handleOpenDialog = (e) => {
    console.log(e);
    if (buttonRef.current) {
      setFileNameColour("white");
      buttonRef.current.open(e);
      // formData.append('file',e.target.files[0]);
    }
  }
  const handleOnFileLoad = (data, meta) => {
    console.log(data)
    console.log(meta);
    setFormDataData(meta);
    let fileName = meta.name.toLowerCase();
    let filePattern = /(\.csv)$/i;
    if (filePattern.exec(fileName)) {
      console.log('Valid file')
      setfilePreviewData(data)
      if (data && data[0]) {
        setFileHeaders(data[0].meta.fields)
      }
      setTimeout(() => {
        handleShow();
      }, 500);

    } else {
      console.log('invalid file')
      setFileNameColour("red");
      toast("Invalid File Type", {
        type: "error"
      })
    }
  }

  const handleOnRemoveFile = (data) => {
    console.log(data)
  }

  const handleRemoveFile = (e) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.removeFile(e)
      setFileHeaders([])
      setfilePreviewData([])
    }
  }
  // ******************************************************************************************************************
  // *********************************************************Handle Import Student*********************************************************
  const handleUpload = () => {

    console.log('formData', formDataData);
    formData.append('file', formDataData);
    setLoader(true);
    Api.postApi(UrlConfig.apiUrls.importStudent, formData)
      .then((response) => {
        setLoader(false);
        toast.success("Students Imported Successfully!", {
          style: { zIndex: "11111" }
        });
        console.log(response)
        console.log('**** response data', response.data);
      })
      .catch((error) => {
        setLoader(false);
        const errorMessage = CommonFunctions.apiErrorMessage(error);
        console.log('errorMessage', errorMessage)
        toast(errorMessage, {
          type: "error",
        });
      })
  }
  //********************************************************* Views ********************************************************************
  //********************************************************* Page Header*********************************************************
  const PageHeader = () => {
    return (
      <div className="page-header-wrapper">
        <div className="page-header">
          <h3 className="page-title">
            Import Students
          </h3>
          <div className="right-side-box">
            <div className="upload-box">
              <CSVReader
                ref={buttonRef}
                name="file"
                onFileLoad={handleOnFileLoad}
                onRemoveFile={handleOnRemoveFile}
                noProgressBar
                config={{
                  header: true,
                  fastMode: true,
                  skipEmptyLines: true
                }}
              >
                {({ file }) => (
                  <div
                    className="import-btn-main-box"
                  >
                    <div className="selected-file-box">
                      {
                        file &&
                        <div className="close-selected-box">
                          <button className="close-btn" onClick={handleRemoveFile}><GrClose /></button>
                        </div>
                      }
                      <div className="selected-text-box" style={{ color: `${fileColour}` }}  >
                        <a onClick={handleShow} >{file && file.name.includes('.csv') && file.name}</a>
                      </div>

                    </div>
                    <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-bottom" className="common-tooltip">.csv</Tooltip>}>
                      <>
                        <button
                          type='button'
                          onClickCapture={handleOpenDialog}
                          onChange={handleOpenDialog}
                          className="common-btn-import"
                        >
                          <BsCloudUpload size={20} />
                        Import
                   </button>
                      </>
                    </OverlayTrigger>

                  </div>
                )}
              </CSVReader>
            </div>
          </div>
        </div>
      </div>
    )
  }
  // ******************************************************************************************************************


  // *********************************************************Search Function View*********************************************************
  const SearchView = () => {
    return (
      <div className="explorerSearchWrapper" style={{ width: "250px" }}>
        <InputGroup>
          <FormControl
            placeholder="Search Student"
            aria-label="Search"
            aria-describedby="basic-addon2"
            value={studentSearch} onChange={(e) => {
              setStudentSearch(e.target.value)
            }}
          />
          <InputGroup.Append>
            <Button variant="outline-secondary"><i className="fa fa-search"></i></Button>
          </InputGroup.Append>
        </InputGroup>
      </div>
    )
  }

  // ******************************HandleBatchShift*****************************************
  const HandleBatchShift = async (studentData, batch, newDivisionIndex) => {
    // console.log('studentData', studentData);
    const result = await StudentCommonFunctions.StudentBatchShift(studentData, batch, newDivisionIndex)
    console.log('result=============>>>>>>>>>', result);
    if (result === "success") {
      const oldStudentArray = FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].batches[divisionIndex].students;
      console.log('oldStudentArray', oldStudentArray);
      const newStudentArray = await oldStudentArray.filter(s => s.id !== studentData.id)
      console.log('newStudentArray', newStudentArray);
      FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].batches[newDivisionIndex].students = []
      FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].batches[divisionIndex].students = newStudentArray;
      getStudentList(divisionIndex);
      setdivisionIndex(divisionIndex);
    }
  }

  // ******************************Handle Code Change*****************************************
  const handleCodeChangeSubmit = (studentData) => {

    const { id } = studentData;
    const payload = {
      "id": `${id}`,
      "code": `${studentInputs.code}`
    }
    setAddPopupLoader(true);
    Api.putApi(`${UrlConfig.apiUrls.students}/${id}`, payload)
      .then((response) => {
        console.log('response==>', response)
        toast.success(`Student Code updated to "${studentInputs.code}"`)
        setStudentInputs({
          "batchId": "",
          "name": "",
          "email": "",
          "phone": "",
          "code": ""
        })
        FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].batches[divisionIndex].students = [];
        getStudentList(divisionIndex);
        setdivisionIndex(divisionIndex);
        setShowModal(false);
        setAddPopupLoader(false);
      }).catch((error) => {
        console.log('error==>', error);
        setAddPopupLoader(false);
        const errorMessage = CommonFunctions.apiErrorMessage(error);
        console.log('errorMessage', errorMessage)
        toast(errorMessage, {
          type: "error",
        });
      })
  }

  //********************************************************* Student Right Click Menu *********************************************************
  const [showStudentShiftModal, setShowStudentShiftModal] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [studentShiftLoader, setStudentShiftLoader] = useState(false);
  const handleShiftStudentClose = () => {
    setShowStudentShiftModal(false);
  }
  const handleShiftStudent = (newBatch, studentData, newBranchIndex, newClassIndex, newBatchIndex) => {
    console.log('newBatch==>', newBatch);
    console.log('studentData', studentData);
    console.log('oldBranch,oldClass,oldBatch', branchIndex, classIndex, divisionIndex)
    console.log('newBranchIndex, newClassIndex, newBatchIndex', newBranchIndex, newClassIndex, newBatchIndex);
    setStudentShiftLoader(true);
    const payload = {
      "studentIds": [`${studentData.id}`],
      "batchId": `${newBatch.id}`
    }
    Api.putApi(UrlConfig.apiUrls.changeStudentBatch, payload)
      .then((response) => {
        console.log('response', response);
        const oldStudentArray = FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].batches[divisionIndex].students;
        console.log('oldStudentArray', oldStudentArray);
        const newStudentArray = oldStudentArray.filter(s => s.id !== studentData.id)
        console.log('newStudentArray', newStudentArray);
        FileExplorerArray[instituteIndex].branches[newBranchIndex].classes[newClassIndex].batches[newBatchIndex].students = []
        FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].batches[divisionIndex].students = newStudentArray;
        getStudentList(divisionIndex);
        setdivisionIndex(divisionIndex);
        setStudentShiftLoader(false);
        setShowStudentShiftModal(false);
        toast.success('Student Shifted Successfully !!');
      })
      .catch((error) => {
        const errorMessage = CommonFunctions.apiErrorMessage(error);
        toast.error(errorMessage);
        setStudentShiftLoader(false);
      })
  }
  const RightClickMenu = (student) => {
    let studentData = student;
    console.log('studentData', studentData);
    return (
      <ListGroup className="commonListContent" id="context-menu-01"
        style={{
          maxWidth: "120px",
          position: "absolute",
          zIndex: "9999",
          fontSize: "small",
          boxShadow: "0px 1px 50px 5px black",
          left: "50%",
          border: "dotted 1px white"
        }}
        hidden={auxClickMenu1}
      >
        <ListGroup.Item
          onMouseOver={() => setSubShow1(true)}
          style={{ padding: "6px", background: "rgb(39, 40, 40)", color: "white", fontFamily: 'GOTHIC', fontSize: 12 }}
          className="context-menu-item">Change branch</ListGroup.Item>
        <ListGroup.Item
          onMouseOver={() => setSubShow1(true)}
          onClick={() => {
            setStudentData(student);
            setShowStudentShiftModal(true);
          }}
          style={{ padding: "6px", background: "rgb(39, 40, 40)", color: "white", fontFamily: 'GOTHIC', fontSize: 12 }} className="context-menu-item" >Student Shift</ListGroup.Item>
        {/* <ListGroup.Item
          onMouseOver={() => setSubShow1(true)}
          style={{ padding: "6px", background: "rgb(39, 40, 40)", color: "white", fontFamily: 'GOTHIC', fontSize: 12 }} className="context-menu-item" >Copy to another batch</ListGroup.Item> */}
        <EditModal
          showModal={showModal}
          Detail={studentData}
          setShowModal={setShowModal}
          View={EditStudentView(studentData)}
          buttonValidation={(studentInputs.code.length <= 0 || studentInputs.code === studentData.code) ? 'disabled' : ''}
          handleSubmit={() => handleCodeChangeSubmit(studentData)}
          addPopupLoader={addPopupLoader}
        />
        <ListGroup.Item className="btn btn-secondary"
          style={{ padding: "6px", background: "rgb(39, 40, 40)", color: "white", fontFamily: 'GOTHIC', fontSize: 12 }}
          onMouseOver={() => setSubShow1(false)}
        >Change batch<i className="fa fa-angle-double-right"></i>
          {/* Submenu */}
          <ListGroup
            hidden={showBatches1}
            style={{
              background: "rgb(39, 40, 40)",
              position: "absolute", left: "-109%", top: "16%",
              boxShadow: "0px 1px 50px 5px black", width: "120px", maxWidth: "120px",
              border: "dotted 1px white"
            }}
          >
            {props.explorerData[instituteIndex].branches[branchIndex].classes[classIndex].batches.map((batch, dIndex) => {
              return (
                <button style={{
                  textAlign: "left", fontFamily: 'GOTHIC', fontSize: 12, textOverflow: "ellipsis",
                  overflow: "hidden", whiteSpace: "nowrap", zIndex: "99999"
                }} className="btn btn-secondary" title={batch.name}
                  onClick={() => {
                    HandleBatchShift(studentData, batch, dIndex)
                  }}
                >{batch.name}</button>
              )
            })}
          </ListGroup>
        </ListGroup.Item>
      </ListGroup>
    )
  }

  //********************************************************* Modal Content*********************************************************
  const ModalContent = () => {
    return (
      <div className="modal-main-dark">
        <Modal show={show} onHide={handleClose} size="lg" className="modal-dark">
          {showLoader && <div className="loader">
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>}
          <ToastContainer autoClose={5000} position="top-right" className="tost-dark-container" style={{ borderRadius: 5, fontFamily: 'GOTHIC' }} />
          <Modal.Header closeButton>
            <div className="modal-title-box">
              <h3>File Preview</h3>
              <span>Total Students to be added: {filePreviewData.length}</span>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div className="student-list-box">
              <h3 className="student-list-box-title"><BsPeople /> Student List</h3>
              <div className="table-responsive">
                <Table striped bordered hover variant="dark" className="dark-light-common-table">
                  <thead>
                    <tr>
                      <th style={{ textAlign: "center" }}> <BsChevronDoubleDown size={15} /> </th>
                      {fileHeaders.map((header, i) => {
                        console.log('header', header)
                        return (<th style={{ textAlign: "center" }} key={j = j + 1}>{header}</th>)
                      })}
                      {/* <th style={{ textAlign: "center" }}>{fileHeaders[4]}</th>
                      <th style={{ textAlign: "center" }}>{fileHeaders[0]}</th>
                      <th style={{ textAlign: "center" }}>{fileHeaders[1]}</th>
                      <th style={{ textAlign: "center" }}>{fileHeaders[2]}</th>
                      <th style={{ textAlign: "center" }}>{fileHeaders[3]}</th>
                      <th style={{ textAlign: "center" }}>{fileHeaders[5]}</th> */}

                    </tr>
                  </thead>
                  <tbody>
                    {filePreviewData.map((student, i) => {
                      console.log('student data', student.data['UserName(Email/Phone)'])
                      const UserName = student.data['UserName(Email/Phone)'];
                      return (
                        <tr key={student.data[3]}>
                          <td style={{ textAlign: "center" }}>{i = i + 1}</td>
                          <td style={{ textAlign: "center" }}>{student.data.BatchCode === "" ? "-" : student.data.BatchCode}</td>
                          <td style={{ textAlign: "center" }}>{student.data.StudentCode === "" ? "-" : student.data.StudentCode}</td>
                          <td style={{ textAlign: "center" }}>{student.data.Name === "" ? "-" : student.data.Name}</td>
                          <td style={{ textAlign: "center" }}>{UserName === "" ? "-" : UserName}</td>
                          <td style={{ textAlign: "center" }}>{student.data.Email === "" ? "-" : student.data.Email}</td>
                          <td style={{ textAlign: "center" }}>{student.data.Phone === "" ? "-" : student.data.Phone}</td>
                          <td style={{ textAlign: "center" }}>{student.data.PostalCode === "" ? "-" : student.data.PostalCode}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" className="closeBtn" onClick={handleClose}>Close</Button>
            <Button variant="primary" className="uploadeBtn"
              onClick={handleUpload}>Upload</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
  // Modal Content end

  // getStudentTestListList



  const getStudentTestList = (studentID) => {
    setLoaderForDetail(true);
    Api.getApi(UrlConfig.apiUrls.studentGivenTest + studentID)
      .then((response) => {
        console.log(response);
        const { data } = response;
        if (data && data.length != 0) {
          let report = [];
          data.map((e, i) => {
            if (e) {
              report.push(e);
            }
          });
          if (report && report.length != 0) {
            setTestList(sortSelectedBatch(report));
            setLoaderForDetail(false);
            setShowAttemptedExamModal(true);
          }
        } else {
          setLoaderForDetail(false);
          toast('Not assigned any exam yet.', {
            type: "error",
          });
        }
      }).catch((error) => {
        setLoaderForDetail(false);
        const errorMessage = CommonFunctions.apiErrorMessage(error);
        console.log('errorMessage', errorMessage)
        setAddPopupLoader(false);
        toast(errorMessage, {
          type: "error",
        });
      })

  }

  const sortSelectedBatch = (report) => {
    const sortedBatches = report.sort((a, b) => {
      let startdateTimeA = moment(a.startDateTime).format(" MM DD YYYY, hh:mm a");
      let startdateTimeB = moment(b.startDateTime).format(" MM DD YYYY, hh:mm a");

      startdateTimeA = Date.parse(new Date(startdateTimeA.split("/").reverse().join("-")));
      startdateTimeB = Date.parse(new Date(startdateTimeB.split("/").reverse().join("-")));
      const isResult = (startdateTimeA > startdateTimeB) ? 1 : -1;

      return isResult;
    })

    return sortedBatches;
  }


  function scrollFunction(flag) {
    // flag === 0 ?
    //   document.getElementById('scrollId').scrollTo({
    //     left: 510,
    //     behavior: 'smooth'
    //   }) :
    //   document.getElementById('scrollId').scrollTo({
    //     left: 0,
    //     behavior: 'smooth'
    //   })
    if (flag === 0) {
      var elem = document.getElementById('scrollId');
      var scrollWidth = elem.offsetWidth;
      elem.scrollTo({
        left: scrollWidth,
        behavior: 'smooth'
      })
      setTimeout(() => {
        elem.scrollTo({
          left: scrollWidth,
          behavior: 'smooth'
        })
      }, 100);
    }
    else {
      document.getElementById('scrollId').scrollTo({
        left: 0,
        behavior: 'smooth'
      })
    }
  }

  const [deleteConfirmatioModal, setDeleteConfirmatioModal] = useState(false);
  const showDeltedConfirmatioModal = () => setDeleteConfirmatioModal(true);
  const closeDeltedConfirmatioModal = () => { setDeleteConfirmatioModal(false); }


  const deleteStudent = () => {
    const { id, name } = studentArray[studentIndex];
    Api.deleteApi(`${UrlConfig.apiUrls.deleteStudent}/${id}`)
      .then((response) => {
        toast.success(`Student: ${name} ed successfully`);
        FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].batches[divisionIndex].students = [];
        getStudentList(divisionIndex);
        closeDeltedConfirmatioModal();
      }).catch((error) => {
        const errorMessage = CommonFunctions.apiErrorMessage(error);
        toast(errorMessage, {
          type: "error",
        });
      })
  }

  const instituteListColumn = () => {
    return (
      <div className="explorerColContentListWrap">
        <div className="explorerColHeaderWrap">
          <div></div>
          <div className="explorerColHeaderTitle">
            <h5>Institiute</h5>
          </div>
          <div className="explorerColHeaderCreate">
            <Button
              onClick={() => {
                setDetails({ ...details, BranchName: "", ClassName: "", DivisionName: "" });
                setPlaceHolder({ ...placeHolder, InstituteHolder: true });
                setDisplay({ ...display, BranchDisplay: false, ClassDisplay: false, DivisionDisplay: false, StudentDisplay: false })
              }}
              className="pluseBtnCommon">
              <i className="fa fa-plus"></i>
            </Button>
          </div>
        </div>
        <ul className="commonListContent" >
          {props.explorerData.map((institute, iIndex) => {
            return (
              <li className="commonListContent" key={institute.id}>
                <Button
                  onClick={() => {
                    setinstituteIndex(iIndex);
                    setInstituteId(institute.id)
                    setBranchIndex(-1);
                    setActiveIndex(0);
                    scrollFunction(1);
                    setDetails({ ...details, BranchName: "", ClassName: "", DivisionName: "" })
                  }} onMouseDown={handelPopup} name="InstituteName" value={props.explorerData[iIndex].name} className={instituteIndex === iIndex ? (activeMainIndex === 0 ? "currentSelect" : 'prevSelect') : "commonListNameBtn"}>
                  {institute.name}
                  <Dropdown hidden={instituteIndex === iIndex ? false : true} className="option-sub-menu">
                    <Dropdown.Toggle className="nav-link count-indicator bg-transparent">
                      <BsThreeDots size={18} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="preview-list navbar-dropdown">
                      <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center"
                        onClick={() => { ExportHandle('instituteId', institute, details.InstituteName) }}>
                        <FcUpload size={15} /> Export Students
                                 </Dropdown.Item>
                      {/* <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center">
                                      <FcServices /> Edit
                                  </Dropdown.Item> */}
                    </Dropdown.Menu>
                  </Dropdown>
                </Button>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  const handleUpdateSubmit = (url, flag, successMessage) => {
    const payload = getUpdatePayload(flag);
    setAddPopupLoader(true);
    Api.putApi(`${url}`, payload)
      .then((response) => {
        const { data } = response;
        if (flag === 4) {
          FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].batches[divisionIndex].students = [];
          getStudentList(divisionIndex);
        } else {
          CommonApiCall.getInstituteData();
        }
        resetDynamicPopupFields(4);
        setAddPopupLoader(false);
        handleCloseDynamicAddPopup(flag)
        toast.success(`${successMessage}`);
      }).catch((error) => {
        const errorMessage = CommonFunctions.apiErrorMessage(error);
        console.log('errorMessage', errorMessage)
        setAddPopupLoader(false);
        toast(errorMessage, {
          type: "error",
        });
      })
  }

  const getUpdatePayload = (flag) => {
    let payload = null;
    switch (flag) {
      case 1:
        return payload = {
          id: `${branchId}`,
          name: `${branchInputs.name}`,
          description: '',
          address: '',
          city: '',
          postalCode: `${branchInputs.postalCode}`,
          phone: '',
          email: '',
          sortingIndex: branchInputs.sortingIndex ? parseInt(branchInputs.sortingIndex) : 0
        }
        break;
      case 2:
        return payload = {
          id: `${classId}`,
          name: `${classInputs.name}`,
          branchId: `${branchId}`,
          sortingIndex: classInputs.sortingIndex ? parseInt(classInputs.sortingIndex) : 0
        }
        break;
      case 3:
        return payload = {
          id: `${batchId}`,
          name: `${batchInputs.name}`,
          classId: `${classId}`,
          sortingIndex: batchInputs.sortingIndex ? parseInt(batchInputs.sortingIndex) : 0
        }
        break;
      case 4:
        return payload = {
          id: `${studentId}`,
          studentCode: `${studentInputs.code}`,
          name: `${studentInputs.name}`,
          email: `${studentInputs.email}`,
          phone: "",
          postalCode: "",
          batchId: `${batchId}`,
        }
        break;
      default:
        return payload;
        break;
    }
  }


  const branchListColumn = () => {
    return (
      <div className="explorerColContentListWrap">

        {instituteIndex !== -1 && <div className="explorerColHeaderWrap">
          <DynamicAddPopUp Detail={details}
            View={BranchView(instituteId)}
            PlaceHolder={placeHolder}
            Display={display}
            handleSubmit={() => display.isUpdate ? handleUpdateSubmit(`${UrlConfig.apiUrls.updateBranches}/${branchId}`, 1, 'Branch updated successfully.') : handleCreateSubmit(1)}
            buttonValidation={(!branchInputs || !branchInputs.postalCode || branchInputs.postalCode.length < 6) ? 'disabled' : branchInputs.name.length < 1 ? 'disabled' : ''}
            addPopupLoader={addPopupLoader}
            showDynamicAddPopup={showDynamicAddPopup === 1}
            closeDynamicAddPopup={() => handleCloseDynamicAddPopup(1)}
          />
          <div className="explorerColHeaderTitle">
            <h5>Branch   {`(${props.explorerData && FileExplorerArray[instituteIndex].branches && FileExplorerArray[instituteIndex].branches.length > 0 ? FileExplorerArray[instituteIndex].branches.length : 0})`}</h5>
          </div>
          <div className="explorerColHeaderCreate">
            <Button onClick={() => {
              setDetails({ ...details, ClassName: "", DivisionName: "" });
              setPlaceHolder({ ...placeHolder, BranchHolder: true, InstituteHolder: false });
              setDisplay({ ...display, BranchDisplay: true, ClassDisplay: false, DivisionDisplay: false, StudentDisplay: false, isUpdate: false });
              handleShowDynamicAddPopup(1);
            }} className="pluseBtnCommon">
              {/* <i className="fa fa-plus"></i> */}
              {/* <Button className="pluseBtnCommon" onClick={handleShow}> */}
              <i className="fa fa-plus"></i>
              {/* </Button> */}
            </Button>
          </div>
        </div>}
        <ul className="commonListContent">
          {instituteIndex !== -1 && props.explorerData[instituteIndex].branches.map((instituteBranch, bIndex) => {
            return <div key={`instituteBranch${instituteBranch.id}`}>
              <li key={instituteBranch.id} ><Button
                onContextMenu={(e) => {
                  setBranchIndex(bIndex);
                }}

                onClick={() => {
                  setBranchIndex(bIndex);
                  setclassIndex(-1);
                  setActiveIndex(1);
                  setBranchId(instituteBranch.id)
                  scrollFunction(1);
                  setDetails({ ...details, ClassName: "", DivisionName: "" });
                }}
                onMouseDown={handelPopup}
                name="BranchName"
                value={props.explorerData[instituteIndex].branches[bIndex].name}
                className={branchIndex === bIndex ? (activeMainIndex === 1 ? "currentSelect " : 'prevSelect') : "commonListNameBtn"}
              >
                {instituteBranch.name}
                <Dropdown hidden={branchIndex === bIndex ? false : true} className="option-sub-menu">
                  <Dropdown.Toggle className="nav-link count-indicator bg-transparent">
                    <BsThreeDots size={18} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="preview-list navbar-dropdown">
                    <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center"
                      onClick={() => { ExportHandle('branchId', instituteBranch, details.BranchName) }}>
                      <FcUpload size={15} /> Export Student
                                 </Dropdown.Item>
                    <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center"
                      onClick={() => {
                        setDetails({ ...details, ClassName: "", DivisionName: "" });
                        setPlaceHolder({ ...placeHolder, BranchHolder: true, InstituteHolder: false });
                        setDisplay({ ...display, BranchDisplay: true, ClassDisplay: false, DivisionDisplay: false, StudentDisplay: false, isUpdate: true });

                        setBranchInputs({
                          name: instituteBranch.name,
                          postalCode: instituteBranch.postalCode,
                          address: instituteBranch.address ? instituteBranch.address : '',
                          city: instituteBranch.city ? instituteBranch.city : '',
                          phone: instituteBranch.phone ? instituteBranch.phone : '',
                          description: instituteBranch.description ? instituteBranch.description : '',
                          sortingIndex: instituteBranch.sortingIndex ? instituteBranch.sortingIndex : 0
                        });

                        handleShowDynamicAddPopup(1);
                      }}>
                      <FcServices size={15} /> Edit
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                {/* <span hidden={branchIndex === bIndex ? false : true} className="dark-count float-right"
                                onClick={() => { ExportHandle('branchId', instituteBranch, details.BranchName) }}><BsThreeDots size={15} />
                              </span> */}
              </Button>
              </li>
            </div>
          })
          }
        </ul>
      </div>
    )
  }

  const classListColumn = () => {
    return (
      <div className="explorerColContentListWrap">
        {instituteIndex !== -1 && branchIndex !== -1 && <div className="explorerColHeaderWrap">
          <DynamicAddPopUp Detail={details}
            View={ClassView(branchId)}
            PlaceHolder={placeHolder}
            Display={display}
            handleSubmit={() => display.isUpdate ? handleUpdateSubmit(`${UrlConfig.apiUrls.updateClasses}/${classId}`, 2, 'Class updated successfully.') : handleCreateSubmit(2)}
            buttonValidation={classInputs.name.length < 1 ? 'disabled' : ''}
            addPopupLoader={addPopupLoader}
            showDynamicAddPopup={showDynamicAddPopup === 2}
            closeDynamicAddPopup={() => handleCloseDynamicAddPopup(2)}
          />
          <div className="explorerColHeaderTitle">
            <h5>Class  {`(${props.explorerData && FileExplorerArray[instituteIndex].branches[branchIndex].classes && FileExplorerArray[instituteIndex].branches[branchIndex].classes.length > 0 ? FileExplorerArray[instituteIndex].branches[branchIndex].classes.length : 0})`}</h5>
          </div>
          <div className="explorerColHeaderCreate">
            <Button onClick={() => {
              setDetails({ ...details, DivisionName: "" });
              setPlaceHolder({ ...placeHolder, ClassHolder: true, BranchHolder: false, InstituteHolder: false });
              setDisplay({ ...display, BranchDisplay: true, ClassDisplay: true, DivisionDisplay: false, StudentDisplay: false, isUpdate: false });
              handleShowDynamicAddPopup(2);
            }} className="pluseBtnCommon">
              <i className="fa fa-plus"></i>
            </Button>
          </div>
        </div>}
        <ul className="commonListContent">
          {instituteIndex !== -1 && branchIndex !== -1 && props.explorerData[instituteIndex].branches[branchIndex].classes.map((classes, ci) => {
            return <li key={classes.id}>
              <Button onClick={() => {
                setclassIndex(ci);
                setdivisionIndex(-1);
                setStudentIndex(-1)
                setActiveIndex(2);
                setClassId(classes.id)
                scrollFunction(1);
                setDetails({ ...details, DivisionName: "" });
              }}
                onMouseDown={handelPopup}
                name="ClassName"
                value={props.explorerData[instituteIndex].branches[branchIndex].classes[ci].name}
                className={classIndex === ci ? (activeMainIndex === 2 ? "currentSelect " : 'prevSelect') : "commonListNameBtn"}>
                {classes.name}
                <Dropdown hidden={classIndex === ci ? false : true} className="option-sub-menu">
                  <Dropdown.Toggle className="nav-link count-indicator bg-transparent">
                    <BsThreeDots size={18} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="preview-list navbar-dropdown">
                    <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center"
                      onClick={() => { ExportHandle('classId', classes, details.BranchName); }}>
                      <FcUpload size={15} /> Export Student
                  </Dropdown.Item>
                    <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center"
                      onClick={() => {
                        setDetails({ ...details, DivisionName: "" });
                        setPlaceHolder({ ...placeHolder, ClassHolder: true, BranchHolder: false, InstituteHolder: false });
                        setDisplay({ ...display, BranchDisplay: true, ClassDisplay: true, DivisionDisplay: false, StudentDisplay: false, isUpdate: true });
                        setClassInputs({
                          name: classes.name,
                          sortingIndex: classes.sortingIndex ? classes.sortingIndex : 0
                        });
                        handleShowDynamicAddPopup(2);
                      }}
                    >
                      <FcServices /> Edit
                  </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                {/* <span hidden={classIndex === ci ? false : true} className="dark-count float-right"
                onClick={() => { ExportHandle('classId', classes, details.BranchName); }}><BsThreeDots size={15} /> </span> */}
              </Button>
            </li>
          })
          }
        </ul>
      </div>
    )
  }

  const batchListColumn = () => {
    return (
      <div className="explorerColContentListWrap">
        {instituteIndex !== -1 && branchIndex !== -1 && classIndex !== -1 &&
          <div className="explorerColHeaderWrap">
            <DynamicAddPopUp
              Detail={details} View={BatchView(classId)} PlaceHolder={placeHolder} Display={display}
              handleSubmit={() => display.isUpdate ? handleUpdateSubmit(`${UrlConfig.apiUrls.updateBatches}/${batchId}`, 3, 'Batch updated successfully.') : handleCreateSubmit(3)}
              buttonValidation={batchInputs.name.length < 1 ? 'disabled' : ''}
              addPopupLoader={addPopupLoader}
              showDynamicAddPopup={showDynamicAddPopup === 3}
              closeDynamicAddPopup={() => handleCloseDynamicAddPopup(3)}
            />
            <div className="explorerColHeaderTitle">
              <h5>Batch   {`(${props.explorerData && FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].batches && FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].batches.length > 0 ? FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].batches.length : 0})`}</h5>
            </div>
            <div className="explorerColHeaderCreate">
              <Button
                onClick={() => {
                  setPlaceHolder({ ...placeHolder, DivisionHolder: true, ClassHolder: false, BranchHolder: false, InstituteHolder: false });
                  setDisplay({ ...display, BranchDisplay: true, ClassDisplay: true, DivisionDisplay: true, StudentDisplay: false, isUpdate: false })
                  handleShowDynamicAddPopup(3)
                }}
                className="pluseBtnCommon">
                <i className="fa fa-plus"></i>
              </Button>
            </div>
          </div>
        }
        <ul className="commonListContent">
          {instituteIndex !== -1 && branchIndex !== -1 && classIndex !== -1 && props.explorerData[instituteIndex].branches[branchIndex].classes[classIndex].batches.map((batch, batchIndex) => {
            return <li key={batch.id}>
              <Button
                onClick={() => {
                  setdivisionIndex(batchIndex);
                  setStudentIndex(-1);
                  setActiveIndex(3);
                  setBatchId(batch.id);
                  // scrollFunction(1);
                  const selectedBatch = FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].batches[batchIndex];
                  const studentList = batchIndex >= 0 && selectedBatch ? selectedBatch.students : [];
                  if (studentList && studentList.length > 0) {
                    setStudentArray(studentList);
                    setStudentIndex(-1);
                  } else {
                    getStudentList(batchIndex);
                  }
                }}
                onMouseDown={handelPopup} name="DivisionName" value={props.explorerData[instituteIndex].branches[branchIndex].classes[classIndex].batches[batchIndex].name}
                className={divisionIndex === batchIndex ? (activeMainIndex === 3 ? "currentSelect " : 'prevSelect') : "commonListNameBtn"}>
                {batch.name}<span className="combi-batch-menu"><span className="dark-count">[{batch.code}]</span>
                  <Dropdown hidden={divisionIndex === batchIndex ? false : true} className="option-sub-menu">
                    <Dropdown.Toggle className="nav-link count-indicator bg-transparent">
                      <BsThreeDots size={18} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="preview-list navbar-dropdown">
                      <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center"
                        onClick={() => { ExportHandle('batchId', batch, details.BranchName) }}>
                        <FcUpload size={15} /> Export Student
                    </Dropdown.Item>
                      <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center"
                        onClick={() => {
                          setPlaceHolder({ ...placeHolder, DivisionHolder: true, ClassHolder: false, BranchHolder: false, InstituteHolder: false });
                          setDisplay({ ...display, BranchDisplay: true, ClassDisplay: true, DivisionDisplay: true, StudentDisplay: false, isUpdate: true });
                          setBatchInputs({
                            name: batch.name,
                            sortingIndex: batch.sortingIndex ? batch.sortingIndex : 0
                          });
                          handleShowDynamicAddPopup(3)
                        }}
                      >
                        <FcServices /> Edit
                    </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  {/* <span hidden={divisionIndex === batchIndex ? false : true} className="dark-count"
                  onClick={() => { ExportHandle('batchId', batch, details.BranchName) }}><BsThreeDots size={15} /></span> */}
                </span>
              </Button>
            </li>
          })
          }
        </ul>
      </div>
    )
  }

  const studentListColumn = () => {
    return (
      <div onClick={() => { setAuxClickMenu1(true); setSubShow1(true) }} className={'explorerColContentListWrap explorerColContentOverflowVisi'} >
        {instituteIndex !== -1 && branchIndex !== -1 && classIndex !== -1 && divisionIndex !== -1 &&
          <div className="explorerColHeaderWrap">
            <DynamicAddPopUp Detail={details} View={StudentView(batchId)} PlaceHolder={placeHolder} Display={display}
              handleSubmit={() => handleCreateSubmit(4)} buttonValidation={studentInputs.code.length < 1 ? "disabled" : studentInputs.name.length < 1 ? 'disabled' : studentInputs.email.length < 1 ? 'disabled' : EmailFlag ? 'disabled' : ''}
              addPopupLoader={addPopupLoader}
              showDynamicAddPopup={showDynamicAddPopup === 4}
              closeDynamicAddPopup={() => handleCloseDynamicAddPopup(4)}
            />
            <div className="">
              <h5>Students  {`(${studentArray && studentArray.length > 0 ? studentArray.length : 0})`}</h5>
            </div>
            <div className="explorerColHeaderCreate">
              <Button
                onClick={() => {
                  setPlaceHolder({ ...placeHolder, DivisionHolder: false, ClassHolder: false, BranchHolder: false, InstituteHolder: false });
                  setDisplay({ ...display, BranchDisplay: true, ClassDisplay: true, DivisionDisplay: true, StudentDisplay: true, isUpdate: false })
                  handleShowDynamicAddPopup(4)
                }}
                className="pluseBtnCommon">
                <i className="fa fa-plus"></i>
              </Button>
            </div>
          </div>
        }
        <div >
          <ul className="commonListContent"
            onChange={() => {
              setAuxClickMenu1(true);
              setSubShow1(true)
            }}
          >
            {showLoader &&
              <div className="loader">
                <Spinner animation="border" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              </div>
            }
            {instituteIndex !== -1 && branchIndex !== -1 && classIndex !== -1 && divisionIndex !== -1 &&
              // props.explorerData[instituteIndex].branches[branchIndex].classes[classIndex].batches[divisionIndex].students.map((student, sIndex) => {
              studentArray.map((student, sIndex) => {
                console.log(student,"count")
                const studentName = student.name.toLowerCase();
                const studentId = student.code.toString();
                const exist = (studentName.includes(studentSearch.toLowerCase())) || (studentId.includes(studentSearch.toLowerCase()));
                // Filtered Student List
                if (studentSearch !== "") {
                  if (studentSearch !== "" && exist) {
                    return (
                      <div
                        style={{ position: "relative" }}
                        key={`studentList_${student.id}`}
                      >
                        <li className="commonListContent" key={student.id}>
                          <Button

                            onContextMenu={() => {
                              setStudentIndex(sIndex);
                              console.log(student.id)
                              setAuxClickMenu1(!auxClickMenu1)
                            }}
                            onClick={() => {
                              setStudentIndex(sIndex);
                              setActiveIndex(4);
                              scrollFunction(0);
                              console.log(student.id + " " + student.name)
                            }}
                            className={studentIndex === sIndex ? (activeMainIndex === 4 ? "currentSelect " : 'prevSelect') : "commonListNameBtn"}
                          >
                            {student.name}<span className="dark-count float-right">[{student.code}]</span>
                          </Button>

                        </li>
                        {/* Right Menu View */}
                        {studentIndex === sIndex && RightClickMenu(studentIndex === sIndex && student)}
                        {/* Right Menu View End */}
                      </div>
                    )
                  }
                }
                // Normal Student List
                else {
                  return (
                    <div style={{ position: 'relative' }} key={`studentList_${student.id}`}>
                      <li className="commonListContent" key={student.id}>
                        <Button
                          style={{ maxWidth: "100%" }}
                          onContextMenu={(e) => {
                            setStudentIndex(sIndex);
                            console.log(student.id)
                            setAuxClickMenu1(!auxClickMenu1)
                          }}
                          onClick={() => {
                            setStudentIndex(sIndex);
                            setActiveIndex(4)
                            scrollFunction(0);
                            console.log(student.id + " " + student.name);
                            setEmailTextOrInput(true)
                          }}
                          // onClick={() => setEmailTextOrInput(true)}
                          className={studentIndex === sIndex ? (activeMainIndex === 4 ? "currentSelect " : 'prevSelect') : "commonListNameBtn"}
                        >
                          {student.name}<span className="dark-count float-right">[{student.code}]</span>
                        </Button>
                      </li>
                      {/* Right Menu View */}
                      {studentIndex === sIndex && RightClickMenu(studentIndex === sIndex && student)}
                      {/* Right Menu View End */}
                    </div>
                  )
                }
              })
            }
          </ul>
        </div>
      </div>
    )
  }



  const studentDetailColumn = () => {
    return (
      <div className="explorerColContentListWrap explorerColStudentProfile">
        {instituteIndex !== -1 && branchIndex !== -1 && classIndex !== -1 && divisionIndex !== -1 && studentIndex !== -1 &&
          <div className="explorerColHeaderWrap">
            <div></div>
            <div className="explorerColHeaderTitle">
              <h5>Student Profile</h5>
            </div>
            {/* <div className="explorerColHeaderCreate">
              <Button
                className="pluseBtnCommon">
              </Button>
            </div> */}
            <div className="explorerColHeaderCreate">
              <button type="button" className="btn btn-delete" onClick={() => {
                showDeltedConfirmatioModal()
              }}>
                <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-bottom" className="common-tooltip">Remove Student</Tooltip>}>
                  <MdDelete />
                </OverlayTrigger>

              </button>


              {/* <button type="button" className="btn btn-edit" onClick={handleEditExam}><MdEdit /></button> */}
            </div>
          </div>
        }
        {studentDetailView()}
      </div>
    )
  }
  const [showPassCodeModal, setShowPasscodeModal] = useState(false);
  const [studentPassCode, setStudentPassCode] = useState('');
  const [passocdeLoader, setPasscodeLaoder] = useState(false);
  const handleShowPassCodeModal = () => setShowPasscodeModal(true);
  const handleClosePassCodeModal = () => {
    setStudentPassCode('');
    setShowPasscodeModal(false);
  }

  const getStudentPassCode = () => {
    const studentDetail = studentArray[studentIndex];
    if (studentDetail && studentDetail.userInfo && studentDetail.userInfo.email) {
      const { userInfo } = studentDetail;
      const { email } = userInfo;
      const payload = { emailOrPhone: email }
      setPasscodeLaoder(true);
      Api.postApi(UrlConfig.apiUrls.resetPasswordSupport, payload)
        .then((response) => {
          const { data, message } = response;
          if (data && data.code) {
            setStudentPassCode(data.code);
            setPasscodeLaoder(false);
            handleShowPassCodeModal();
          } else {
            toast('Data not found', {
              type: "error",
            });
          }
        })
        .catch((error) => {
          const errorMessage = CommonFunctions.apiErrorMessage(error);
          setPasscodeLaoder(false);
          toast(errorMessage, {
            type: "error",
          });
        });
    } else {
      const errorMessage = 'Please select student';
      toast(errorMessage, {
        type: "error",
      });
    }

  }

  const studentDetailView = () => {
    if (!studentArray[studentIndex]) return null;
    return (
      <div className="commonListContent" >
        <ViewPasscodeModal
          handleClosePassCodeModal={() => handleClosePassCodeModal()}
          showPassCodeModal={showPassCodeModal}
          studentDetail={(studentArray && studentArray[studentIndex]) ? studentArray[studentIndex] : null}
          passCode={studentPassCode}
        />
        <ConfirmationModal
          showDeleteConfirmatioModal={deleteConfirmatioModal}
          hideDeleteModal={closeDeltedConfirmatioModal}
          onConfirm={deleteStudent}
          // noteText={'This action can not be rollbacked!'}
          descriptionText={'Student will move to bin.'}
        />
        {instituteIndex !== -1 && branchIndex !== -1 && classIndex !== -1 && studentIndex !== -1 &&
          <div className="profile-student-details">
            <div className="profile-student-img">
              <Image src={studentArray[studentIndex].userInfo.profileImage === null ? assets.images.studentDefaultImage : studentArray[studentIndex].userInfo.profileImage} roundedCircle />
            </div>
            <div className="profile-student-info-box">
              <p>
                <label><FaUserCircle /></label>
                <span id="studentsNameField" >{studentArray[studentIndex].userInfo.name ? `${studentArray[studentIndex].userInfo.name}` : '-'}</span>
              </p>
              <p>
                <label>Student Code: </label>
                <span id="studentsNameField" >{studentArray[studentIndex].code ? ` ${studentArray[studentIndex].code}` : '-'}</span>
              </p>
              {/* Email Field */}
              <p style={{ width: "100%" }}>
                <label><MdMail /></label>
                <div className="edit-wrap-disp">
                  {
                    emailText === true ?
                      <span style={{ marginRight: "10px" }} id="studentsEmailField">{studentArray[studentIndex].userInfo.userName ? `${studentArray[studentIndex].userInfo.userName}` : '-'}
                      </span> :
                      <span id="studentEmailEditInput" style={{ marginRight: "10px" }} >
                        <input
                          autoFocus
                          className="in-explorer-input-box"
                          name="emailToEdit"
                          id="emailToEdit"
                          type="email"
                          defaultValue={`${emailValue}`}
                          onChange={(e) => {
                            setEmailValue(e.target.value);
                          }}
                        />
                      </span>
                  }
                  <label style={{ width: "15%" }}
                  >{
                      emailText ?
                        <div className="button-set">
                          <OverlayTrigger overlay={<Tooltip transition={true} id="tooltip-disabled">Update Email</Tooltip>}>
                            <span className="edit-icon">
                              <FaUserEdit onClick={() => {
                                setEmailValue(studentArray[studentIndex].userInfo.userName);
                                setEmailTextOrInput(!emailText);
                              }} />
                            </span>
                          </OverlayTrigger>
                          <OverlayTrigger overlay={<Tooltip transition={true} id="tooltip-disabled">Get Pass-Code</Tooltip>}>
                            <span className="d-inline-block">
                              <span className="get-pass-code-icon">
                                {!passocdeLoader && <FaKey onClick={() => getStudentPassCode()} />}
                                {passocdeLoader && <Spinner size="sm" animation="grow" variant="success" />}
                              </span>
                            </span>
                          </OverlayTrigger>
                        </div> :
                        <div className="button-set">
                          <span className="edit-success-icon">
                            <FaCheck onClick={(event) => {
                              event.preventDefault()
                              console.log('studentArray[studentIndex]', studentArray[studentIndex]);
                              console.log('emailValue', emailValue);
                              updateStudentEmailAddress(studentArray[studentIndex]);
                            }} />
                          </span>
                          <span className="edit-cancel-icon">
                            <FaRegWindowClose onClick={() => {
                              setEmailTextOrInput(!emailText);
                              setEmailValue("");
                            }} />
                          </span>
                        </div>
                    }
                  </label>
                </div>
              </p>
              {/* Email Field */}

              <p>
                <label><FaPhoneAlt /></label>{studentArray[studentIndex].userInfo.phone ? `${studentArray[studentIndex].userInfo.phone}` : '-'}
              </p>
              {/* <p><label><FaAddressCard /></label>1330/11 E ward Shastrinagar Kolhapur.(416008)</p> */}
              <div className="attended-exam-box">
                <button className="attempted-exam-btm" onClick={() => {
                  getStudentTestList(studentArray[studentIndex].userInfo.id);
                }}>{LoaderForDetail && <Spinner size="sm" animation="grow" variant="info" />}{!LoaderForDetail && "Assigned Exam"}</button>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }

  const [showDynamicAddPopup, setShowDynamicAddPopup] = useState(-1);

  const handleShowDynamicAddPopup = (value) => setShowDynamicAddPopup(value);
  const handleCloseDynamicAddPopup = (flag) => {
    setShowDynamicAddPopup(-1);
    resetDynamicPopupFields(flag);
  }

  const resetDynamicPopupFields = (flag) => {
    switch (flag) {
      case 1:
        setBranchInputs({
          name: "",
          description: "",
          email: "",
          phone: "",
          address: "",
          postalCode: "",
          city: "",
          sortingIndex: 0
        });
        break;
      case 2:
        setClassInputs({
          name: "", branchId: "", sortingIndex: 0
        });
        break;
      case 3:
        setBatchInputs({
          name: "", classId: "", sortingIndex: 0
        });
        break;
      case 4:
        setStudentInputs({
          batchId: "",
          name: "",
          email: "",
          phone: "",
          code: "",
          sortingIndex: 0
        });
        break;
      default:
        break;

    }
  }

  const headerRightComponenet = () => {
    return <div className="import-btn-main-box">
      <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-bottom" className="common-tooltip">Import students.</Tooltip>}>
        <CSVReader
          ref={buttonRef}
          name="file"
          onFileLoad={handleOnFileLoad}
          onRemoveFile={handleOnRemoveFile}
          noProgressBar
          config={{
            header: true,
            fastMode: true,
            skipEmptyLines: true
          }}
        >
          {({ file }) => (
            <div
              className="import-btn-main-box"
            >
              <div className="selected-file-box">
                {
                  file &&
                  <div className="close-selected-box">
                    <button className="close-btn" onClick={handleRemoveFile}><GrClose /></button>
                  </div>
                }
                <div className="selected-text-box" style={{ color: `${fileColour}` }}  >
                  <a onClick={handleShow} >{file && file.name.includes('.csv') && file.name}</a>
                </div>

              </div>
              <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-bottom" className="common-tooltip">.csv</Tooltip>}>
                <>
                  <button
                    type='button'
                    onClickCapture={handleOpenDialog}
                    onChange={handleOpenDialog}
                    className="common-btn-import"
                  >
                    <BsCloudUpload size={20} />
                        Import
                   </button>
                </>
              </OverlayTrigger>

            </div>
          )}
        </CSVReader>
      </OverlayTrigger>
    </div>
  }
  //********************************************************* Main Return*********************************************************
  return (
    <div
      onClickCapture={() => {
        setAuxClickMenu1(true);
        setSubShow1(true)
      }}
    >
      {/* Page Header & Import File View */}
      {/* {PageHeader()} */}
      <PagesHeader headerText={"Import Students"} customElementsComponent={headerRightComponenet} dropDownItem={["importStudentsTemplate_Excel_CSV", "studentImportTemplate_SampleData"]} />
      {showStudentExportModal && <StudentExportModal
        showStudentExportModal={showStudentExportModal}
        closeStudentExportModal={closeStudentExportModal}
        dataForStudentExport={dataForExportStudent} />}
      {
        showAttemptedExamModal && <AttemptedExamModal showAttemptedExamModal={showAttemptedExamModal}
          userGivenTestList={userGivenTestList}
          closeAttemptedExamModal={closeAttemptedExamModal} />
      }
      {/* Explorer View */}
      <div className="student-file explorer-view" onContextMenu={(e) => e.preventDefault()}>
        <div className="common-dark-box explorerMainWrapper">
          <div className="common-title-wrapper-dark">
            <h3 className="common-dark-box-title">Explorer</h3>
            <div className="explorerSearchWrapper" style={{ width: "250px" }}>
              {/* Student Search */}
              {SearchView()}
              {/*  */}
            </div>
          </div>
          <div className="student-file-explorer-view">
            <div id="scrollId" className="explorerScrollableWrapper">
              <div className="explorerHorizontalWrapper">
                <div className="explorerRowWrapper">
                  <div className="explorerRowContentListWrap">

                    {/* Institue Column */}
                    {instituteListColumn()}
                    {/*  */}

                    {/* Institute Branch Column */}
                    {branchListColumn()}
                    {/*  */}

                    {/* Institute->Branch->Class Column */}
                    {classListColumn()}
                    {/*  */}

                    {/* Institute->Branch->Class->Batch Column */}
                    {batchListColumn()}
                    {/*  */}

                    {/* Institute->Branch->Class->Batch->Students Column */}
                    {studentListColumn()}
                    {(studentIndex !== -1 && studentArray[studentIndex]) &&
                      studentDetailColumn()
                    }
                  </div>
                  <br style={{ backgroundColor: 'white' }}></br>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal Content */}
      {ModalContent()}
      {/* StudentShiftModal */}
      {showStudentShiftModal && <StudentShiftModal
        show={showStudentShiftModal}
        handleShiftStudentClose={handleShiftStudentClose}
        handleShiftStudent={handleShiftStudent}
        instituteTree={props.explorerData}
        studentData={studentData}
        oldBranchIndex={branchIndex}
        oldClassIndex={classIndex}
        oldBatchIndex={divisionIndex}
        loader={studentShiftLoader}
      />}
    </div >
  )
}
const mapPropsToState = (state) => {
  return {
    accountList: state.accountList,
    explorerData: state.explorerData,
  }
}
export default connect(mapPropsToState)(EnrollStudent);