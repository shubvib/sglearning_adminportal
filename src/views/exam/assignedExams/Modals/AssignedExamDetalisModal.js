import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { GrDocumentText } from "react-icons/gr";
import moment from 'moment';
const AssignedExamDetalisModal = (props) => {
    const { showAssignedExamDetalisModal, closeAssignedExamDetalisModal, examData } = props;
    const { exam, examName } = examData;

    const { courses, description, duration, examType, id, marks, name, subjects, noOfQuestion, dateCreated } = exam;

    return (
        <div className="modal-main-dark">
            <Modal show={showAssignedExamDetalisModal} onHide={closeAssignedExamDetalisModal} size="lg" className="modal-dark assigned-exam-details-modal-dark" centered>

                <div className="modal-title-box">
                    <h3><GrDocumentText /> Assigned Exam Details</h3>
                </div>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <div className="assigned-exam-details-wrapper">
                        <div className="exam-name-assigned"> <span>{examName ? examName : name}</span></div>
                        <div className="assigned-exam-details-grid">
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="exapandable-content">
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
                                <div className="col-sm-6">
                                    <div className="exapandable-content" style={{ display: "flex", justifyContent: "space-between" }} >
                                        <p><label>Total Questions:</label>{noOfQuestion}</p>
                                        <p><label>Total marks:</label>{marks}</p>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="exapandable-content">
                                        <p><label>Applicable for:</label>
                                            {courses.map((course, index) => {
                                                return <span key={`course_${course.id}`}> {course.name}{(index + 1 === courses.length || courses.length === 0) ? '' : ','} </span>
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="exapandable-content">
                                        <p><label>No.of subjects:</label>{subjects.length}</p>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="exapandable-content">
                                        <p>
                                            <label>Subjects:</label>
                                            {subjects.map((subject, index) => {
                                                return <span key={`subjectList_${subject.id}_${index}`}> {subject.name}{(index + 1 === subjects.length || subjects.length === 0) ? '' : ','} </span>
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}


export default AssignedExamDetalisModal;



