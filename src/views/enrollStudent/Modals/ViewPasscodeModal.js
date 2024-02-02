import React, { useRef, useState, useEffect } from 'react';
import { Button, Modal, Card, Accordion } from 'react-bootstrap';
import DetailsReportModal from './DetailsReportModal';
import moment from 'moment';
import { Api, CommonApiCall } from '../../../services';
import { toast, ToastContainer } from 'react-toastify';
import CommonFunctions from '../../../utils/CommonFunctions';
import { BsCheckCircle, BsCircle } from "react-icons/bs";

const ViewPasscodeModal = (props) => {
    const { handleClosePassCodeModal, passCode, showPassCodeModal, studentDetail } = props;

    return (
        <div className="modal-main-dark">
            <Modal show={showPassCodeModal} onHide={() => handleClosePassCodeModal()} centered size="md" className="modal-dark view-passcode-modal" backdrop="static" >
                <ToastContainer autoClose={5000} position="top-right" className="tost-dark-container" style={{ borderRadius: 5, fontFamily: 'GOTHIC' }} />
                <Modal.Header closeButton>
                    <div className="modal-title-box">
                        <span>Student Pass-Code</span>
                        {/* <span>Total assigned count: {userGivenTestList.length}</span> */}
                    </div>
                </Modal.Header>

                <Modal.Body>
                    <div className="attempted-exam-list">
                        {(studentDetail && studentDetail.userInfo && studentDetail.userInfo.email) && <span>Student Email: {studentDetail.userInfo.email}</span>}
                    </div>
                    <div className="attempted-exam-list">
                        <span>Student Pass-Code: {passCode} </span>
                    </div>

                </Modal.Body>
                {/* <Modal.Footer>
                    <Button variant="secondary" className="closeBtn">
                        Cancel
                    </Button>
                    <Button variant="secondary" className="uploadeBtn">
                        Detail Report
                    </Button>

                </Modal.Footer> */}
            </Modal>
        </div>
    )
}
export default ViewPasscodeModal