import React, { useState, useEffect } from 'react'
import { Modal, Button, Breadcrumb, Spinner } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
const DynamicAddPopUp = (props) => {
    const { Detail, Display, View, handleSubmit, buttonValidation, addPopupLoader, showDynamicAddPopup, closeDynamicAddPopup } = props;
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        console.log('Detail', Detail)
        console.log('Display', Display);
    }, [])
    return (
        <div>
            {/* <Button className="pluseBtnCommon" onClick={handleShow}>
                <i className="fa fa-plus"></i>
            </Button> */}
            <Modal show={showDynamicAddPopup} onHide={closeDynamicAddPopup} size="md" className="modal-dark">
                {addPopupLoader && <div className="loader">
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </div>}
                <ToastContainer autoClose={5000} position="top-right" className="tost-dark-container" style={{ borderRadius: 5, fontFamily: 'GOTHIC' }} />
                <Modal.Header closeButton>
                    <Modal.Title>
                        <Breadcrumb>
                            {Display.BranchDisplay && <Breadcrumb.Item href="#"><span>{Detail.InstituteName}</span></Breadcrumb.Item>}
                            {Display.ClassDisplay && <Breadcrumb.Item><span>{Detail.BranchName}</span></Breadcrumb.Item>}
                            {Display.DivisionDisplay && <Breadcrumb.Item><span>{Detail.ClassName}</span></Breadcrumb.Item>}
                            {Display.StudentDisplay && <Breadcrumb.Item href="#"><span>{Detail.DivisionName}</span></Breadcrumb.Item>}
                        </Breadcrumb>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="create-popup-main-content">
                        {View}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeDynamicAddPopup} className="closeBtn">
                        Close
                    </Button>
                    <Button variant="primary" className={`${buttonValidation} uploadeBtn`} onClick={handleSubmit}>
                        {Display.isUpdate ? 'Update' : 'Create'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default DynamicAddPopUp;
