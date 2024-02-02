import React, { useState, useEffect } from 'react';
import { Tooltip, OverlayTrigger, Button, Modal, Form, Spinner } from 'react-bootstrap';
import { FiEdit } from 'react-icons/fi';
import { ToastContainer } from 'react-toastify';
const EditTestModal = (props) => {

    // Props---------------------------------------------------------------
    const { showEditModal, handleCloseEditModal, editLoader, handleEdit, courseList, examDataForEdit } = props;
    // UseStates-----------------------------------------------------------
    const [updater, setUpdater] = useState(false);
    const [newData, setNewData] = useState({
        "name": examDataForEdit[0].name,
        "description": examDataForEdit[0].description,
        "duration": `${examDataForEdit[0].duration}`
    });
    const [courses, setCourses] = useState(null);
    const [applicableForArray, setApplicableForArray] = useState({
        applicableFor: []
    })
    // UseEffect-----------------------------------------------------------
    useEffect(() => {
        console.log('examDataForEdit', examDataForEdit);
    }, [examDataForEdit])

    useEffect(() => {
        console.log('courseList', courseList);
        setCourses(courseList)
    }, [courseList])

    // Functions-----------------------------------------------------------

    const classValidator = () => {
        if (applicableForArray.applicableFor.length === 0) {
            return false;
        } else if (newData.name.length === 0) {
            return false;
        } else if ((newData.duration.length === 0) || (parseInt(newData.duration) === 0)) {
            return false;
        } else {
            return true;
        }
    }
    const columnWiseFormat = (option, i) => {
        return (
            <div className="form-check form-check-neonWhite">
                <label className="form-check-label">
                    <input type="checkbox"
                        className="form-check-input"

                        value={option.name}
                        name={"checkBox" + i}
                        key={option.name}
                        onChange={(e) => {
                            console.log('option', option);
                            console.log('i', i);
                            var list = [];
                            list = applicableForArray.applicableFor;
                            setApplicableForArray({
                                ...applicableForArray,
                                ['applicableFor']: [],
                            });
                            let isFind = list.indexOf(option.id);
                            if (isFind != -1) { list.splice(isFind, 1) } else { list.push(option.id) }
                            setApplicableForArray({
                                ...applicableForArray,
                                ['applicableFor']: list,
                            });
                            // classValidator();
                            setUpdater(!updater)
                        }} />
                    <i className="input-helper"></i>
                    {option.name}
                </label>
            </div>
        )
    }
    const examDetailSection = () => {
        return (
            <div className="exam-details-box">
                {/********************************************* Applicable For Start ********************************************************************/}
                <div className="applicable-for-filter">
                    <div className='row'>
                        <div className="col-md-12">
                            {/* INLINE */}
                            <div className="form-group applicable-for-header" style={{ marginBottom: 10 }}>
                                <label className="form-control-placeholder" htmlFor="applicableFor" style={{ position: 'initial' }}>Applicable for<sup style={{ opacity: 1 }}>*</sup></label>
                            </div>
                        </div>
                    </div>
                    <div className="row applicable-for-items">
                        {courses && courses.map((option, i) => {
                            return <div className="col-md-6 " key={`courseChk_${option.id}_${i}`} >
                                {columnWiseFormat(option, i)}
                            </div>
                        })}
                    </div>
                </div>
                <hr style={{ marginTop: "30px", marginBottom: "30px", boxShadow: "0px 1px 1px" }} />
                {/******************************* Applicable For End ********************************/}
                <div className='row'>
                    <div className="col-md-12">
                        <div className="form-group">
                            <input type="text"
                                name="name"
                                id="name"
                                className="form-control"
                                // defaultValue={examDataForEdit[0].name}
                                value={newData.name}
                                onChange={(e) => {
                                    let OldData = newData;
                                    console.log('OldData', OldData);
                                    OldData.name = e.target.value;
                                    setNewData(OldData);
                                    setUpdater(!updater);
                                }}
                            />
                            <label className="form-control-placeholder" htmlFor="name">Exam Name<sup>*</sup></label>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className="col-md-12">
                        <div className="form-group">
                            <textarea type="text" id="description" name="description" className="form-control"
                                style={{ height: "35px" }}
                                // defaultValue={examDataForEdit[0].description}
                                value={newData.description}
                                onChange={(e) => {
                                    let OldData = newData;
                                    console.log('OldData', OldData);
                                    OldData.description = e.target.value;
                                    setNewData(OldData);
                                    setUpdater(!updater);
                                }}
                            />
                            <label className="form-control-placeholder" htmlFor="description">Description</label>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className="col-md-6">
                        <div className="form-group">
                            <input
                                type="number"
                                id="duration"
                                name="duration"
                                className="form-control"
                                // defaultValue={examDataForEdit[0].duration}
                                value={newData.duration}
                                onChange={(e) => {
                                    if (NaN) {
                                        return false;
                                    } else {
                                        let OldData = newData;
                                        console.log('OldData', OldData);
                                        OldData.duration = e.target.value;
                                        setNewData(OldData);
                                        setUpdater(!updater);
                                    }
                                }}
                            />
                            <label className="form-control-placeholder" htmlFor="duration">Duration in minutes<sup>*</sup></label>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const handleCloseButton = () => {
        setNewData([]);
        setCourses(null);
        setApplicableForArray({
            applicableFor: []
        })
        handleCloseEditModal();
    }

    const handleEditButton = () => {
        handleEdit(examDataForEdit, newData, applicableForArray.applicableFor);
    }
    return (
        <div className="modal-main-dark">
            {examDataForEdit && newData &&
                <Modal show={showEditModal} onHide={handleCloseButton} className="modal-dark create-test-modal" centered backdrop="static">
                    {editLoader &&
                        <div className="loader">
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </div>
                    }
                    <ToastContainer autoClose={5000} position="top-right" className="tost-dark-container" style={{ borderRadius: 5, fontFamily: 'GOTHIC' }} />
                    <Modal.Header closeButton>
                        <div className="modal-title-box">
                            <h3><FiEdit size={26} />Edit Question Paper Details</h3>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="modal-contemt-wrapper">
                            <form className="forms-sample">
                                {examDetailSection()}
                            </form>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" className="closeBtn"
                            onClick={handleCloseButton}>
                            Close
                        </Button>
                        <Button
                            variant="primary" className={classValidator() === true ? 'uploadeBtn' : 'uploadeBtn disabled'}
                            onClick={handleEditButton}
                        >
                            Edit
                        </Button>
                    </Modal.Footer>
                </Modal>
            }
        </div >)
}
export default EditTestModal;