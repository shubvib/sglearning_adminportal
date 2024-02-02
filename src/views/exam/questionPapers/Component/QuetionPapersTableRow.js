import React, { useState, useEffect } from 'react';
import { Tooltip, OverlayTrigger, Accordion, Spinner } from 'react-bootstrap';
import { FaBook } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { GrDocumentTime } from "react-icons/gr";
import { BsChevronDoubleDown } from "react-icons/bs";
import moment from 'moment';
import DeleteExamConfirmationModal from '../Modals/DeleteExamConfirmationModal';

const QuetionPapersTableRow = (props) => {
    const { index, listKey, examData, handleAssignClick, onAssignIcon, assignLabel, isMultiExpand, handleAkcBkcPreviewClick, handlePreviewClick, showExamPreviewLoader, showAkcBkcPreviewLoader, handleEditExam, handleDeleteExamClick, hadRemoved, deleteActionLoader } = props;
    const { courses, description, duration, examType, id, marks, name, subjects, noOfQuestion, dateCreated } = examData;

    const [open, setOpen] = useState(false);
    const [defValue, setDefaultvalue] = useState(index)

    useEffect(() => {
        console.log('open', open);
    }, [open])

    // ****************************************************Delete Menu******************************************
    // ---------------useStates----------------
    const [showDeleteConfirmationBox, setShowDeleteConfirmationBox] = useState(false);

    // ---------------useEffects----------------
    useEffect(() => {
        console.log('showDeleteConfirmationBox', showDeleteConfirmationBox);
    }, [showDeleteConfirmationBox])

    useEffect(() => {
        console.log('hadRemoved', hadRemoved);
    }, [hadRemoved])
    // ---------------Functions----------------
    const handleDeleteExam = () => {
        console.log('examData', examData);
        setShowDeleteConfirmationBox(!showDeleteConfirmationBox);

    }

    const handleDelete = () => {
        console.log('examData.id', examData.id);
        setShowDeleteConfirmationBox(false);
        handleDeleteExamClick();
    }

    const deleteView = () => {
        return (
            <>
                <DeleteExamConfirmationModal
                    showDeleteConfirmationBox={showDeleteConfirmationBox}
                    hideDeleteModal={() => {
                        console.log('!showDeleteConfirmationBox', !showDeleteConfirmationBox)
                        setShowDeleteConfirmationBox(false);
                    }}
                    handleDelete={() => {
                        handleDelete(index)
                    }}
                    handleClose={() => { setShowDeleteConfirmationBox(false) }}
                />
                <button type="button" className="btn btn-delete" onClick={() => {
                    handleDeleteExam()
                }}><MdDelete /></button>

            </>
        )
    }
    // ****************************************************Delete Menu End******************************************

    const mutiExpandComponenet = () => {
        return (
            <Accordion className="accordian-dark-wrapper" >
                {subContentComponent()}
            </Accordion>
        )
    }
    const singleExpandComponent = () => {
        return (
            <div className="accordian-dark-wrapper" key={`examListItem_${listKey}`}>
                {subContentComponent()}
            </div>
        )
    }

    const subContentComponent = () => {
        let removedExamStyle = {}
        if (hadRemoved && hadRemoved === true) {
            removedExamStyle = {
                borderRightStyle: "groove",
                borderRightWidth: "7px",
                borderRightColor: "red"
            }
        }
        return (
            <>
                <Accordion.Toggle eventKey={defValue} key={`AccordionExamListItem_${listKey}`}
                    onBlur={(e) => {
                        e.preventDefault();
                        !isMultiExpand && setOpen(false)
                    }}
                    onClick={(e) => {
                        if (deleteActionLoader) {
                        } else {
                            setOpen(!open)
                        }

                    }} >
                    <div className="card-box-inner-wrapper">
                        <div className="dark-card" style={removedExamStyle}>

                            <div className="exapand-card-row">
                                <div className="exapand-card-col exapand-card-col-id">
                                    <div className="exapnd-card-box">
                                        <div className="id-box">
                                            <span className="common-text-exapand-id">{index}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="exapand-card-col exapand-card-col-exam-nm">
                                    <div className="exapnd-card-box">
                                        <div className="exam-name-box">
                                            <div className="exam-text-name-box">
                                                <span className="common-text-exapand" title={name}>{name}</span>
                                            </div>
                                            <div className="exam-sub-box">
                                                <div className="exam-sub-inner-box exam-type-box">
                                                    <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-bottom" className="common-tooltip">Exam Type: Subjective</Tooltip>}>

                                                        <span className="exam-title-names"> <FaBook /></span>
                                                    </OverlayTrigger>
                                                </div>
                                                <div className="exam-sub-inner-box exam-duration-box">
                                                    <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-bottom" className="common-tooltip">Duration</Tooltip>}>

                                                        <span className="exam-title-names"><GrDocumentTime />:{duration} min</span>
                                                    </OverlayTrigger>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="exapand-card-col exapand-card-col-exam-buttons">
                                    <div className="exapnd-card-box">
                                        <div className="button-box-exam-wrapper">
                                            <div className="button-box-exam">
                                                <div className="assign-btn-box on-hover-show" style={{ opacity: open ? '1' : '0' }}>
                                                    {(hadRemoved && hadRemoved === true) ?
                                                        <span style={{ opacity: "1", color: "white" }}>This exam is removed</span> :
                                                        deleteActionLoader ?
                                                            <span style={{ color: "white" }}>Deleting Question Paper...</span>
                                                            :
                                                            <button
                                                                onMouseOver={() => setDefaultvalue(-1)}
                                                                onMouseLeave={() => setDefaultvalue(index)}
                                                                onBlur={() => setDefaultvalue(index)}
                                                                onClick={handleAssignClick} type="submit" className="btn btn-assign">{onAssignIcon}{assignLabel} </button>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="exapand-card-col exapand-card-col-arrow-button">
                                    <div className="exapnd-card-box">
                                        <div className="expand-arrow-box-exam">
                                            <div className={open ? 'expand-btn-box' : 'expand-btn-box active'}>
                                                <button type="submit" className="btn btn-arrow text-muted">
                                                    <BsChevronDoubleDown />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={index} >
                    <div className="expandable">
                        <div className="exapandable-content-wrapper uk-background-muted">
                            <div className="inner uk-grid">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="exapandable-content" style={{ display: "block" }}>
                                            <div className="row">
                                                <div className="col-sm-8">
                                                    <p><label>Description:</label>{description ? description : "-"}</p>
                                                </div>
                                                <div className="col-sm-4">
                                                    <p className="date-created"><label>Date Created:</label>{moment(new Date(dateCreated)).format("lll")}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="exapandable-content" style={{ display: "flex", justifyContent: "space-between" }} >
                                            <p><label>Total Questions:</label>{noOfQuestion}</p>
                                            <p><label>Total marks:</label>{marks}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="exapandable-content">
                                            <p><label>Applicable for:</label>
                                                {courses.map((course, index) => {
                                                    return <span key={`course_${course.id}`}> {course.name} {(index + 1 === courses.length || courses.length === 0) ? '' : ','} </span>
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="exapandable-content">
                                            <p><label>No.of subjects:</label>{subjects.length}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="exapandable-content">
                                            <p><label>Subjects:</label>
                                                {subjects.map((subject, index) => {
                                                    return <span key={`subjectList_${subject.id}_${index}`}> {subject.name} {(index + 1 === subjects.length || subjects.length === 0) ? '' : ','} </span>
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-2">
                                        <div className="exapandable-content-button-box left-btn-expand-box">
                                            <button type="submit" className={`btn btn-preview ${showExamPreviewLoader ? 'disabled' : ''}`} onClick={handlePreviewClick} >
                                                Preview {showExamPreviewLoader && <Spinner size="sm" animation="grow" variant="info" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-sm-10">
                                        {hadRemoved && hadRemoved === true ?
                                            <div></div> :
                                            deleteActionLoader === true ?
                                                <div class="loader-under-accordion">
                                                    <p>Deleting Question Paper...</p>
                                                </div>
                                                :
                                                <div className="exapandable-content-button-box">
                                                    {deleteView()}
                                                    <button type="button" className="btn btn-edit" onClick={handleEditExam}><MdEdit /></button>
                                                </div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Accordion.Collapse></>
        )
    }

    return (
        <>
            {isMultiExpand ? mutiExpandComponenet() : singleExpandComponent()}
        </>
    )
}
export default QuetionPapersTableRow;