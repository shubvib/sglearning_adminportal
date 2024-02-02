import React, { useState, useEffect } from 'react';
import { BsChevronDoubleDown, BsPeople, BsCloudUpload } from 'react-icons/bs'
import { GrClose } from 'react-icons/gr';
import { CSVReader } from 'react-papaparse';
import { Tooltip, OverlayTrigger, Button, Modal, InputGroup, FormControl } from 'react-bootstrap';
import PagesHeader from '../../components/shared/Pageheader';
import FileExplorerArray1 from './FileExplorerFacultyData';
import { FileExplorerComponent } from '../../components';
import ExplorerData from '../enrollStudent/FileExplorerDataUnique';
const buttonRef = React.createRef()
const EnrollFaculty = () => {
  
  let i = 0;
  const [fileColour, setFileNameColour] = useState("white");
  const [filePreviewData, setfilePreviewData] = useState([]);
  // const [instituteIndex, setinstituteIndex] = useState(-1);
  // const [branchIndex, setBranchIndex] = useState(-1);
  // const [classIndex, setclassIndex] = useState(-1);
  // const [divisionIndex, setdivisionIndex] = useState(-1);
  // const [activeMainIndex, setActiveIndex] = useState(-1);
  // // for preview
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // 

  const [instituteIndex, setinstituteIndex] = useState(-1);
  const [branchIndex, setBranchIndex] = useState(-1);
  const [classIndex, setclassIndex] = useState(-1);
  const [divisionIndex, setdivisionIndex] = useState(-1);
  const [branch, setbranch] = useState(false);
  const [activeMainIndex, setActiveIndex] = useState(-1);
  const [branchArray, setBranchArray] = useState([]);
  const [classArray, setClassArray] = useState([]);
  const [batchArray, setBatchArray] = useState([]);
  const [studentArray, setStudentArray] = useState([]);
  const [FileExplorerArray, setFileExplorerArray] = useState(FileExplorerArray1);


  /****************File explorer functionality start here **************************************/
  const onClickMenuItem = (name, data) => {
    debugger
    switch (name) {
      case 'institute':
        console.log(data, 'data')
        setinstituteIndex(data.index);
        setBranchArray(FileExplorerArray[data.index].branches);
        setBranchIndex(-1);
        setActiveIndex(0);
        break;
      case 'branch':
        setBranchIndex(data.index);
        // setBranchArray(FileExplorerArray[data.index].branches);
        setClassArray(FileExplorerArray[instituteIndex].branches[data.index].classes);
        setclassIndex(-1);
        setActiveIndex(1);
        break;
      case 'class':
        setclassIndex(data.index);
        setBatchArray(FileExplorerArray[instituteIndex].branches[branchIndex].classes[data.index].batches);
        setdivisionIndex(-1);
        setActiveIndex(2);
        break;
      case 'batch':
        setdivisionIndex(data.index);
        setStudentArray(FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].batches[data.index].students);
        setActiveIndex(3);
        break;
      case 'student':
        // setdivisionIndex(data.index);

        // setActiveIndex(3);
        break;
    }
  }

  const ComponenetArray = [
    {
      name: 'institute',
      title: 'Institute',
      data: FileExplorerArray,
      mainIndex: activeMainIndex,
      currentIndex: instituteIndex,
      onClickMenuItem: (name, data) => onClickMenuItem(),
      showCheckbox: false,
      showComponenet: true,
      isActive: activeMainIndex == 0,
      showHeaderButtons: true
    },
    {
      name: 'branch',
      title: 'Branch',
      data: branchArray,
      mainIndex: activeMainIndex,
      currentIndex: branchIndex,
      onClickMenuItem: (name, data) => onClickMenuItem(name, data),
      showCheckbox: false,
      showComponenet: instituteIndex != -1,
      isActive: activeMainIndex == 1,
      showHeaderButtons: true
    },
    {
      name: 'class',
      title: 'Class',
      data: classArray,
      mainIndex: activeMainIndex,
      currentIndex: classIndex,
      onClickMenuItem: (name, data) => onClickMenuItem(name, data),
      showCheckbox: true,
      showComponenet: instituteIndex != -1 && branchIndex != -1,
      isActive: activeMainIndex == 2,
      showHeaderButtons: true,
      onCheckboxChange: (isSelected, i) => {
        if (i >= 0) {
          const classDetails = FileExplorerArray[instituteIndex].branches[branchIndex].classes[i];
          const branchDetails = FileExplorerArray[instituteIndex].branches[branchIndex];
          if (isSelected) {
            const newBatchArray = classDetails.batches.map(batch => ({ ...batch, checked: true, className: classDetails.name, branchName: branchDetails.name }));
            FileExplorerArray[instituteIndex].branches[branchIndex].classes[i].batches = newBatchArray;
            setBatchArray(newBatchArray);
          } else {
            const newBatchArray1 = classDetails.batches.map(batch => ({ ...batch, checked: false }));
            FileExplorerArray[instituteIndex].branches[branchIndex].classes[i].batches = newBatchArray1;
            setBatchArray(newBatchArray1);
          }
        }

      }
    },
    {
      name: 'batch',
      title: 'Batch',
      data: batchArray,
      mainIndex: activeMainIndex,
      currentIndex: divisionIndex,
      onClickMenuItem: (name, data) => onClickMenuItem(name, data),
      showCheckbox: true,
      showComponenet: instituteIndex != -1 && branchIndex != -1 && classIndex != -1,
      isActive: activeMainIndex == 3,
      showRightComponenet: true,
      rightComponentKey: 'id',
      showHeaderButtons: true,
      onCheckboxChange: (isSelected, i) => {
        const newBatchArray = FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].batches;
        const classDetails = FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex];
        const branchDetails = FileExplorerArray[instituteIndex].branches[branchIndex];
        let newBatchDetailArray = [];
        newBatchArray.map((batch) => {
          let obj = batch;
          if (batch.checked) {
            obj = { ...obj, className: classDetails.name, branchName: branchDetails.name }
          }
          newBatchDetailArray.push(obj);
        })

        var res = batchArray.filter(val => {
          return val.checked;
        });
        FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].batches = newBatchDetailArray;
        setBatchArray(newBatchDetailArray);
        // res = res + 1;
        console.log('res len', res.length);
        let selectedClsObj;
        if (res.length === 0) {
          selectedClsObj = FileExplorerArray[instituteIndex].branches[branchIndex].classes.map((cls, i) => i === classIndex ? ({ ...cls, checked: false, partialChecked: false }) : ({ ...cls }));
          FileExplorerArray[instituteIndex].branches[branchIndex].classes = selectedClsObj;
          setClassArray(selectedClsObj);
          return;
        }
        if (batchArray.length === res.length) {
          selectedClsObj = FileExplorerArray[instituteIndex].branches[branchIndex].classes.map((cls, i) => i === classIndex ? ({ ...cls, checked: true, partialChecked: false }) : ({ ...cls }));
          FileExplorerArray[instituteIndex].branches[branchIndex].classes = selectedClsObj;
          setClassArray(selectedClsObj);
          return;
        }
        if (res.length > 0 && res.length < batchArray.length) {
          selectedClsObj = FileExplorerArray[instituteIndex].branches[branchIndex].classes.map((cls, i) => i === classIndex ? ({ ...cls, checked: false, partialChecked: true }) : ({ ...cls }));
          FileExplorerArray[instituteIndex].branches[branchIndex].classes = selectedClsObj;
          setClassArray(selectedClsObj);
          return;
        }
      }
    },
    {
      name: 'student',
      title: 'Students',
      data: studentArray,
      mainIndex: activeMainIndex,
      currentIndex: -1,
      onClickMenuItem: (name, data) => onClickMenuItem(name, data),
      showCheckbox: false,
      showComponenet: instituteIndex != -1 && branchIndex != -1 && classIndex != -1 && divisionIndex != -1,
      isActive: activeMainIndex == 4,
      showRightComponenet: true,
      rightComponentKey: 'id',
      showHeaderButtons: true,
      onCheckboxChange: () => { }
    }
  ]
  /****************File explorer functionality end here **************************************/

  useEffect(() => {
    console.log(filePreviewData.length)
  }, [filePreviewData])
  // For File Validation
  const handleOpenDialog = (e) => {
    // Note that the ref is set async, so it might be null at some point 
    if (buttonRef.current) {
      buttonRef.current.open(e)
    }
  }
  const handleOnFileLoad = (data, meta) => {
    console.log(data)
    console.log(meta)
    let fileName = meta.name.toLowerCase();
    let filePattern = /(\.xls|\.xlsx|\.xlsm|\.xlsb|\.xps|\.csv)$/i;
    if (filePattern.exec(fileName)) {
      console.log('Valid file')
      setfilePreviewData(data)
      setTimeout(() => {
        handleShow();
      }, 500);
    } else {
      console.log('invalid file')
      setFileNameColour("red");
    }
  }

  const handleOnRemoveFile = (data) => {
    console.log(data)
  }

  const handleRemoveFile = (e) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.removeFile(e)
    }
  }
  const fileReader = () => {
    return <CSVReader
      ref={buttonRef}
      onFileLoad={handleOnFileLoad}
      noClick
      noDrag
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
            <div className="selected-text-box" style={{ color: `${fileColour}` }}>
              {file && file.name}
            </div>

          </div>
          <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-bottom" className="common-tooltip">.xls .xlsx .csv</Tooltip>}>
            <button
              type='button'
              onClick={handleOpenDialog}
              className="common-btn-import"
            >
              <BsCloudUpload size={20} />
                       Import
                     </button>
          </OverlayTrigger>

        </div>
      )}
    </CSVReader>
  }

  // File Validation End

  // Modal Body Content
  const ModalContent = () => {
    return (
      <div className="modal-main-dark">
        <Modal show={show} centered size="lg" onHide={handleClose} className="modal-dark">
          <Modal.Header closeButton>
            <div className="modal-title-box">
              <h3>File Preview</h3>
              <span>Faculty to be added: {filePreviewData.length}</span>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div className="faculty-list-box">
              <h3 className="faculty-list-box-title"><BsPeople /> Faculty List</h3>
              <div className="table-responsive">
                <table className="table table-striped text-muted">
                  <thead>
                    <tr>
                      <th> <BsChevronDoubleDown size={15} /> </th>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Password</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filePreviewData.map((student) => {
                      return (
                        <tr key={student.data.student_mobile}>
                          <td>{i = i + 1}</td>
                          <td>{student.data.student_name}</td>
                          <td>{student.data.student_email}</td>
                          <td>{student.data.student_mobile}</td>
                          <td>{student.data.student_password}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" className="closeBtn" onClick={handleClose}>
              Close
          </Button>
            <Button variant="primary" className="uploadeBtn" onClick={handleClose}>
              Upload
          </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
  return (
    <div>
      {/* Modal For Preview */}
      <ModalContent />
      {/* Banner for Page header and Import button */}

      <PagesHeader headerText={"Import Faculty"} handleOnFileLoad={handleOnFileLoad} customElementsComponent={fileReader} />
      <div className="common-dark-box explorerMainWrapper">
        <div className="common-title-wrapper-dark">
          <h3 className="common-dark-box-title">SGIMA Explorer</h3>
          <div className="explorerSearchWrapper" style={{ width: "250px" }}>
            <InputGroup>
              <FormControl
                placeholder="Search Student"
                aria-label="Search"
                aria-describedby="basic-addon2"
              // value={studentSearch} onChange={(e) => {
              //   setStudentSearch(e.target.value)
              // }}
              />
              <InputGroup.Append>
                <Button variant="outline-secondary"><i className="fa fa-search"></i></Button>
              </InputGroup.Append>
            </InputGroup>
          </div>
        </div>
        <div className="student-file-explorer-view disabled">
          <FileExplorerComponent
            ComponenetArray={ComponenetArray}
            onClickMenuItem={onClickMenuItem}
          />
        </div>
      </div>
    </div>
  )
}

export default EnrollFaculty;