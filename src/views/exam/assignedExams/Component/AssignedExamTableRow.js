import React, { useState, useEffect } from 'react';
import { Tooltip, OverlayTrigger, Accordion, Spinner } from 'react-bootstrap';
import { FaBook } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { GrDocumentTime } from "react-icons/gr";
import { BsChevronDoubleDown } from "react-icons/bs";
import moment from 'moment';
import { ScheduledTestModal } from '../Modals';
import DeleteExamConfirmationModal from '../../questionPapers/Modals/DeleteExamConfirmationModal';


const AssignedExamTableRow = (props) => {
    const { index, listKey, examData, handleOnGoingClick, onGoingIcon, onGoingLabel, isMultiExpand, examReportIcon, examReportLabel, handleExamReportClick, liveExamIcon, liveExamLabel, handleLiveExamReportClick, setCurrentExamId, handleAkcBkcPreviewClick, handlePreviewClick, showExamPreviewLoader, showAkcBkcPreviewLoader, handleAssignedExamDetalisClick, setExamData, assignLabel, handleAssignClick, handleDeleteExamClick, hadDeleted } = props;
    // const { courses, description, duration, id, marks, name, subjects, lastScheduleDate, noOfQuestion, dateCreated } = examData;

    const { accountId, batchExamSchedules, createdByUserId, exam, examName, id } = examData;
    const { courses, description, duration, examType, instructions, lastScheduleDate, marks, name, noOfQuestion, organizerAccountName, organizerAccountShortName, subjects, dateCreated } = exam;

    const [onGoingFlag, setOnGoingFlag] = useState(false)
    const [open, setOpen] = useState(false);
    const [defValue, setDefaultvalue] = useState(index)
    useEffect(() => {
        const currentDate = moment(new Date(Date.now())).format("L");
        const ScheduleDate = moment(lastScheduleDate).format("L")
        if (ScheduleDate >= currentDate) {
            setOnGoingFlag(true)
        }
        else {
            setOnGoingFlag(false)
        }
    }, [lastScheduleDate])

    // *((((((((((((((((((((Delete View))))))))))))))))))))
    const [showDeleteConfirmationBox, setShowDeleteConfirmationBox] = useState(false);

    useEffect(() => {
        console.log('hadDeleted', hadDeleted);
    }, [hadDeleted])
    const handleDelete = () => {
        console.log('examData.id', examData.id);
        setShowDeleteConfirmationBox(false);
        handleDeleteExamClick();
    }

    const handleDeleteExam = () => {
        console.log('examData', examData);
        setShowDeleteConfirmationBox(!showDeleteConfirmationBox);
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
                    message={"This will delete whole Exam Schedule."}
                    handleClose={() => { setShowDeleteConfirmationBox(false) }}
                />
                <button type="button" className="btn btn-delete" onClick={() => {
                    handleDeleteExam()
                }}><MdDelete /></button>

            </>
        )
    }
    // *((((((((((((((((((((Delete View))))))))))))))))))))
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
        return (
            <>
                <Accordion.Toggle eventKey={defValue} key={`AccoExamListItem_${listKey}`}
                    onBlur={(e) => {
                        e.preventDefault();
                        !isMultiExpand && setOpen(false)
                    }}
                    onClick={(e) => {
                        setOpen(!open)
                    }}

                >
                    <div className="card-box-inner-wrapper">
                        <div className="dark-card">
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
                                                <span className="common-text-exapand" title={name}>{examName ? examName : name}</span>
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
                                            {!hadDeleted ?
                                                <div className="button-box-exam">
                                                    <div className="live-exam-btn-box on-hover-show" style={{ opacity: open ? '1' : '0' }}>
                                                        <button
                                                            onMouseOver={() => setDefaultvalue(-1)}
                                                            onMouseLeave={() => setDefaultvalue(index)}
                                                            onBlur={() => setDefaultvalue(index)}
                                                            type="submit" className="btn btn-live-exam" onClick={e => {
                                                                handleLiveExamReportClick(batchExamSchedules)
                                                                setCurrentExamId(id)

                                                            }}>{liveExamIcon}{liveExamLabel} </button>
                                                    </div>
                                                    <div className="export-report-btn-box on-hover-show" style={{ opacity: open ? '1' : '0' }}>
                                                        <button
                                                            onMouseOver={() => setDefaultvalue(-1)}
                                                            onMouseLeave={() => setDefaultvalue(index)}
                                                            onBlur={() => setDefaultvalue(index)}
                                                            onClick={e => {
                                                                handleExamReportClick(batchExamSchedules)
                                                                setCurrentExamId(id)
                                                                console.log('batchExamSchedules', batchExamSchedules);
                                                            }} type="submit" className="btn btn-export-report">{examReportIcon}{examReportLabel} </button>
                                                    </div>
                                                </div> :
                                                <div><span style={{ color: "#c66666", textShadow: "0px 1px 20px #f90909", float: "right", paddingRight: "10px" }}>Schedule Deleted</span></div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="exapand-card-col exapand-card-col-arrow-button">
                                    <div className="exapnd-card-box">
                                        <div className="expand-arrow-box-exam">
                                            <div className=
                                                {open ? 'expand-btn-box' : 'expand-btn-box active'}
                                            >
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
                            <div className="inner uk-grid" >

                                {batchExamSchedules && !hadDeleted && <ScheduledTestModal
                                    examScheduleData={batchExamSchedules}
                                    duration={duration}
                                // metaDataForShedule={batchExamSchedules[0].bufferTimeInMinutes}
                                />}

                                {!hadDeleted ?
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="exapandable-content-button-box left-btn-expand-box">
                                                <button type="submit" className="btn btn-assign-details" onClick={() => {
                                                    handleAssignedExamDetalisClick()
                                                    setExamData(examData);
                                                }}>Details</button>
                                                <button type="submit" className={`btn btn-preview ${showExamPreviewLoader ? 'disabled' : ''}`} onClick={handlePreviewClick} >
                                                    {!showExamPreviewLoader && "Preview"} {showExamPreviewLoader && <Spinner size="sm" animation="grow" variant="info" />}
                                                </button>
                                                <button type="submit" className={`btn btn-akc-bkc ${showAkcBkcPreviewLoader ? 'disabled' : ''}`} onClick={handleAkcBkcPreviewClick}>
                                                    {!showAkcBkcPreviewLoader && "Key-Corrections"} {showAkcBkcPreviewLoader && <Spinner size="sm" animation="grow" variant="info" />} </button>

                                                <button type="submit" className="btn btn-add-batches" onClick={handleAssignClick}>
                                                    {assignLabel}</button>
                                            </div>

                                        </div>
                                        <div className="col-sm-6">
                                            <div className="exapandable-content-button-box">
                                                {deleteView()}
                                                {/* <button type="submit" className="btn btn-delete"><MdDelete /></button> */}
                                            </div>
                                        </div>
                                    </div> :
                                    <div className="row"
                                        style={{ backgroundImage: "linear-gradient(45deg, #8a3030, transparent)", borderBottomLeftRadius: "18px", borderStyle: "solid", borderWidth: "8px", borderColor: "black" }}
                                    ><span style={{ paddingLeft: "20px", color: "#c66666", textShadow: "0px 1px 20px #f90909" }}>Schedule Deleted</span></div>
                                }
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
export default AssignedExamTableRow;