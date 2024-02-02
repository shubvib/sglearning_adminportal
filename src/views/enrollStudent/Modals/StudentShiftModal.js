import React, { useState, useEffect } from 'react';
import { Modal, Button, Spinner, Dropdown } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
const StudentShiftModal = (props) => {

    const { show, instituteTree, studentData, oldBranchIndex, oldClassIndex, oldBatchIndex, handleShiftStudentClose, handleShiftStudent, loader } = props;
    const { userInfo, branches, classes, batches, code } = studentData;

    const [instituteBranchesClassesBatches, setInstituteBranchesClassesBatches] = useState(null);
    const [newBranchIndex, setNewBranchIndex] = useState(-1);
    const [newClassIndex, setNewClassIndex] = useState(-1);
    const [newBatchIndex, setNewBatchIndex] = useState(-1);
    const [newBranch, setNewBranch] = useState(null);
    const [newClass, setNewClass] = useState(null);
    const [newBatch, setNewBatch] = useState(null);

    useEffect(() => {
        console.log('instituteTree', instituteTree);
        setInstituteBranchesClassesBatches(instituteTree[0]);
    }, [instituteTree])

    useEffect(() => {
        console.log('studentData', studentData);
        if (instituteBranchesClassesBatches) {
            setNewBranch(instituteBranchesClassesBatches.branches[newBranchIndex]);
            setNewClass(instituteBranchesClassesBatches.branches[newBranchIndex].classes[newClassIndex]);
            setNewBatch(instituteBranchesClassesBatches.branches[newBranchIndex].classes[newClassIndex].batches[newBatchIndex]);
        }
    }, [studentData, instituteBranchesClassesBatches])

    useEffect(() => {
        console.log('instituteBranchesClassesBatches', instituteBranchesClassesBatches);
    }, [instituteBranchesClassesBatches])

    useEffect(() => {
        setNewBranchIndex(oldBranchIndex);
        setNewClassIndex(oldClassIndex);
        setNewBatchIndex(oldBatchIndex);
    }, [oldBranchIndex, oldClassIndex, oldBatchIndex])
    return (
        <div>
            <Modal show={show} onHide={() => handleShiftStudentClose()} size="md" className="modal-dark code-change-modal stud-shift-modal-wrapper" centered>
                {loader && <div className="loader">
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </div>}
                <ToastContainer autoClose={5000} position="top-right" className="tost-dark-container" style={{ borderRadius: 5, fontFamily: 'GOTHIC' }} />
                <Modal.Header closeButton>
                    <div className="modal-title-box">
                        <h3>{`[${code}] `} {userInfo.name}</h3>
                        <span>Email: {userInfo.email}</span>
                    </div>

                </Modal.Header>
                <Modal.Body>
                    <div className="stud-shift-content">
                        <div className="row">
                            <div className="col-sm-4">
                                <div className="stud-shif-class">
                                    <label>Current Branch:</label>
                                    <p>{branches[0].name}</p>
                                    <div className="stud-drop-down-shift-class">
                                        <label>New Branch</label>
                                        <Dropdown>
                                            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                                {newBranch && newBranch.name}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu >
                                                {
                                                    instituteBranchesClassesBatches && instituteBranchesClassesBatches.branches.map((branch, branchIndex) => {
                                                        const { name } = branch
                                                        return (
                                                            <Dropdown.Item
                                                                id={newBranch && newBranch.id}
                                                                onSelect={() => {
                                                                    console.log('branch', branch);
                                                                    if (newBranch && (newBranch.id !== branch.id)) {
                                                                        setNewBranchIndex(branchIndex)
                                                                        setNewBranch(branch);
                                                                        setNewClass(null);
                                                                        setNewBatch(null);
                                                                        setNewClassIndex(-1);
                                                                    }
                                                                }}
                                                            >{name}</Dropdown.Item>
                                                        )
                                                    })
                                                }
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="stud-shif-class">
                                    <label>Current Class:</label>
                                    <p>{classes[0].name}</p>
                                    <div className="stud-drop-down-shift-class">
                                        <label>New Class</label>
                                        <Dropdown>
                                            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                                {newClass && newClass.name}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu >
                                                {instituteBranchesClassesBatches && newBranchIndex !== -1 && instituteBranchesClassesBatches.branches[newBranchIndex].classes.map((classs, classIndex) => {
                                                    const { name } = classs
                                                    return (
                                                        <Dropdown.Item
                                                            id={newClass && newClass.id}
                                                            onSelect={() => {
                                                                if (newClass === null) {
                                                                    console.log('classs', classs);
                                                                    setNewClassIndex(classIndex);
                                                                    setNewClass(classs);
                                                                    setNewBatch(null)
                                                                    setNewBatchIndex(-1);
                                                                }
                                                                if (newClass && (newClass.id !== classs.id)) {
                                                                    console.log('classs', classs);
                                                                    setNewClassIndex(classIndex);
                                                                    setNewClass(classs);
                                                                    setNewBatch(null)
                                                                    setNewBatchIndex(-1);
                                                                }
                                                            }}
                                                        >{name}</Dropdown.Item>
                                                    )
                                                })}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="stud-shif-class">
                                    <label>Current Batch:</label>
                                    <p>{batches[0].name}</p>
                                    <div className="stud-drop-down-shift-class">
                                        <label>New Batch</label>
                                        <Dropdown>
                                            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                                {newBatch && newBatch.name}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu >
                                                {instituteBranchesClassesBatches && newBranchIndex !== -1 && newClassIndex !== -1 && instituteBranchesClassesBatches.branches[newBranchIndex].classes[newClassIndex].batches.map((batch, batchIndex) => {
                                                    const { name } = batch
                                                    return (
                                                        <Dropdown.Item
                                                            id={newBatch && newBatch.id}
                                                            onSelect={() => {
                                                                // console.log('batch', batch);
                                                                if (newBatch === null) {
                                                                    setNewBatchIndex(batchIndex)
                                                                    setNewBatch(batch);
                                                                }
                                                                if (newBatch && (newBatch.id !== batch.id)) {
                                                                    console.log('batch', batch);
                                                                    setNewBatchIndex(batchIndex)
                                                                    setNewBatch(batch);
                                                                }
                                                            }}
                                                        >{name}</Dropdown.Item>
                                                    )
                                                })}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="create-popup-main-content" style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary"
                        onClick={() => handleShiftStudentClose()}
                        className="closeBtn">
                        Close
                    </Button>
                    <Button variant="primary"
                        className={studentData && studentData.batches && newBatch && (studentData.batches[0].id === newBatch.id) || (newBranch === null || newClass === null || newBatch === null) ? `disabled uploadeBtn` : `uploadeBtn`}
                        // className="uploadeBtn"
                        onClick={() => {
                            handleShiftStudent(newBatch, studentData, newBranchIndex, newClassIndex, newBatchIndex)
                        }}
                    >
                        Confirm Change
                   </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default StudentShiftModal;