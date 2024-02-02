import React, { useState, useEffect, hideDeleteModal } from 'react';
import { Button } from 'react-bootstrap';
import { MdClose } from "react-icons/md";
const DeleteExamConfirmationModal = (props) => {
    const { showDeleteConfirmationBox, hideDeleteModal, handleDelete, handleClose, message } = props;
    return (
        <div onBlur={hideDeleteModal} className="confirmation-delete-popup" hidden={!showDeleteConfirmationBox}>
            <button className="close-btn" onClick={handleClose}><MdClose /></button>
            <div className="confirmation-contaion">
                <span>{message ? `${message}` : "This will delete selected Question Paper and Assigned Exams associated with it."}</span>
                <span className="note-span">Note: This action can not be rollbacked!!</span>
            </div>

            <div className="footer-confirmation-box">
                <div className="yes-no-text"> <span>Do you want to Continue:</span></div>
                <div className="yes-no">
                    <Button size="sm" variant="outline-danger" onClick={handleDelete} className="yes-btn">Yes</Button>
                    <Button size="sm" variant="outline-info" onClick={hideDeleteModal} className="no-btn">No</Button>
                </div>
            </div>
        </div>
    )
}

export default DeleteExamConfirmationModal;