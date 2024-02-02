import React, { useState, useEffect } from 'react'
import { Modal, Button, Breadcrumb, Spinner } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
const EditModal = (props) => {
    const { View, handleSubmit, Detail, showModal, setShowModal, buttonValidation, addPopupLoader } = props;

    useEffect(() => {
        console.log('Detail', Detail)
    }, [])
    return (
        <div>
            <button style={{
                textAlign: "left", fontSize: "13px", textOverflow: "ellipsis",
                overflow: "hidden", whiteSpace: "nowrap", zIndex: "99999", width: '100%', padding: 6, fontFamily: 'GOTHIC', fontSize: 12
            }} className="btn btn-secondary"
                onClick={() => {
                    setShowModal(true)
                }}
            >Change Code</button>


            <Modal show={showModal} onHide={() => setShowModal(false)} size="sm" className="modal-dark code-change-modal" centered>
                {addPopupLoader && <div className="loader">
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </div>}
                <ToastContainer autoClose={5000} position="top-right" className="tost-dark-container" style={{ borderRadius: 5, fontFamily: 'GOTHIC' }} />
                <Modal.Header closeButton>
                    <Modal.Title>
                        <p className="code-change-stude-name"><label>Name:</label><span>{Detail && Detail.userInfo.name}</span></p>
                        <p className="code-change-stude-email"><label>Email:</label><span> {Detail && Detail.userInfo.email}</span></p>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="create-popup-main-content">
                        {View}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)} className="closeBtn">
                        Close
                    </Button>
                    <Button variant="primary" className={`${buttonValidation} uploadeBtn`} onClick={handleSubmit}>
                        Confirm Change
                   </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default EditModal;
