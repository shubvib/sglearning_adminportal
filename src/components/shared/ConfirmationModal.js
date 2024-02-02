import React, { useState, useEffect, hideDeleteModal } from 'react';
import { Button } from 'react-bootstrap';
import { MdClose } from "react-icons/md";
const ConfirmationModal = (props) => {
    const { showDeleteConfirmatioModal, hideDeleteModal, onConfirm, onCancel, noteText = '', descriptionText = '', confirmButtonText = 'Yes', cancelButtonText = 'No', confiBoxStyle = null } = props;

    const cancelAction = () => {
        if (onCancel && typeof (onCancel) === "function") {
            onCancel();
        } else {
            hideDeleteModal();
        }
    }

    // const defaultStyle = {
    //     width: "auto",
    //     height: 'auto',
    //     maxWidth: '50%',
    //     maxHeight: '50%',
    //     position: "absolute",
    //     right: "59px",
    //     backgroundColor: "#ffffff47",
    //     padding: "10px",
    //     backdropFilter: "blur(10px)",
    //     borderRadius: "10px",
    //     borderBottomRightRadius: "0px",
    //     boxShadow: "-31px -18px 66px black"
    // }


    return (
        <div onBlur={hideDeleteModal} hidden={!showDeleteConfirmatioModal} className="common-confirmation-delete-popup">
            <button className="close-btn" onClick={cancelAction} ><MdClose /></button>
            <div className="confirmation-contaion">
                {descriptionText && <span>{descriptionText} </span>}
                {noteText && <span className="note-span">Note: {noteText}</span>}
            </div>

            <div className="footer-confirmation-box">
                <div className="yes-no-text"> <span>Do you want to Continue?</span></div>
                <div className="yes-no">
                    <Button size="sm" variant="outline-danger" onClick={onConfirm} className="yes-btn">{confirmButtonText}</Button>
                    <Button size="sm" variant="outline-info" onClick={cancelAction} className="no-btn">{cancelButtonText}</Button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationModal;