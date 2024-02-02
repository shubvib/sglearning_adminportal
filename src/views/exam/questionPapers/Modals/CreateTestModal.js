import React, { useRef, useEffect } from 'react';
import { Tooltip, OverlayTrigger, Button, Modal, Form, Spinner } from 'react-bootstrap';
import { BsCloudUpload } from 'react-icons/bs';
import { GrDocumentUpload } from 'react-icons/gr';
import { MdClose } from 'react-icons/md';
import { ToastContainer } from 'react-toastify';
import { useState } from 'react';
const CreatetestModal = (props) => {
    const inputFile = useRef(null)
    const { courseList, handleClose, handleCreateSubmit, handleExamUpload, createTestJSON, upatecreateJSON, show, columwiseFormat, subjectList, isSubjectMappingRequire, mappingError, showMappingPopup, isValidCreateData, showOverlayOncreate, selectedFile = null, showLoader = false, updateExamList, Disabled, CloseFile , accountCourses } = props;

    const [disabled, setDisabled] = useState(false);
    // *************************************Bug Fixes**********************************************
    // const [fileShowFlag, setFileShowFlag] = useState(false);
    // ********************************************************************************************
    // useEffect(() => {
    //     setFileShowFlag(true);
    // }, [inputFile])
    useEffect(() => {
        console.log("Account Courses:",accountCourses)
        setDisabled(Disabled);
        return () => {
            setDisabled(false);
        }
    })
    

    const uploadSection = () => {
        return (
            <div>
                <div className='row'>
                    <div className="col-md-12">
                        <div className="form-group" style={{ marginBottom: 10 }}>
                            <label className="form-control-placeholder" htmlFor="aplicablefor" style={{ position: 'initial' }}>Applicable for<sup style={{ opacity: 1 }}>*</sup></label>
                        </div>
                    </div>
                </div>
                <div>
                { accountCourses.length != 0 ? <div className="row">
                    {accountCourses.map((option, i) => {
                        return <div className="col-md-6" key={`courseChk_${option.id}_${i}`} >
                            {columwiseFormat(option, i)}
                        </div>
                    })}
                </div>
                :
                <div className="row">
                    {courseList.map((option, i) => {
                        return <div className="col-md-6" key={`courseChk_${option.id}_${i}`} >
                            {columwiseFormat(option, i)}
                        </div>
                    })}
                </div>

                }
                </div>
                <div className='row'>
                    <div className="col-md-12">
                        <Form.Group>
                            <div className={`${createTestJSON.applicableFor ? "upload-box" : "upload-box disabled"}`}>
                                <input type='file' id='file' ref={inputFile} style={{ display: 'none' }} onChange={(e) => handleExamUpload(e)}
                                    onClick={(e) => {
                                        e.target.value = null
                                    }}
                                />
                                <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-bottom" className="common-tooltip">Upload document file..!</Tooltip>}>


                                    <button
                                        type='button'
                                        className={disabled ? "common-btn-import disabled" : "common-btn-import"} onClick={() => {
                                            inputFile.current.click();

                                        }}
                                    >
                                        <BsCloudUpload size={20} />
                                            Upload
                                        </button>

                                </OverlayTrigger>
                                {(selectedFile && selectedFile.name) && <div className="selected-file-box">
                                    <span id="selectedFile">{selectedFile.name}</span>
                                    <Button
                                        onClick={() => { CloseFile(); }}
                                        className="closefile"
                                    ><MdClose /></Button>
                                </div>}

                            </div>
                            {(isSubjectMappingRequire && mappingError) &&
                                <a href="javascript:void(0);" onClick={showMappingPopup} className="mapping-error-box">
                                    {mappingError}
                                </a>
                            }
                        </Form.Group>

                    </div>

                </div>
            </div>

        )
    }


    const examDetailSection = () => {
        return (
            <div className="exam-details-box">
                <div className='row'>
                    <div className="col-md-12">
                        <div className="form-group">
                            <input type="text"
                                name="name"
                                id="name"
                                value={createTestJSON.name}
                                onChange={upatecreateJSON}
                                className="form-control"
                                required
                            />
                            <label className="form-control-placeholder" htmlFor="name">Exam Name<sup>*</sup></label>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className="col-md-12">
                        <div className="form-group">
                            <textarea type="text" id="description" className="form-control"
                                name="description"
                                value={createTestJSON.description}
                                onChange={upatecreateJSON}
                            />
                            <label className="form-control-placeholder" htmlFor="description">Description</label>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    {/* <div className="col-md-6"> */}
                    {/* <Form.Group>
                            <div className="form-check form-check-neonWhite">
                                <label className="form-check-label">
                                    <input type="checkbox"
                                        className="form-check-input"
                                        checked={createTestJSON.examType == 1 ? true : false}
                                        name="examType"
                                        onChange={upatecreateJSON}
                                    />
                                    <i className="input-helper"></i>
                                            Objective
                                        </label>
                            </div>
                        </Form.Group> */}
                    {/* <div className="form-group">
                            <input
                                type="number"
                                id="attempts"
                                name={"attempts"}
                                className="form-control"
                                required
                                value={createTestJSON.attempts}
                                onChange={upatecreateJSON}
                            />
                            <label className="form-control-placeholder" htmlFor="attempts">Attempts<sup>*</sup></label>
                        </div> */}
                    {/* </div> */}

                    <div className="col-md-6">
                        {/* <Form.Group>
                            <div className="form-check form-check-neonWhite">
                                <label className="form-check-label">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        name={"examType"}
                                        id={"examType"}
                                        checked={createTestJSON.examType == 0 ? true : false}
                                        name="examType"
                                        onChange={upatecreateJSON}
                                    />
                                    <i className="input-helper"></i>
                                            Subjective
                                        </label>
                            </div>
                        </Form.Group> */}
                        <div className="form-group">
                            <input
                                type="number"
                                id="duration"
                                name={"duration"}
                                className="form-control"
                                required
                                value={createTestJSON.duration}
                                onChange={upatecreateJSON}
                            />
                            <label className="form-control-placeholder" htmlFor="duration">Duration in minutes<sup>*</sup></label>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className="col-md-12">
                        <div className="form-group" style={{ marginBottom: 10 }}>
                            <label className="form-control-placeholder" style={{ position: 'initial' }}>Note: Common instructions have been applied.</label>
                        </div>
                    </div>
                </div>
                <div className="form-check form-check-neonWhite">
                    <label className="form-check-label">
                        <input type="checkbox"
                            className="form-check-input"
                            value={createTestJSON.isSpecificInstructions}
                            defaultChecked={createTestJSON.isSpecificInstructions}
                            name={"isSpecificInstructions"}
                            key={createTestJSON.isSpecificInstructions}
                            onChange={upatecreateJSON}
                        />
                        <i className="input-helper"></i>
                        Specific instruction
                    </label>
                </div>

                {createTestJSON.isSpecificInstructions && <div className='row'>
                    <div className="col-md-12">
                        <div className="form-group">
                            <textarea type="text" className="form-control"
                                name="testInstructions"
                                value={createTestJSON.testInstructions}
                                onChange={upatecreateJSON}
                            />
                            {/* <label className="form-control-placeholder" htmlFor="description">Specific instruction<sup>*</sup></label> */}
                        </div>
                    </div>
                </div>}

                {showOverlayOncreate && <div className="overlay-exam-details"></div>}
            </div>
        )
    }


    return (
        <div className="modal-main-dark">
            <Modal show={show} onHide={handleClose} className="modal-dark create-test-modal" centered backdrop="static">
                {showLoader && <div className="loader">
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </div>}
                <ToastContainer autoClose={5000} position="top-right" className="tost-dark-container" style={{ borderRadius: 5, fontFamily: 'GOTHIC' }} />
                <Modal.Header closeButton>
                    <div className="modal-title-box">
                        <h3><GrDocumentUpload size={26} />Import Question Paper</h3>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className="modal-contemt-wrapper">
                        <form className="forms-sample">
                            {uploadSection()}
                            {examDetailSection()}
                        </form>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" className="closeBtn" onClick={handleClose}>
                        Close
                </Button>
                    <Button
                        variant="primary" className={`uploadeBtn ${isValidCreateData ? '' : 'disabled'}`} onClick={() => {
                            handleCreateSubmit()
                        }} >
                        Submit
                </Button>
                </Modal.Footer>
            </Modal>
        </div >)
}
export default CreatetestModal;