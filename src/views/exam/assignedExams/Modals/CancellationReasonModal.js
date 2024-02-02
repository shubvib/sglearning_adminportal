import React, { useState } from 'react';
import { Tooltip, OverlayTrigger, Button, Modal, Spinner } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
const CancellationReasonModal = (props) => {
    // --------------props
    const { batchData, index, show, handleClose, showLoader, cancelExam } = props;
    // --------------useState
    const [reasonForCancellation, setReasonForCancellation] = useState("");
    // -------------useEffect

    // ----------function----------------------------------------
    const handleCloseButton = () => {
        setReasonForCancellation("");
        handleClose();
    }

    const handleCancelButton = (batchData, index, reasonForCancellation) => {
        cancelExam(batchData, index, reasonForCancellation);
        setReasonForCancellation("");
    }
    // ----------------------------------------------Main Return-----------------------------------------
    return (
        <div className="modal-main-dark">
            <Modal show={show} onHide={() => {
                handleCloseButton()
            }} centered className="modal-dark cancel-reason-modal">
                <ToastContainer autoClose={5000} position="top-right" className="tost-dark-container" style={{ borderRadius: 5, fontFamily: 'GOTHIC' }} />
                {showLoader &&
                    <div className="loader">
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </div>
                }
                <Modal.Header closeButton>
                    <div className="modal-title-box">
                        <h3>Cancel Reason</h3>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <input
                            type="reason"
                            name="reason"
                            id="reason"
                            value={reasonForCancellation}
                            onChange={e => setReasonForCancellation(e.target.value)}
                            required
                            className="form-control"
                        />
                        <label className="form-control-placeholder">Reason for Cancellation<sup>*</sup></label>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        handleCloseButton();
                    }} className="closeBtn">
                        Close
                    </Button>
                    <Button variant="primary" className={reasonForCancellation.length <= 2 ? 'disabled uploadeBtn' : 'uploadeBtn'}
                        onClick={() => { handleCancelButton(reasonForCancellation) }}>
                        Cancel Exam
                   </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default CancellationReasonModal;