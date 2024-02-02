import React, { useRef, useState, useEffect } from 'react';
import { Tooltip, OverlayTrigger, Button, Modal, Form } from 'react-bootstrap';
import { BsChevronDoubleDown, BsPeople, BsCloudUpload } from 'react-icons/bs';
import { GrDocumentTime } from 'react-icons/gr';
import { FcViewDetails } from 'react-icons/fc';
// import FileExplorerComponent from '../../../components/shared/file-explorer-component';
import { FileExplorerComponent } from '../../../../components';
import AssignPreviewModal from './AssignPreviewModal';
import { CommonApiCall, Api } from '../../../../services';
import { UrlConfig } from '../../../../config';
import CommonFunctions from '../../../../utils/CommonFunctions';
import { toast, ToastContainer } from 'react-toastify';
import { batch } from 'react-redux';


{/* File explorer model */ }
const AssignModal = (props) => {
    const { showfileExplorerModel, handleCloseforFileExploere, isFileExploere, selectedTest, onPreviousClick, onSubmitFileExplorer, createTestJSON, upatecreateJSON, explorerData, updateExamList, setInstituteData = null, ExamScheduleId, dataForExtraBatchSchedule } = props;
    const [instituteIndex, setinstituteIndex] = useState(-1);
    const [branchIndex, setBranchIndex] = useState(-1);
    const [classIndex, setclassIndex] = useState(-1);
    const [divisionIndex, setdivisionIndex] = useState(-1);
    const [studentIndex, setStudentIndex] = useState(-1);
    const [branch, setbranch] = useState(false);
    const [activeMainIndex, setActiveIndex] = useState(-1);
    const [branchArray, setBranchArray] = useState([]);
    const [classArray, setClassArray] = useState([]);
    const [batchArray, setBatchArray] = useState([]);
    const [studentArray, setStudentArray] = useState([]);
    const [FileExplorerArray, setFileExplorerArray] = useState(explorerData);
    const [isSubmitDisabled, setSubmitDisabled] = useState(true);
    const [scheduleSubmit, handleScheduleSubmit] = useState(false);
    const [isValidExplorerData, setValidExplorerData] = useState(false);
    const [showLoader, setLoader] = useState({
        studentLoader: false
    });

    useEffect(() => {
        setFileExplorerArray(explorerData)
    }, [explorerData]);

    useEffect(() => {
        if (showfileExplorerModel) {
            if ((!FileExplorerArray || FileExplorerArray.length === 0) && (explorerData && explorerData.length > 0)) { setFileExplorerArray(explorerData) } else {
                CommonApiCall.getInstituteData();
            }
        }
        validateExaplorerData();
    }, [showfileExplorerModel])


    // ***********************************************For Extra Batch Add Feature*********************************
    useEffect(() => {
        console.log("ExamScheduleId", ExamScheduleId);
    }, [ExamScheduleId])
    // ***********************************************Extra Batch Add Feature End*********************************

    /**get student data by batch id */
    const getStudentList = (batchData) => {
        const selectedBatch = FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].batches[batchData.index];
        if (selectedBatch) {
            const { id } = selectedBatch;
            const loaders = { ...showLoader, studentLoader: true };
            setLoader(loaders);
            Api.getApi(UrlConfig.apiUrls.getStudentList, { batchId: id, pageSize: 50000 })
                .then((response) => {
                    const loaders = { ...showLoader, studentLoader: false };
                    setLoader(loaders);
                    let studentArray = [];
                    if (response) {
                        const { data } = response;
                        data.map((student, index) => {
                            const obj = { ...student, userId: student.userInfo.id, name: student.userInfo.name };
                            studentArray.push(obj);
                        });
                    }
                    FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].batches[batchData.index].students = studentArray;
                    setStudentArray(studentArray);
                })
                .catch(error => {
                    const loaders = { ...showLoader, studentLoader: false };
                    setLoader(loaders);
                    const errorMessage = CommonFunctions.apiErrorMessage(error);
                    toast(errorMessage, {
                        type: "error",
                    });
                });
        }
    }

    useEffect(() => {
        if (FileExplorerArray && FileExplorerArray.length > 0) {
            if (explorerData.length === 1) {
                setinstituteIndex(0);
                setBranchArray(explorerData[0].branches);
                setBranchIndex(-1);
                setActiveIndex(0);
            }
        }

    }, [FileExplorerArray]);

    useEffect(() => {
        validateExaplorerData();
    }, [batchArray])

    const validateExaplorerData = () => {
        const checkedBatchArray = CommonFunctions.getCheckedExplorerdData(FileExplorerArray, 'batches');
        console.log('checkedBatchArray', checkedBatchArray);
        checkedBatchArray && checkedBatchArray.map((batch) => {
            console.log('batchhhhhh', batch);
        })
        checkedBatchArray && checkedBatchArray.length > 0 ? setValidExplorerData(true) : setValidExplorerData(false);;
    }
    const resetExplorerSelection = () => {
        CommonFunctions.resetCheckboxSelection(FileExplorerArray, 'branches');
        CommonFunctions.resetCheckboxSelection(FileExplorerArray, 'classes');
        CommonFunctions.resetCheckboxSelection(FileExplorerArray, 'batches');
        setBranchIndex(-1);
        setclassIndex(-1);
        setdivisionIndex(-1);
        setStudentIndex(-1);
        handleCloseforFileExploere();
        JSON.stringify(localStorage.setItem('stateShuffle', true));
        JSON.stringify(localStorage.setItem('stateMandatory', false));
    }
    /****************File explorer functionality start here **************************************/
    const onClickMenuItem = (name, data) => {
        switch (name) {
            case 'institute':
                setinstituteIndex(data.index);
                const branchData = data.index >= 0 ? FileExplorerArray[data.index].branches : [];
                setBranchArray(branchData);
                setBranchIndex(-1);
                setActiveIndex(0);
                break;
            case 'branch':
                setBranchIndex(data.index);
                console.log(data)
                // setBranchArray(FileExplorerArray[data.index].branches);
                const classData = data.index >= 0 ? FileExplorerArray[instituteIndex].branches[data.index].classes : []
                setClassArray(classData);
                setclassIndex(-1);
                setActiveIndex(1);
                break;
            case 'class':
                setclassIndex(data.index);
                console.log(data.index, 'data')
                const batchData = data.index >= 0 ? FileExplorerArray[instituteIndex].branches[branchIndex].classes[data.index].batches : [];
                setBatchArray(batchData);
                setdivisionIndex(-1);
                setActiveIndex(2);
                break;
            case 'batch':
                console.log(data.index, 'data')
                const studentList = data.index >= 0 ? FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].batches[data.index].students : [];
                setdivisionIndex(data.index);
                setActiveIndex(3);
                if (studentList && studentList.length > 0) {
                    setStudentArray(studentList);
                    setStudentIndex(-1);
                } else {
                    getStudentList(data);
                }
                break;
            case 'student':
                // setStudentArray(studentData);
                setActiveIndex(4);
                setStudentIndex(data.index);
                break;
            default:
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
            onClickMenuItem: (name, data) => onClickMenuItem(name, data),
            showCheckbox: false,
            showComponenet: true,
            isActive: activeMainIndex == 0,
            // hide: FileExplorerArray.length === 1
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
            onCheckboxChange: (isSelected, i) => {
                if (i >= 0) {
                    const classDetails = FileExplorerArray[instituteIndex].branches[branchIndex].classes[i];
                    const branchDetails = FileExplorerArray[instituteIndex].branches[branchIndex];
                    classDetails.partialChecked = false;
                    if (isSelected) {
                        const newBatchArray = classDetails.batches.map(batch => ({ ...batch, checked: true, className: classDetails.name, branchName: branchDetails.name }));
                        classDetails.batches = newBatchArray;
                        setBatchArray(newBatchArray);
                    } else {
                        const newBatchArray1 = classDetails.batches.map(batch => ({ ...batch, checked: false }));
                        classDetails.batches = newBatchArray1;
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
            rightComponentKey: 'batchCode',
            onCheckboxChange: (isSelected, i) => {
                const newBatchArray = FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].batches;
                const batchDetails = FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].batches[i];
                const classDetails = FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex];
                const branchDetails = FileExplorerArray[instituteIndex].branches[branchIndex];

                batchDetails.partialChecked = false;
                if (FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].batches[i].students &&
                    FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].batches[divisionIndex].students.length > 0) {
                    if (isSelected) {
                        const newStudentArray = batchDetails.students.map(student => ({ ...student, checked: true, className: classDetails.name, branchName: branchDetails.name }));
                        batchDetails.students = newStudentArray;
                        setStudentArray(newStudentArray);
                    }
                    if (isSelected === false) {
                        const newStudentArray = batchDetails.students.map(student => ({ ...student, checked: false }));
                        batchDetails.students = newStudentArray;
                        setStudentArray(newStudentArray);
                    }
                }

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
                // +++++++++++
            }
        },
        {
            name: 'student',
            title: 'Students',
            data: studentArray,
            mainIndex: activeMainIndex,
            currentIndex: studentIndex,
            onClickMenuItem: (name, data) => onClickMenuItem(name, data),
            showCheckbox: true,
            showComponenet: instituteIndex != -1 && branchIndex != -1 && classIndex != -1 && divisionIndex != -1,
            isActive: activeMainIndex == 4,
            showRightComponenet: true,
            rightComponentKey: 'code',
            onCheckboxChange: (isSelected, i) => {

                const newStudentArray = FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].batches[divisionIndex].students[i];
                const batchDetails = FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].batches[divisionIndex];
                const classDetails = FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex];
                const branchDetails = FileExplorerArray[instituteIndex].branches[branchIndex];
                console.log('newStudentArray', newStudentArray);

                var res = studentArray.filter(val => {
                    return val.checked;
                });
                console.log('res len', res.length);
                let selectedBatchObj;
                if (res.length === 0) {
                    selectedBatchObj = FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].batches.map((batch, i) => i === divisionIndex ? ({ ...batch, checked: false, partialChecked: false }) : ({ ...batch }));
                    FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].batches = selectedBatchObj;
                    setBatchArray(selectedBatchObj);
                    return;
                }
                if (studentArray.length === res.length) {
                    selectedBatchObj = FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].batches.map((batch, i) => i === divisionIndex ? ({ ...batch, checked: true, partialChecked: false }) : ({ ...batch }));
                    FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].batches = selectedBatchObj;
                    setBatchArray(selectedBatchObj);
                    return;
                }
                if (res.length > 0 && res.length < studentArray.length) {
                    selectedBatchObj = FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].batches.map((batch, i) => i === divisionIndex ? ({ ...batch, checked: false, partialChecked: true }) : ({ ...batch }));
                    FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].batches = selectedBatchObj;
                    setBatchArray(selectedBatchObj);
                    return;
                }
            },
            showLoader: showLoader.studentLoader,
            showHeaderButtons: false
        }
    ]

    /****************File explorer functionality end here **************************************/

    return (
        <div className="modal-main-dark">
            <Modal show={showfileExplorerModel} onHide={() => resetExplorerSelection()} centered size={isFileExploere ? "lg" : "md"} className="modal-dark" backdrop="static" >
                <ToastContainer autoClose={5000} position="top-right" className="tost-dark-container" style={{ borderRadius: 5, fontFamily: 'GOTHIC' }} />
                <Modal.Header closeButton>
                    <div className="modal-title-box">
                        <h3>{isFileExploere ? <><GrDocumentTime size={26} />Assign Exam</> : <><FcViewDetails size={28} />Assign Preview</>}</h3>
                        {/* <span>Faculty to be added: {filePreviewData.length}</span> */}
                    </div>
                </Modal.Header>
                <Modal.Body style={{ position: 'initial' }}>
                    {isFileExploere ?
                        <FileExplorerComponent
                            isFileExploere={isFileExploere}
                            selectedTest={selectedTest}
                            ComponenetArray={ComponenetArray}
                            onClickMenuItem={onClickMenuItem}
                            dataForExtraBatchSchedule={dataForExtraBatchSchedule}
                        // showLoader={showLoader.studentLoader}
                        />
                        :
                        <AssignPreviewModal
                            selectedTest={selectedTest}
                            createTestJSON={createTestJSON}
                            upatecreateJSON={upatecreateJSON}
                            assignedData={FileExplorerArray}
                            batchData={classArray}
                            disableSubmitButton={(value) => { setSubmitDisabled(value) }}
                            onPreviousClick={onPreviousClick}
                            handleCloseforFileExploere={handleCloseforFileExploere}
                            updateExamList={updateExamList}
                            resetExplorerSelection={resetExplorerSelection}
                            ExamScheduleId={ExamScheduleId}
                            dataForExtraBatchSchedule={dataForExtraBatchSchedule}
                        />
                    }

                </Modal.Body>
                {isFileExploere && <Modal.Footer>
                    <Button variant="secondary" className="closeBtn" onClick={() => { resetExplorerSelection() }}>
                        Cancel
                    </Button>
                    <Button variant="primary" className={`uploadeBtn ${isValidExplorerData ? '' : 'disabled'}`} onClick={() => {
                        setFileExplorerArray(FileExplorerArray);
                        onSubmitFileExplorer();
                    }}>
                        Next
                    </Button>
                </Modal.Footer>}
            </Modal>
        </div>
    )
}

export default AssignModal;